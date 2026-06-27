import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// ENROLLED students whose (course price - sum of monthly payments) > 0
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
    where: { status: "ENROLLED", groupId: { not: null }, isArchived: false },
    select: {
      id: true,
      fullName: true,
      phone: true,
      course: { select: { name: true, price: true, color: true } },
      group: { select: { id: true, name: true } },
    },
    orderBy: { fullName: "asc" },
  });

  const leadIds = students.map((s) => s.id);

  // Sum payments per student for this month (handles partial payments)
  const monthPayments = leadIds.length
    ? await db.payment.groupBy({
        by: ["leadId"],
        where: { forMonth: month, leadId: { in: leadIds } },
        _sum: { amount: true },
      })
    : [];
  const paidMap = new Map(monthPayments.map((p) => [p.leadId, Number(p._sum.amount ?? 0)]));

  // Last payment date per student (any month)
  const lastPayments = leadIds.length
    ? await db.payment.groupBy({
        by: ["leadId"],
        where: { leadId: { in: leadIds } },
        _max: { paidAt: true },
      })
    : [];
  const lastPaymentMap = new Map(lastPayments.map((p) => [p.leadId, p._max.paidAt]));

  const debtors = students
    .map((s) => {
      const required = Number(s.course?.price ?? 0);
      const paid = paidMap.get(s.id) ?? 0;
      const debt = required - paid;
      return {
        id: s.id,
        fullName: s.fullName,
        phone: s.phone,
        group: s.group?.name ?? null,
        course: s.course?.name ?? null,
        courseColor: s.course?.color ?? null,
        required,
        paid,
        debt,
        lastPaymentAt: lastPaymentMap.get(s.id) ?? null,
      };
    })
    .filter((s) => s.debt > 0);

  const totalDebt = debtors.reduce((a, d) => a + d.debt, 0);

  return NextResponse.json({ month, debtors, totalDebt, count: debtors.length });
}
