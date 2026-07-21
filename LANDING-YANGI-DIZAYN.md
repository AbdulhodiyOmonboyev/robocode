# VS Code buyruq — Landing'ni yangi dizaynga o'tkazish

Quyidagini to'liq nusxalab agentga bering.

---

Landing sahifasini yangi dizayn bo'yicha qayta yoz. Namuna HTML fayl: `design/Robocode Landing.dc.html` (men uni loyihaga qo'yaman). Uni o'qib, **Next.js komponentlariga** o'tkaz — `src/components/landing/` ichidagi mavjud fayllarni almashtir.

## 1. RANG — faqat binafsha

```
Fon:      #08060F → #1E0B3C → #2A0E5A (gradient)
Urg'u:    #A657F2 (asosiy), #7C3AED, #C9A6FF (och), #5E2CA5 (brend)
Matn:     oq / #A1A1AA
```
**Yashil rang umuman ishlatilmasin.** Shrift — Inter.

## 2. BO'LIMLAR (namunadagidek 7 ta)

1. **Header** (sticky) — logo + menyu + til almashtirgich (UZ/RU/EN) + "Kirish" + binafsha "Kursga yozilish"
2. **Hero** — "ROBOCODE — **ANDIJONDAGI** BIRINCHI IT AKADEMIYA" (ANDIJONDAGI binafsha gradient), "Biz bilan doim birinchi bo'ling!", 2 tugma
3. **Raqamlar** — `+3000` bitiruvchi · `70%` daromad topmoqda · `$300–$3000` o'rtacha daromad
4. **Sizni nimalar kutyapti** — 4 karta
5. **Kurslar** — 8 karta: Robototexnika (12 oy), Front-end (6 oy), Back-end (6 oy), Grafik va Web dizayn (12 oy), Startup (2 oy), Foundation (14 kun), Web UI/UX dizayn, Vibe Coding
6. **STARTUP STUDIO** ⭐ — «Startapingiz uchun **$20 000** investitsiya» katta banner + 4 bosqich (G'oya → MVP → Texnik rivojlanish → Bozorga chiqish) + UZCombinator
7. **Jamoa** — 10 mentor
8. **Forma** + **Footer** (© 2018 Robocode IT Academy)

Kontent matnlari namuna HTML ichidagi `uz: { ... }` obyektidan olinsin.

## 3. TUZATILADIGAN KAMCHILIKLAR ⚠️

**1) Forma CRM'ga ulanmagan — eng muhimi.**
Namunada forma faqat `preventDefault` qiladi, hech qayerga yubormaydi. Buni tuzat:
```
POST /api/public/lead
body: { fullName, phone, comment, source: "WEBSITE" }
```
Tanlangan kurs nomi `comment` ichiga qo'shilsin. Yuborishda tugma "loading", muvaffaqiyatda binafsha belgi + "Rahmat! Tez orada siz bilan bog'lanamiz", xatoda tushunarli xabar.

**2) Telefon maydoni.**
`+998` doimiy prefiks (o'chirib bo'lmaydi), yozilganda avtomatik `93 071 35 55` ko'rinishida bo'linsin. Bazaga `+998930713555` formatida ketsin. Bo'sh yoki 9 raqamdan kam bo'lsa yuborilmasin.

**3) SEO — `src/app/page.tsx` da `BASE_URL` buzuq.**
Hozir `localhost:3000` chiqyapti. Tuzat:
```ts
const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://crm-oquv-markaz2.vercel.app");
```

**4) Til tanlovi saqlansin** — `localStorage` ga yozilsin, sahifa qayta ochilganda o'sha til chiqsin. Standart — `uz`.

**5) Jamoa rasmlari yo'q** — hozircha bosh harflar avatar (binafsha gradient doira ichida, masalan "AY"). Rasm qo'yish uchun `src` maydoni qoldirilsin.

## 4. TEXNIK

- Mavjud `src/components/landing/*` fayllari almashtirilsin, yangi kerakli komponentlar qo'shilsin
- Tailwind ishlatilsin, inline `<style>` emas
- Scroll'da yengil fade-in animatsiya (mavjud `Reveal.tsx` dan foydalan)
- Mobilda kartalar 1 ustunga tushsin, menyu hamburger
- CRM'ning qolgan qismi **buzilmasin**
- `npm run build` xatosiz o'tsin — tekshirib ber

## 5. YAKUNDA

Nima o'zgartirganingni qisqa ro'yxat qilib ber va `npm run build` natijasini ko'rsat.
