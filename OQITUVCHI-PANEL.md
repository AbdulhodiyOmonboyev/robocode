# VS Code buyruq — O'qituvchi paneli (LC-UP asosida)

CRM'ga o'qituvchilar uchun alohida panel qo'shamiz. Namuna: robocode.lc-up.com/teacher. Dizayn bizning mavjud CRM uslubida (binafsha urg'u), lekin tuzilma quyidagicha.

Ishni **bosqichlarga** bo'lib qil. Har bosqichdan keyin `npm run build` xatosiz o'tsin.

---

## UMUMIY

- Yangi rol: o'qituvchi (`role: OPERATOR` yoki mavjud `Group.teacherId` orqali). O'qituvchi faqat **o'ziga biriktirilgan guruhlarni** ko'radi.
- Marshrut prefiksi: `/teacher/*`. Login talab qilinadi. O'qituvchi kirsa `/teacher/dashboard` ga tushsin (admin esa avvalgidek `/dashboard`).
- Yon menyu (o'qituvchi uchun): Asosiy · O'quvchilar · Uy vazifalari · Profil. (Statistika va Chat — "Tez kunda" placeholder.)
- Xavfsizlik: har API o'qituvchi faqat o'z guruhlari ma'lumotini ko'rishini tekshirsin (`teacherId === session.user.id`).

---

## 1-BOSQICH — Asosiy (dashboard) + guruhlar ro'yxati

`/teacher/dashboard`:
- Yuqorida 2 karta: **Reyting** (o'qituvchi reytingi — hozircha "Tez kunda" badge) va **Oylik** (maosh — hozircha yashirin `*****` yoki "Tez kunda").
- **Guruhlar** jadvali: Guruh nomi · Kurs · O'quvchilar soni · Xona. Faqat shu o'qituvchi guruhlari.
- Filtr: **Barchasi / Bugun** (bugun dars bo'ladigan guruhlar).
- Guruh nomiga bosilganda → `/teacher/groups/[id]` (2-bosqich).

## 2-BOSQICH — Guruh sahifasi, 5 tab ⭐ (eng muhim)

`/teacher/groups/[id]` — yuqorida 5 tab + o'ng tarafda **yil** va **oy** tanlagich.

**a) Davomat**
- Jadval: chapda o'quvchilar (rasm + ism), yuqorida shu oydagi dars sanalari (07, 09, 11 …).
- Har katak bosilganda holat almashadi: ✓ keldi (yashil) / ✗ kelmadi (qizil) / 🚩 sababli.
- Bizdagi `Attendance` modeliga saqlansin.

**b) Ballar**
- Xuddi shunday jadval (o'quvchilar × sanalar), har katakka **ball** (0–100) kiritiladi.
- Bizdagi `Score` yoki yangi kunlik-ball mexanizmiga saqlansin.

**c) Mashqlar**
- Har dars sanasi ustida "+" tugma — o'sha kunga mashq qo'shish.
- Har o'quvchiga o'sha mashq uchun ball.

**d) Reyting**
- O'quvchilar reyting bo'yicha tartiblanadi, 1-2-3 o'ringa medal.
- Filtrlar: **Ballar / Kristall** (coin), **O'rta arifmetik / Umumiy**.

**e) Imtihonlar**
- Jadval: Nomi · Sana · O'tish bali · Bo'lim · Harakatlar.
- "+ Yangi imtihon qo'shish" — bizdagi `Exam` modeliga.

## 3-BOSQICH — O'quvchilar

`/teacher/students`:
- Jadval: ism · telefon · guruh(lar) · balans · tug'ilgan sana · oxirgi faollik.
- Qidiruv (ism/telefon). Faqat shu o'qituvchi guruhidagi o'quvchilar.
- Ismga bosilganda o'quvchi kartasi (mavjud lead sahifasidan foydalan).

## 4-BOSQICH — Uy vazifalari

`/teacher/homework`:
- O'quvchilar topshirgan vazifalar ro'yxati (mashq bo'yicha guruhlangan).
- Filtr: Holat (Barchasi/Tekshirilmagan/Tekshirilgan) · Dan-Gacha sana · Qidirish.
- Har topshiriqni ko'rish/baholash.

## 5-BOSQICH — Profil

`/teacher/profile` — bizdagi mavjud profil sahifasini qayta ishlat:
- Shaxsiyat (ism, rasm, til, telefon, jins, tug'ilgan sana, viloyat/tuman, Instagram, Telegram)
- Kirish va xavfsizlik (parol o'zgartirish)
- Bildirishnomalar
- To'lovlar tarixi (maosh — hozircha "Tez kunda")

---

## TEXNIK
- Dizayn: bizning CRM binafsha uslubi (`#A657F2`, `#7C3AED`), kartalar `rounded-2xl`, mobil mos.
- O'qituvchi faqat o'z guruhini ko'rishini har API'da tekshir.
- Mavjud modellardan foydalaning: `Group`, `Attendance`, `Score`, `Exam`, `Lead`, `User`.
- Har bosqich oxirida `npm run build` xatosiz. Nimalarni qo'shganingni ro'yxat qil.

## HOZIRCHA QILINMAYDI (keyin)
- Statistika, Chat — "Tez kunda" placeholder.
- Reyting/Oylikning real hisob-kitobi — avval UI, keyin logika.
