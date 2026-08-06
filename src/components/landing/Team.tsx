"use client";

import { Reveal } from "./Reveal";
import { InstagramGlyph } from "./InstagramGlyph";
import { useLang } from "./LangContext";
import { MENTORS } from "./translations";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Team() {
  const { lang, t } = useLang();
  const mentors = MENTORS[lang];

  return (
    <section id="team" className="bg-[#08060F] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <Reveal className="max-w-2xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A657F2]">{t.teamLabel}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">{t.teamTitle}</h2>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((t2, i) => (
            <Reveal key={t2.name} delay={(i % 3) * 80}>
              <div className="landing-bracket landing-card h-full p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 flex-shrink-0 rounded-2xl bg-[#7C3AED]/20 text-[#A657F2] font-bold flex items-center justify-center text-lg">
                    {initials(t2.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">{t2.name}</h3>
                    <p className="text-xs text-[#A657F2] font-semibold mt-0.5">{t2.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-[#A1A1AA] leading-relaxed">{t2.bio}</p>
                {t2.instagram && (
                  <a
                    href={`https://instagram.com/${t2.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-[#A657F2] transition-colors"
                  >
                    <InstagramGlyph className="w-3.5 h-3.5" />@{t2.instagram}
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
