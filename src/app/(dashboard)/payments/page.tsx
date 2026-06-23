"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Plus, Trash2, X, Search, Wallet, CalendarDays, AlertCircle, Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/components/ui/confirm";
import { cn } from "@/lib/utils";

interface Payment {
  id: string; amount: string; discount?: string | null; currency: string;
  method: string; type: string; forMonth: string | null; note: string | null; paidAt: string;
  lead: { id: string; fullName: string; phone: string } | null;
  course?: { name: string; color?: string | null } | null;
  group: { id: string; name: string } | null;
  createdBy: { id: string; fullName: string } | null;
}

const METHODS: Record<string, string> = { cash: "Naqd", card: "Karta", transfer: "O'tkazma" };
const BRAND = "#5E2CA5";

function money(v: any) { return Number(v || 0).toLocaleString("ru-RU"); }
function ym(d: Date) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; }

const inputCls =
  "w-full px-3 py-2 text-[13px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5E2CA5]/30 focus:border-[#5E2CA5]/50 transition";

const TH = "px-4 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide whitespace-nowrap";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<any>({ total: 0, count: 0, monthTotal: 0, month: "" });
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

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [load]);

  const loadDebtors = useCallback(async () => {
    const res = await fetch(`/api/payments/debtors?month=${debtMonth}`);
    setDebtors(await res.json());
  }, [debtMonth]);

  useEffect(() => { loadDebtors(); }, [loadDebtors]);

  const { confirm, dialog } = useConfirm();

  const del = async (id: string) => {
    if (!(await confirm({ title: "To'lovni o'chirish", message: "Bu to'lovni o'chirishni tasdiqlaysizmi?" }))) return;
    const res = await fetch(`/api/payments/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("O'chirildi"); load(); }
    else toast.error("O'chirib bo'lmadi (faqat admin)");
  };

  const kpiCards = [
    {
      label: `Bu oy tushum (${summary.month || "—"})`,
      value: `${money(summary.monthTotal)} so'm`,
      icon: CalendarDays,
      chip: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "Jami tushum",
      value: `${money(summary.total)} so'm`,
      icon: Wallet,
      chip: "bg-[#5E2CA5]/10 text-[#5E2CA5]",
    },
    {
      label: "Qarzdorlar",
      value: `${debtors.debtors?.length || 0} ta`,
      sub: debtors.totalExpected ? `${money(debtors.totalExpected)} so'm kutilmoqda` : undefined,
      icon: AlertCircle,
      chip: "bg-red-500/10 text-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F6FA] dark:bg-gray-950 p-6 space-y-5" style={{ fontFamily: "'Inter', sans-serif" }}>
      {dialog}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">To&apos;lovlar</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">O&apos;quvchi to&apos;lovlari va daromad</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium bg-[#5E2CA5] hover:bg-[#4a2280] text-white shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> To&apos;lov qabul qilish
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpiCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 flex items-start gap-4">
              <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", card.chip)}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] text-gray-400 dark:text-gray-500 mb-0.5">{card.label}</p>
                <p className="text-[22px] font-bold text-gray-900 dark:text-white leading-tight">{card.value}</p>
                {card.sub && <p className="text-[11px] text-gray-400 mt-0.5">{card.sub}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white dark:bg-gray-900 p-1 rounded-xl w-fit shadow-sm border border-gray-100 dark:border-white/5">
        {(["payments", "debtors"] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "px-4 py-2 text-[13px] font-medium rounded-lg transition-colors duration-150",
              view === v
                ? "bg-[#5E2CA5] text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            )}
          >
            {v === "payments" ? "To'lovlar" : "Qarzdorlar"}
          </button>
        ))}
      </div>

      {/* ── PAYMENTS view ── */}
      {view === "payments" && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={q} onChange={e => setQ(e.target.value)}
                placeholder="O'quvchi ismi yoki telefon..."
                className="w-full pl-9 pr-3 py-2 text-[13px] border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5E2CA5]/30 focus:border-[#5E2CA5]/50 transition"
              />
            </div>
            <input
              type="month" value={month} onChange={e => setMonth(e.target.value)}
              className="px-3 py-2 text-[13px] border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E2CA5]/30 focus:border-[#5E2CA5]/50 transition"
            />
            {month && (
              <button onClick={() => setMonth("")} className="px-3 py-2 text-[13px] font-medium text-gray-500 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                Tozalash
              </button>
            )}
          </div>

          {/* Table card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/5">
                    <th className={TH}>O&apos;quvchi</th>
                    <th className={TH}>Guruh</th>
                    <th className={cn(TH, "text-right")}>Summa</th>
                    <th className={cn(TH, "text-right")}>Chegirma</th>
                    <th className={TH}>To&apos;lov turi</th>
                    <th className={TH}>Sana</th>
                    <th className={TH}>Holat</th>
                    <th className={TH}></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                  {loading ? (
                    <tr><td colSpan={8} className="px-4 py-12 text-center text-[13px] text-gray-400 animate-pulse">Yuklanmoqda...</td></tr>
                  ) : payments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center">
                        <Receipt className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-[13px] text-gray-400">To&apos;lov yo&apos;q</p>
                      </td>
                    </tr>
                  ) : payments.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-100">
                      {/* O'quvchi + avatar */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0" style={{ backgroundColor: BRAND }}>
                            {p.lead?.fullName?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">{p.lead?.fullName || "—"}</p>
                            <p className="text-[11px] text-gray-400 font-mono">{p.lead?.phone}</p>
                          </div>
                        </div>
                      </td>

                      {/* Guruh/Kurs */}
                      <td className="px-4 py-3">
                        {p.course?.name || p.group?.name ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#5E2CA5]/8 text-[#5E2CA5]" style={{ backgroundColor: "#5E2CA510" }}>
                            {p.course?.name || p.group?.name}
                          </span>
                        ) : <span className="text-[13px] text-gray-300">—</span>}
                      </td>

                      {/* Summa */}
                      <td className="px-4 py-3 text-right">
                        <span className="text-[14px] font-bold text-emerald-600 whitespace-nowrap">{money(p.amount)} so&apos;m</span>
                      </td>

                      {/* Chegirma */}
                      <td className="px-4 py-3 text-right">
                        {p.discount && Number(p.discount) > 0
                          ? <span className="text-[13px] text-amber-600 font-medium whitespace-nowrap">-{money(p.discount)} so&apos;m</span>
                          : <span className="text-[13px] text-gray-300">—</span>
                        }
                      </td>

                      {/* To'lov turi */}
                      <td className="px-4 py-3">
                        <span className="text-[13px] text-gray-600 dark:text-gray-300 whitespace-nowrap">
                          {METHODS[p.method] || p.method}
                        </span>
                      </td>

                      {/* Sana */}
                      <td className="px-4 py-3 text-[13px] text-gray-400 whitespace-nowrap">
                        {new Date(p.paidAt).toLocaleDateString("ru-RU")}
                        {p.forMonth && <span className="block text-[11px] text-gray-300">{p.forMonth}</span>}
                      </td>

                      {/* Holat badge */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                          To&apos;langan
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`/receipt/${p.id}`} target="_blank" rel="noreferrer"
                            className="px-2 py-1 text-[11px] font-medium rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                          >
                            Chek
                          </a>
                          <button
                            onClick={() => del(p.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── DEBTORS view ── */}
      {view === "debtors" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="month" value={debtMonth} onChange={e => setDebtMonth(e.target.value)}
              className="px-3 py-2 text-[13px] border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E2CA5]/30 transition"
            />
            {(debtors.debtors?.length > 0) && (
              <p className="text-[13px] text-gray-500">
                <span className="font-semibold text-gray-900 dark:text-white">{debtors.debtors.length}</span> qarzdor ·{" "}
                kutilayotgan: <span className="font-semibold text-red-600">{money(debtors.totalExpected)} so&apos;m</span>
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/5">
                    <th className={TH}>O&apos;quvchi</th>
                    <th className={TH}>Guruh</th>
                    <th className={TH}>Kurs</th>
                    <th className={cn(TH, "text-right")}>Oylik</th>
                    <th className={TH}>Holat</th>
                    <th className={TH}></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                  {(debtors.debtors || []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-16 text-center">
                        <p className="text-2xl mb-2">🎉</p>
                        <p className="text-[13px] text-gray-400">Qarzdor yo&apos;q</p>
                      </td>
                    </tr>
                  ) : debtors.debtors.map((d: any) => (
                    <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-100">
                      {/* O'quvchi + avatar */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 bg-red-500">
                            {d.fullName?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-gray-900 dark:text-white">{d.fullName}</p>
                            <p className="text-[11px] text-gray-400 font-mono">{d.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-gray-500 dark:text-gray-400">{d.group || "—"}</td>
                      <td className="px-4 py-3 text-[13px] text-gray-500 dark:text-gray-400">{d.course || "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-[14px] font-bold text-red-600 whitespace-nowrap">{money(d.expected)} so&apos;m</span>
                      </td>
                      {/* Holat: Qarz */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                          Qarz
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => { setPresetLead({ id: d.id, fullName: d.fullName, phone: d.phone }); setShowAdd(true); }}
                          className="px-3 py-1.5 text-[12px] font-semibold rounded-xl bg-[#5E2CA5] hover:bg-[#4a2280] text-white transition-colors"
                        >
                          To&apos;lov
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <AddPaymentModal
          presetLead={presetLead}
          onClose={() => { setShowAdd(false); setPresetLead(null); }}
          onSaved={() => { setShowAdd(false); setPresetLead(null); load(); loadDebtors(); }}
        />
      )}
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

  useEffect(() => {
    fetch("/api/payment-types").then(r => r.json())
      .then(d => setTypes(Array.isArray(d) ? d.filter((t: any) => t.isActive) : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (lead || leadQ.length < 1) { setLeadResults([]); return; }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/leads?search=${encodeURIComponent(leadQ)}&limit=8`);
      setLeadResults((await res.json()).leads || []);
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

  const fieldCls = "w-full px-3 py-2 text-[13px] border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5E2CA5]/30 focus:border-[#5E2CA5]/50 transition";
  const labelCls = "block text-[11px] font-medium text-gray-400 dark:text-gray-500 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-gray-900 dark:text-white">To&apos;lov qabul qilish</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lead picker */}
        <div className="relative">
          <label className={labelCls}>O&apos;quvchi</label>
          {lead ? (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl border border-[#5E2CA5]/30 bg-[#5E2CA5]/5 dark:bg-[#5E2CA5]/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#5E2CA5] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {lead.fullName?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-gray-900 dark:text-white">{lead.fullName}</p>
                  <p className="text-[11px] text-gray-400 font-mono">{lead.phone}</p>
                </div>
              </div>
              <button onClick={() => { setLead(null); setLeadQ(""); }} className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              <input
                value={leadQ} onChange={e => setLeadQ(e.target.value)}
                placeholder="Ism yoki telefon bo'yicha qidiring..."
                className={fieldCls}
              />
              {leadResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                  {leadResults.map(l => (
                    <button key={l.id} onClick={() => { setLead(l); setLeadResults([]); }}
                      className="w-full text-left px-3 py-2 text-[13px] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-white/5 last:border-0">
                      <span className="font-medium text-gray-900 dark:text-white">{l.fullName}</span>{" "}
                      <span className="text-gray-400 font-mono">{l.phone}</span>
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
            <label className={labelCls}>Qaysi oy uchun</label>
            <input type="month" value={forMonth} onChange={e => setForMonth(e.target.value)} className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>Usul</label>
            <select value={method} onChange={e => setMethod(e.target.value)} className={fieldCls}>
              <option value="cash">Naqd</option>
              <option value="card">Karta</option>
              <option value="transfer">O'tkazma</option>
              {types.map((t: any) => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>Turi</label>
          <select value={type} onChange={e => setType(e.target.value)} className={fieldCls}>
            <option value="tuition">Oylik to'lov</option>
            <option value="enrollment">Ro'yxatdan o'tish</option>
            <option value="other">Boshqa</option>
          </select>
        </div>

        <div>
          <label className={labelCls}>Izoh (ixtiyoriy)</label>
          <input value={note} onChange={e => setNote(e.target.value)} className={fieldCls} placeholder="..." />
        </div>

        <div className="flex gap-2 pt-1">
          <Button onClick={save} loading={saving} className="flex-1">Saqlash</Button>
          <Button variant="outline" onClick={onClose}>Bekor</Button>
        </div>
      </div>
    </div>
  );
}
