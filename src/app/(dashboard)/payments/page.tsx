"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Trash2, X, Search, Wallet, CalendarDays, Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/components/ui/confirm";

interface Payment {
  id: string;
  amount: string;
  currency: string;
  method: string;
  type: string;
  forMonth: string | null;
  note: string | null;
  paidAt: string;
  lead: { id: string; fullName: string; phone: string } | null;
  group: { id: string; name: string } | null;
  createdBy: { id: string; fullName: string } | null;
}

const METHODS: Record<string, string> = { cash: "Naqd", card: "Karta", transfer: "O'tkazma" };
const TYPES: Record<string, string> = { tuition: "Oylik to'lov", enrollment: "Ro'yxatdan o'tish", other: "Boshqa" };

function money(v: any) {
  return Number(v || 0).toLocaleString("ru-RU");
}
function ym(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<any>({ total: 0, count: 0, monthTotal: 0 });
  const [q, setQ] = useState("");
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [presetLead, setPresetLead] = useState<any>(null);
  const [view, setView] = useState<"payments" | "debtors">("payments");
  const [debtors, setDebtors] = useState<any>({ debtors: [], totalExpected: 0, month: "" });
  const [debtMonth, setDebtMonth] = useState(ym(new Date()));

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (month) params.set("month", month);
    const res = await fetch("/api/payments?" + params.toString());
    const data = await res.json();
    setPayments(data.payments || []);
    setSummary(data.summary || { total: 0, count: 0, monthTotal: 0 });
    setLoading(false);
  }, [q, month]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const loadDebtors = useCallback(async () => {
    const res = await fetch(`/api/payments/debtors?month=${debtMonth}`);
    setDebtors(await res.json());
  }, [debtMonth]);

  useEffect(() => {
    if (view === "debtors") loadDebtors();
  }, [view, loadDebtors]);

  const { confirm, dialog } = useConfirm();

  const del = async (id: string) => {
    if (!(await confirm({ title: "To'lovni o'chirish", message: "Bu to'lovni o'chirishni tasdiqlaysizmi?" }))) return;
    const res = await fetch(`/api/payments/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("O'chirildi"); load(); }
    else toast.error("O'chirib bo'lmadi (faqat admin)");
  };

  return (
    <div className="space-y-6">
      {dialog}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">To'lovlar</h1>
          <p className="text-sm text-gray-500 mt-0.5">O'quvchi to'lovlari va daromad</p>
        </div>
        <Button onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> To'lov qo'shish</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><Wallet className="w-5 h-5 text-green-600" /></div>
          <div><p className="text-xs text-gray-500">Jami daromad</p><p className="text-xl font-bold text-gray-900 dark:text-white">{money(summary.total)} <span className="text-sm font-normal text-gray-400">so'm</span></p></div>
        </CardContent></Card>
        <Card><CardContent className="p-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center"><CalendarDays className="w-5 h-5 text-indigo-600" /></div>
          <div><p className="text-xs text-gray-500">Bu oy ({summary.month})</p><p className="text-xl font-bold text-gray-900 dark:text-white">{money(summary.monthTotal)} <span className="text-sm font-normal text-gray-400">so'm</span></p></div>
        </CardContent></Card>
        <Card><CardContent className="p-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"><Receipt className="w-5 h-5 text-amber-600" /></div>
          <div><p className="text-xs text-gray-500">To'lovlar soni</p><p className="text-xl font-bold text-gray-900 dark:text-white">{summary.count}</p></div>
        </CardContent></Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        <button onClick={() => setView("payments")} className={`px-4 py-2 text-sm font-medium rounded-lg transition ${view==="payments"?"bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm":"text-gray-500"}`}>To'lovlar</button>
        <button onClick={() => setView("debtors")} className={`px-4 py-2 text-sm font-medium rounded-lg transition ${view==="debtors"?"bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm":"text-gray-500"}`}>Qarzdorlar</button>
      </div>

      {view === "payments" && (<>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="O'quvchi ismi yoki telefon..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
        {month && <Button size="sm" variant="outline" onClick={() => setMonth("")}>Tozalash</Button>}
      </div>

      {/* Table */}
      <Card><CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left font-medium px-4 py-3">Sana</th>
              <th className="text-left font-medium px-4 py-3">O'quvchi</th>
              <th className="text-right font-medium px-4 py-3">Summa</th>
              <th className="text-left font-medium px-4 py-3">Oy</th>
              <th className="text-left font-medium px-4 py-3">Usul</th>
              <th className="text-left font-medium px-4 py-3">Qabul qildi</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Yuklanmoqda...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">To'lov yo'q</td></tr>
            ) : payments.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{new Date(p.paidAt).toLocaleDateString("ru-RU")}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 dark:text-white">{p.lead?.fullName || "—"}</p>
                  <p className="text-xs text-gray-400">{p.lead?.phone}</p>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-green-600 whitespace-nowrap">{money(p.amount)} so'm</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.forMonth || "—"}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{METHODS[p.method] || p.method}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.createdBy?.fullName || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a href={`/receipt/${p.id}`} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">Chek</a>
                    <button onClick={() => del(p.id)} className="text-gray-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent></Card>
      </>)}

      {view === "debtors" && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <input type="month" value={debtMonth} onChange={e => setDebtMonth(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            <p className="text-sm text-gray-500">{debtors.debtors?.length || 0} qarzdor · kutilayotgan: <b className="text-gray-900 dark:text-white">{money(debtors.totalExpected)} so'm</b></p>
          </div>
          <Card><CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left font-medium px-4 py-3">O'quvchi</th>
                  <th className="text-left font-medium px-4 py-3">Guruh</th>
                  <th className="text-left font-medium px-4 py-3">Kurs</th>
                  <th className="text-right font-medium px-4 py-3">Oylik</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {(debtors.debtors || []).length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Qarzdor yo'q 🎉</td></tr>
                ) : debtors.debtors.map((d: any) => (
                  <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3"><p className="font-medium text-gray-900 dark:text-white">{d.fullName}</p><p className="text-xs text-gray-400">{d.phone}</p></td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{d.group || "—"}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{d.course || "—"}</td>
                    <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{money(d.expected)} so'm</td>
                    <td className="px-4 py-3 text-right"><Button size="sm" onClick={() => { setPresetLead({ id: d.id, fullName: d.fullName, phone: d.phone }); setShowAdd(true); }}>To'lov</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent></Card>
        </div>
      )}

      {showAdd && <AddPaymentModal presetLead={presetLead} onClose={() => { setShowAdd(false); setPresetLead(null); }} onSaved={() => { setShowAdd(false); setPresetLead(null); load(); if (view === "debtors") loadDebtors(); }} />}
    </div>
  );
}

function AddPaymentModal({ presetLead, onClose, onSaved }: { presetLead?: any; onClose: () => void; onSaved: () => void }) {
  const [leadQ, setLeadQ] = useState("");
  const [leadResults, setLeadResults] = useState<any[]>([]);
  const [lead, setLead] = useState<any>(presetLead || null);
  const [amount, setAmount] = useState("");
  const [forMonth, setForMonth] = useState(ym(new Date()));
  const [method, setMethod] = useState("cash");
  const [type, setType] = useState("tuition");
  const [discount, setDiscount] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [types, setTypes] = useState<any[]>([]);

  useEffect(() => { fetch("/api/payment-types").then(r => r.json()).then(d => setTypes(Array.isArray(d) ? d.filter((t: any) => t.isActive) : [])).catch(() => {}); }, []);

  useEffect(() => {
    if (lead || leadQ.length < 1) { setLeadResults([]); return; }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/leads?search=${encodeURIComponent(leadQ)}&limit=8`);
      const data = await res.json();
      setLeadResults(data.leads || []);
    }, 250);
    return () => clearTimeout(t);
  }, [leadQ, lead]);

  const save = async () => {
    if (!lead) { toast.error("O'quvchini tanlang"); return; }
    if (!amount || Number(amount) <= 0) { toast.error("Summani kiriting"); return; }
    setSaving(true);
    const res = await fetch("/api/payments", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: lead.id, amount, discount: discount || null, method, type, forMonth, note, groupId: lead.group?.id || null }),
    });
    setSaving(false);
    if (res.ok) { toast.success("To'lov qo'shildi"); onSaved(); }
    else toast.error("Saqlab bo'lmadi");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">To'lov qo'shish</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        {/* lead picker */}
        <div className="relative">
          <label className="block text-xs text-gray-500 mb-1">O'quvchi</label>
          {lead ? (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl border border-indigo-300 bg-indigo-50 dark:bg-indigo-900/20">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{lead.fullName} <span className="text-gray-400">{lead.phone}</span></span>
              <button onClick={() => { setLead(null); setLeadQ(""); }} className="text-gray-400 hover:text-red-600"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <>
              <input value={leadQ} onChange={e => setLeadQ(e.target.value)} placeholder="Ism yoki telefon bo'yicha qidiring..."
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
              {leadResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                  {leadResults.map(l => (
                    <button key={l.id} onClick={() => { setLead(l); setLeadResults([]); }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                      <span className="font-medium text-gray-900 dark:text-white">{l.fullName}</span> <span className="text-gray-400">{l.phone}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <Input label="Summa (so'm)" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="500000" />
        <Input label="Chegirma (ixtiyoriy)" type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="0" />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Qaysi oy uchun</label>
            <input type="month" value={forMonth} onChange={e => setForMonth(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Usul</label>
            <select value={method} onChange={e => setMethod(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="cash">Naqd</option><option value="card">Karta</option><option value="transfer">O'tkazma</option>
              {types.map((t: any) => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Turi</label>
          <select value={type} onChange={e => setType(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="tuition">Oylik to'lov</option><option value="enrollment">Ro'yxatdan o'tish</option><option value="other">Boshqa</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Izoh (ixtiyoriy)</label>
          <input value={note} onChange={e => setNote(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={save} loading={saving} className="flex-1">Saqlash</Button>
          <Button variant="outline" onClick={onClose}>Bekor</Button>
        </div>
      </div>
    </div>
  );
}
