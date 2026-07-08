# LC-UP vs Robocode CRM — to'liq taqqoslash (spiska)

Manba: https://robocode.lc-up.com/admin (jonli ko'rib chiqildi, 2026-07-08)

---

## 1. LC-UP menyusi va bo'limlari

| # | Bo'lim | URL | Bizda bormi? |
|---|--------|-----|--------------|
| 1 | Dashboard | /admin | ✅ Bor |
| 2 | Lidlar | /admin/lid/redirect | ✅ Bor |
| 3 | Talabalar | /admin/students | ✅ Bor |
| 4 | Guruhlar | /admin/groups | ✅ Bor |
| 5 | O'qituvchilar | /admin/teachers | ✅ Bor |
| 6 | Moliya → To'lovlar | | ✅ Bor |
| 7 | Moliya → Qo'shimcha daromadlar | | ✅ Bor |
| 8 | Moliya → Ish haqi | | ✅ Bor |
| 9 | Moliya → Bonuslar | | ✅ Bor |
| 10 | Moliya → Xarajatlar | | ✅ Bor |
| 11 | Moliya → Qarzdorlar | | ✅ Bor |
| 12 | Sozlamalar | | ✅ Bor |
| 13 | Hisobotlar | | ✅ Bor |
| 14 | **Xodimlar davomati** | /admin/worker-progol | ❌ **YO'Q** |
| 15 | **Vazifalar (Task board)** | /admin/tasks | ❌ **YO'Q** (faqat eslatma bor) |

---

## 2. Tugma/ikonalar orqasidan nima chiqadi

| Tugma / ikonka | Nima ochiladi | Bizda |
|----------------|---------------|-------|
| 🔔 Qo'ng'iroq | **Bildirishnomalar** paneli (soni + "Eski xabarlarni ko'rish") | ❌ Yo'q |
| ☑️ Checklist ikonka | **Vazifalar** sahifasiga o'tadi | ❌ Yo'q |
| ▦ Ro'yxat ikonka | **Xona bo'yicha jadval** — soatlab band/bo'sh, xona samaradorligi, Excelga eksport, kunlar (Juft/Toq/haftakun), Horizontal ko'rinish | ⚠️ Bizники oddiy (guruh bo'yicha), xona-samaradorlik yo'q |
| 🔍 Qidirish (header) | **Global qidiruv** — butun sayt bo'ylab | ❌ Yo'q |
| ▼ Robocode | **Filial (branch) tanlash** — ko'p markaz | ❌ Yo'q |
| 🟧 New version | O'zgarishlar tarixi (changelog) | ❌ Yo'q |
| 👤 Profil | Profil/akkaunt menyusi | ✅ Bor (Profil sahifasi) |

---

## 3. Dashboard farqlari

- LC-UP KPI kartalari: **Lidlar, Sinov darsida, Faol o'quvchilar, Shu oy to'laganlar, Muzlatilganlar, Qarzdorlar**
- Har KPI yonida **o'sish ko'rsatkichi**: `+14 / −3` (yashil/qizil).
- Grafik: To'lovlar / Maosh / Chiqimlar birga.
- ❌ Bizда o'sish ko'rsatkichlari (+/−) va "Sinov darsida", "Shu oy to'laganlar" alohida KPI yo'q.

---

## 4. Xodimlar davomati (batafsil — bizда yo'q)

- Tablar: Barchasi / Ustozlar / Hodimlar.
- Sana bo'yicha.
- KPI: Jami xodimlar, O'z vaqtida, Kech qolgan, Kelmagan, Hozir ishda.
- Jadval: F.I · KELDI (vaqt) · KETTI (vaqt) · "Keldi" tugma (check-in/out).

## 5. Vazifalar / Task board (batafsil — bizда yo'q)

- Ustunlar: **Todo / Progress / Done** (kanban).
- Filtrlar: Deadline, sana oralig'i, Xodim bo'yicha, Tur bo'yicha, Taglar.
- Tugmalar: **Auto vazifa**, **Yangi vazifa**.
- Xodimга vazifa biriktirish + muddat.

---

## 6. Klaviatura tugmalari (hotkeys)

- Sinov: qidiruv yonidagi "F" ishorasi bosildi — **hech qanday reaksiya yo'q**.
- Xulosa: LC-UP'да ishlaydigan global klaviatura shortcutlari **yo'q**.
- ➡️ Bu bizга **ustunlik imkoniyati**: Ctrl+K global qidiruv, tez tugmalar qo'shsak, biz oldinda bo'lamiz.

---

## 7. XULOSA — bizga qo'shish kerak bo'lganlar (muhimlik bo'yicha)

**Yuqori muhim:**
1. ❌ **Xodimlar davomati** (keldi/ketti, kech qolish statistikasi)
2. ❌ **Vazifalar / Task board** (Todo/Progress/Done, xodimга biriktirish, Auto vazifa)
3. ❌ **Dashboard o'sish ko'rsatkichlari** (+/−) + "Sinov darsida", "Shu oy to'laganlar" KPI

**O'rta muhim:**
4. ❌ **Bildirishnomalar markazi** (qo'ng'iroq paneli)
5. ❌ **Global qidiruv** (header + Ctrl+K)
6. ⚠️ **Xona bo'yicha jadval** + Excel eksport + xona samaradorligi

**Past / ixtiyoriy:**
7. ❌ Ko'p filial (branch) qo'llab-quvvatlash
8. ❌ "New version" / changelog
9. ➕ Klaviatura shortcutlari (LC-UP'да yo'q — biz qo'shsak ustun bo'lamiz)
