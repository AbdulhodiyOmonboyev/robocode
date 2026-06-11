"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Trash2, X, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/components/ui/confirm";

function money(v: any) { return Number(v || 0).toLocaleString("ru-RU"); }
function ym(d: Date) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; }

export default function PayrollPage() {
  const { confirm, dialog } = useConfirm();
  const [data, setData] = useState<any>({ byUser: [], records: [], total: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [month, setMonth] = useState(ym(new Date()));
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ userId: "", amount: "", type: "salary", note: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/payroll?month=${month}`);
    if (res.ok) setData(await res.json());
    setLoading(false);
  }, [month]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { fetch("/api/users").then(r => r.json()).then(d => setUsers(Array.isArray(d) ? d : [])); }, []);

  const save = async () => {
    if (!form.userId) { toast.error("Xodimni tanlang"); return; }
    if (!form.amount || Number(form.amount) <= 0) { toast.error("Summani kiriting"); return; }
    setSaving(true);
    const res = await fetch("/api/payroll", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, month }) });
    setSaving(false);
    if (res.ok) { toast.success("Saqlandi"); setShowAdd(false); setForm({ userId: "", amount: "", type: "salary", note: "" }); load(); }
    else toast.error("Saqlab bo'lmadi");
  };

  const del = async (id: string) => {
    if (!(await confirm({ title: "Yozuvni o'chirish", message: "Bu ish haqi yozuvini o'chirishni tasdiqlaysizmi?" }))) return;
    const res = await fetch(`/api/payroll/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("O'chirildi"); load(); } else toast.error("O'chirib bo'lmadi");
  };

  return (
    <div className="space-y-6">
      {dialog}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ish haqi</h1>
          <p className="text-sm text-gray-500 mt-0.5">Xodimlar oyligi va bonuslari</p>
        </div>
        <Button onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Ish haqi qo'shish</Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <input type="month" value={month} onChange={e => setMonth(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
        <Card className="flex-1 min-w-[200px]"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center"><Wallet className="w-5 h-5 text-indigo-600" /></div>
          <div><p className="text-xs text-gray-500">Bu oy jami ish haqi</p><p className="text-lg font-bold text-gray-900 dark:text-white">{money(data.total)} so'm</p></div>
        </CardContent></Card>
      </div>

      {/* Per-user summary */}
      <Card><CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left font-medium px-4 py-3">Xodim</th>
              <th className="text-right font-medium px-4 py-3">Oylik</th>
              <th className="text-right font-medium px-4 py-3">Bonus</th>
              <th className="text-right font-medium px-4 py-3">Jami</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Yuklanmoqda...</td></tr>
            ) : (data.byUser || []).length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Bu oyda yozuv yo'q</td></tr>
            ) : data.byUser.map((u: any) => (
              <tr key={u.userId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{u.name}</td>
                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{money(u.salary)}</td>
                <td className="px-4 py-3 text-right text-amber-600">{u.bonus ? money(u.bonus) : "—"}</td>
                <td className="px-4 py-3 text-right font-semibold text-green-600">{money(u.total)} so'm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent></Card>

      {/* Detailed records */}
      {(data.records || []).length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Yozuvlar</p>
          <Card><CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs uppercase">
                <tr><th className="text-left font-medium px-4 py-2.5">Xodim</th><th className="text-left font-medium px-4 py-2.5">Turi</th><th className="text-right font-medium px-4 py-2.5">Summa</th><th className="text-left font-medium px-4 py-2.5">Izoh</th><th className="px-4 py-2.5"></th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.records.map((r: any) => (
                  <tr key={r.id}>
                    <td className="px-4 py-2.5 text-gray-900 dark:text-white">{r.user?.fullName || "—"}</td>
                    <td className="px-4 py-2.5">{r.type === "bonus" ? <span className="text-amber-600">Bonus</span> : <span className="text-gray-500">Oylik</span>}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-gray-900 dark:text-white">{money(r.amount)}</td>
                    <td className="px-4 py-2.5 text-gray-500">{r.note || "—"}</td>
                    <td className="px-4 py-2.5 text-right"><button onClick={() => del(r.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent></Card>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Ish haqi qo'shish ({month})</h2>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Xodim</label>
              <select value={form.userId} onChange={e => setForm(f => ({ ...f, userId: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="">Tanlang...</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
              </select>
            </div>
            <Input label="Summa (so'm)" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="3000000" />
            <div>
              <label className="block text-xs text-gray-500 mb-1">Turi</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="salary">Oylik</option>
                <option value="bonus">Bonus</option>
              </select>
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
