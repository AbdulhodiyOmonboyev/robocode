"use client";

import { useState } from "react";
import { User, Phone, BookOpen, MessageSquare, Check } from "lucide-react";
import { PhoneInput } from "@/components/ui/phone-input";
import type { PublicCourse } from "./types";
import { Reveal } from "./Reveal";

export function LeadForm({ courses }: { courses: PublicCourse[] }) {
  const [form, setForm] = useState({ fullName: "", phone: "", courseId: "", note: "", website: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.fullName.trim().length < 2) {
      setError("Ism familiyangizni kiriting");
      return;
    }
    if (form.phone.replace(/\D/g, "").length < 7) {
      setError("Telefon raqamingizni to'g'ri kiriting");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/public/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) setDone(true);
    else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Xatolik. Qayta urinib ko'ring.");
    }
  };

  const inp =
    "w-full px-4 py-3 text-base border border-white/10 rounded-xl bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#A3E635] focus:border-transparent transition";
  const label = "flex items-center gap-1.5 text-sm font-medium text-white/70 mb-1.5";

  return (
    <section id="ariza" className="bg-[#08060F] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-widest text-[#A3E635]">Kursga yozilish</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              Bugun birinchi qadamni tashlang
            </h2>
            <p className="mt-4 text-[#A1A1AA] leading-relaxed max-w-md">
              Formani to&apos;ldiring — mutaxassislarimiz tez orada siz bilan bog&apos;lanib, kurs bo&apos;yicha
              barcha ma&apos;lumotlarni beradi.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="landing-bracket bg-white/[0.03] rounded-2xl p-6 sm:p-8">
              {done ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#A3E635]/10 flex items-center justify-center mx-auto mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#A3E635]/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-[#A3E635]" strokeWidth={3} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">Rahmat!</h3>
                  <p className="text-[#A1A1AA] mt-2 text-sm leading-relaxed">
                    Arizangiz qabul qilindi.
                    <br />
                    Tez orada siz bilan bog&apos;lanamiz.
                  </p>
                  <button
                    onClick={() => {
                      setDone(false);
                      setForm({ fullName: "", phone: "", courseId: "", note: "", website: "" });
                    }}
                    className="mt-6 text-[#A3E635] text-sm font-semibold hover:underline"
                  >
                    Yana ariza qoldirish
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div>
                    <label className={label}>
                      <User className="w-3.5 h-3.5 text-[#A3E635]" /> Ism familiya *
                    </label>
                    <input
                      className={inp}
                      value={form.fullName}
                      onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                      placeholder="Aziza Karimova"
                    />
                  </div>
                  <div>
                    <label className={label}>
                      <Phone className="w-3.5 h-3.5 text-[#A3E635]" /> Telefon raqam *
                    </label>
                    <PhoneInput value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} size="lg" className="!bg-white/5 !border-white/10" />
                  </div>
                  {courses.length > 0 && (
                    <div>
                      <label className={label}>
                        <BookOpen className="w-3.5 h-3.5 text-[#A3E635]" /> Kurs tanlash
                      </label>
                      <select className={inp} value={form.courseId} onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}>
                        <option className="bg-[#08060F]" value="">
                          Tanlang (ixtiyoriy)
                        </option>
                        {courses.map((c) => (
                          <option className="bg-[#08060F]" key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className={label}>
                      <MessageSquare className="w-3.5 h-3.5 text-[#A3E635]" /> Izoh <span className="text-white/40 font-normal">(ixtiyoriy)</span>
                    </label>
                    <textarea
                      className={inp}
                      rows={3}
                      value={form.note}
                      onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                      placeholder="Qo'shimcha ma'lumot..."
                    />
                  </div>

                  {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#A3E635] hover:brightness-110 disabled:opacity-60 text-[#08060F] font-bold rounded-xl shadow-[0_0_25px_rgba(163,230,53,0.3)] transition-[filter]"
                  >
                    {loading ? "Yuborilmoqda..." : "Ariza yuborish"}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
