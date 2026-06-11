# VS Code AI agent uchun to'liq promt
# (Pastdagi hammasini nusxalab, Cursor / Copilot / Claude ga bering)

---

You are working on an existing **Next.js 16 (App Router) education-center CRM** called **Robocode CRM**. Add the new modules described below. Match the existing code style EXACTLY and make sure the project builds with **zero TypeScript / build errors**.

## TECH STACK (already set up — do not change)
- Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict)
- Prisma 7 with driver adapter `@prisma/adapter-pg` (PrismaPg). Client is generated to `src/generated/prisma`.
- Database: Supabase PostgreSQL
- Auth: NextAuth v5 (credentials). Roles: `SUPER_ADMIN, ADMIN, MANAGER, OPERATOR`
- Styling: Tailwind CSS (dark mode via `dark:` classes), `lucide-react` icons, `sonner` for toasts
- Validation: `zod`
- Deploy: Vercel. Build script: `prisma generate && next build`

## PROJECT CONVENTIONS (follow precisely)
- **DB**: `import { db } from "@/lib/db";` (PrismaClient with pg adapter).
- **Auth in API**: 
  ```ts
  import { auth } from "@/lib/auth";
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = session.user as any; // user.id, user.role
  ```
  Restrict mutating/finance endpoints to `["SUPER_ADMIN","ADMIN"]` where appropriate.
- **API routes**: `src/app/api/<name>/route.ts` (+ `[id]/route.ts`). Use `NextResponse.json`. Dynamic param signature: `{ params }: { params: Promise<{ id: string }> }` then `const { id } = await params;`. Validate bodies with `zod` (`safeParse`). Add `export const dynamic = "force-dynamic";` to GET endpoints that read fresh data.
- **Pages**: `src/app/(dashboard)/<name>/page.tsx`, start with `"use client";`. Use UI components: `@/components/ui/card` (`Card, CardHeader, CardTitle, CardContent`), `@/components/ui/button` (`Button`, props: `variant="outline|primary|danger"`, `size="sm"`, `loading`), `@/components/ui/input` (`Input`, props: `label`, `error`, plus native input props).
- **Deletions**: use the existing confirm hook — `import { useConfirm } from "@/components/ui/confirm";` → `const { confirm, dialog } = useConfirm();` → `if (!(await confirm({ title, message }))) return;` and render `{dialog}` inside the page root. Do NOT use the native `confirm()`.
- **Toasts**: `import { toast } from "sonner";` → `toast.success(...) / toast.error(...)`.
- **Sidebar**: add new pages to `navItems` in `src/components/shared/Sidebar.tsx` (each: `{ href, label, icon }`, icon from `lucide-react`).
- **Language**: ALL UI text in **Uzbek (latin)**. Money formatted as `Number(v).toLocaleString("ru-RU")` + " so'm".
- **Money fields**: Prisma `Decimal @db.Decimal(12,2)`. Prisma returns Decimal as string in JSON — use `Number()` on the client.
- **Dates / timezone**: center is in **Asia/Tashkent (UTC+5)**. For "this month / today" grouping, compute with the +5h offset (see existing `src/app/api/payments/route.ts` and `analytics/route.ts`).
- **Schema changes**: edit `prisma/schema.prisma`, then run `npx prisma db push` (this project does NOT use `prisma migrate`) and `npx prisma generate`. Add all needed back-relations.
- **Activity/audit**: there is an `Activity` model (`leadId?, userId, action, details Json?`). Reuse where relevant.

## ALREADY EXISTS (do NOT recreate)
Leads (+ customizable Kanban `Stage` model), Lead detail/profile (with `parentName, parentPhone, telegramChatId`), Groups (`Group` with `room`), Teachers page (User has `salary, subject`), Courses, Payments (`Payment` model: amount, currency, method, type, forMonth, groupId, paidAt, createdById) + debtors, Attendance (`Attendance` model), Timetable, Web lead form (`/apply` + `/api/public/lead`), Telegram bot (`/api/telegram/webhook`), Reminders, Analytics (`/api/analytics`), Reports, Users/Roles, Settings (timeslots, tags, telegram, logo/branding), Excel export.

---

## FEATURES TO ADD

### 1) Xarajatlar (Expenses)
- Model `Expense { id, amount Decimal@db.Decimal(12,2), category String, note String?, spentAt DateTime, createdById String→User, createdAt }`.
- API `/api/expenses` (GET list+filters by month; POST), `/api/expenses/[id]` (DELETE, admin).
- Page `/expenses`: summary (this month total), filters (month), table (sana, kategoriya, summa, izoh), add modal. Sidebar: "Xarajatlar" (icon `Receipt` or `TrendingDown`).

### 2) Qo'shimcha daromadlar (Additional income)
- Model `Income { id, amount Decimal, source String, note String?, receivedAt DateTime, createdById, createdAt }`.
- API `/api/incomes` + `[id]`. Page `/incomes`. Sidebar: "Qo'shimcha daromad".

### 3) Xodimlar ish haqi + Bonuslar (Payroll + bonuses)
- Model `SalaryRecord { id, userId String→User, amount Decimal, month String /* YYYY-MM */, type String /* salary|bonus */, note String?, paidAt DateTime, createdById, createdAt }`.
- API `/api/payroll` (GET by month, POST), `[id]` DELETE. Page `/payroll`: per-month list grouped by user, add salary/bonus, totals. Sidebar: "Ish haqi" (icon `Wallet`). Admin-only.

