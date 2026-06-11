"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Trash2, X, ArrowLeft, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/components/ui/confirm";

function ymd(d: Date) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }

export default function ExamsPage() {
  const { confirm, dialog } = useConfirm();
  const [exams, setExams] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", type: "exam", groupId: "", courseId: "", date: ymd(new Date()), maxScore: "100" });
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/exams");
    setExams(await res.json());
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    fetch("/api/groups").then(r => r.json()).then(d => setGroups(Array.isArray(d) ? d : []));
    fetch("/api/courses").then(r => r.json()).then(d => setCourses(Array.isArray(d) ? d : []));
  }, []);

  const create = async () => {
    if (!form.title.trim()) { toast.error("Nom kiriting"); return; }
    setSaving(true);
    const res = await fetch("/api/exams", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    if (res.ok) { toast.success("Yaratildi"); setShowAdd(false); setForm({ title: "", type: "exam", groupId: "", courseId: "", date: ymd(new Date()), maxScore: "100" }); load(); }
    else toast.error("Saqlab bo'lmadi");
  };

  const del = async (id: string) => {
    if (!(await confirm({ title: "Imtihonni o'chirish", message: "Bu imtihon va uning ballarini o'chirasizmi?" }))) return;
    const res = await fetch(`/api/exams/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("O'chirildi"); load(); } else toast.error("O'chirib bo'lmadi");
  };

  if (selected) return <ScoreEntry exam={selected} onBack={() => { setSelected(null); load(); }} dialog={dialog} />;

  return (
    <div className="space-y-6">
      {dialog}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Imtihonlar</h1>
          <p className="text-sm text-gray-500 mt-0.5">Imtihon va daraja testlari, ballar</p>
        </div>
        <Button onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Imtihon yaratish</Button>
      </div>

      <Card><CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left font-medium px-4 py-3">Nom</th>
              <th className="text-left font-medium px-4 py-3">Turi</th>
              <th className="text-left font-medium px-4 py-3">Guruh</th>
              <th className="text-left font-medium px-4 py-3">Sana</th>
              <th className="text-right font-medium px-4 py-3">Baholangan</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Yuklanmoqda...</td></tr>
            ) : exams.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Imtihon yo'q</td></tr>
            ) : exams.map(e => (
              <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer" onClick={() => setSelected(e)}>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{e.title}</td>
                <td className="px-4 py-3">{e.type === "level_test" ? <span className="text-blue-600">Daraja testi</span> : <span className="text-gray-500">Imtihon</span>}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{e.group?.name || "—"}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{new Date(e.date).toLocaleDateString("ru-RU")}</td>
                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{e._count?.scores ?? 0}</td>
                <td className="px-4 py-3 text-right" onClick={ev => ev.stopPropagation()}>
                  <button onClick={() => del(e.id)} className="text-gray-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent></Card>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Imtihon yaratish</h2>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <Input label="Nom" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="1-modul imtihoni" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Turi</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="exam">Imtihon</option><option value="level_test">Daraja testi</option>
                </select>
              </div>
              <Input label="Maks. ball" type="number" value={form.maxScore} onChange={e => setForm(f => ({ ...f, maxScore: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Guruh</label>
              <select value={form.groupId} onChange={e => setForm(f => ({ ...f, groupId: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Tanlang...</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Sana</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={create} loading={saving} className="flex-1">Yaratish</Button>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Bekor</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreEntry({ exam, onBack, dialog }: { exam: any; onBack: () => void; dialog: any }) {
  const [students, setStudents] = useState<any[]>([]);
  const [maxScore, setMaxScore] = useState(100);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/exams/${exam.id}/scores`).then(r => r.json()).then(d => { setStudents(d.students || []); setMaxScore(d.maxScore || 100); setLoading(false); });
  }, [exam.id]);

  const setScore = (leadId: string, v: string) => setStudents(prev => prev.map(s => s.leadId === leadId ? { ...s, score: v === "" ? null : Number(v) } : s));

  const save = async () => {
    const records = students.filter(s => s.score !== null && s.score !== undefined && s.score !== "").map(s => ({ leadId: s.leadId, score: Number(s.score) }));
    if (!records.length) { toast.error("Hech bo'lmasa bittasini kiriting"); return; }
    setSaving(true);
    const res = await fetch(`/api/exams/${exam.id}/scores`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ records }) });
    setSaving(false);
    res.ok ? toast.success("Ballar saqlandi") : toast.error("Saqlab bo'lmadi");
  };

  return (
    <div className="space-y-6">
      {dialog}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><ArrowLeft className="w-5 h-5 text-gray-500" /></button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{exam.title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{exam.group?.name || "Guruhsiz"} · maks. {maxScore} ball</p>
        </div>
      </div>

      <Card><CardContent className="p-0 divide-y divide-gray-100 dark:divide-gray-800">
        {loading ? (
          <div className="px-4 py-8 text-center text-gray-400">Yuklanmoqda...</div>
        ) : students.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400">Bu guruhda o'quvchi yo'q. Imtihonga guruh biriktiring.</div>
        ) : students.map(s => (
          <div key={s.leadId} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="font-medium text-gray-900 dark:text-white">{s.fullName}</p>
              <p className="text-xs text-gray-400">{s.phone}</p>
            </div>
            <input type="number" min={0} max={maxScore} value={s.score ?? ""} onChange={e => setScore(s.leadId, e.target.value)}
              placeholder="—" className="w-24 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 text-right" />
          </div>
        ))}
      </CardContent></Card>

      {students.length > 0 && (
        <div className="flex justify-end"><Button onClick={save} loading={saving}><Save className="w-4 h-4" /> Ballarni saqlash</Button></div>
      )}
    </div>
  );
}
