# VS Code promt — 4/4 (Qo'shimcha: Muzlatish, Referral, Audit, Hisobot, Bayram, Arxiv, SMS)
# 3-qism tugab, sinab bo'lgach, "---" dan keyingi hammasini nusxalab bering.

---

You are working on the existing **Next.js 16 (App Router) CRM "Robocode CRM"**. This is **Part 4 of 4** — EXTRA modules. Match the existing code style EXACTLY; ensure **zero TypeScript / build errors**.

## TECH STACK & CONVENTIONS
- Next.js 16 App Router, React 19, TS strict. Prisma 7 + `@prisma/adapter-pg` (client → `src/generated/prisma`), Supabase PostgreSQL. NextAuth v5 (`SUPER_ADMIN, ADMIN, MANAGER, OPERATOR`). Tailwind (`dark:`), `lucide-react`, `sonner`, `zod`. Build: `prisma generate && next build`.
- **DB**: `import { db } from "@/lib/db";`. **Auth**: `const session = await auth(); if(!session) 401; const user = session.user as any;` (`@/lib/auth`); admin actions = `["SUPER_ADMIN","ADMIN"]`.
- **API**: `src/app/api/<name>/route.ts` (+ `[id]`), `NextResponse.json`, params `Promise<{id}>` → `await params`, `zod`, `export const dynamic = "force-dynamic";` on GETs.
- **Pages**: `src/app/(dashboard)/<name>/page.tsx`, `"use client";`, UI from `@/components/ui/{card,button,input}`, deletions via `useConfirm` (`@/components/ui/confirm`) + `{dialog}`, toasts `sonner`. Sidebar: `navItems` in `src/components/shared/Sidebar.tsx`.
- **Uzbek** UI. Timezone Asia/Tashkent (UTC+5). Schema: edit `prisma/schema.prisma` → `npx prisma db push` → `npx prisma generate`. Add back-relations.

## ALREADY EXISTS (do NOT recreate)
Leads (`Lead`, with `groupId`, `assignedToId`, `status`), Lead profile + `PATCH /api/leads/[id]` (zod `updateSchema`), Lead list (`/leads`), Groups (`Group`), Teachers (User with groups via `Group.teacherId`), Courses, Payments, Attendance, Timetable, **public `/apply` + `/api/public/lead`**, Telegram bot, Analytics, Reports, Settings, `/api/cron/follow-up` (cron pattern), `Activity`, `useConfirm`.

---

## FEATURES — PART 4

### 10) Muzlatilgan o'quvchilar (Frozen students)
- Add `frozenAt DateTime?`, `frozenUntil DateTime?` to `Lead`.
- Extend the existing `PATCH /api/leads/[id]` zod schema to accept `frozenAt`, `frozenUntil` (nullable strings → Date). On the lead profile add "Muzlatish" / "Faollashtirish" buttons. Add a "Muzlatilganlar" filter on `/leads`. Exclude frozen students from active-student counts in dashboard/analytics.

### 11) Referral (Tavsiya)
- Add `referrerName String?`, `referrerPhone String?` to `Lead`. Add an optional "Sizni kim tavsiya qildi? (ism + telefon)" field to the public `/apply` form and store it in `/api/public/lead`.
- Add a small "Referral" section in reports: count by `referrerPhone` (kim nechta odam olib kelgan).

### 12) Audit log (Jurnallar)
- Model `AuditLog { id, userId String, action String, entity String, entityId String?, details Json?, createdAt @@index([createdAt]) }`.
- Helper `src/lib/audit.ts`: `export async function logAudit(userId: string, action: string, entity: string, entityId?: string, details?: any) {...}` (wrap in try/catch). Call it in key mutating routes (payments create/delete, leads delete, stage delete, expenses, payroll, exams).
- Page `/logs` (admin): table (kim, amal, obyekt, sana) with simple filters. Sidebar: "Jurnallar" (icon `ScrollText`).

### 13) Qo'shimcha hisobotlar (Reports)
- `/api/reports/teacher-performance` (admin): per teacher (User who teaches groups) → guruhlar soni, o'quvchilar soni, davomat %, daromad (payments of their groups' leads). 
- Page `/reports/teachers` (or a section in existing reports): table. Sidebar optional.

### 14) Bayram kunlari (Holidays)
- Model `Holiday { id, date DateTime @db.Date @unique, name String }`. API `/api/holidays` (GET, POST) + `[id]` (DELETE). Manage in Settings (add/remove list). On the Timetable and Attendance date pickers, visually mark holiday dates (e.g., a note/badge).

### 15) Arxiv (Archive)
- Add `isArchived Boolean @default(false)` to `Lead` and `Group`. Exclude archived from default lists/queries (leads list, groups list, kanban, counts). Add "Arxivlash" / "Tiklash" actions and an "Arxiv" filter/section for leads and groups.

### 16) (Optional / later) SMS — Eskiz.uz
- `src/lib/sms.ts`: `export async function sendSms(phone: string, text: string)` using Eskiz.uz API; token from `Setting` key `eskiz_token`. Optional auto-SMS cron (payment-due / lesson reminder), mirror `/api/cron/follow-up`, gated behind a setting `sms_enabled`. Needs an Eskiz account/key — leave disabled by default; do not break the build if no key.

## REQUIREMENTS
- Do 10→16 in order. Each: schema change + `prisma db push` + API + page/section + sidebar link.
- `npx tsc --noEmit` and `npm run build` must pass. No unused imports. Match existing UI (Uzbek, dark mode, useConfirm, sonner). Don't break existing code. After each, list changed files.
- Start with Feature 10 (Frozen students).
