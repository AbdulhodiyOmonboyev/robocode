import { Reveal } from "./Reveal";
import { InstagramGlyph } from "./InstagramGlyph";

const TEAM = [
  {
    name: "Abdulaziz Yakubov",
    role: "Asoschisi",
    bio: "Yoshlar Ventures direktori (2025-fevral). Dasturchi, Team Leader, CEO — IT sohasida +10 yil tajriba, startapper.",
    instagram: "aka.yakubov",
  },
  {
    name: "Akhmadullo Nurmakhamatov",
    role: "Team Lead",
    bio: "6+ yil xalqaro IT tajribasi. Politecnico di Torino (Italiya) bitiruvchisi. React, TypeScript, Agile (Scrum). Senior Software Engineer, Mentor.",
  },
  {
    name: "Shuxratbek Aliyev",
    role: "Grafik va UX/UI ustoz",
    bio: "5 yil tajriba, Robocode yetakchi mentori. Vodiy Brend Startup asoschisi — 30+ brend, 150+ bitiruvchi.",
  },
  {
    name: "Ziyodullo Shuxratbekov",
    role: "Startup mentor",
    bio: "EduCompass asoschisi. 250 000$ qiymatdagi loyiha muallifi, 20+ startap, 700 000$+ investitsiya jalb qilgan.",
  },
  {
    name: "Nazrullo Raxmatov",
    role: "Back-end ustoz",
    bio: "3+ yil IT tajribasi. Robocode bitiruvchisi va ustozi. EduCompass backend jamoasida, 20+ backend loyiha.",
  },
  {
    name: "Abduvahob Qahhorov",
    role: "Back-end ustoz",
    bio: "5+ yil tajriba. UIC Group va Prolab loyihalarida ishlagan — tizim arxitekturasi va server logikasi bo'yicha mutaxassis.",
  },
  {
    name: "Saidislom To'lqinov",
    role: "Front-end / 3D ustoz",
    bio: "5 yil tajriba, Fransiyadagi \"NFINITE\"da ishlaydi. CANFORAMA, CASTORAMA, LECLERC, WALLMART bilan hamkorlik. 25+ shogird.",
  },
  {
    name: "Husanboy Zafarov",
    role: "Front-end ustoz",
    bio: "3+ yil tajriba, Robocode bitiruvchisi. EduCompass va Bozorly loyihalarida ishlagan, Figma'da UI dizayn.",
  },
  {
    name: "Hasanboy Zafarov",
    role: "Vibe Coding ustoz",
    bio: "Robocode front-end mentori. Responsive web interfeyslar va zamonaviy front-end texnologiyalari bo'yicha ustoz.",
  },
  {
    name: "Alimjanov Saidmurod",
    role: "Front-end / Foundation ustoz",
    bio: "2+ yil tajriba. Darslarni rus va o'zbek tillarida olib boradi. Bozorly loyihasida ishtirok etgan.",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Team() {
  return (
    <section id="team" className="bg-[#08060F] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <Reveal className="max-w-2xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A3E635]">Jamoa</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
            Tajribali jamoa bilan tanishing
          </h2>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 80}>
              <div className="landing-bracket h-full bg-white/[0.03] rounded-2xl p-6 hover:bg-white/[0.05] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 flex-shrink-0 rounded-2xl bg-[#7C3AED]/20 text-[#A3E635] font-bold flex items-center justify-center text-lg">
                    {initials(t.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">{t.name}</h3>
                    <p className="text-xs text-[#A3E635] font-semibold mt-0.5">{t.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-[#A1A1AA] leading-relaxed">{t.bio}</p>
                {t.instagram && (
                  <a
                    href={`https://instagram.com/${t.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-[#A3E635] transition-colors"
                  >
                    <InstagramGlyph className="w-3.5 h-3.5" />@{t.instagram}
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
