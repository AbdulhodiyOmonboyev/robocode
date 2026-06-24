import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Students (leads assigned to a group) who have NO payment for the given month,
// enriched with their last payment date (across all months) and course/group info.
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
    where: { groupId: { not: null }, isArchived: false },
    select: {
      id: true, fullName: true, phone: true,
      course: { select: { name: true, price: true, color: true } },
      group: { select: { id: true, name: true } },
    },
    orderBy: { fullName: "asc" },
  });

  const leadIds = students.map((s) => s.id);

  const paidThisMonth = await db.payment.findMany({
    where: { forMonth: month, leadId: { in: leadIds } },
    select: { leadId: true },
  });
  const paidSet = new Set(paidThisMonth.map((p) => p.leadId));

  const unpaid = students.filter((s) => !paidSet.has(s.id));
  const unpaidIds = unpaid.map((s) => s.id);

  // Last payment date per lead (any month), used to show "oxirgi to'lov sanasi"
  const lastPayments = unpaidIds.length
    ? await db.payment.groupBy({
        by: ["leadId"],
        where: { leadId: { in: unpaidIds } },
        _max: { paidAt: true },
      })
    : [];
  const lastPaymentMap = new Map(lastPayments.map((p) => [p.leadId, p._max.paidAt]));

  const debtors = unpaid.map((s) => ({
    id: s.id,
    fullName: s.fullName,
    phone: s.phone,
    group: s.group?.name || null,
    course: s.course?.name || null,
    courseColor: s.course?.color || null,
    expected: Number(s.course?.price || 0),
    lastPaymentAt: lastPaymentMap.get(s.id) || null,
  }));

  const totalExpected = debtors.reduce((a, d) => a + d.expected, 0);

  return NextResponse.json({ month, debtors, totalExpected, count: debtors.length });
}
