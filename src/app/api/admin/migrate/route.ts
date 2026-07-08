import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Idempotent DDL run THROUGH the app's Supabase connection (works on Vercel).
// Admin-only. Safe to call repeatedly (IF NOT EXISTS).
const statements: string[] = [
  // ---- Part 1: Finance (Expense, Income, SalaryRecord) ----
  `CREATE TABLE IF NOT EXISTS "Expense" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "category" TEXT NOT NULL,
    "note" TEXT,
    "spentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
  )`,
  `DO $$ BEGIN ALTER TABLE "Expense" ADD CONSTRAINT "Expense_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `CREATE INDEX IF NOT EXISTS "Expense_spentAt_idx" ON "Expense"("spentAt")`,

  `CREATE TABLE IF NOT EXISTS "Income" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "source" TEXT NOT NULL,
    "note" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
  )`,
  `DO $$ BEGIN ALTER TABLE "Income" ADD CONSTRAINT "Income_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `CREATE INDEX IF NOT EXISTS "Income_receivedAt_idx" ON "Income"("receivedAt")`,

  `CREATE TABLE IF NOT EXISTS "SalaryRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "month" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'salary',
    "note" TEXT,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SalaryRecord_pkey" PRIMARY KEY ("id")
  )`,
  `DO $$ BEGIN ALTER TABLE "SalaryRecord" ADD CONSTRAINT "SalaryRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN ALTER TABLE "SalaryRecord" ADD CONSTRAINT "SalaryRecord_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `CREATE INDEX IF NOT EXISTS "SalaryRecord_month_idx" ON "SalaryRecord"("month")`,

  // ---- Part 2: Payment discount + PaymentType ----
  `ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "discount" DECIMAL(12,2)`,
  `CREATE TABLE IF NOT EXISTS "PaymentType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PaymentType_pkey" PRIMARY KEY ("id")
  )`,

  // ---- Part 3: Exams, Scores, Coins ----
  `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "coins" INTEGER NOT NULL DEFAULT 0`,
  `CREATE TABLE IF NOT EXISTS "Exam" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'exam',
    "courseId" TEXT,
    "groupId" TEXT,
    "date" DATE NOT NULL,
    "maxScore" INTEGER NOT NULL DEFAULT 100,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
  )`,
  `DO $$ BEGIN ALTER TABLE "Exam" ADD CONSTRAINT "Exam_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN ALTER TABLE "Exam" ADD CONSTRAINT "Exam_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN ALTER TABLE "Exam" ADD CONSTRAINT "Exam_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `CREATE INDEX IF NOT EXISTS "Exam_date_idx" ON "Exam"("date")`,

  `CREATE TABLE IF NOT EXISTS "Score" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
  )`,
  `DO $$ BEGIN ALTER TABLE "Score" ADD CONSTRAINT "Score_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN ALTER TABLE "Score" ADD CONSTRAINT "Score_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Score_examId_leadId_key" ON "Score"("examId","leadId")`,
  `CREATE INDEX IF NOT EXISTS "Score_leadId_idx" ON "Score"("leadId")`,

  `CREATE TABLE IF NOT EXISTS "CoinTx" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CoinTx_pkey" PRIMARY KEY ("id")
  )`,
  `DO $$ BEGIN ALTER TABLE "CoinTx" ADD CONSTRAINT "CoinTx_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN ALTER TABLE "CoinTx" ADD CONSTRAINT "CoinTx_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `CREATE INDEX IF NOT EXISTS "CoinTx_leadId_idx" ON "CoinTx"("leadId")`,

  // ---- Part 4: frozen, referral, archive, holidays, audit ----
  `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "frozenAt" TIMESTAMP(3)`,
  `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "frozenUntil" TIMESTAMP(3)`,
  `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "referrerName" TEXT`,
  `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "referrerPhone" TEXT`,
  `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "isArchived" BOOLEAN NOT NULL DEFAULT false`,
  `ALTER TABLE "Group" ADD COLUMN IF NOT EXISTS "isArchived" BOOLEAN NOT NULL DEFAULT false`,
  `CREATE TABLE IF NOT EXISTS "Holiday" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Holiday_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Holiday_date_key" ON "Holiday"("date")`,
  `CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt")`,

  // ---- Part 5: performance indexes ----
  `CREATE INDEX IF NOT EXISTS "Lead_status_idx" ON "Lead"("status")`,
  `CREATE INDEX IF NOT EXISTS "Lead_createdAt_idx" ON "Lead"("createdAt")`,
  `CREATE INDEX IF NOT EXISTS "Lead_phone_idx" ON "Lead"("phone")`,
  `CREATE INDEX IF NOT EXISTS "Lead_assignedToId_idx" ON "Lead"("assignedToId")`,
  `CREATE INDEX IF NOT EXISTS "Lead_courseId_idx" ON "Lead"("courseId")`,
  `CREATE INDEX IF NOT EXISTS "Lead_isArchived_idx" ON "Lead"("isArchived")`,
  `CREATE INDEX IF NOT EXISTS "Payment_leadId_idx" ON "Payment"("leadId")`,
  `CREATE INDEX IF NOT EXISTS "Payment_createdAt_idx" ON "Payment"("createdAt")`,
  `CREATE INDEX IF NOT EXISTS "Attendance_leadId_date_idx" ON "Attendance"("leadId","date")`,
  `CREATE INDEX IF NOT EXISTS "Activity_leadId_idx" ON "Activity"("leadId")`,
  `CREATE INDEX IF NOT EXISTS "Reminder_leadId_idx" ON "Reminder"("leadId")`,
];

export async function POST() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const results: { i: number; status: string }[] = [];
  for (let i = 0; i < statements.length; i++) {
    try {
      await db.$executeRawUnsafe(statements[i]);
      results.push({ i, status: "ok" });
    } catch (e) {
      results.push({ i, status: "ERROR: " + (e instanceof Error ? e.message : String(e)) });
    }
  }
  const ok = results.every((r) => r.status === "ok");
  return NextResponse.json({ done: true, ok, results });
}
