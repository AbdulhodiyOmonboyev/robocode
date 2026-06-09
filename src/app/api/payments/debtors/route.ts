import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Students (leads assigned to a group) who have NO payment for the given month.
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  let month = searchParams.get("month");
  if (!month) {
    const t = new Date(Date.now() + 5 * 3600 * 1000);
    month = `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, "0")}`;
  }

  const students = await db.lead.findMany({
    where: { groupId: { not: null } },
    select: {
      id: true, fullName: true, phone: true,
      course: { select: { name: true, price: true } },
      group: { select: { id: true, name: true } },
    },
    orderBy: { fullName: "asc" },
  });

  const paid = await db.payment.findMany({
    where: { forMonth: month, leadId: { in: students.map((s) => s.id) } },
    select: { leadId: true },
  });
  const paidSet = new Set(paid.map((p) => p.leadId));

  const debtors = students
    .filter((s) => !paidSet.has(s.id))
    .map((s) => ({
      id: s.id,
      fullName: s.fullName,
      phone: s.phone,
      group: s.group?.name || null,
      course: s.course?.name || null,
      expected: Number(s.course?.price || 0),
    }));

  return NextResponse.json({ month, debtors, totalExpected: debtors.reduce((a, d) => a + d.expected, 0) });
}
