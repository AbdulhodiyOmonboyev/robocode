import { Hammer, GraduationCap, Cpu, Users2, Award, Briefcase } from "lucide-react";

const ITEMS = [
  { icon: Hammer, title: "Amaliy loyihalar", desc: "Har bir mavzu real loyihalar orqali mustahkamlanadi." },
  { icon: GraduationCap, title: "Tajribali ustozlar", desc: "Sohada faoliyat yurituvchi mutaxassislardan ta'lim." },
  { icon: Cpu, title: "Zamonaviy jihozlar", desc: "Yangi kompyuterlar va robototexnika uskunalari." },
  { icon: Users2, title: "Kichik guruhlar", desc: "Har bir o'quvchiga individual e'tibor." },
  { icon: Award, title: "Sertifikat", desc: "Kursni tugatgan har bir o'quvchiga sertifikat." },
  { icon: Briefcase, title: "Ish bilan ta'minlash", desc: "Eng yaxshi bitiruvchilarga ish topishda ko'maklashamiz." },
];

export function WhyUs() {
  return (
    <section id="why-us" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
      <div className="max-w-2xl mx-auto text-center">
        <span className="text-sm font-semibold text-brand">Nega biz</span>
        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Bizni tanlash uchun sabablar
        </h2>
      </div>

      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ITEMS.map((item) => (
          <div key={item.title} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center mb-4">
              <item.icon className="w-5 h-5 text-brand" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
