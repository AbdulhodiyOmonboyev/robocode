# VS Code promt — 2-QISM (O'quv jarayoni + qo'shimcha)
# 1-QISM tugab, sinab bo'lgach, pastdagi "---" dan keyingi hammasini nusxalab bering.

---

You are working on the existing **Next.js 16 (App Router) education-center CRM "Robocode CRM"**. This is **Part 2 of 2 — EDUCATION + EXTRA modules** (Part 1 added the finance modules). Match the existing code style EXACTLY and ensure **zero TypeScript / build errors**.

## TECH STACK (already set up — do not change)
- Next.js 16 (App Router), React 19, TypeScript (strict)
- Prisma 7 + `@prisma/adapter-pg` (client generated to `src/generated/prisma`), Supabase PostgreSQL
- NextAuth v5 (roles: `SUPER_ADMIN, ADMIN, MANAGER, OPERATOR`)
- Tailwind (dark mode via `dark:`), `lucide-react`, `sonner`, `zod`. Build: `prisma generate && next build`

## PROJECT CONVENTIONS (follow precisely)
- **DB**: `import { db } from "@/lib/db";`
- **Auth in API**: `const session = await auth(); if(!session) return 401; const user = session.user as any;` (`auth` from `@/lib/auth`). Restrict admin actions to `["SUPER_ADMIN","ADMIN"]`.
- **API**: `src/app/api/<name>/route.ts` (+ `[id]`). `NextResponse.json`. Params: `{ params }: { params: Promise<{ id: string }> }` → `await params`. Validate with `zod`. `export const dynamic = "force-dynamic";` on fresh GETs.
- **Pages**: `src/app/(dashboard)/<name>/page.tsx`, `"use client";`. UI from `@/components/ui/{card,button,input}`. Deletions via `useConfirm` from `@/components/ui/confirm` (`const { confirm, dialog } = useConfirm();` + render `{dialog}`). Toasts via `sonner`.
- **Sidebar**: add to `navItems` in `src/components/shared/Sidebar.tsx`.
- **Language**: UI in **Uzbek (latin)**. Money: `Number(v).toLocaleString("ru-RU")`.
- **Timezone**: Asia/Tashkent (UTC+5) for month/today grouping.
- **Schema**: edit `prisma/schema.prisma` → `npx prisma db push` → `npx prisma generate`. Add back-relations.
- **Bulk save pattern**: for scores/attendance, mirror existing `src/app/api/attendance/route.ts` (GET returns group students + values; POST upserts an array).

## ALREADY EXISTS (do NOT recreate)
Leads (+ `Stage`), Lead profile (`parentName, parentPhone, telegramChatId`), Groups (`room`), Teachers, Courses, Payments + debtors, **Attendance** (`Attendance` model + `/api/attendance` bulk pattern), Timetable, Web form `/apply`, Telegram bot, Reminders, Analytics, Reports, Users/Roles, Settings, `Activity` model, `useConfirm`. (Part 1 added: Expense, Income, SalaryRecord, PaymentType, cashflow, receipt.)

---

## FEATURES — PART 2

### 7) Imtihon + Ballar (Exams / scores)
- Models: `Exam { id, title String, courseId String?, groupId String?, date DateTime @db.Date, maxScore Int @default(100), createdById String, createdAt }` and `Score { id, examId String, exam Exam@relation, leadId String, lead Lead@relation, score Int, note String?, createdAt, updatedAt @@unique([examId, leadId]) }`. Back-relations on Lead/Group/Course.
- API `/api/exams` (GET list, POST), `/api/exams/[id]` (GET, DELETE), `/api/exams/[id]/scores` (GET group students + their score; POST bulk upsert array — mirror attendance).
- Page `/exams`: list + create exam (title, guruh, sana, maxScore); open an exam → enter scores per student (table). Show each student's scores on the lead profile. Sidebar: "Imtihonlar" (icon `ClipboardList`).

