# VS Code promt — 3/4 (O'quv: Imtihon, Ball, Tanga, Reyting)
# 2-qism tugab, sinab bo'lgach, "---" dan keyingi hammasini nusxalab bering.

---

You are working on the existing **Next.js 16 (App Router) CRM "Robocode CRM"**. This is **Part 3 of 4** — the EDUCATION modules. Match the existing code style EXACTLY; ensure **zero TypeScript / build errors**.

## TECH STACK & CONVENTIONS
- Next.js 16 App Router, React 19, TS strict. Prisma 7 + `@prisma/adapter-pg` (client → `src/generated/prisma`), Supabase PostgreSQL. NextAuth v5. Tailwind (`dark:`), `lucide-react`, `sonner`, `zod`. Build: `prisma generate && next build`.
- **DB**: `import { db } from "@/lib/db";`. **Auth**: `const session = await auth(); if(!session) 401; const user = session.user as any;` (`@/lib/auth`).
- **API**: `src/app/api/<name>/route.ts` (+ `[id]`), `NextResponse.json`, params `Promise<{id}>` → `await params`, `zod`, `export const dynamic = "force-dynamic";` on GETs.
- **Pages**: `src/app/(dashboard)/<name>/page.tsx`, `"use client";`, UI from `@/components/ui/{card,button,input}`, deletions via `useConfirm` (`@/components/ui/confirm`) + `{dialog}`, toasts `sonner`. Sidebar: `navItems` in `src/components/shared/Sidebar.tsx`.
- **Uzbek** UI. Timezone Asia/Tashkent (UTC+5). Schema: edit `prisma/schema.prisma` → `npx prisma db push` → `npx prisma generate`. Add back-relations.
- **Bulk-save pattern**: for scores, MIRROR existing `src/app/api/attendance/route.ts` — GET returns a group's students + their current value; POST upserts an array of `{leadId, ...}`.

## ALREADY EXISTS (do NOT recreate)
Leads (`Lead`), Lead profile page (`src/app/(dashboard)/leads/[id]/page.tsx`), Groups (`Group`), Courses, **Attendance** (`Attendance` + `/api/attendance` bulk pattern), Users, Settings, `Activity`, `useConfirm`. Lead has `groupId`.

---

## FEATURES — PART 3

### 7) Imtihon + Ballar (Exams / scores)
- Models: `Exam { id, title String, type String @default("exam") /* exam|level_test */, courseId String?, groupId String?, date DateTime @db.Date, maxScore Int @default(100), createdById String, createdAt }` and `Score { id, examId String, exam Exam @relation, leadId String, lead Lead @relation, score Int, note String?, createdAt, updatedAt @@unique([examId, leadId]) }`. Add back-relations on `Lead`, `Group`, `Course`.
- API: `/api/exams` (GET list, POST create), `/api/exams/[id]` (GET, DELETE), `/api/exams/[id]/scores` (GET → group students + their score; POST → bulk upsert `[{leadId, score, note?}]`, mirror attendance).
- Page `/exams`: list exams + "Imtihon yaratish" (title, type, guruh, sana, maxScore). Open an exam → enter scores per student (table like attendance, number inputs). Sidebar: "Imtihonlar" (icon `ClipboardList`).
- On the lead profile (`leads/[id]`), add a small "Ballar / imtihonlar" card showing that student's scores.

### 8) Daraja testi (Level test)
- Reuse `Exam` with `type="level_test"`. On `/exams`, allow choosing type when creating; add a simple filter (Imtihon / Daraja testi). Results are `Score` rows; show under the same lead profile card.

### 9) Gamifikatsiya — Tanga (Coins)
- Add `coins Int @default(0)` to `Lead`. Model `CoinTx { id, leadId String, lead Lead @relation, amount Int /* + or - */, reason String, createdById String, createdAt }`.
- API `/api/leads/[id]/coins` (POST `{ amount, reason }` → update `Lead.coins` and insert `CoinTx`). On the lead profile, show coin balance + a "Tanga berish / olish" control (amount + reason).
- Page `/leaderboard`: students ranked by `coins` desc (ism, guruh, tanga). Sidebar: "Reyting" (icon `Trophy`).

## REQUIREMENTS
- Do 7→9 in order. Each: model + `prisma db push` + API + page/section + sidebar link.
- `npx tsc --noEmit` and `npm run build` must pass. No unused imports. Match existing UI (Uzbek, dark mode, useConfirm, sonner). Reuse the attendance bulk pattern for scores. Don't break existing code. After each, list changed files.
- Start with Feature 7 (Exams/scores).
