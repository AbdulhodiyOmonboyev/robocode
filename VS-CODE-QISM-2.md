# VS Code promt — 2/4 (Moliya: Pul oqimi, Chegirma, Chek)
# 1-qism tugab, sinab bo'lgach, "---" dan keyingi hammasini nusxalab bering.

---

You are working on the existing **Next.js 16 (App Router) CRM "Robocode CRM"**. This is **Part 2 of 4** (Part 1 added Expense, Income, SalaryRecord). Match the existing code style EXACTLY; ensure **zero TypeScript / build errors**.

## TECH STACK & CONVENTIONS
- Next.js 16 App Router, React 19, TS strict. Prisma 7 + `@prisma/adapter-pg` (client → `src/generated/prisma`), Supabase PostgreSQL. NextAuth v5 (`SUPER_ADMIN, ADMIN, MANAGER, OPERATOR`). Tailwind (`dark:`), `lucide-react`, `sonner`, `zod`. Build: `prisma generate && next build`.
- **DB**: `import { db } from "@/lib/db";`. **Auth**: `const session = await auth(); if(!session) 401; const user = session.user as any;` (`@/lib/auth`); finance = admin-only.
- **API**: `src/app/api/<name>/route.ts` (+ `[id]`), `NextResponse.json`, params `Promise<{id}>` → `await params`, `zod` validation, `export const dynamic = "force-dynamic";` on GETs.
- **Pages**: `src/app/(dashboard)/<name>/page.tsx`, `"use client";`, UI from `@/components/ui/{card,button,input}`, deletions via `useConfirm` (`@/components/ui/confirm`) + render `{dialog}`, toasts via `sonner`. Sidebar: `navItems` in `src/components/shared/Sidebar.tsx`.
- **Uzbek** UI. Money `Decimal@db.Decimal(12,2)` → `Number(v).toLocaleString("ru-RU")`. Timezone Asia/Tashkent (UTC+5). Schema: edit `prisma/schema.prisma` → `npx prisma db push` → `npx prisma generate`.

## ALREADY EXISTS (do NOT recreate)
Leads, Lead profile, Groups, Teachers, Courses, **Payments** (`Payment`: amount, currency, method, type, forMonth, groupId, paidAt, createdById) + debtors, Attendance, Timetable, `/apply`, Telegram bot, Analytics, Settings, branding (`/api/branding`), `useConfirm`. (Part 1 added: `Expense`, `Income`, `SalaryRecord` + `/expenses`, `/incomes`, `/payroll`.)

---

## FEATURES — PART 2

### 4) Pul oqimi (Cash flow)
- API `/api/cashflow` (admin): last 6–12 months — `income` = Payments (sum by month) + Incomes; `outflow` = Expenses + SalaryRecords; `profit = income − outflow`. Return `{ months:[{month, income, outflow, profit}], totals }`.
- Page `/cashflow`: 3 cards (jami daromad, jami chiqim, sof foyda) + monthly **bar chart using plain Tailwind `<div>` bars (NO chart library)** + table per month. Sidebar: "Pul oqimi" (icon `TrendingUp`). Admin-only.

### 5) Chegirmalar + To'lov turlari (Discounts + payment types)
- Add `discount Decimal? @db.Decimal(12,2)` to `Payment` (amount = net paid; discount informational). Add an optional "Chegirma" input to the payment add modal; show it on the payment list and receipt.
- Model `PaymentType { id, name String, isActive Boolean @default(true) }`. API `/api/payment-types` + `[id]`. Manage in Settings (add/remove/toggle). Use these in the payment "Turi/Usul" dropdown (fallback to cash/card/transfer if none).

### 6) Chek / kvitansiya (Receipt)
- Add a `GET /api/payments/[id]` returning the payment with lead + course (if not already present).
- Route `/receipt/[paymentId]` — a `"use client"` page that fetches that payment and branding (`/api/branding`): clean A6/A5 printable layout — markaz nomi + logo, o'quvchi ism+telefon, kurs, summa (+ chegirma), sana, qabul qilgan xodim. "Chop etish" button → `window.print()`; add `@media print` CSS so only the receipt prints. Add a "Chek" button on each payment row that opens `/receipt/[id]` in a new tab.

## REQUIREMENTS
- Do 4→6 in order. Each: schema change + `prisma db push` + API + page + sidebar link.
- `npx tsc --noEmit` and `npm run build` must pass. No unused imports. Match existing UI (Uzbek, dark mode, useConfirm, sonner). Don't break existing code. After each, list changed files.
- Start with Feature 4 (Cash flow).
