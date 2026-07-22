"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { Reveal } from "./Reveal";
import { useLang } from "./LangContext";
import { TESTIMONIALS } from "./translations";
import { getInitials } from "@/lib/utils";

export function Testimonials() {
  const { lang, t } = useLang();
  const testimonials = TESTIMONIALS[lang];
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section id="testimonials" className="bg-[#08060F] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <Reveal className="max-w-2xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A657F2]">{t.testimonialsLabel}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">{t.testimonialsTitle}</h2>
        </Reveal>

        {/* Mobile: horizontal swipe carousel (scroll-snap, no library). Desktop: 3-column grid. */}
        <div className="mt-12 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {testimonials.map((item, i) => (
            <Reveal key={item.name} delay={(i % 3) * 80} className="shrink-0 w-[85%] snap-center sm:w-[60%] lg:w-auto">
              <div className="landing-bracket h-full bg-white/[0.03] rounded-2xl p-6 hover:bg-white/[0.05] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 flex-shrink-0">
                    {item.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.photo} alt={item.name} className="w-14 h-14 rounded-2xl object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-[#7C3AED]/20 text-[#A657F2] font-bold flex items-center justify-center text-lg">
                        {getInitials(item.name)}
                      </div>
                    )}
                    {item.videoUrl && (
                      <button
                        type="button"
                        onClick={() => setActiveVideo(item.videoUrl!)}
                        aria-label="Play video"
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#A657F2] flex items-center justify-center shadow-[0_0_10px_rgba(166,87,242,0.6)] hover:brightness-110 transition"
                      >
                        <Play className="w-3 h-3 text-white fill-white" strokeWidth={0} />
                      </button>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-[#A657F2] font-semibold mt-0.5 truncate">{item.workplace}</p>
                  </div>
                </div>

                <span className="inline-block mt-4 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-white/5 text-white/60 border border-white/10">
                  {item.course}
                </span>

                <p className="mt-3 text-sm text-[#A1A1AA] leading-relaxed line-clamp-3">{item.review}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-modal-overlay"
          onClick={() => setActiveVideo(null)}
        >
          <div className="relative w-full max-w-2xl animate-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              aria-label="Close"
              className="absolute -top-10 right-0 text-white/70 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
            <video src={activeVideo} controls autoPlay className="w-full rounded-2xl bg-black" />
          </div>
        </div>
      )}
    </section>
  );
}
