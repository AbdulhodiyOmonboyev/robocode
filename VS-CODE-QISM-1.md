# VS Code promt — 1/4 (Moliya: Xarajat, Daromad, Ish haqi)
# "---" dan keyingi hammasini nusxalab VS Code AI agentiga bering.

---

You are working on an existing **Next.js 16 (App Router) education-center CRM "Robocode CRM"**. This is **Part 1 of 4**. Add the modules below, match the existing code style EXACTLY, and ensure **zero TypeScript / build errors**.

## TECH STACK (already set up — do not change)
- Next.js 16 (App Router), React 19, TypeScript (strict)
- Prisma 7 + `@prisma/adapter-pg` (client generated to `src/generated/prisma`), Supabase PostgreSQL
- NextAuth v5 (roles: `SUPER_ADMIN, ADMIN, MANAGER, OPERATOR`)
- Tailwind (dark mode via `dark:`), `lucide-react`, `sonner`, `zod`. Build: `prisma generate && next build`

## CONVENTIONS (follow precisely)
- **DB**: `import { db } from "@/lib/db";`
- **Auth in API**: `const session = await auth(); if(!session) return NextResponse.json({error:"Unauthorized"},{status:401}); const user = session.user as any;` (`auth` from `@/lib/auth`). Finance endpoints: restrict to `["SUPER_ADMIN","ADMIN"]`.
- **API**: `src/app/api/<name>/route.ts` (+ `[id]`). `NextResponse.json`. Params: `{ params }: { params: Promise<{ id: string }> }` → `await params`. Validate with `zod` `safeParse`. `export const dynamic = "force-dynamic";` on fresh GETs.
- **Pages**: `src/app/(dashboard)/<name>/page.tsx`, `"use client";`. UI: `@/components/ui/card` (`Card, CardHeader, CardTitle, CardContent`), `@/components/ui/button` (`Button` — `variant="outline|primary|danger"`, `size`, `loading`), `@/components/ui/input` (`Input` — `label`, `error`).
- **Deletions**: `import { useConfirm } from "@/components/ui/confirm";` → `const { confirm, dialog } = useConfirm();` → `if (!(await confirm({title,message}))) return;` + render `{dialog}`. Never native `confirm()`.
- **Toasts**: `sonner`. **Sidebar**: add to `navItems` in `src/components/shared/Sidebar.tsx`.
- **Language**: UI in **Uzbek (latin)**. Money: `Number(v).toLocaleString("ru-RU")` + " so'm". Money fields `Decimal @db.Decimal(12,2)` (returned as string → `Number()`).
- **Timezone**: Asia/Tashkent (UTC+5) for month/today (see `src/app/api/payments/route.ts`).
- **Schema**: edit `prisma/schema.prisma` → `npx prisma db push` (NOT migrate) → `npx prisma generate`. Add back-relations.

## ALREADY EXISTS (do NOT recreate)
Leads (+ `Stage`), Lead profile, Groups (`room`), Teachers (User has `salary, subject`), Courses, **Payments** (`Payment`: amount, currency, method, type, forMonth, groupId, paidAt, createdById) + debtors, Attendance, Timetable, `/apply` form, Telegram bot, Reminders, Analytics, Reports, Users/Roles, Settings, `Activity`, `useConfirm`.

---

## FEATURES — PART 1

### 1) Xarajatlar (Expenses)
- Model `Expense { id, amount Decimal@db.Decimal(12,2), category String, note String?, spentAt DateTime @default(now()), createdById String, createdBy User @relation, createdAt }`.
- API `/api/expenses` (GET: list + `?month=YYYY-MM` + monthly total; POST), `/api/expenses/[id]` (DELETE, admin).
- Page `/expenses`: this-month total card, month filter, table (sana, kategoriya, summa, izoh, o'chirish), "Xarajat qo'shish" modal. Sidebar: "Xarajatlar" (icon `TrendingDown`).

### 2) Qo'shimcha daromadlar (Additional income)
- Model `Income { id, amount Decimal@db.Decimal(12,2), source String, note String?, receivedAt DateTime @default(now()), createdById String, createdBy User @relation, createdAt }`.
- API `/api/incomes` + `[id]`. Page `/incomes` (same layout as expenses). Sidebar: "Qo'shimcha daromad" (icon `PlusCircle`).

### 3) Xodimlar ish haqi + Bonuslar (Payroll + bonuses)
- Model `SalaryRecord { id, userId String, user User @relation("SalaryUser"), amount Decimal@db.Decimal(12,2), month String /* YYYY-MM */, type String @default("salary") /* salary|bonus */, note String?, paidAt DateTime @default(now()), createdById String, createdAt }`. Add back-relation `salaryRecords SalaryRecord[] @relation("SalaryUser")` on `User`.
- API `/api/payroll` (GET `?month=` → records grouped by user + totals; POST), `/api/payroll/[id]` DELETE. Admin-only.
- Page `/payroll`: month selector, per-user rows (ism, lavozim, oylik, bonus, jami), "Ish haqi qo'shish" modal (xodim, summa, oy, type=salary/bonus, izoh), umumiy jami. Sidebar: "Ish haqi" (icon `Wallet`).

## REQUIREMENTS
- Do 1→3 in order. Each: model + `prisma db push` + API + page + sidebar link.
- `npx tsc --noEmit` and `npm run build` must pass. No unused imports. Match existing UI (Uzbek, dark mode, useConfirm, sonner). Don't break existing code. After each, list changed files.
- Start with Feature 1 (Expenses).
