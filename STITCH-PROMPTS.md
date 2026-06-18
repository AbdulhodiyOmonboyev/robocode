# Robocode CRM — Stitch promtlari (bo'lib-bo'lib)

Bu fayl Google Stitch (stitch.withgoogle.com) uchun tayyor promtlardan iborat.
Har bir ekran uchun: avval **STIL BLOKI**ni nusxalang, so'ng ekran promtini qo'shib, Stitch'ga joylang.
Stitch dizaynni yasaydi → "Export to Figma" yoki "Copy code" orqali olasiz.

---

## 🎨 STIL BLOKI (har bir promt boshiga qo'shing)

```
Design a clean, modern SaaS web dashboard screen (desktop, 1440px wide).
Style: light theme, background #F5F6FA, white cards with 18px rounded corners and soft subtle shadow.
Primary brand color: violet #5E2CA5. Accent text dark #111827, secondary gray #6B7280.
Font: Inter. Use small colored status badges (pill shape, 12% opacity background).
Left sidebar 260px, white, with a violet rounded logo square (robot face, two white eyes) + "Robocode CRM" title, and a vertical nav menu (active item = violet background, white text).
All interface text in Uzbek (latin). Generous spacing, professional, friendly.
```

---

## QISM 1 — Kirish va asosiy

### 1. Login
```
A centered login card on a soft violet-tinted background. Card contains: violet robot logo, "Robocode CRM" title, "Tizimga kirish" subtitle, "Login" and "Parol" input fields, a full-width violet "Kirish" button, and small "© 2026 Robocode CRM" footer. No sidebar on this screen.
```

### 2. Dashboard
```
A CRM dashboard. Top row: 4 KPI cards (Jami lidlar, Faol o'quvchilar, Bu oy tushum, Konversiya %) each with a colored icon chip and a small green trend badge. Below: a large card with a monthly revenue vs expense bar chart, and a side card "So'nggi lidlar" listing 5 recent leads with avatar, name and status badge.
```

---

## QISM 2 — Lidlar

### 3. Lidlar (jadval)
```
A leads management page. Header: "Lidlar" title + search box + violet "+ Yangi lid" button. Filter chips: Barchasi, Yangi, Aloqada, Sinov darsi, Muzlatilgan, Arxiv. Then a table card with columns: Ism (with round avatar initials), Telefon, Kurs, Holat (colored badge), Manba, Sana. 7 sample rows of Uzbek student names.
```

### 4. Kanban
```
A kanban board for leads with 5 columns: Yangi (blue), Aloqada (amber), Sinov darsi (violet), O'qiyapti (green), Yo'qotilgan (red). Each column has a header with a colored dot, title and count badge, and several white lead cards. Each card shows student name (bold), course name as a small violet tag, and phone number.
```

### 5. Lid kartasi (batafsil)
```
A lead detail page. Top: profile header card with large avatar, name "Sardor Aliyev", status badge, phone + course, and action buttons (Tahrirlash, Muzlatish, Arxiv). Below two columns: left = info card (Telefon, Ota-ona, Manba, Qo'shilgan sana, Guruh, Mas'ul) and a gold "Tangalar: 1250" card; right = a card with tabs (Faoliyat, Eslatmalar, To'lovlar, Davomat, Ballar) and a vertical activity timeline with colored dots.
```

---

## QISM 3 — Moliya

### 6. To'lovlar
```
A payments page. 3 summary cards (Bu oy tushum, Jami tushum, Qarzdorlar) with colored icon chips. Then a table: O'quvchi (avatar), Kurs, Summa (bold), Chegirma, To'lov turi, Sana, Holat (To'langan = green badge, Qarz = red badge). Header has a violet "+ To'lov qabul qilish" button.
```

### 7. Xarajatlar
```
An expenses page. 3 KPI cards (Bu oy xarajat, O'rtacha kunlik, Eng katta kategoriya) with red/amber/violet accents. Table columns: Sana, Kategoriya (colored badge), Izoh, To'lov turi, Summa (red, with minus sign). Header "+ Xarajat qo'shish" violet button.
```

### 8. Pul oqimi
```
A cashflow page. 3 summary cards (Jami kirim green, Jami chiqim red, Sof foyda violet) each with a small percentage trend badge. Below: a large card titled "Oylik kirim / chiqim" with a grouped bar chart (green income bars and red expense bars) for 6 months (Yan–Iyun), with a legend.
```

### 9. Qo'shimcha daromad
```
An extra-income page. 3 KPI cards (Bu oy qo'shimcha, Eng katta manba, Yozuvlar soni). Table: Sana, Manba (badge), Izoh, To'lov turi, Summa (green, plus sign). "+ Daromad qo'shish" violet button.
```

### 10. Ish haqi (oylik)
```
A payroll page. 3 KPI cards (Jami hisoblangan, To'langan, Qoldiq). Table: O'qituvchi, Lavozim, Guruhlar, Hisoblangan, To'langan, Holat (To'langan green / Qisman amber / Kutilmoqda red badges). "+ Oylik hisoblash" violet button.
```

### 11. Chek / kvitansiya
```
A printable payment receipt: a narrow centered white card with violet robot logo, "Robocode CRM", "TO'LOV CHEKI" label, a dashed divider, rows (Chek raqami, Sana, O'quvchi, Kurs, To'lov turi, Davr), another divider, a big violet total "650 000 so'm", a "Rahmat!" line, and a full-width violet "Chop etish" button. Light gray page background.
```

