"use client";

import { useState, useEffect } from "react";

export default function ApplyPage() {
  const [cfg, setCfg] = useState<{ courses: any[]; name: string; logo: string }>({ courses: [], name: "Robocode CRM", logo: "" });
  const [form, setForm] = useState({ fullName: "", phone: "", courseId: "", preferredDays: "", lessonTime: "", note: "", referrerName: "", referrerPhone: "", website: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/public/lead").then((r) => r.json()).then(setCfg).catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.fullName.trim().length < 2) { setError("Ism familiyangizni kiriting"); return; }
    if (form.phone.replace(/\D/g, "").length < 7) { setError("Telefon raqamingizni to'g'ri kiriting"); return; }
    setLoading(true);
    const res = await fetch("/api/public/lead", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) setDone(true);
    else { const d = await res.json().catch(() => ({})); setError(d.error || "Xatolik. Qayta urinib ko'ring."); }
  };

  const inp = "w-full px-4 py-3 text-base border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-violet-500 outline-none";

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cfg.logo || "/icon.svg"} alt={cfg.name} className="inline-block w-16 h-16 rounded-2xl mb-3 shadow-lg object-contain" />
          <h1 className="text-2xl font-bold text-gray-900">{cfg.name}</h1>
          <p className="text-gray-500 mt-1">Kursga yozilish uchun ariza qoldiring</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          {done ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Rahmat!</h2>
              <p className="text-gray-500 mt-2">Arizangiz qabul qilindi. Tez orada siz bilan bog'lanamiz.</p>
              <button onClick={() => { setDone(false); setForm({ fullName: "", phone: "", courseId: "", preferredDays: "", lessonTime: "", note: "", referrerName: "", referrerPhone: "", website: "" }); }}
                className="mt-6 text-violet-600 font-medium hover:underline">Yana ariza qoldirish</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <input type="text" tabIndex={-1} autoComplete="off" value={form.website}
                onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                className="hidden" aria-hidden="true" />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ism familiya *</label>
                <input className={inp} value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} placeholder="Aziza Karimova" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon raqam *</label>
                <input className={inp} type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+998 90 123 45 67" />
              </div>
              {cfg.courses.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Qaysi kurs?</label>
                  <select className={inp} value={form.courseId} onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}>
                    <option value="">Tanlang (ixtiyoriy)</option>
                    {cfg.courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Qulay vaqt (ixtiyoriy)</label>
                <input className={inp} value={form.lessonTime} onChange={(e) => setForm((f) => ({ ...f, lessonTime: e.target.value }))} placeholder="masalan: ertalab / 18:00 dan keyin" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Izoh (ixtiyoriy)</label>
                <textarea className={inp} rows={3} value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} placeholder="Qo'shimcha ma'lumot..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Sizni kim tavsiya qildi? (ixtiyoriy)</label>
                <input className={inp + " mb-2"} value={form.referrerName} onChange={(e) => setForm((f) => ({ ...f, referrerName: e.target.value }))} placeholder="Tavsiya qilgan kishi ismi" />
                <input className={inp} value={form.referrerPhone} onChange={(e) => setForm((f) => ({ ...f, referrerPhone: e.target.value }))} placeholder="Uning telefoni" />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold rounded-xl transition">
                {loading ? "Yuborilmoqda..." : "Ariza yuborish"}
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">© {new Date().getFullYear()} {cfg.name}</p>
      </div>
    </div>
  );
}
