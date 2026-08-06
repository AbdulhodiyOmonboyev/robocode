"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "./Reveal";
import { useLang } from "./LangContext";
import { FAQ_ITEMS } from "./translations";

export function FAQ() {
  const { lang, t } = useLang();
  const items = FAQ_ITEMS[lang];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#08060F] border-b border-white/10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <Reveal className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A657F2]">{t.faqLabel}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">{t.faqTitle}</h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {items.map((item, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={item.q} delay={i * 60}>
                <div className="landing-bracket landing-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 sm:px-6 sm:py-5"
                  >
                    <span className="font-semibold text-white">{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 text-[#A657F2] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 sm:px-6 sm:pb-5 text-sm text-[#A1A1AA] leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
