# Rejа — Yagona login + rollar + admin boshqaradigan ruxsatlar

**Maqsad:** Har qanday xodim/o'quvchi bitta login sahifasidan (ism yoki telefon + parol/kod) kirsa, tizim uni o'z portaliga yo'naltirsin. Har bir rol nimani ko'rishi/qila olishini **admin paneldan** boshqariladi.

3 bosqich. Har bosqichdan keyin `npm run build` xatosiz.

---

## 1-BOSQICH — Yagona login + rol bo'yicha yo'naltirish

**a) Login ism YOKI telefon bilan.**
`src/lib/auth.ts` da hozir faqat `username` bo'yicha qidiradi. Buni o'zgartir: kiritilgan qiymat telefonga o'xshasa (`+998...` yoki raqamlar) `phone` bo'yicha, aks holda `username` bo'yicha `db.user.findFirst` bilan qidirsin. Telefonni normallashtir (probel/qavs olib tashla, `+998` bilan solishtir).

**b) Rol bo'yicha yo'naltirish (login sahifasida).**
Kirgandan keyin rolга qarab yo'naltir:
- SUPER_ADMIN / ADMIN → `/dashboard`
- Buxgalter → `/finance` (2-bosqichda quriladi; hozircha `/dashboard`)
- Reception → `/reception` (2-bosqichda; hozircha `/dashboard`)
- O'qituvchi (isTeacher) → `/teacher/dashboard`
- O'quvchi → `/student/dashboard` (3-bosqichda; hozircha login rad etilsin)

---

## 2-BOSQICH — Rollar va admin boshqaradigan ruxsatlar ⭐ (asosiy)

**a) Yangi rollar.**
`Role` enum'iga qo'sh: `RECEPTION`, `ACCOUNTANT`. (Migrate endpoint orqali enum'ga qiymat qo'shiladi — `ALTER TYPE "Role" ADD VALUE IF NOT EXISTS ...`.)

**b) Kengaytirilgan ruxsat bayroqlari.**
`User` modeliga qo'shimcha boolean ruxsatlar qo'sh (admin toggle qiladi), masalan:
- `canSeePayments` — to'lov holatini ko'rish
- `canManagePayments` — to'lov qabul qilish
- `canSeeStudentContacts` — o'quvchi telefon/manzilini ko'rish
- `canManageAttendance` — davomat belgilash
- `canManageGrades` — ball/baho qo'yish
- `canSeeReports` — hisobotlar
- `canManageExpenses` — xarajatlar
(mavjud `canManageLeads` va h.k. saqlanadi.)

**c) Admin panelda "Ruxsatlar" boshqaruvi.**
Foydalanuvchilar sahifasida har xodimni ochganda — ruxsat toggle'lari (yuqoridagi bayroqlar). Admin kim nimani ko'rishini shu yerdan belgilaydi. Har rol uchun standart to'plam bo'lsin (masalan o'qituvchida davomat/ball yoqilgan, to'lov o'chirilgan).

**d) Portallar ruxsatga bo'ysunsin.**
Har portal (teacher, reception, finance) va API shu bayroqlarni tekshirsin. Masalan o'qituvchi panelida to'lov holati faqat `canSeePayments` yoqilgan bo'lsa ko'rinadi.

**e) Reception va Buxgalter portali (sodda).**
- `/reception` — lidlar qo'shish, qo'ng'iroqlar, ro'yxatga olish (ruxsatга qarab).
- `/finance` — to'lovlar, xarajatlar, maoshlar, moliyaviy hisobot (ruxsatга qarab).
(Mavjud admin sahifalaridan qayta foydalanish mumkin, faqat cheklangan ko'rinishда.)

---

## 3-BOSQICH — O'quvchi login (telefon + kod)

- O'quvchi (Lead) uchun login: telefon raqami + maxsus kod (masalan tug'ilgan sana yoki admin bergan 4-6 xonali kod). `Lead` modeliga `loginCode` maydoni.
- `/student/dashboard` — o'quvchi o'z: davomati, ballari, uy vazifalari, to'lov holatini ko'radi (ruxsatга qarab).
- Bitta login sahifasi: kiritilgan qiymat User'da topilmasa, Lead (o'quvchi) sifatida tekshirsin.

---

## TEXNIK
- Dizayn: bizning binafsha uslub. Har bosqich `npm run build` xatosiz.
- Yangi jadval/ustun/enum qiymatlari `migrate` endpoint orqali (host Supabase'ga ulanmaydi).
- O'qituvchi/reception/buxgalter/o'quvchi faqat o'ziga tegishlisini ko'rsin — har API'da tekshir.
