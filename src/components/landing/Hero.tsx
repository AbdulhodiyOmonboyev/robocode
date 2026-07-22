"use client";

import { ArrowRight, PlayCircle } from "lucide-react";
import { useLang } from "./LangContext";

export function Hero() {
  const { t } = useLang();

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Brand gradient backdrop — the one place the full #08060F → #1E0B3C → #2A0E5A
          sweep runs at full strength; the rest of the page settles to flat #08060F. */}
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(160deg, #08060F 10%, #1E0B3C 55%, #2A0E5A 115%)" }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-40"
        style={{ background: "radial-gradient(45% 35% at 80% 15%, rgba(166,87,242,0.18) 0%, transparent 70%)" }}
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/mascot-white.png"
        alt=""
        aria-hidden="true"
        className="hidden lg:block pointer-events-none select-none absolute right-10 xl:right-20 top-1/2 -translate-y-1/2 w-[420px] h-auto drop-shadow-[0_0_70px_rgba(166,87,242,0.2)]"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white leading-[1.05]">
            {t.heroPrefix}
            <span className="text-[#A657F2]">{t.heroHighlight}</span>
            {t.heroSuffix}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[#A1A1AA] max-w-xl leading-relaxed">{t.heroSub}</p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <a
              href="#ariza"
              className="inline-flex items-center justify-center gap-2 bg-[#A657F2] hover:brightness-110 transition-[filter] text-[#08060F] font-bold px-6 py-3.5 rounded-xl shadow-[0_0_30px_rgba(166,87,242,0.35)]"
            >
              {t.heroBtn1}
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#courses"
              className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/15 hover:border-[#A657F2]/40 transition-colors text-white font-semibold px-6 py-3.5 rounded-xl"
            >
              <PlayCircle className="w-4 h-4 text-[#A657F2]" />
              {t.heroBtn2}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