---

## QISM 4 — O'quv jarayoni

### 12. Guruhlar
```
A groups page as a grid of cards (3 per row). Each card: colored rounded icon, group code (e.g. Robo-A12), course name, status badge, teacher row with small avatar, schedule line (days + time), and two chips (student count, room number). "+ Yangi guruh" violet button.
```

### 13. Davomat (jurnal)
```
An attendance journal table. Left column = student names with avatars. Top = date columns (8 dates). Cells = small rounded marks: green check (keldi), red cross (kelmadi), gray dash (dars yo'q). Last column = attendance percentage (bold, color-coded). Group/month selector dropdowns and a "Saqlash" button in header. A small legend above the table.
```

### 14. Imtihonlar
```
An exams page. Row of 3 exam summary cards (title, course, status badge, and stats: Sana, O'quvchi soni, O'rtacha foiz). Below: a results table for one exam with columns # (rank), O'quvchi (avatar), Ball (e.g. 48/50), Foiz (violet bold), Baho (letter grade badge A+/A/B/C/F colored). "+ Yangi imtihon" violet button.
```

### 15. Reyting (leaderboard)
```
A gamification leaderboard. Top: a podium with 3 winner cards (1st in center higher, gold/silver/bronze medals, avatars with colored ring, name, coin count with a gold coin icon, and a colored bar). Below: a ranked list (4th–10th) with rank number, avatar, name, course, and coin total. Month/Week/All segmented toggle in header.
```

### 16. Kurslar
```
A courses page as a grid of cards (3 per row). Each card: colored rounded icon, course name (bold), level badge (Boshlang'ich/O'rta/Yuqori), a thin divider, and 2x2 stats (Davomiyligi, Narxi in violet, Guruhlar, O'quvchilar). "+ Yangi kurs" violet button.
```

### 17. O'qituvchilar
```
A teachers page as a grid of cards (3 per row). Each card: avatar, name (bold), subject with colored dot, a gold star rating, divider, two stats (Guruhlar, O'quvchilar), and a phone line. "+ Yangi o'qituvchi" violet button.
```

### 18. O'qituvchi hisoboti
```
A teacher performance report. 3 KPI cards (O'rtacha davomat, O'rtacha ball, Faol o'qituvchi). Table: O'qituvchi, Guruh, O'quvchi soni, Davomat % (green/amber), O'rtacha ball, Reyting (star badge). "Eksport" outline button in header.
```

---

## QISM 5 — Tizim

### 19. Dars jadvali
```
A weekly timetable grid. Columns = days (Dushanba–Shanba), left column = time slots (09:00–18:30). Cells contain colored class blocks showing group code + room (e.g. "Robo-A12 / X3"), each course a different soft color. Header has group/week selectors and "+ Dars qo'shish" violet button.
```

### 20. Eslatmalar
```
A reminders/tasks page. Filter chips (Bugun, Ertaga, Bu hafta, Bajarilgan). A list card where each row has: a checkbox, a time (violet bold), a task title + short description, and a type badge (Qo'ng'iroq/To'lov/Vazifa/Uchrashuv colored). One completed row shown with a green check and strikethrough. "+ Yangi eslatma" violet button.
```

### 21. Hisobotlar (analitika)
```
An analytics page. Top: 4 KPI cards (Yangi lidlar, Konversiya, Faol o'quvchi, O'rtacha chek) with trend badges. Below two columns: left = "Oylik yangi lidlar" violet bar chart (6 months); right = "Lidlar manbasi" horizontal progress bars (Instagram, Telegram, Tavsiya, Sayt, Boshqa) with percentages. "Eksport" button.
```

### 22. Jurnallar (audit log)
```
A system audit log table. Columns: Vaqt, Foydalanuvchi, Amal (colored badge like To'lov qabul/Lid qo'shildi/Holat o'zgardi/Xarajat/Kirish), Tafsilot. 7 sample rows. "Eksport" outline button in header.
```

### 23. Hodimlar (foydalanuvchilar)
```
A staff/users page table. Columns: Ism, Rol (badge: Super Admin violet, Admin blue, Operator amber, Manager green), Email, Oxirgi kirish, Holat (Faol green / Nofaol red). "+ Yangi hodim" violet button.
```

### 24. Sozlamalar
```
A settings page. Left = a settings menu card (Umumiy, Logo, To'lov turlari, Bayram kunlari, SMS, Telegram bot, Foydalanuvchilar — active = soft violet). Right = "Markaz ma'lumotlari" form (Markaz nomi, Telefon, Valyuta, Manzil inputs, a "Qorong'i rejim" toggle, "Saqlash" violet button) and below a "Logotip" card with logo preview and "Rasm yuklash" button.
```

---

### Maslahat
- Promtni inglizcha qoldiring (Stitch inglizchani yaxshi tushunadi), UI matnlari o'zbekcha chiqadi.
- Bir ekran yoqmasa, "make it more compact / change color / add column" deb qo'shimcha yozing.
- Tayyor bo'lgach har ekranni **Export to Figma** qiling — bitta faylga yig'ib, prototip ulang.
