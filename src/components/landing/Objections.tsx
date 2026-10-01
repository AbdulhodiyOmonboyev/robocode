"use client";

import { CheckCircle2 } from "lucide-react";
import { Reveal } from "./Reveal";
import { useLang } from "./LangContext";
import { OBJECTIONS } from "./translations";

// LeadForm'dan oldin joylashtirilgan: o'quvchini ariza berishdan to'xtatadigan
// eng keng tarqalgan to'rtta bahonaga to'g'ridan-to'g'ri, ishonchli javob beradi.
export function Objections() {
  const { lang, t } = useLang();
  const items = OBJECTIONS[lang];

  return (
    <section id="objections" className="border-b border-white/10">
      <div className="w-full px-4 sm:px-6 py-20 sm:py-28 max-w-7xl mx-auto">
        <Reveal className="max-w-2xl mx-auto text-center">
          <h2 className="landing-heading mt-3">{t.objectionsTitle}</h2>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {items.map((item, i) => (
            <Reveal key={item.q} delay={i * 80}>
              <div className="landing-card h-full p-6 sm:p-7 flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 text-violet-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-sm">&ldquo;{item.q}&rdquo;</h3>
                  <p className="mt-2 text-sm text-ink-muted leading-relaxed">{item.a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
