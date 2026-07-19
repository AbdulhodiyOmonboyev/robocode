import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

const CURRICULUM = [
  {
    name: "Robototexnika",
    duration: "12 oy",
    modules: [
      "Elektronika va fizika — real amaliyot, tranzistorlar, mikrosxemalar",
      "Dasturlash asoslari — Scratch, mBlock, multfilm va o'yinlar",
      "Aqlli robotlar — kod yozish, datchiklar, Wi-Fi/Bluetooth boshqaruvi",
    ],
  },
  {
    name: "Front-end",
    duration: "6 oy",
    modules: ["1-oy: HTML", "2–3-oy: CSS — Flexbox, Grid, adaptiv", "4–5-oy: JavaScript — DOM, funksiyalar", "6-oy: React + real loyihalar"],
  },
  {
    name: "Back-end",
    duration: "6 oy",
    modules: ["REST API, ma'lumotlar bazasi, autentifikatsiya", "Real loyihalar — Blog API, Todo App", "Natija: GitHub portfolio, serverga joylash, login tizimi"],
  },
  {
    name: "Grafik va Web dizayn",
    duration: "12 oy",
    modules: ["Photoshop — 3 oy", "Illustrator — 3 oy", "UI/UX & Web dizayn — Figma, 6 oy", "Natija: grafik dizaynerdan UI/UX mutaxassisiga"],
  },
  {
    name: "Startup",
    duration: "2 oy",
    modules: ["Blog platforma", "Online do'kon", "Auth + Dashboard", "API + AI integratsiya", "Final startup — deploy"],
  },
  {
    name: "Foundation",
    duration: "14 kun",
    modules: ["Computer asoslari, OT + Google", "Word/Docs, Excel/Sheets, PowerPoint/Canva", "AI tools, Figma + UI tools, Cloud tools", "Imtihon va mentor session"],
  },
  {
    name: "Web (UI/UX) dizayn",
    duration: null,
    modules: ["Figma", "Responsive saytlar", "Mobil ilovalar", "Branding"],
  },
];

export const COURSE_NAMES = CURRICULUM.map((c) => c.name);

export function Courses({ onSelect }: { onSelect: () => void }) {
  return (
    <section id="courses" className="bg-[#08060F] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <Reveal className="max-w-2xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A3E635]">Kurslar</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
            Sizga mos yo&apos;nalishni tanlang
          </h2>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CURRICULUM.map((c, i) => (
            <Reveal key={c.name} delay={(i % 3) * 80}>
              <div className="landing-bracket group flex flex-col h-full bg-white/[0.03] rounded-2xl p-6 hover:bg-white/[0.05] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-lg text-white uppercase tracking-tight">{c.name}</h3>
                  {c.duration && (
                    <span className="flex-shrink-0 text-xs font-bold text-[#08060F] bg-[#A3E635] rounded-full px-2.5 py-1">{c.duration}</span>
                  )}
                </div>
                <ul className="mt-4 space-y-2 flex-1">
                  {c.modules.map((m) => (
                    <li key={m} className="text-sm text-[#A1A1AA] leading-relaxed pl-3 border-l border-[#7C3AED]/50">
                      {m}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={onSelect}
                  className="mt-5 inline-flex items-center justify-center gap-1.5 text-sm font-bold text-[#A3E635] group-hover:gap-2.5 transition-all"
                >
                  Yozilish <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
