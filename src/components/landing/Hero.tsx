import { ArrowRight, PlayCircle } from "lucide-react";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Brand gradient backdrop — the one place the full #08060F → #2A0E5A → #6D28D9
          sweep runs at full strength; the rest of the page settles to flat #08060F. */}
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(160deg, #08060F 10%, #2A0E5A 55%, #6D28D9 115%)" }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-40"
        style={{ background: "radial-gradient(45% 35% at 80% 15%, rgba(163,230,53,0.18) 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="max-w-3xl">
          <span className="landing-bracket inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A3E635] px-4 py-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-pulse" />
            Andijondagi birinchi IT akademiya
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white leading-[1.05]">
            ROBOCODE — <span className="text-[#A3E635]">Andijondagi</span> birinchi IT akademiya
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[#A1A1AA] max-w-xl leading-relaxed">
            Biz bilan doim birinchi bo&apos;ling!
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <a
              href="#ariza"
              className="inline-flex items-center justify-center gap-2 bg-[#A3E635] hover:brightness-110 transition-[filter] text-[#08060F] font-bold px-6 py-3.5 rounded-xl shadow-[0_0_30px_rgba(163,230,53,0.35)]"
            >
              Kursga yozilish
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#courses"
              className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/15 hover:border-[#A3E635]/40 transition-colors text-white font-semibold px-6 py-3.5 rounded-xl"
            >
              <PlayCircle className="w-4 h-4 text-[#A3E635]" />
              Kurslarni ko&apos;rish
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