### 4) Pul oqimi (Cash flow report)
- API `/api/cashflow?from&to` → monthly series: income (payments + incomes) vs outflow (expenses + payroll) + net profit.
- Page `/cashflow`: bar/line chart (simple Tailwind bars, no extra libs) + monthly table. Sidebar: "Pul oqimi" (icon `TrendingUp`). Admin-only.

### 5) Chegirmalar + To'lov turlari (Discounts + payment types)
- Add `discount Decimal? @db.Decimal(12,2)` to `Payment` (amount = net). Show discount in payment add form + receipt.
- Payment types: store as `Setting` keys or a small `PaymentType { id, name, isActive }` model; use in the payment method dropdown.

### 6) Chek / kvitansiya (Receipt)
- On a payment: a "Chek" button that opens a printable receipt (clean A6/A5 layout: markaz nomi + logo, o'quvchi, kurs, summa, sana, qabul qilgan). Use a print-friendly route `/receipt/[paymentId]` (server component or client) with `window.print()`.

### 7) Daraja testi + Imtihon + Ballar (Tests / exams / scores)
- Models: `Exam { id, title, courseId?, groupId?, date, maxScore Int, createdById }`, `Score { id, examId→Exam, leadId→Lead, score Int, note?, createdAt } @@unique([examId, leadId])`.
- API `/api/exams` (+ `[id]`), `/api/exams/[id]/scores` (GET students+scores for a group, POST bulk save — mirror the attendance bulk pattern).
- Page `/exams`: create exam, then enter scores per group (table like attendance). Show each student's score history on the lead profile. Sidebar: "Imtihonlar" (icon `GraduationCap` or `ClipboardList`).

### 8) Gamifikatsiya — Tanga (Coins)
- Add `coins Int @default(0)` to `Lead`. Model `CoinTx { id, leadId→Lead, amount Int /* +/- */, reason String, createdById, createdAt }`.
- API `/api/leads/[id]/coins` (POST add/deduct). Show coin balance + give/deduct on lead profile. Page `/leaderboard`: students ranked by coins. Sidebar: "Reyting" (icon `Trophy`).

### 9) Muzlatilgan o'quvchilar (Frozen students)
- Add `frozenAt DateTime?`, `frozenUntil DateTime?` to `Lead`. 
- API: a PATCH action to freeze/unfreeze (set/clear fields). UI: "Muzlatish" button on lead profile + a filter/section "Muzlatilganlar". Frozen students excluded from active counts.

### 10) Referral forma (Referrals)
- Add `referredById String?` (→ Lead, self-relation) and/or `referrerName String?, referrerPhone String?` to `Lead`.
- Public page `/apply` already exists — add an optional "Sizni kim tavsiya qildi?" field; public API stores it. Report: referral counts per student. (Bonus/coin on successful enrollment — optional.)

### 11) Audit log (Jurnallar)
- Model `AuditLog { id, userId String→User, action String, entity String, entityId String?, details Json?, createdAt }`.
- Add a small helper `logAudit(userId, action, entity, entityId?, details?)` and call it in create/update/delete API routes (payments, expenses, payroll, leads delete, stage delete, etc.).
- Page `/logs` (admin): filterable table (kim, qachon, nima). Sidebar: "Jurnallar" (icon `ScrollText`).

### 12) Qo'shimcha hisobotlar (Reports)
- `/api/reports/teacher-performance` → per teacher: groups, students, attendance %, revenue. Page section.
- Extend financial reporting (monthly income/expense/profit) — can live on `/cashflow`.

### 13) Bayram kunlari (Holidays)
- Model `Holiday { id, date DateTime @db.Date, name String }`. API `/api/holidays` + `[id]`. Settings UI to add/remove. Timetable/attendance should visually mark holidays.

### 14) Arxiv (Archive)
- Add `isArchived Boolean @default(false)` to `Lead` and `Group`. Exclude archived from default lists; add an "Arxiv" view + archive/restore actions.

### 15) (Optional / later) SMS — Eskiz.uz
- Wrap an `sendSms(phone, text)` util using Eskiz.uz API (token from a `Setting` key `eskiz_token`). Auto-SMS for payment-due / lesson reminders (cron, mirror `/api/cron/follow-up`). Gate behind a setting; needs an Eskiz account/key.

---

## DELIVERABLE REQUIREMENTS
1. Implement features in the order listed (finance first). Each feature: Prisma model(s) + `prisma db push` + API + page + sidebar link.
2. **Zero errors**: `npx tsc --noEmit` and `npm run build` must pass. No unused imports. Proper types (avoid `any` except where the codebase already uses it).
3. Match existing UI exactly (cards, buttons, dark mode, Uzbek labels, useConfirm for deletes, sonner toasts).
4. Don't break existing pages/APIs. Reuse existing models/relations; add back-relations on `User`, `Lead`, `Group`, `Course` as needed.
5. Keep money as Decimal(12,2); compute month/today in Asia/Tashkent (UTC+5).
6. After each feature, briefly state what files you created/changed.

Start with **Feature 1 (Expenses)** and proceed sequentially. Write complete, working code for each before moving on.
