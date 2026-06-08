import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getToken() {
  const s = await db.setting.findUnique({ where: { key: "telegram_bot_token" } });
  return s?.value || process.env.TELEGRAM_BOT_TOKEN || "";
}

async function tg(token: string, method: string, payload: any) {
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await r.json();
  } catch {
    return { ok: false };
  }
}

const MAIN_KB = {
  keyboard: [
    ["📊 Statistika", "📋 Yangi lidlar"],
    ["🔍 Lid qidirish", "➕ Yangi lid"],
  ],
  resize_keyboard: true,
};

async function send(token: string, chatId: number | string, text: string, kb = true) {
  await tg(token, "sendMessage", {
    chat_id: chatId,
    text,
    ...(kb ? { reply_markup: MAIN_KB } : {}),
  });
}

// Tashkent (UTC+5) start of today
function startOfTodayTashkent() {
  const TZ = 5 * 3600 * 1000;
  const now = Date.now();
  const t = new Date(now + TZ);
  const startUtcMs = Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()) - TZ;
  return new Date(startUtcMs);
}

// find which CRM user a chat is linked to
async function findUserByChat(chatId: number | string) {
  const s = await db.setting.findFirst({
    where: { key: { startsWith: "telegram_chat_id_" }, value: String(chatId) },
  });
  if (!s) return null;
  const userId = s.key.replace("telegram_chat_id_", "");
  return db.user.findUnique({ where: { id: userId } });
}