### 8) Daraja testi (Level test)
- Reuse the Exam model with a `type` field (`exam | level_test`) OR a boolean `isLevelTest Boolean @default(false)` on Exam. A simple "Daraja testi" filter/section under `/exams`. Result stored as a Score; show on lead profile.

### 9) Gamifikatsiya — Tanga (Coins)
- Add `coins Int @default(0)` to `Lead`. Model `CoinTx { id, leadId String, lead Lead@relation, amount Int /* + or - */, reason String, createdById String, createdAt }`.
- API `/api/leads/[id]/coins` (POST `{amount, reason}` → updates Lead.coins + logs CoinTx). Show coin balance + "Tanga berish/olish" control on the lead profile.
- Page `/leaderboard`: students ranked by `coins` desc (ism, guruh, tanga). Sidebar: "Reyting" (icon `Trophy`).

### 10) Muzlatilgan o'quvchilar (Frozen students)
- Add `frozenAt DateTime?`, `frozenUntil DateTime?` to `Lead`.
- API: PATCH on `/api/leads/[id]` already exists — extend its zod schema to accept `frozenAt`, `frozenUntil` (nullable). UI: "Muzlatish" / "Faollashtirish" button on the lead profile (set/clear). Add a "Muzlatilganlar" filter on the leads list. Exclude frozen from active-student counts in dashboards/analytics.

### 11) Referral (Tavsiya)
- Add `referrerName String?`, `referrerPhone String?` to `Lead`. Add an optional "Sizni kim tavsiya qildi?" field to the public `/apply` form + `/api/public/lead` (store it). 
- Report: count referrals (group by `referrerPhone`) on a small "Referral" section in reports. (Optional: award coins on enrolled referral.)

### 12) Audit log (Jurnallar)
- Model `AuditLog { id, userId String, action String, entity String, entityId String?, details Json?, createdAt @@index([createdAt]) }`.
- Helper `src/lib/audit.ts`: `export async function logAudit(userId, action, entity, entityId?, details?) {...}`. Call it in create/update/delete routes (payments, expenses, incomes, payroll, leads delete, stage delete, exams).
- Page `/logs` (admin): table (kim, amal, obyekt, sana) with filters. Sidebar: "Jurnallar" (icon `ScrollText`).

### 13) Qo'shimcha hisobotlar (Reports)
- `/api/reports/teacher-performance` (admin): per teacher (User with groups) → guruhlar soni, o'quvchilar soni, davomat %, daromad (payments of their groups' leads). Render as a table on a `/reports`-area page or a new `/reports/teachers` page. Sidebar (optional).

### 14) Bayram kunlari (Holidays)
- Model `Holiday { id, date DateTime @db.Date @unique, name String }`. API `/api/holidays` + `[id]`. Manage in Settings (add/remove). On the Timetable and Attendance date pickers, visually mark holiday dates.

### 15) Arxiv (Archive)
- Add `isArchived Boolean @default(false)` to `Lead` and `Group`. Exclude archived from default lists/queries. Add "Arxivlash" / "Tiklash" actions and an "Arxiv" filter/section for leads and groups.

### 16) (Optional / later) SMS — Eskiz.uz
- `src/lib/sms.ts`: `sendSms(phone, text)` using Eskiz.uz API; token from `Setting` key `eskiz_token`. Auto-SMS cron for payment-due / lesson reminders (mirror `/api/cron/follow-up`), gated behind a setting. Needs an Eskiz account/key — leave disabled by default.

---

## REQUIREMENTS
1. Do them in order (7→16). Each: model + `prisma db push` + API + page/section + sidebar link.
2. **Zero errors**: `npx tsc --noEmit` and `npm run build` must pass. No unused imports.
3. Match existing UI (cards, buttons, dark mode, Uzbek, useConfirm, sonner). Reuse the attendance bulk pattern for scores.
4. Don't break existing pages/APIs. Add back-relations on `Lead`, `Group`, `Course`, `User`.
5. After each feature, list the files you created/changed.

Start with **Feature 7 (Exams/scores)** and proceed sequentially.
