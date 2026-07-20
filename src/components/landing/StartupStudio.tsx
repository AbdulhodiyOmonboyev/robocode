import { Sparkles, Lightbulb, Package, Code2, Rocket, Zap, TrendingUp, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

const HIGHLIGHTS = [
  {
    icon: Zap,
    title: "Innovatsiya",
    desc: "Yangi yechimlar va texnologiyalar orqali muammolarni hal qilish",
  },
  {
    icon: TrendingUp,
    title: "Tez rivojlanish",
    desc: "Qisqa vaqt ichida katta miqyosda o'sish imkoniyati",
  },
];

const STAGES = [
  { icon: Lightbulb, title: "G'oya shakllantirish" },
  { icon: Package, title: "MVP yaratish" },
  { icon: Code2, title: "Texnik rivojlanish" },
  { icon: Rocket, title: "Bozorga chiqish" },
];

export function StartupStudio({ onSelect }: { onSelect: () => void }) {
  return (
    <section id="startup-studio" className="relative bg-[#08060F] border-b border-white/10 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#A3E635]/10 blur-[120px]"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <Reveal className="max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#A3E635]">
            <Sparkles className="w-3.5 h-3.5" /> Startup Studio <Sparkles className="w-3.5 h-3.5" />
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">Startup Studio</h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 text-center">
            <p className="text-lg sm:text-xl text-white/70 font-medium">Startapingiz uchun</p>
            <p className="mt-1 text-5xl sm:text-7xl font-extrabold tracking-tight text-[#A3E635] drop-shadow-[0_0_45px_rgba(163,230,53,0.55)]">
              $20 000
            </p>
            <p className="mt-1 text-lg sm:text-xl text-white/70 font-medium">investitsiya</p>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="landing-bracket mt-14 bg-white/[0.03] rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto text-center">
            <h3 className="font-bold text-white text-lg">Startup nima?</h3>
            <p className="mt-3 text-[#A1A1AA] leading-relaxed">
              Startup — bu innovatsion g&apos;oya asosida yaratilgan loyiha yoki kompaniya bo&apos;lib, muammoni hal qilish va tez
              rivojlanishga qaratilgan.
            </p>
          </div>
        </Reveal>

        <div className="mt-6 grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {HIGHLIGHTS.map((h, i) => (
            <Reveal key={h.title} delay={180 + i * 80}>
              <div className="landing-bracket h-full bg-white/[0.03] rounded-2xl p-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center flex-shrink-0">
                  <h.icon className="w-5 h-5 text-[#A3E635]" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{h.title}</h4>
                  <p className="mt-1 text-sm text-[#A1A1AA] leading-relaxed">{h.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={340}>
          <div className="landing-bracket mt-6 bg-white/[0.03] rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto text-center">
            <h3 className="font-bold text-white text-lg">Bizning jamoa</h3>
            <p className="mt-3 text-[#A1A1AA] leading-relaxed">
              Maxsus jamoamiz g&apos;oyani shakllantirishdan tortib, MVP yaratish va xalqaro akseleratorlar (UZCombinator)
              darajasiga chiqishgacha yordam beradi.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STAGES.map((s, i) => (
            <Reveal key={s.title} delay={380 + i * 80}>
              <div className="relative">
                <div className="landing-bracket h-full bg-white/[0.03] rounded-2xl p-6 text-center hover:bg-white/[0.05] transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-[#A3E635]/15 flex items-center justify-center mx-auto mb-4">
                    <s.icon className="w-5 h-5 text-[#A3E635]" />
                  </div>
                  <span className="text-xs font-bold text-[#A3E635]">{i + 1}</span>
                  <h4 className="mt-1 font-bold text-white text-sm leading-snug">{s.title}</h4>
                </div>
                {i < STAGES.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-5 -translate-y-1/2 w-4 h-4 text-[#A3E635]/40" />
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={700}>
          <div className="mt-14 text-center">
            <button
              type="button"
              onClick={onSelect}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#A3E635] hover:brightness-110 text-[#08060F] font-bold rounded-xl shadow-[0_0_30px_rgba(163,230,53,0.35)] transition-[filter]"
            >
              Ariza qoldirish <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
