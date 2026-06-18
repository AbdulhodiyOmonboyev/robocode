# VS Code (Claude Code) buyruq — Sidebar'ni guruhlash / qisqartirish

Quyidagi matnni Claude Code chat'iga to'liq nusxalab joylang:

---

**Vazifa:** `src/components/shared/Sidebar.tsx` faylidagi navigatsiyani qayta tuzib, hozirgi 23 ta tekis (flat) menyu elementini guruhlangan, ochiladigan/yig'iladigan (collapsible) menyuga aylantir. LC-UP CRM uslubidagi ixcham menyu kerak.

**Muhim shartlar:**
- Hech qaysi `href` (route) o'zgarmasin — barcha sahifalar avvalgidek ishlasin. Faqat menyuning ko'rinishi va tartibi o'zgaradi.
- Hozirgi funksiyalar saqlansin: sidebar collapse (ikonkagacha yig'ish) tugmasi, logo/branding (`/api/branding`), foydalanuvchi profili + chiqish (signOut), dark mode (`dark:` klasslar), active holat.

**Yangi menyu strukturasi** (`navGroups` massivi sifatida tuz):

```
1. Dashboard            -> /dashboard            (yakka element)
2. Lidlar               -> /leads                (bola: Kanban -> /leads/kanban)
3. Guruhlar             -> /groups               (yakka)
4. O'qituvchilar        -> /teachers             (yakka)
5. "O'quv jarayoni"     (guruh, ochiladigan):
      Davomat           -> /attendance
      Dars jadvali      -> /timetable
      Imtihonlar        -> /exams
      Reyting           -> /leaderboard
      Kurslar           -> /courses
6. "Moliya"             (guruh, ochiladigan):
      To'lovlar         -> /payments
      Qo'shimcha daromad-> /incomes
      Ish haqi          -> /payroll
      Xarajatlar        -> /expenses
      Pul oqimi         -> /cashflow
7. "Hisobotlar"         (guruh, ochiladigan):
      Hisobotlar        -> /reports
      Analitika         -> /analytics
      O'qituvchi hisoboti -> /teacher-report
8. Eslatmalar           -> /reminders            (yakka)
9. "Sozlamalar"         (guruh, ochiladigan):
      Sozlamalar        -> /settings
      Hodimlar          -> /users
      Jurnallar         -> /logs
```

**Texnik talablar:**
1. `navGroups` tipini quyidagicha qil:
   ```ts
   type NavItem = { href: string; label: string; icon: LucideIcon };
   type NavEntry =
     | { type: "item"; href: string; label: string; icon: LucideIcon; children?: NavItem[] }
     | { type: "group"; label: string; icon: LucideIcon; children: NavItem[] };
   ```
2. Guruh sarlavhasi (`type: "group"`) bosilganda ochilib/yopilsin. Holat `useState<Record<string, boolean>>` da saqlansin.
3. Agar guruh ichidagi biror element joriy sahifa bo'lsa (`pathname` mos kelsa), o'sha guruh **avtomatik ochiq** bo'lsin (boshlang'ich holatda).
4. Active holat: joriy `pathname` mos kelgan element indigo/binafsha fonda (avvalgi `bg-indigo-50 text-indigo-700 ...` uslubi) ajralib tursin. Guruh yopiq turganda ham, ichida active element bo'lsa, guruh sarlavhasi biroz ajralib tursin (masalan matni indigo).
5. Guruhda o'ng tomonda chevron ikonka (ChevronDown/ChevronRight) ochiq/yopiqligini ko'rsatsin va animatsiya bilan aylansin (`transition-transform`).
6. Guruh bolalari biroz ichkariga surilgan (chap padding kattaroq) va ozgina kichikroq shrift bilan ko'rsatilsin.
7. Sidebar `collapsed` (ikonkagacha yig'ilgan) holatida: faqat ikonkalar ko'rinsin; guruh sarlavhasini bosganda menyu kengaysin yoki tooltip ko'rsatilsin (oddiyroq variant: collapsed holatda guruhlar tekis ikonkalar sifatida ko'rinsin).
8. Lucide ikonalaridan foydalan. Tavsiya etilgan ikonkalar:
   - Dashboard: LayoutDashboard, Lidlar: Users, Kanban: Pin, Guruhlar: GraduationCap, O'qituvchilar: Presentation
   - O'quv jarayoni guruhi: BookOpen; ichida Davomat: ClipboardCheck, Dars jadvali: CalendarRange, Imtihonlar: ClipboardList, Reyting: Trophy, Kurslar: BookOpen
   - Moliya guruhi: Wallet; ichida To'lovlar: Wallet, Qo'shimcha daromad: PlusCircle, Ish haqi: Banknote, Xarajatlar: TrendingDown, Pul oqimi: ArrowLeftRight
   - Hisobotlar guruhi: BarChart3; ichida Hisobotlar: BarChart3, Analitika: TrendingUp, O'qituvchi hisoboti: FileBarChart
   - Eslatmalar: Bell
   - Sozlamalar guruhi: Settings; ichida Sozlamalar: Settings, Hodimlar: UserCog, Jurnallar: ScrollText
9. Kod toza, TypeScript xatosiz bo'lsin. `"use client"` saqlansin. Faqat shu faylni o'zgartir.

**Yakuniy natija:** menyu ancha qisqa va tartibli ko'rinsin, guruhlarni ochib-yopib ishlatish mumkin bo'lsin, barcha sahifalar avvalgidek ochilaversin. Build (`npm run build`) xatosiz o'tsin.

---
