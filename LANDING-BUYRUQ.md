# VS Code (Claude Code) buyruq — Robocode IT Academy ommaviy sayt (landing)

Quyidagini to'liq nusxalab agentga bering.

---

CRM loyihasiga **ommaviy marketing sayt (landing)** qo'sh. Kursga yozilish formasi to'ldirilganda ma'lumot **to'g'ridan-to'g'ri CRM Lidlar bo'limiga** tushsin.

## 1. Marshrutlar
- Root `/` — ommaviy **landing** (login talab qilmasin). `src/proxy.ts` da `/` allaqachon public.
- `/dashboard` — avvalgidek CRM (login bilan).
- Mavjud `/apply` va `/api/public/lead` ishlashda davom etsin.

## 2. BREND (prezentatsiyadan — aynan shu ranglar)
- Fon: qora–to'q binafsha gradient (`#08060F` → `#2A0E5A` → `#6D28D9`).
- Asosiy urg'u: **lime yashil `#A3E635`** (sarlavhalarda, tugmalarda, ikonkalarda).
- Ikkilamchi: binafsha `#7C3AED`, oq matn, kulrang `#A1A1AA`.
- Shrift: Inter (bold sarlavhalar, katta harfli sarlavhalar).
- Logo: mavjud Robocode logo (`/api/branding/logo`).
- Uslub: qorong'i, zamonaviy, karta chetlari `rounded-2xl`, yengil yashil chegara/nur.

## 3. Bo'limlar (bitta sahifa, silliq scroll)

**Header (sticky):** logo + menyu (Biz haqimizda · Kurslar · Jamoa · Aloqa) + "Kirish" (→ /login) + yashil "Kursga yozilish" tugma.

**Hero:**
- H1: "ROBOCODE — Andijondagi birinchi IT akademiya"
- Sub: "Biz bilan doim birinchi bo'ling!"
- 2 tugma: "Kursga yozilish" (yashil) + "Kurslarni ko'rish"

**Raqamlar (3 ta katta karta):**
- `+3000` — Bitiruvchi
- `70%` — Kursni tamomlaganlar daromad topib kelmoqda
- `300$ – 3000$` — Bitiruvchilarning o'rtacha daromadi

**Sizni nimalar kutyapti (4 karta):**
- Real startup loyihalarda amaliy tajriba va jamoaga taklif
- Tajribali Team Lead rahbarligida doimiy rivojlanish
- Bepul ishtirok etish imkoniyati (talab: bilim bazasi va ingliz tili)
- Faqat bilim emas — haqiqiy tajriba, real loyihalar va kuchli karyera

