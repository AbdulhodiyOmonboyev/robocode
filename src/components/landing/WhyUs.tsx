"use client";

import { Hammer, GraduationCap, Cpu, Users2, Award, Briefcase } from "lucide-react";
import { Reveal } from "./Reveal";
import { useLang } from "./LangContext";
import { WHY_US } from "./translations";

const ICONS = { hammer: Hammer, gradCap: GraduationCap, cpu: Cpu, users: Users2, award: Award, briefcase: Briefcase };

export function WhyUs() {
  const { lang, t } = useLang();
  const items = WHY_US[lang];

  return (
    <section id="why-us" className="bg-[#08060F] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <Reveal className="max-w-2xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A657F2]">{t.whyUsLabel}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">{t.whyUsTitle}</h2>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const Icon = ICONS[item.icon];
            return (
              <Reveal key={item.title} delay={i * 80}>
                <div className="landing-bracket landing-card h-full p-7">
                  <div className="w-11 h-11 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-[#A657F2]" />
                  </div>
                  <h3 className="font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-[#A1A1AA] leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
