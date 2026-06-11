"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Trash2, X, PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/components/ui/confirm";

interface Income {
  id: string; amount: string; source: string; note: string | null; receivedAt: string;
  createdBy: { fullName: string } | null;
}
function money(v: any) { return Number(v || 0).toLocaleString("ru-RU"); }
function ym(d: Date) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; }
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function IncomesPage() {
  const { confirm, dialog } = useConfirm();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [summary, setSummary] = useState<any>({ total: 0, count: 0 });
  const [month, setMonth] = useState(ym(new Date()));
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ amount: "", source: "", note: "", receivedAt: todayStr() });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/incomes?month=${month}`);
    if (res.ok) { const d = await res.json(); setIncomes(d.incomes || []); setSummary(d.summary || { total: 0, count: 0 }); }
    setLoading(false);
  }, [month]);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.amount || Number(form.amount) <= 0) { toast.error("Summani kiriting"); return; }
    if (!form.source.trim()) { toast.error("Manbani kiriting"); return; }
    setSaving(true);
    const res = await fetch("/api/incomes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    if (res.ok) { toast.success("Daromad qo'shildi"); setShowAdd(false); setForm({ amount: "", source: "", note: "", receivedAt: todayStr() }); load(); }
    else toast.error("Saqlab bo'lmadi");
  };

  const del = async (id: string) => {
    if (!(await confirm({ title: "Daromadni o'chirish", message: "Bu daromadni o'chirishni tasdiqlaysizmi?" }))) return;
    const res = await fetch(`/api/incomes/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("O'chirildi"); load(); } else toast.error("O'chirib bo'lmadi");
  };

  return (
    <div className="space-y-6">
      {dialog}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Qo'shimcha daromad</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kurs to'lovidan tashqari daromadlar</p>
        </div>
        <Button onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Daromad qo'shish</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card><CardContent className="p-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><PlusCircle className="w-5 h-5 text-green-600" /></div>
          <div><p className="text-xs text-gray-500">Bu oy qo'shimcha daromad</p><p className="text-xl font-bold text-gray-900 dark:text-white">{money(summary.total)} <span className="text-sm font-normal text-gray-400">so'm</span></p></div>
        </CardContent></Card>
        <Card><CardContent className="p-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 font-bold">№</div>
          <div><p className="text-xs text-gray-500">Yozuvlar soni</p><p className="text-xl font-bold text-gray-900 dark:text-white">{summary.count}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <input type="month" value={month} onChange={e => setMonth(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
      </div>

      <Card><CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left font-medium px-4 py-3">Sana</th>
              <th className="text-left font-medium px-4 py-3">Manba</th>
              <th className="text-right font-medium px-4 py-3">Summa</th>
              <th className="text-left font-medium px-4 py-3">Izoh</th>
              <th className="text-left font-medium px-4 py-3">Kim</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Yuklanmoqda...</td></tr>
            ) : incomes.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Daromad yo'q</td></tr>
            ) : incomes.map(e => (
              <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{new Date(e.receivedAt).toLocaleDateString("ru-RU")}</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{e.source}</td>
                <td className="px-4 py-3 text-right font-semibold text-green-600 whitespace-nowrap">+{money(e.amount)} so'm</td>
                <td className="px-4 py-3 text-gray-500">{e.note || "—"}</td>
                <td className="px-4 py-3 text-gray-500">{e.createdBy?.fullName || "—"}</td>
                <td className="px-4 py-3 text-right"><button onClick={() => del(e.id)} className="text-gray-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent></Card>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Daromad qo'shish</h2>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <Input label="Summa (so'm)" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="1000000" />
            <Input label="Manba" value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} placeholder="Sotuv / Tadbir / Boshqa..." />
            <div>
              <label className="block text-xs text-gray-500 mb-1">Sana</label>
              <input type="date" value={form.receivedAt} onChange={e => setForm(f => ({ ...f, receivedAt: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Izoh (ixtiyoriy)</label>
              <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={save} loading={saving} className="flex-1">Saqlash</Button>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Bekor</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