**Kurslar (7 ta karta, har birida davomiylik va modullar):**
1. **Robototexnika — 12 oy:** Elektronika va fizika (real amaliyot, tranzistorlar, mikrosxemalar); Dasturlash asoslari (Scratch, mBlock, multfilm va o'yinlar); Aqlli robotlar (kod yozish, datchiklar, Wi-Fi/Bluetooth boshqaruvi).
2. **Front-end — 6 oy:** 1-oy HTML; 2–3-oy CSS (Flexbox, Grid, adaptiv); 4–5-oy JavaScript (DOM, funksiyalar); 6-oy React + real loyihalar.
3. **Back-end — 6 oy:** REST API, ma'lumotlar bazasi, autentifikatsiya, real loyihalar (Blog API, Todo App). Natija: GitHub portfolio, serverga joylash, login tizimi.
4. **Grafik va Web dizayn — 12 oy:** Photoshop (3 oy), Illustrator (3 oy), UI/UX & Web dizayn — Figma (6 oy). Natija: grafik dizaynerdan UI/UX mutaxassisiga.
5. **Startup — 2 oy:** Blog platforma; Online do'kon; Auth + Dashboard; API + AI integratsiya; Final startup (deploy).
6. **Foundation — 1 oy (14 kun):** Computer asoslari, OT + Google, Word/Docs, Excel/Sheets, PowerPoint/Canva, AI tools, Figma + UI tools, Cloud tools, imtihon, mentor session.
7. **Web (UI/UX) dizayn:** Figma, responsive saytlar, mobil ilovalar, branding.

Har kartada: nom, davomiylik (yashil badge), qisqa modullar ro'yxati, "Yozilish" tugmasi (formaga scroll).

**Jamoa (5 karta — rasm o'rni + ma'lumot):**
- **Abdulaziz Yakubov** — Asoschisi. Yoshlar Ventures direktori (2025-fevral). Dasturchi, Team Leader, CEO, IT sohasida +10 yil tajriba, startapper. Instagram: @aka.yakubov
- **Akhmadullo Nurmakhamatov** — Team Lead. 6+ yil xalqaro IT tajribasi; Politecnico di Torino (Italiya) bitiruvchisi; React, TypeScript, Agile (Scrum). Senior Software Engineer, Mentor.
- **Nazrullo Raxmatov** — Back-end ustoz. 3+ yil IT tajribasi; Robocode bitiruvchisi va ustozi; EduCompass backend; 20+ backend loyiha.
- **Ziyodullo Shuxratbekov** — Startup mentor. EduCompass asoschisi; 250 000$ qiymatdagi loyiha muallifi; 20+ startap; 700 000$+ investitsiya jalb qilgan.
- **Saidislom To'lqinov** — Front-end / 3D ustoz. 5 yil tajriba; Fransiyadagi "NFINITE"da ishlaydi; CANFORAMA, CASTORAMA, LECLERC, WALLMART bilan hamkorlik; 25+ shogird.

**Kursga yozilish formasi ⭐ (eng muhim):**
- Maydonlar: **Ism** (majburiy), **Telefon** (`+998` doimiy prefiks, `93 071 35 55` formatida avtomatik bo'linadi, majburiy), **Kurs tanlash** (yuqoridagi 7 kurs), **Izoh** (ixtiyoriy).
- Yuborishda: `POST /api/public/lead` → CRM **Lidlar** bo'limiga tushsin, `source: WEBSITE`.
- Muvaffaqiyatda: yashil belgi bilan "Rahmat! Tez orada siz bilan bog'lanamiz" ekrani.
- Xatoda tushunarli xabar. Yuborish paytida tugma "loading" holatida.

**Footer:** logo, qisqa tavsif, menyu havolalari, ijtimoiy tarmoqlar (Instagram @aka.yakubov), telefon/manzil uchun joy (`TODO: aloqa ma'lumotlari`), "© 2018 Robocode IT Academy".

## 4. SEO (Google'da "Robocode" deb izlaganda chiqishi uchun)
- Metadata: `title: "Robocode IT Academy — Andijondagi birinchi IT akademiya"`, description (bitiruvchilar, kurslar, Andijon), keywords: robocode, IT academy Andijon, dasturlash kurslari Andijon, robototexnika, front-end, back-end, grafik dizayn.
- **Open Graph + Twitter card** (rasm bilan), `lang="uz"`, canonical URL.
- `src/app/sitemap.ts` va `src/app/robots.ts` qo'sh.
- Semantik HTML: bitta `h1`, tartibli `h2`/`h3`, rasmlarga `alt`.
- `next/image`, tez yuklanish (LCP), lazy-load.

## 5. Texnik talablar
- **Mobil mos (responsive)** — telefon, planshet, desktop.
- Yengil animatsiya (scroll'da fade-in), lekin performansga zarar bermasin.
- Mavjud CRM funksiyalari **buzilmasin**.
- `npm run build` xatosiz o'tsin.

---

### TODO (foydalanuvchidan olinadi)
- Aloqa: telefon raqami, manzil (Andijon), ish vaqti, Telegram kanal.
- Jamoa a'zolari va kurslar uchun rasmlar.
