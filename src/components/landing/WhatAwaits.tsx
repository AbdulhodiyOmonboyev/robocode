import { Rocket, Users2, Gift, Trophy } from "lucide-react";
import { Reveal } from "./Reveal";

const ITEMS = [
  {
    icon: Rocket,
    title: "Real startup loyihalar",
    desc: "Amaliy tajriba va jamoaga taklif — real startup loyihalarida ishtirok eting.",
  },
  {
    icon: Users2,
    title: "Team Lead mentorligida",
    desc: "Tajribali Team Lead rahbarligida doimiy rivojlanish va bilim almashinuvi.",
  },
  {
    icon: Gift,
    title: "Bepul ishtirok",
    desc: "Bepul ishtirok etish imkoniyati (talab: bilim bazasi va ingliz tili).",
  },
  {
    icon: Trophy,
    title: "Kuchli karyera",
    desc: "Faqat bilim emas — haqiqiy tajriba, real loyihalar va kuchli karyera.",
  },
];

export function WhatAwaits() {
  return (
    <section id="about" className="bg-[#08060F] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <Reveal className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A3E635]">Biz haqimizda</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
            Sizni nimalar kutyapti
          </h2>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <div className="landing-bracket h-full bg-white/[0.03] rounded-2xl p-7 hover:bg-white/[0.05] transition-colors">
                <div className="w-11 h-11 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center mb-5">
                  <item.icon className="w-5 h-5 text-[#A3E635]" />
                </div>
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-[#A1A1AA] leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
