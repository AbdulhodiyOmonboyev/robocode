"use client";

import { Reveal } from "./Reveal";
import { useLang } from "./LangContext";
import { STATS } from "./translations";

export function Stats() {
  const { lang } = useLang();
  const stats = STATS[lang];

  return (
    <section className="relative bg-[#08060F] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 grid sm:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 100}>
            <div className="landing-bracket h-full bg-white/[0.03] rounded-2xl p-8 text-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#A657F2] tracking-tight">{s.value}</div>
              <div className="mt-3 text-sm text-[#A1A1AA] leading-relaxed max-w-[220px] mx-auto">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
