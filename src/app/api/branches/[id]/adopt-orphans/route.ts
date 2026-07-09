import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Attaches all branchId=null records (created before multi-branch existed) to one branch,
// so switching to a specific branch doesn't make them disappear.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;

  const branch = await db.branch.findUnique({ where: { id } });
  if (!branch) return NextResponse.json({ error: "Filial topilmadi" }, { status: 404 });

  const [leads, groups, users, payments, expenses, incomes, courses] = await db.$transaction([
    db.lead.updateMany({ where: { branchId: null }, data: { branchId: id } }),
    db.group.updateMany({ where: { branchId: null }, data: { branchId: id } }),
    db.user.updateMany({ where: { branchId: null }, data: { branchId: id } }),
    db.payment.updateMany({ where: { branchId: null }, data: { branchId: id } }),
    db.expense.updateMany({ where: { branchId: null }, data: { branchId: id } }),
    db.income.updateMany({ where: { branchId: null }, data: { branchId: id } }),
    db.course.updateMany({ where: { branchId: null }, data: { branchId: id } }),
  ]);

  const total = leads.count + groups.count + users.count + payments.count + expenses.count + incomes.count + courses.count;

  return NextResponse.json({
    total,
    counts: {
      leads: leads.count,
      groups: groups.count,
      users: users.count,
      payments: payments.count,
      expenses: expenses.count,
      incomes: incomes.count,
      courses: courses.count,
    },
  });
}
