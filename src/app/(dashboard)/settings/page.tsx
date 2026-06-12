"use client";

import { useState, useEffect, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Plus, Trash2, ToggleLeft, ToggleRight, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/components/ui/confirm";

type Tab = "general" | "timeslots" | "tags" | "notifications";

interface TimeSlot { id: string; startTime: string; endTime: string; label: string; isActive: boolean; }
interface Tag { id: string; name: string; color: string; }

const TAG_COLORS = ["#6366f1","#10b981","#f59e0b","#f43f5e","#06b6d4","#8b5cf6","#ec4899","#14b8a6","#f97316","#84cc16"];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("general");
  const { confirm, dialog } = useConfirm();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newSlot, setNewSlot] = useState({ startTime: "", endTime: "" });
  const [newTag, setNewTag] = useState({ name: "", color: "#6366f1" });
  const [centerName, setCenterName] = useState("Robocode CRM");
  const [tgToken, setTgToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [chatIds, setChatIds] = useState<Record<string, string>>({});
  const [contacts, setContacts] = useState<any[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [botUsername, setBotUsername] = useState("");
  const [webhookActive, setWebhookActive] = useState(false);
  const [activating, setActivating] = useState(false);
  const [logo, setLogo] = useState("");
  const [logoSaving, setLogoSaving] = useState(false);
  const [paymentTypes, setPaymentTypes] = useState<any[]>([]);
  const [newPaymentType, setNewPaymentType] = useState("");

  const loadPaymentTypes = () => fetch("/api/payment-types").then(r=>r.json()).then(d=>setPaymentTypes(Array.isArray(d)?d:[]));
  const addPaymentType = async () => {
    if (!newPaymentType.trim()) { toast.error("Nom kiriting"); return; }
    const res = await fetch("/api/payment-types", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newPaymentType.trim() }) });
    if (res.ok) { setNewPaymentType(""); toast.success("Qo'shildi"); loadPaymentTypes(); } else toast.error("Xatolik");
  };
  const removePaymentType = async (id: string) => {
    if (!(await confirm({ title: "To'lov turini o'chirish", message: "Bu to'lov turini o'chirasizmi?" }))) return;
    const res = await fetch(`/api/payment-types/${id}`, { method: "DELETE" });
    if (res.ok) loadPaymentTypes(); else toast.error("Xatolik");
  };

  const [holidays, setHolidays] = useState<any[]>([]);
  const [newHoliday, setNewHoliday] = useState({ date: "", name: "" });
  const loadHolidays = () => fetch("/api/holidays").then(r=>r.json()).then(d=>setHolidays(Array.isArray(d)?d:[]));
  const addHoliday = async () => {
    if (!newHoliday.date || !newHoliday.name.trim()) { toast.error("Sana va nom kiriting"); return; }
    const res = await fetch("/api/holidays", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newHoliday) });
    if (res.ok) { setNewHoliday({ date: "", name: "" }); toast.success("Qo'shildi"); loadHolidays(); } else { const d = await res.json().catch(()=>({})); toast.error(d.error || "Xatolik"); }
  };
  const removeHoliday = async (id: string) => {
    if (!(await confirm({ title: "Bayram kunini o'chirish", message: "Bu kunni o'chirasizmi?" }))) return;
    const res = await fetch(`/api/holidays/${id}`, { method: "DELETE" });
    if (res.ok) loadHolidays(); else toast.error("Xatolik");
  };

  const loadSlots = () => fetch("/api/timeslots").then(r=>r.json()).then(setSlots);
  const loadTags = () => fetch("/api/tags").then(r=>r.json()).then(setTags);
  const loadTgSettings = async () => {
    const s = await fetch("/api/settings").then(r=>r.json());
    setTgToken(s["telegram_bot_token"] || "");
    if (s["center_name"]) setCenterName(s["center_name"]);
    if (s["brand_logo"]) setLogo(s["brand_logo"]);
    const cids: Record<string,string> = {};
    Object.entries(s).forEach(([k,v]) => { if (k.startsWith("telegram_chat_id_")) cids[k.replace("telegram_chat_id_","")] = v as string; });
    setChatIds(cids);
  };

  const loadBotInfo = async () => {
    const res = await fetch("/api/telegram/setup");
    if (res.ok) { const d = await res.json(); setBotUsername(d.username || ""); setWebhookActive(!!d.active); }
  };

  useEffect(() => {
    loadSlots(); loadTags(); loadTgSettings(); loadBotInfo(); loadPaymentTypes(); loadHolidays();
    fetch("/api/users").then(r=>r.json()).then(setUsers);
  }, []);

  const activateBot = async () => {
    setActivating(true);
    const res = await fetch("/api/telegram/setup", { method: "POST" });
    const d = await res.json();
    setActivating(false);
    if (res.ok) { toast.success("Bot faollashtirildi! @" + d.username); setBotUsername(d.username || ""); setWebhookActive(true); }
    else toast.error(d.error || "Xatolik");
  };

  const copyLink = (userId: string) => {
    if (!botUsername) { toast.error("Avval botni faollashtiring"); return; }
    const link = `https://t.me/${botUsername}?start=${userId}`;
    navigator.clipboard.writeText(link).then(() => toast.success("Havola nusxalandi"), () => toast.error("Nusxalab bo'lmadi"));
  };

  const saveSetting = async (key: string, value: string) => {
    const res = await fetch("/api/settings", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ key, value }) });
    return res.ok;
  };

  const saveToken = async () => {
    setSaving(true);
    const ok = await saveSetting("telegram_bot_token", tgToken.trim());
    setSaving(false);
    ok ? toast.success("Token saqlandi") : toast.error("Saqlab bo'lmadi");
  };

  const saveChatId = async (userId: string) => {
    const ok = await saveSetting("telegram_chat_id_" + userId, (chatIds[userId] || "").trim());
    ok ? toast.success("Chat ID saqlandi") : toast.error("Xatolik");
  };

  const testChat = async (chatId: string) => {
    if (!chatId) { toast.error("Avval chat ID kiriting"); return; }
    const res = await fetch("/api/telegram/test", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ chatId }) });
    const data = await res.json();
    res.ok ? toast.success("Test xabar yuborildi! Telegram'ni tekshiring.") : toast.error(data.error || "Yuborilmadi");
  };

  const fetchContacts = async () => {
    setLoadingContacts(true);
    const res = await fetch("/api/telegram/contacts");
    const data = await res.json();
    if (res.ok) { setContacts(data.contacts || []); if (!data.contacts?.length) toast.info("Hech kim botga yozmagan. Hodimlar botga /start yuborsin."); }
    else toast.error(data.error || "Xatolik");
    setLoadingContacts(false);
  };

  const saveGeneral = async () => {
    setSaving(true);
    await saveSetting("center_name", centerName);
    setSaving(false);
    toast.success("Saqlandi");
  };

  const onLogoFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Rasm fayli tanlang"); return; }
    if (file.size > 1024 * 1024) { toast.error("Rasm 1MB dan kichik bo'lsin"); return; }
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const saveLogo = async () => {
    setLogoSaving(true);
    const ok = await saveSetting("brand_logo", logo);
    setLogoSaving(false);
    ok ? toast.success("Logo saqlandi! Sahifani yangilang.") : toast.error("Saqlab bo'lmadi");
  };

  const removeLogo = async () => {
    setLogo("");
    const ok = await saveSetting("brand_logo", "");
    ok ? toast.success("Standart logoga qaytarildi") : toast.error("Xatolik");
  };

  const addSlot = async () => {
    if (!newSlot.startTime || !newSlot.endTime) { toast.error("Vaqtlarni kiriting"); return; }
    const label = `${newSlot.startTime} - ${newSlot.endTime}`;
    const res = await fetch("/api/timeslots", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newSlot, label }),
    });
    if (res.ok) { toast.success("Vaqt sloti qo'shildi"); setNewSlot({ startTime: "", endTime: "" }); loadSlots(); }
    else toast.error("Xatolik");
  };

  const toggleSlot = async (slot: TimeSlot) => {
    await fetch(`/api/timeslots/${slot.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !slot.isActive }),
    });
    loadSlots();
  };

  const deleteSlot = async (id: string) => {
    if (!(await confirm({ title: "Slotni o'chirish", message: "Bu vaqt slotini o'chirishni tasdiqlaysizmi?" }))) return;
    await fetch(`/api/timeslots/${id}`, { method: "DELETE" });
    loadSlots();
  };

  const addTag = async () => {
    if (!newTag.name.trim()) { toast.error("Tag nomini kiriting"); return; }
    const res = await fetch("/api/tags", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTag),
    });
    if (res.ok) { toast.success("Tag qo'shildi"); setNewTag({ name: "", color: "#6366f1" }); loadTags(); }
    else toast.error("Bu nom band bo'lishi mumkin");
  };

  const deleteTag = async (id: string) => {
    await fetch(`/api/tags/${id}`, { method: "DELETE" });
    loadTags();
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "general", label: "Umumiy" },
    { key: "timeslots", label: "Vaqt slotlari" },
    { key: "tags", label: "Teglar" },
    { key: "notifications", label: "Bildirishnomalar" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {dialog}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sozlamalar</h1>
        <p className="text-sm text-gray-500 mt-0.5">Tizim sozlamalari</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${tab===t.key?"bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm":"text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* General */}
      {tab === "general" && (
        <Card>
          <CardHeader><CardTitle>Umumiy sozlamalar</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Markaz nomi" value={centerName} onChange={e=>setCenterName(e.target.value)}/>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Vaqt mintaqasi</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="Asia/Tashkent">Asia/Tashkent (UTC+5)</option>
                <option value="Europe/Moscow">Europe/Moscow (UTC+3)</option>
              </select>
            </div>
            <Button onClick={saveGeneral} loading={saving}><Save className="w-4 h-4"/> Saqlash</Button>
          </CardContent>
        </Card>
      )}

      {/* Logo */}
      {tab === "general" && (
        <Card>
          <CardHeader><CardTitle>Logo</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-20 h-20 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo || "/icon.svg"} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Sayt logosi</p>
                <p className="text-xs text-gray-500 mt-0.5">PNG yoki SVG, 1MB gacha. Login va yon menyuda chiqadi.</p>
                <div className="flex items-center gap-2 mt-2">
                  <label className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    Rasm tanlash
                    <input type="file" accept="image/*" onChange={onLogoFile} className="hidden" />
                  </label>
                  {logo && <Button size="sm" variant="outline" onClick={removeLogo}>Standart</Button>}
                </div>
              </div>
            </div>
            <Button onClick={saveLogo} loading={logoSaving}><Save className="w-4 h-4"/> Logoni saqlash</Button>
          </CardContent>
        </Card>
      )}

      {/* Payment types */}
      {tab === "general" && (
        <Card>
          <CardHeader><CardTitle>To'lov turlari</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-gray-500">Naqd / Karta / O'tkazma — asosiy turlar doim bor. Bu yerda qo'shimcha turlarni qo'shing (masalan: Click, Payme, Uzcard).</p>
            <div className="flex flex-wrap gap-2">
              {paymentTypes.map((t:any)=>(
                <div key={t.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300">
                  {t.name}
                  <button onClick={()=>removePaymentType(t.id)} className="ml-1 opacity-70 hover:opacity-100"><X className="w-3 h-3"/></button>
                </div>
              ))}
              {paymentTypes.length===0 && <p className="text-sm text-gray-400">Qo'shimcha tur yo'q</p>}
            </div>
            <div className="flex items-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Input label="Yangi to'lov turi" value={newPaymentType} onChange={e=>setNewPaymentType(e.target.value)} placeholder="Click / Payme..." className="flex-1"/>
              <Button onClick={addPaymentType}><Plus className="w-4 h-4"/> Qo'shish</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Holidays */}
      {tab === "general" && (
        <Card>
          <CardHeader><CardTitle>Bayram kunlari</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-gray-500">Dars bo'lmaydigan kunlar (bayramlar, ta'til).</p>
            <div className="space-y-1.5">
              {holidays.map((h:any)=>(
                <div key={h.id} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300"><b>{new Date(h.date).toLocaleDateString("ru-RU")}</b> — {h.name}</span>
                  <button onClick={()=>removeHoliday(h.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
              {holidays.length===0 && <p className="text-sm text-gray-400">Bayram kuni yo'q</p>}
            </div>
            <div className="flex items-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Sana</label>
                <input type="date" value={newHoliday.date} onChange={e=>setNewHoliday(h=>({...h,date:e.target.value}))} className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"/>
              </div>
              <Input label="Nomi" value={newHoliday.name} onChange={e=>setNewHoliday(h=>({...h,name:e.target.value}))} placeholder="Navro'z" className="flex-1"/>
              <Button onClick={addHoliday}><Plus className="w-4 h-4"/></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time Slots */}
      {tab === "timeslots" && (
        <Card>
          <CardHeader><CardTitle>Vaqt slotlari</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {slots.map(slot => (
                <div key={slot.id} className={`flex items-center justify-between p-3 rounded-xl border ${slot.isActive?"border-gray-200 dark:border-gray-700":"border-gray-100 dark:border-gray-800 opacity-50"}`}>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{slot.label}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>toggleSlot(slot)} className="text-gray-400 hover:text-indigo-600 transition">
                      {slot.isActive ? <ToggleRight className="w-5 h-5"/> : <ToggleLeft className="w-5 h-5"/>}
                    </button>
                    <button onClick={()=>deleteSlot(slot.id)} className="text-gray-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Boshlanish</label>
                <input type="time" value={newSlot.startTime} onChange={e=>setNewSlot(s=>({...s,startTime:e.target.value}))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"/>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Tugash</label>
                <input type="time" value={newSlot.endTime} onChange={e=>setNewSlot(s=>({...s,endTime:e.target.value}))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"/>
              </div>
              <Button onClick={addSlot}><Plus className="w-4 h-4"/> Qo'shish</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {tab === "tags" && (
        <Card>
          <CardHeader><CardTitle>Teglar</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <div key={tag.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-white" style={{backgroundColor:tag.color}}>
                  {tag.name}
                  <button onClick={()=>deleteTag(tag.id)} className="ml-1 opacity-70 hover:opacity-100"><X className="w-3 h-3"/></button>
                </div>
              ))}
              {tags.length === 0 && <p className="text-sm text-gray-400">Teglar yo'q</p>}
            </div>
            <div className="flex items-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Input label="Teg nomi" value={newTag.name} onChange={e=>setNewTag(t=>({...t,name:e.target.value}))} placeholder="Muhim" className="flex-1"/>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Rang</label>
                <div className="flex gap-1.5">
                  {TAG_COLORS.map(c=>(
                    <button key={c} type="button" onClick={()=>setNewTag(t=>({...t,color:c}))}
                      className={`w-6 h-6 rounded-lg ${newTag.color===c?"ring-2 ring-offset-1 ring-gray-400":""}`}
                      style={{backgroundColor:c}}/>
                  ))}
                </div>
              </div>
              <Button onClick={addTag}><Plus className="w-4 h-4"/></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      {tab === "notifications" && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Telegram bot</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Input label="Bot Token" value={tgToken} onChange={e=>setTgToken(e.target.value)} placeholder="123456:ABC-DEF..." type="password"/>
                </div>
                <Button onClick={saveToken} loading={saving}><Save className="w-4 h-4"/> Saqlash</Button>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bot holati: {webhookActive
                      ? <span className="text-green-600">✅ Faol {botUsername && `(@${botUsername})`}</span>
                      : <span className="text-gray-400">o&apos;chiq</span>}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Tokenni saqlagandan keyin botni faollashtiring — shunda bot buyruqlarga javob beradi.</p>
                </div>
                <Button size="sm" onClick={activateBot} loading={activating}>Botni faollashtirish</Button>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Qanday ulanadi:</p>
                <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
                  <li>@BotFather dan bot yarating va tokenini bu yerga saqlang</li>
                  <li><b>Botni faollashtirish</b> tugmasini bosing</li>
                  <li>Pastda har bir hodim uchun <b>ulanish havolasi</b> chiqadi — uni hodimga yuboring</li>
                  <li>Hodim havolani ochib <b>Start</b> bossa — avtomatik ulanadi</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Hodimlarni ulash</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-gray-500">
                Har bir hodimga o&apos;z havolasini yuboring. Hodim havolani ochib <b>Start</b> bossa — avtomatik ulanadi.
                {webhookActive && <span className="text-green-600"> Ulangan hodimda yashil ✅ ko&apos;rinadi.</span>}
              </p>
              <div className="space-y-3">
                {users.map((u:any)=>(
                  <div key={u.id} className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {chatIds[u.id] ? "✅ " : ""}{u.fullName} <span className="text-gray-400 font-normal">@{u.username}</span>
                      </p>
                      {botUsername && (
                        <code className="text-xs text-indigo-600 dark:text-indigo-400 font-mono truncate block">
                          t.me/{botUsername}?start={u.id}
                        </code>
                      )}
                    </div>
                    <Button size="sm" variant="outline" onClick={()=>copyLink(u.id)} disabled={!botUsername}>Havolani nusxalash</Button>
                    {chatIds[u.id] && <Button size="sm" onClick={()=>testChat(chatIds[u.id])}>Test</Button>}
                  </div>
                ))}
                {users.length === 0 && <p className="text-sm text-gray-400">Hodimlar yo&apos;q</p>}
              </div>

              <details className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <summary className="text-xs text-gray-400 cursor-pointer">Qo&apos;lda chat ID kiritish (ixtiyoriy)</summary>
                <div className="mt-2">
                  <Button size="sm" variant="outline" onClick={fetchContacts} loading={loadingContacts}>Botga yozganlarni ko&apos;rsatish</Button>
                  {contacts.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {contacts.map((c:any)=>(
                        <div key={c.chatId} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                          <span className="text-gray-700 dark:text-gray-300">{c.name} {c.username && <span className="text-gray-400">{c.username}</span>}</span>
                          <code className="text-xs text-indigo-600 dark:text-indigo-400 font-mono select-all">{c.chatId}</code>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="space-y-2 mt-3">
                    {users.map((u:any)=>(
                      <div key={u.id} className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">{u.fullName}</label>
                          <input value={chatIds[u.id] || ""} onChange={e=>setChatIds(c=>({...c,[u.id]:e.target.value}))}
                            placeholder="Chat ID"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"/>
                        </div>
                        <Button size="sm" variant="outline" onClick={()=>saveChatId(u.id)}>Saqlash</Button>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function X({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>;
}
