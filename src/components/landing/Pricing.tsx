"use client";

import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "./Reveal";
import { useLang } from "./LangContext";
import { COURSES, PRICES } from "./translations";

export function Pricing({ onSelect }: { onSelect: (courseName?: string) => void }) {
  const { lang, t } = useLang();
  const courses = COURSES[lang];
  const prices = PRICES[lang];

  return (
    <section id="pricing" className="bg-[#08060F] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <Reveal className="max-w-2xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A657F2]">{t.pricingLabel}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">{t.pricingTitle}</h2>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c, i) => (
            <Reveal key={c.name} delay={(i % 3) * 80}>
              <div className="landing-bracket landing-card group flex flex-col h-full p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-lg text-white uppercase tracking-tight">{c.name}</h3>
                  {c.duration && (
                    <span className="flex-shrink-0 text-xs font-bold text-[#08060F] bg-[#A657F2] rounded-full px-2.5 py-1">{c.duration}</span>
                  )}
                </div>

                <p className="mt-4 text-2xl font-extrabold text-white">{prices.monthly[i]}</p>

                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-white/40">{t.pricingIncludedTitle}</p>
                <ul className="mt-2 space-y-2 flex-1">
                  {prices.included.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#A1A1AA] leading-relaxed">
                      <Check className="w-4 h-4 text-[#A657F2] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => onSelect(c.name)}
                  className="mt-5 inline-flex items-center justify-center gap-1.5 text-sm font-bold text-[#A657F2] group-hover:gap-2.5 transition-all"
                >
                  {lang === "uz" ? "Yozilish" : lang === "ru" ? "Записаться" : "Enroll"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