export async function POST(req: NextRequest) {
  const token = await getToken();
  if (!token) return NextResponse.json({ ok: true });

  // optional secret verification
  const secretSetting = await db.setting.findUnique({ where: { key: "telegram_webhook_secret" } });
  if (secretSetting?.value) {
    const header = req.headers.get("x-telegram-bot-api-secret-token");
    if (header !== secretSetting.value) return NextResponse.json({ ok: true });
  }

  let update: any;
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const msg = update.message || update.edited_message;
  const chatId: number | undefined = msg?.chat?.id;
  const text: string = (msg?.text || "").trim();
  if (!chatId) return NextResponse.json({ ok: true });

  try {
    // /start [code]  -> link this chat to a CRM user
    if (text.startsWith("/start")) {
      const code = text.split(/\s+/)[1];
      if (code) {
        const user = await db.user.findUnique({ where: { id: code } });
        if (user && user.isActive) {
          await db.setting.upsert({
            where: { key: `telegram_chat_id_${user.id}` },
            update: { value: String(chatId) },
            create: { key: `telegram_chat_id_${user.id}`, value: String(chatId) },
          });
          await send(
            token,
            chatId,
            `✅ Salom, ${user.fullName}!\nSiz tizimga muvaffaqiyatli ulandingiz.\n\nQuyidagi tugmalardan foydalaning yoki /yordam yozing.`
          );
          return NextResponse.json({ ok: true });
        }
      }
      await send(
        token,
        chatId,
        "👋 Salom! Bu — IT O'quv Markaz CRM boti.\n\nTizimga ulanish uchun adminingizdan shaxsiy ulanish havolasini so'rang.",
        false
      );
      return NextResponse.json({ ok: true });
    }

    // everything else requires a linked user
    const user = await findUserByChat(chatId);
    if (!user) {
      await send(
        token,
        chatId,
        "🔒 Siz hali tizimga ulanmagansiz.\nAdminingizdan shaxsiy ulanish havolasini oling va /start bosing.",
        false
      );
      return NextResponse.json({ ok: true });
    }

    // help
    if (text === "/yordam" || text === "/help") {
      await send(
        token,
        chatId,
        "ℹ️ Buyruqlar:\n\n📊 Statistika — bugungi ko'rsatkichlar\n📋 Yangi lidlar — oxirgi lidlar\n🔍 Lid qidirish — telefon yoki ism yuboring\n➕ Yangi lid — \"Ism, +998901234567\" ko'rinishida yuboring"
      );
      return NextResponse.json({ ok: true });
    }

    // STATISTIKA
    if (text === "📊 Statistika" || text === "/stat" || text === "/statistika") {
      const since = startOfTodayTashkent();
      const [todayCount, totalCount, stages, pendingReminders] = await Promise.all([
        db.lead.count({ where: { createdAt: { gte: since } } }),
        db.lead.count(),
        db.stage.findMany({ orderBy: { order: "asc" } }),
        db.reminder.count({ where: { status: "PENDING", userId: user.id } }),
      ]);
      const byStage = await Promise.all(
        stages.map((s) => db.lead.count({ where: { stageId: s.id } }))
      );
      let out = `📊 Statistika\n\n🆕 Bugungi yangi lidlar: ${todayCount}\n👥 Jami lidlar: ${totalCount}\n⏰ Sizdagi eslatmalar: ${pendingReminders}\n`;
      if (stages.length) {
        out += `\nBosqichlar bo'yicha:\n`;
        stages.forEach((s, i) => {
          out += `• ${s.name}: ${byStage[i]}\n`;
        });
      }
      await send(token, chatId, out.trim());
      return NextResponse.json({ ok: true });
    }

    // YANGI LIDLAR
    if (text === "📋 Yangi lidlar" || text === "/lidlar") {
      const leads = await db.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 7,
        include: { course: true, stage: true },
      });
      if (!leads.length) {
        await send(token, chatId, "Hozircha lid yo'q.");
        return NextResponse.json({ ok: true });
      }
      let out = "📋 Oxirgi lidlar:\n\n";
      for (const l of leads) {
        out += `👤 ${l.fullName}\n📞 ${l.phone}\n`;
        if (l.course) out += `📚 ${l.course.name}\n`;
        if (l.stage) out += `🏷 ${l.stage.name}\n`;
        out += `\n`;
      }
      await send(token, chatId, out.trim());
      return NextResponse.json({ ok: true });
    }

    // QIDIRISH (help prompt)
    if (text === "🔍 Lid qidirish" || text === "/qidir") {
      await send(token, chatId, "🔍 Telefon raqam yoki ismni yuboring (masalan: 901234567 yoki Aziza).");
      return NextResponse.json({ ok: true });
    }

    // YANGI LID (help prompt)
    if (text === "➕ Yangi lid" || text === "/yangi") {
      await send(
        token,
        chatId,
        "➕ Yangi lid qo'shish uchun shu ko'rinishda yuboring:\n\nIsm Familiya, +998901234567"
      );
      return NextResponse.json({ ok: true });
    }

    // ADD LEAD:  "Name, +998..."  (name, then comma, then phone)
    const addMatch = text.match(/^(.+?),\s*(\+?\d[\d\s\-]{6,})$/);
    if (addMatch) {
      const fullName = addMatch[1].trim();
      const phone = addMatch[2].replace(/[\s\-]/g, "");
      const newStage = await db.stage.findFirst({ orderBy: { order: "asc" } });
      const lead = await db.lead.create({
        data: {
          fullName,
          phone,
          source: "TELEGRAM",
          createdById: user.id,
          assignedToId: user.id,
          stageId: newStage?.id || null,
        },
      });
      await db.activity.create({
        data: { leadId: lead.id, userId: user.id, action: "created", details: { via: "telegram" } },
      });
      await send(token, chatId, `✅ Yangi lid qo'shildi:\n👤 ${fullName}\n📞 ${phone}`);
      return NextResponse.json({ ok: true });
    }

    // SEARCH: just a phone-like number, or any other text -> search
    const isPhone = /^\+?[\d\s\-]{5,}$/.test(text);
    const query = text.replace(/^\//, "");
    const leads = await db.lead.findMany({
      where: isPhone
        ? { phone: { contains: text.replace(/[\s\-]/g, "") } }
        : { fullName: { contains: query, mode: "insensitive" } },
      take: 6,
      include: { course: true, stage: true, assignedTo: true },
      orderBy: { createdAt: "desc" },
    });
    if (!leads.length) {
      await send(token, chatId, `🔍 "${text}" bo'yicha hech narsa topilmadi.`);
      return NextResponse.json({ ok: true });
    }
    let out = `🔍 Natijalar (${leads.length}):\n\n`;
    for (const l of leads) {
      out += `👤 ${l.fullName}\n📞 ${l.phone}\n`;
      if (l.course) out += `📚 ${l.course.name}\n`;
      if (l.stage) out += `🏷 ${l.stage.name}\n`;
      if (l.assignedTo) out += `👨‍💼 ${l.assignedTo.fullName}\n`;
      out += `\n`;
    }
    await send(token, chatId, out.trim());
    return NextResponse.json({ ok: true });
  } catch (e) {
    try {
      await send(token, chatId, "⚠️ Xatolik yuz berdi. Birozdan keyin urinib ko'ring.", false);
    } catch {}
    return NextResponse.json({ ok: true });
  }
}
