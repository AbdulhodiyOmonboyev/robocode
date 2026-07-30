# Ruxsatlar katalogi (LC-UP asosida) — admin boshqaradigan tizim

Admin har rol/xodimga quyidagi ruxsatlarni yoqadi/o'chiradi. Har API va UI shu ruxsatni tekshiradi.
Belgilar: ✅ bizda mavjud (moslash oson) · 🟡 qisman bor · ⛔ hali yo'q (keyin quriladi).

## Lavozim / Rollar
- Lavozim qo'shish · o'zgartirish · o'chirish · ko'rish · bo'limga kirish 🟡

## Kurslar ✅
- Kurs yaratish · o'zgartirish · o'chirish · ko'rish · bo'limga kirish

## Guruhlar ✅
- Guruh qo'shish · ma'lumotini o'zgartirish · ichiga kirish · o'chirish · bo'limga kirish
- Zahira guruh yaratish 🟡

## Xonalar ✅
- Xona qo'shish · o'zgartirish · jadvalini ko'rish · o'chirish · bo'limga kirish
- Xonalar samaradorligini ko'rish 🟡

## Hodimlar (xodimlar) ✅
- Hodim qo'shish · ma'lumotini o'zgartirish · jadvalini ko'rish · o'chirish · sahifaga kirish
- Hodimlar faoliyatini ko'rish/kirish 🟡
- Hodim ish vaqtini sozlash · davomatini belgilash · davomat hisobotini ko'rish ⛔

## O'quvchilar ✅
- O'quvchi qo'shish · ma'lumotini o'zgartirish · jadvalini ko'rish · sahifaga kirish
- Balansini o'zgartirish 🟡
- Yechib olingan qarzdorlik summasini o'zgartirish ⛔

## O'qituvchilar ✅
- O'qituvchi sahifasiga kirish · qo'shish · o'zgartirish · ko'rish · o'chirish
- Balansini o'zgartirish 🟡
- O'qituvchilar bilan kelishuv (oyligi)ni ko'rish 🟡

## To'lovlar / Moliya 🟡
- To'lovlar bo'limiga kirish
- Hisobdagi pulni olish · Hisob-kitob bo'limiga kirish · Kassa
- To'lov chekini sozlash ⛔
- Qo'shimcha daromad kiritish · bo'limiga kirish

## Xarajatlar ✅
- Xarajat qo'shish · o'zgartirish · ko'rish · o'chirish · bo'limga kirish

## Maoshlar 🟡
- Hodimlar maoshini ko'rish · o'zgartirish · bo'limga kirish
- Ish haqi hisobotini ko'rish

## Davomat ✅
- O'quvchilar davomatini belgilash · o'zgartirish · ko'rish · o'chirish · bo'limga kirish

## Ball / Baholar ✅
- Ball bo'limiga kirish · o'quvchiga ball qo'shish

## Imtihonlar ✅
- Imtihon bo'limiga kirish · qo'shish · o'zgartirish · o'chirish · ko'rish
- Guruhda imtihon tashkil qilish

## Daraja testi ⛔
- qo'shish · o'zgartirish · o'chirish · kirish

## Mashqlar (Student app) ✅
- Mashq qo'shish · bo'limga kirish · ko'rish · o'chirish · o'zgartirish

## Lidlar ✅
- Lid qo'shish · o'zgartirish · ko'rish · o'chirish · bo'limga kirish

## Chegirmalar 🟡
- Chegirma qo'shish · o'zgartirish · ko'rish · o'chirish · bo'limga kirish

## Qarzdorlar / Arxiv ✅
- Qarzdorlar bo'limiga kirish
- Arxivga kirish · o'chirish · qaytarish

## Hisobotlar 🟡
- Moliyaviy · Lidlar · Guruhdan o'chirilgan o'quvchilar · Yo'qlama (davomat) · SMS · Qo'ng'iroqlar
- Asosiy sahifadagi moliyaviy ko'rsatkichlar · Dashboard hisobotlari

## Vazifalar ✅
- Vazifa qo'shish · o'zgartirish · o'chirish · bo'limga kirish · Izoh qo'shish

## Dars jadvali ✅
- Ma'lum dars kunini boshqa kunga o'zgartirish · o'qituvchini almashtirish

## Bayram kunlari 🟡
- Bayram kunlarini yaratish

## Sozlamalar / Profil ✅
- Sozlamalar bo'limiga kirish · Profil ma'lumotini o'zgartirish

## SMS / Xabarlar ⛔
- SMS yuborish · SMS bo'limiga kirish · Xabarlar bo'limiga kirish

## Formalar / Teglar / Jurnal 🟡
- Forma qo'shish · o'zgartirish · o'chirish · bo'limga kirish
- Teglar bo'limiga kirish · Jurnal bo'limiga kirish

## Mahsulot / Buyurtma ⛔
- Mahsulot yaratish · o'zgartirish · o'chirish
- Buyurtma bo'limiga kirish · o'zgartirish · o'chirish

## Filiallar ⛔ (bizda o'chirilgan)
- Filial yaratish · o'zgartirish · ro'yxatini ko'rish · kirish

---

## QANDAY QURAMIZ
1. Har ruxsat — bazada bitta yozuv (`Permission` jadvali) yoki `Role`ga bog'langan `RolePermission`.
2. Admin panelда "Rollar va ruxsatlar" sahifasi: chap tomonda rol/xodim, o'ngda modullarga ajratilgan toggle'lar (yuqoridagidek).
3. Har API va menyu shu ruxsatni tekshiradi.
4. Avval ✅ mavjud modullar, keyin 🟡, oxirida ⛔ (yangi funksiyalar) quriladi.
