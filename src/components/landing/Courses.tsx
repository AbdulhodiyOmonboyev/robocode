"use client";

import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { useLang } from "./LangContext";
import { COURSES } from "./translations";

export function Courses({ onSelect }: { onSelect: (courseName?: string) => void }) {
  const { lang, t } = useLang();
  const courses = COURSES[lang];

  return (
    <section id="courses" className="bg-[#08060F] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <Reveal className="max-w-2xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A657F2]">{t.coursesLabel}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">{t.coursesTitle}</h2>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c, i) => (
            <Reveal key={c.name} delay={(i % 3) * 80}>
              <div className="landing-bracket group flex flex-col h-full bg-white/[0.03] rounded-2xl p-6 hover:bg-white/[0.05] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-lg text-white uppercase tracking-tight">{c.name}</h3>
                  {c.duration && (
                    <span className="flex-shrink-0 text-xs font-bold text-[#08060F] bg-[#A657F2] rounded-full px-2.5 py-1">{c.duration}</span>
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
