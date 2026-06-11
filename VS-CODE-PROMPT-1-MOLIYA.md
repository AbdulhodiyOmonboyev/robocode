# VS Code promt — 1-QISM (Moliya)
# Pastdagi "---" dan keyingi hammasini nusxalab, VS Code AI agentiga bering.
# Bu qismni tugatib, sinab bo'lgach, 2-QISM (VS-CODE-PROMPT-2-...) ni bering.

---

You are working on an existing **Next.js 16 (App Router) education-center CRM** called **Robocode CRM**. This is **Part 1 of 2 — the FINANCE modules**. Add the modules below, match the existing code style EXACTLY, and ensure the project builds with **zero TypeScript / build errors**.

## TECH STACK (already set up — do not change)
- Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict)
- Prisma 7 with driver adapter `@prisma/adapter-pg` (PrismaPg). Client generated to `src/generated/prisma`.
- Database: Supabase PostgreSQL
- Auth: NextAuth v5 (credentials). Roles: `SUPER_ADMIN, ADMIN, MANAGER, OPERATOR`
- Styling: Tailwind (dark mode via `dark:`), `lucide-react` icons, `sonner` toasts
- Validation: `zod`. Build script: `prisma generate && next build`

## PROJECT CONVENTIONS (follow precisely)
- **DB**: `import { db } from "@/lib/db";`
- **Auth in API**:
  ```ts
  import { auth } from "@/lib/auth";
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = session.user as any; // user.id, user.role
  ```
  Restrict all finance endpoints to `["SUPER_ADMIN","ADMIN"]`.
- **API**: `src/app/api/<name>/route.ts` (+ `[id]/route.ts`). `NextResponse.json`. Dynamic params: `{ params }: { params: Promise<{ id: string }> }` → `const { id } = await params;`. Validate with `zod` `safeParse`. Add `export const dynamic = "force-dynamic";` to fresh-read GET routes.
- **Pages**: `src/app/(dashboard)/<name>/page.tsx`, start `"use client";`. UI: `@/components/ui/card` (`Card, CardHeader, CardTitle, CardContent`), `@/components/ui/button` (`Button` — `variant="outline|primary|danger"`, `size="sm"`, `loading`), `@/components/ui/input` (`Input` — `label`, `error` + native props).
- **Deletions**: `import { useConfirm } from "@/components/ui/confirm";` → `const { confirm, dialog } = useConfirm();` → `if (!(await confirm({ title, message }))) return;` and render `{dialog}` in the page root. Never use native `confirm()`.
- **Toasts**: `import { toast } from "sonner";`
- **Sidebar**: add links to `navItems` in `src/components/shared/Sidebar.tsx` (`{ href, label, icon }`, lucide icon).
- **Language**: ALL UI text in **Uzbek (latin)**. Money: `Number(v).toLocaleString("ru-RU")` + " so'm".
- **Money fields**: `Decimal @db.Decimal(12,2)` (Prisma returns Decimal as string in JSON → use `Number()`).
- **Timezone**: Asia/Tashkent (UTC+5). For "this month/today" use +5h offset (see existing `src/app/api/payments/route.ts`, `analytics/route.ts`).
- **Schema changes**: edit `prisma/schema.prisma`, then run `npx prisma db push` (NOT `prisma migrate`) and `npx prisma generate`. Add all back-relations.

## ALREADY EXISTS (do NOT recreate)
Leads (+ `Stage` Kanban), Lead profile (`parentName, parentPhone, telegramChatId`), Groups (`room`), Teachers page (User has `salary, subject`), Courses, **Payments** (`Payment`: amount, currency, method, type, forMonth, groupId, paidAt, createdById) + debtors, Attendance, Timetable, Web form (`/apply`), Telegram bot, Reminders, Analytics, Reports, Users/Roles, Settings, Excel export, `Activity` model, `useConfirm` hook.

---

## FEATURES — PART 1 (FINANCE)

