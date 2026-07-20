# VS Code buyruq — Landing sahifasini yangilash (prezentatsiyaning to'liq materiali)

Quyidagini to'liq nusxalab agentga bering.

---

Mavjud landing sahifasini (`src/app/page.tsx` + `src/components/landing/`) quyidagicha yangila va tuzat.

## A. TUZATISHLAR (birinchi navbatda)

**1. SEO buzuq — canonical/OG manzillar `localhost:3000` chiqyapti.**
`src/app/page.tsx` da `BASE_URL` ni tuzat: `NEXT_PUBLIC_APP_URL` bo'lmasa `https://${process.env.VERCEL_URL}` ishlatilsin, u ham bo'lmasa `https://crm-oquv-markaz2.vercel.app`. Hech qachon localhost chiqmasin.

**2. Kurs tanlash ro'yxati noto'g'ri.**
`LeadForm.tsx` da "Kurs tanlash" CRM bazasidan emas, **landing kurslaridan** olinsin (quyidagi 8 ta). Tanlangan kurs lid izohiga yozilsin.

---

## B. YANGI BO'LIM: STARTUP STUDIO ⭐ (eng kuchli sotuv nuqtasi)

Kurslardan keyin **alohida katta bo'lim** qo'sh — yashil urg'u bilan, e'tiborni tortadigan:

**Sarlavha:** "STARTUP STUDIO"
**Katta banner:** «Startapingiz uchun **$20 000** investitsiya» (juda katta shrift, `$20 000` lime yashil, atrofida yengil nur).

**Startup nima?** — "Startup — bu innovatsion g'oya asosida yaratilgan loyiha yoki kompaniya bo'lib, muammoni hal qilish va tez rivojlanishga qaratilgan."
- **Innovatsiya:** Yangi yechimlar va texnologiyalar orqali muammolarni hal qilish
- **Tez rivojlanish:** Qisqa vaqt ichida katta miqyosda o'sish imkoniyati

**Bizning jamoa:** "Maxsus jamoamiz g'oyani shakllantirishdan tortib, MVP yaratish va xalqaro akseleratorlar (**UZCombinator**) darajasiga chiqishgacha yordam beradi."

**4 bosqich (ikonkali karta yoki timeline):**
1. G'oya shakllantirish → 2. MVP yaratish → 3. Texnik rivojlanish → 4. Bozorga chiqish

---

## C. KURSLAR — "Vibe Coding" qo'shilsin (jami 8 ta)

Mavjud 7 taga qo'shimcha:
**Vibe Coding** — zamonaviy front-end texnologiyalari va AI yordamida tez ishlab chiqish; responsive web interfeyslar; real mijoz loyihalari.

Yakuniy ro'yxat: Robototexnika (12 oy) · Front-end (6 oy) · Back-end (6 oy) · Grafik va Web dizayn (12 oy) · Startup (2 oy) · Foundation (14 kun) · Web UI/UX dizayn · **Vibe Coding**

---

## D. JAMOA — to'liq 10 mentor (hozir 5 ta, 5 tasi qo'shilsin)

Har biri: ism, lavozim, qisqa bio (2–3 qator). Rasm o'rni qoldirilsin (keyin qo'shiladi), hozircha bosh harflar avatar.

1. **Abdulaziz Yakubov** — Asoschisi. Yoshlar Ventures direktori (2025-fevral). Dasturchi, Team Leader, CEO — IT'da +10 yil, startapper. `@aka.yakubov`
2. **Akhmadullo Nurmakhamatov** — Team Lead. 6+ yil xalqaro tajriba, Politecnico di Torino (Italiya). React, TypeScript, Agile. Senior Software Engineer.
3. **Shuxratbek Aliyev** — Grafik va UX/UI ustoz. 5 yil tajriba, Robocode yetakchi mentori, Vodiy Brend Startup asoschisi. 30+ brend, 150+ bitiruvchi.
4. **Ziyodullo Shuxratbekov** — Startup mentor. EduCompass asoschisi, 250 000$ loyiha muallifi, 20+ startap, 700 000$+ investitsiya.
5. **Nazrullo Raxmatov** — Back-end ustoz. 3+ yil, Robocode bitiruvchisi va ustozi, EduCompass backend, 20+ loyiha.
6. **Abduvahob Qahhorov** — Back-end ustoz. 5+ yil, UIC Group va Prolab loyihalari, tizim arxitekturasi va server logikasi.
7. **Saidislom To'lqinov** — Front-end / 3D ustoz. 5 yil, Fransiyadagi "NFINITE". CANFORAMA, CASTORAMA, LECLERC, WALLMART. 25+ shogird.
8. **Husanboy Zafarov** — Front-end ustoz. 3+ yil, Robocode bitiruvchisi. EduCompass, Bozorly loyihalari, Figma'da UI.
9. **Hasanboy Zafarov** — Vibe Coding ustoz. Robocode front-end mentori. Responsive web interfeyslar, zamonaviy front-end.
10. **Alimjanov Saidmurod** — Front-end / Foundation ustoz. 2+ yil. Darslar **rus va o'zbek** tillarida. Bozorly loyihasi.

Jamoa bo'limi: 3 ustunli grid, mobilda 1 ustun, kartalar `rounded-2xl`, hover'da yengil yashil chegara.

---

## E. QO'SHIMCHA URG'ULAR (hero yoki alohida lenta)

- «Darslar **rus va o'zbek** tillarida»
- «Xalqaro akselerator (**UZCombinator**) darajasigacha yordam»
- «**Bepul ishtirok** imkoniyati (talab: bilim bazasi va ingliz tili)»

---

## F. TALABLAR

- Brend: qora–binafsha fon + **lime yashil `#A3E635`** urg'u (prezentatsiyadagidek).
- Mobil mos (responsive), yengil scroll animatsiya.
- Yozilish formasi avvalgidek `POST /api/public/lead` → CRM Lidlar (`source: WEBSITE`).
- Mavjud CRM funksiyalari buzilmasin. `npm run build` xatosiz.

---

### Hali yetishmayotgani (foydalanuvchidan)
- Telefon, manzil (Andijon), ish vaqti, Telegram kanal → footer uchun.
- Jamoa a'zolari rasmlari.
