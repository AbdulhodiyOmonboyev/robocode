# VS Code (Claude Code) — LC-UP'да bor, bizда yo'q funksiyalar

Har bir taskни alohida agentga bering. Baza o'zgarishi bo'lgan tasklarда:
schema.prisma + `/api/admin/migrate` ga mos `CREATE TABLE/COLUMN IF NOT EXISTS` qo'shiladi
(host Supabase'ga ulanolmaydi — migratsiya jonli saytда `/api/admin/migrate` orqali bajariladi).
Enumlar o'rniga **TEXT** ustun ishlating (migratsiya sodda bo'lsin). Har taskда `npm run build` xatosiz.

═══════════════════════════════════════

## 🔹 AGENT 1 — Xodimlar davomati (Staff attendance)

Xodimlar/ustozlar ishga kelish-ketishini belgilaydigan tizim yarat.

1. `prisma/schema.prisma` ga model qo'sh:
   `StaffAttendance { id String @id @default(cuid()); userId String; user User @relation(...); date String; checkIn DateTime?; checkOut DateTime?; status String @default("absent"); note String?; createdAt DateTime @default(now()) }` + User modelга teskari relation.
2. `src/app/api/admin/migrate/route.ts` statements massiviga qo'sh:
   `CREATE TABLE IF NOT EXISTS "StaffAttendance" (id text primary key, "userId" text not null, date text not null, "checkIn" timestamptz, "checkOut" timestamptz, status text default 'absent', note text, "createdAt" timestamptz default now())` va indeks: `CREATE INDEX IF NOT EXISTS "sa_user_date" ON "StaffAttendance"("userId", date)`.
3. API `src/app/api/staff-attendance/route.ts`: GET (?date= bo'yicha barcha xodim + holati), POST (check-in — checkIn=now, status "ontime"/"late" ish boshlanish vaqtiga qarab), PATCH (check-out — checkOut=now).
4. Sahifa `src/app/(dashboard)/staff-attendance/page.tsx`: tablar (Barchasi/Ustozlar/Hodimlar), sana tanlash, KPI kartalar (Jami xodimlar, O'z vaqtida, Kech qolgan, Kelmagan, Hozir ishda), jadval (F.I · KELDI · KETTI · "Keldi"/"Ketdi" tugma). Zamonaviy uslub: oq kartalar rounded-2xl, brend #5E2CA5.
5. `src/components/shared/Sidebar.tsx` ga "Xodimlar davomati" havola qo'sh (/staff-attendance, ikon: UserCheck).

═══════════════════════════════════════

## 🔹 AGENT 2 — Vazifalar / Task board (Kanban)

Xodimlarga vazifa biriktiriladigan Todo/Progress/Done doskasi yarat.

1. `prisma/schema.prisma` ga model:
   `Task { id String @id @default(cuid()); title String; description String?; status String @default("todo"); type String?; assignedToId String?; assignedTo User? @relation("TaskAssignee",...); createdById String?; deadline DateTime?; tags String?; createdAt DateTime @default(now()) }` + User teskari relation.
2. `migrate/route.ts` ga: `CREATE TABLE IF NOT EXISTS "Task" (id text primary key, title text not null, description text, status text default 'todo', type text, "assignedToId" text, "createdById" text, deadline timestamptz, tags text, "createdAt" timestamptz default now())` + indeks status va assignedToId bo'yicha.
3. API `src/app/api/tasks/route.ts` (GET filtrlar bilan, POST) va `src/app/api/tasks/[id]/route.ts` (PATCH status/tahrir, DELETE).
4. Sahifa `src/app/(dashboard)/tasks/page.tsx`: 3 ustun (Todo/Progress/Done), kartalarni ustundan ustunga o'tkazish (drag yoki tugma), filtrlar (xodim, tur, muddat, teg), "Yangi vazifa" modal. Zamonaviy uslub, brend #5E2CA5.
5. Sidebar'ga "Vazifalar" havola (/tasks, ikon: CheckSquare).

═══════════════════════════════════════

## 🔹 AGENT 3 — Dashboard KPI yaxshilash

`src/app/api/dashboard/route.ts` va `src/app/(dashboard)/dashboard/page.tsx` ni yangila:
1. Har KPI uchun **o'sish ko'rsatkichi** qo'sh — joriy davr vs oldingi davr (masalan +14 / −3), yashil/qizil rangда kartada ko'rsat.
2. Yangi KPI kartalar qo'sh: **Sinov darsida** (status TRIAL_BOOKED soni), **Shu oy to'laganlar** (shu oyда to'lov qilganlar soni), **Muzlatilganlar** (frozen), **Qarzdorlar** (qarzi borlar soni).
3. Kartalar zamonaviy: rangli ikon-chip + katta son + o'sish badge. Brend #5E2CA5.
Faqat shu 2 fayl (+ kerak bo'lsa kichik yordamchi). Build xatosiz.

═══════════════════════════════════════

## 🔹 AGENT 4 — Bildirishnomalar markazi

1. `src/components/shared/NotificationBell.tsx`: header'да qo'ng'iroq ikon + o'qilmagan soni; bosilganда dropdown — bugungi/kechikkan eslatmalar (`/api/reminders`) va so'nggi muhim voqealar (`/api/logs`). Har element ikon + matn + vaqt, "Hammasini ko'rish".
2. Layout/topbar'ga shu komponentni qo'sh.
Zamonaviy uslub, brend #5E2CA5, dark mode. Build xatosiz.

═══════════════════════════════════════

## 🔹 AGENT 5 — Global qidiruv (header + Ctrl+K)

1. Header (topbar)ga qidiruv maydoni qo'sh; `Ctrl+K` bilan ochiladigan `src/components/shared/CommandPalette.tsx`.
2. Qidiruv lidlar, talabalar, guruhlar, o'qituvchilar bo'ylab ishlasin (`/api/leads`, `/api/students`, `/api/groups`, `/api/teachers`), natijani bosib o'sha sahifaga o'tsin.
3. Klaviatura bilan boshqarish (yuq/quyi/Enter/Esc). Zamonaviy oq panel rounded-2xl + soya, brend #5E2CA5, dark mode. Build xatosiz.

═══════════════════════════════════════

## 🔹 AGENT 6 — Xona bo'yicha jadval + Excel eksport (ixtiyoriy)

`src/app/(dashboard)/timetable/page.tsx` ni kengaytir: guruh bo'yicha ko'rinishдan tashqari **xona (room) bo'yicha** ko'rinish qo'sh — ustunlar vaqt, qatorlar xonalar, kataklarда dars bloki (kurs, o'qituvchi, vaqt, o'quvchi soni). "Excelga eksport" tugma (CSV/XLSX), Juft/Toq kunlar va haftakun tablari. Guruhда `room` maydoni bor — shundan foydalan. Brend #5E2CA5. Build xatosiz.

═══════════════════════════════════════

### Eslatma
Baza modelli tasklardan (Agent 1, 2) keyin push qiling, so'ng jonli saytда admin bo'lib
Console'да ishga tushiring: `fetch('/api/admin/migrate',{method:'POST'}).then(r=>r.json()).then(console.log)` —
shundagина yangi jadvallar Supabase'ga qo'shiladi va sahifalar ishlaydi.
