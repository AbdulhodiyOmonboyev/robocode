import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

function toDate(s: string) {
  return new Date(s + "T00:00:00.000Z");
}

// GET ?groupId=&date=YYYY-MM-DD  -> students of the group + their status for that date
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  const date = searchParams.get("date");
  if (!groupId || !date) return NextResponse.json({ error: "groupId va date kerak" }, { status: 400 });

  const [students, att] = await Promise.all([
    db.lead.findMany({ where: { groupId }, select: { id: true, fullName: true, phone: true }, orderBy: { fullName: "asc" } }),
    db.attendance.findMany({ where: { groupId, date: toDate(date) } }),
  ]);
  const map: Record<string, string> = {};
  att.forEach((a) => (map[a.leadId] = a.status));

  return NextResponse.json({
    date,
    students: students.map((s) => ({ leadId: s.id, fullName: s.fullName, phone: s.phone, status: map[s.id] || null })),
  });
}

const saveSchema = z.object({
  groupId: z.string().min(1),
  date: z.string().min(1),
  records: z.array(z.object({ leadId: z.string(), status: z.string(), note: z.string().optional().nullable() })),
});

// POST bulk save attendance for a group+date
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = session.user;

  const body = await req.json();
  const parsed = saveSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { groupId, date, records } = parsed.data;
  const d = toDate(date);

  for (const r of records) {
    await db.attendance.upsert({
      where: { groupId_leadId_date: { groupId, leadId: r.leadId, date: d } },
      update: { status: r.status, note: r.note || null },
      create: { groupId, leadId: r.leadId, date: d, status: r.status, note: r.note || null, createdById: user.id },
    });
  }

  return NextResponse.json({ success: true, saved: records.length });
}