### 1) Xarajatlar (Expenses)
- Model `Expense { id, amount Decimal@db.Decimal(12,2), category String, note String?, spentAt DateTime @default(now()), createdById String, createdBy User@relation, createdAt }`.
- API `/api/expenses` (GET: list + `?month=YYYY-MM` filter + monthly total; POST), `/api/expenses/[id]` (DELETE, admin).
- Page `/expenses`: summary card (this-month total), month filter, table (sana, kategoriya, summa, izoh, o'chirish), "Xarajat qo'shish" modal (summa, kategoriya, sana, izoh). Sidebar: "Xarajatlar" (icon `TrendingDown`).

### 2) Qo'shimcha daromadlar (Additional income)
- Model `Income { id, amount Decimal@db.Decimal(12,2), source String, note String?, receivedAt DateTime @default(now()), createdById String, createdBy User@relation, createdAt }`.
- API `/api/incomes` + `[id]`. Page `/incomes` (same layout as expenses). Sidebar: "Qo'shimcha daromad" (icon `PlusCircle`).

### 3) Xodimlar ish haqi + Bonuslar (Payroll + bonuses)
- Model `SalaryRecord { id, userId String, user User@relation("SalaryUser"), amount Decimal@db.Decimal(12,2), month String /* YYYY-MM */, type String @default("salary") /* salary|bonus */, note String?, paidAt DateTime @default(now()), createdById String, createdAt }`. Add back-relation on `User`.
- API `/api/payroll` (GET `?month=` → records grouped by user + totals; POST add salary/bonus), `/api/payroll/[id]` DELETE. Admin-only.
- Page `/payroll`: month selector, per-user rows (ism, lavozim, oylik, bonus, jami), "Ish haqi qo'shish" modal (xodimni tanlash, summa, oy, type=salary/bonus, izoh), umumiy jami. Sidebar: "Ish haqi" (icon `Wallet`).

### 4) Pul oqimi (Cash flow)
- API `/api/cashflow` (admin): last 6–12 months series — `income` = Payments(sum by forMonth or paidAt month) + Incomes; `outflow` = Expenses + SalaryRecords; `profit = income − outflow`. Return `{ months:[{month, income, outflow, profit}], totals }`.
- Page `/cashflow`: 3 summary cards (jami daromad, jami chiqim, sof foyda) + monthly bar chart (simple Tailwind `<div>` bars, NO chart library) + table per month. Sidebar: "Pul oqimi" (icon `TrendingUp`). Admin-only.

### 5) Chegirmalar + To'lov turlari (Discounts + payment types)
- Add `discount Decimal? @db.Decimal(12,2)` to `Payment` (amount stays the net paid; discount is informational). Add an optional "Chegirma" field to the payment add modal and show it on the payment list + receipt.
- Payment types: model `PaymentType { id, name String, isActive Boolean @default(true) }` with API `/api/payment-types` + `[id]`, managed in Settings; use these in the payment "Usul/Turi" dropdown (fallback to existing cash/card/transfer if empty).

### 6) Chek / kvitansiya (Receipt)
- Route `/receipt/[paymentId]` (a `"use client"` page that fetches the payment via a new `/api/payments/[id]` GET): clean A6/A5 printable layout — markaz nomi + logo (from `/api/branding`), o'quvchi ism+telefon, kurs, summa (va chegirma), sana, qabul qilgan xodim. A "Chop etish" button calls `window.print()`; add `@media print` styles to hide everything except the receipt. Add a "Chek" button on each payment row that opens this route in a new tab.

---

## REQUIREMENTS
1. Do them in order (1→6). Each: model + `prisma db push` + API + page + sidebar link.
2. **Zero errors**: `npx tsc --noEmit` and `npm run build` must pass. No unused imports.
3. Match existing UI (cards, buttons, dark mode, Uzbek, useConfirm, sonner).
4. Don't break existing pages/APIs. Add back-relations on `User` as needed.
5. After each feature, list the files you created/changed.

Start with **Feature 1 (Expenses)** and proceed sequentially.
