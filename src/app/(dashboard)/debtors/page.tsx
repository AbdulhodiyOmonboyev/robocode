"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { AlertCircle, Send, Users2 } from "lucide-react";
import { cn, getInitials, formatPhone, phoneToTel } from "@/lib/utils";

const BRAND = "#5E2CA5";

interface Debtor {
  id: string;
  fullName: string;
  phone: string;
  group: string | null;
  course: string | null;
  courseColor: string | null;
  expected: number;
  lastPaymentAt: string | null;
}

function money(v: any) { return Number(v || 0).toLocaleString("ru-RU"); }
function ym(d: Date) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; }

export default function DebtorsPage() {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [totalExpected, setTotalExpected] = useState(0);
  const [month, setMonth] = useState(ym(new Date()));
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/debtors?month=${month}`);
    if (res.ok) {
      const d = await res.json();
      setDebtors(d.debtors || []);
      setTotalExpected(d.totalExpected || 0);
    }
    setLoading(false);
  }, [month]);

  useEffect(() => { load(); }, [load]);

  const sendReminder = async (debtor: Debtor) => {
    setSendingId(debtor.id);
    const text = `Salom, ${debtor.fullName}! ${month} oyi uchun to'lov muddati o'tdi. Iltimos, ${money(debtor.expected)} so'm to'lovni amalga oshiring.`;
    const res = await fetch(`/api/leads/${debtor.id}/notify`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setSendingId(null);
    if (res.ok) toast.success(`${debtor.fullName} ga eslatma yuborildi`);
    else {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error || "Yuborilmadi");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] dark:bg-gray-950 p-6 space-y-5" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Qarzdorlar</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">To&apos;lovi kechikkan o&apos;quvchilar ro&apos;yxati</p>
        </div>
        <input
          type="month" value={month} onChange={e => setMonth(e.target.value)}
          className="px-3 py-2 text-[13px] border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E2CA5]/30 focus:border-[#5E2CA5]/50 transition"
        />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-[12px] text-gray-400 mb-0.5">Jami qarzdorlik ({month})</p>
            <p className="text-[20px] font-bold text-red-600 dark:text-red-400 leading-tight">
              {money(totalExpected)} <span className="text-[13px] font-normal text-gray-400">so&apos;m</span>
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#5E2CA5]/10 flex items-center justify-center flex-shrink-0">
            <Users2 className="w-5 h-5 text-[#5E2CA5]" />
          </div>
          <div>
            <p className="text-[12px] text-gray-400 mb-0.5">Qarzdorlar soni</p>
            <p className="text-[22px] font-bold text-gray-900 dark:text-white leading-tight">{debtors.length}</p>
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-[13px] text-gray-400 animate-pulse">Yuklanmoqda...</div>
        ) : debtors.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-2xl mb-2">🎉</p>
            <p className="text-[13px] text-gray-400">Bu oyda qarzdor yo&apos;q</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide whitespace-nowrap">O&apos;quvchi</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide whitespace-nowrap">Guruh / Kurs</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide whitespace-nowrap">Qarz summasi</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide whitespace-nowrap">Oxirgi to&apos;lov</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide whitespace-nowrap"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {debtors.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50/60 dark:hover:bg-white/5 transition-colors duration-100">

                    {/* O'quvchi + avatar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                          style={{ backgroundColor: BRAND }}
                        >
                          {getInitials(d.fullName)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">{d.fullName}</p>
                          <a href={phoneToTel(d.phone)} className="text-[11px] text-gray-400 font-mono hover:text-[#5E2CA5] transition-colors">
                            {formatPhone(d.phone)}
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Guruh / Kurs */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {d.group && <span className="text-[13px] text-gray-700 dark:text-gray-300">{d.group}</span>}
                        {d.course && (
                          <span
                            className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full w-fit"
                            style={{ backgroundColor: (d.courseColor || BRAND) + "18", color: d.courseColor || BRAND }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.courseColor || BRAND }} />
                            {d.course}
                          </span>
                        )}
                        {!d.group && !d.course && <span className="text-[13px] text-gray-300">—</span>}
                      </div>
                    </td>

                    {/* Qarz summasi */}
                    <td className="px-4 py-3 text-right">
                      <span className="text-[14px] font-bold text-red-600 dark:text-red-400 whitespace-nowrap">
                        {money(d.expected)} so&apos;m
                      </span>
                    </td>

                    {/* Oxirgi to'lov sanasi */}
                    <td className="px-4 py-3 text-[13px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                      {d.lastPaymentAt
                        ? new Date(d.lastPaymentAt).toLocaleDateString("ru-RU")
                        : <span className="text-gray-300">Hech qachon</span>
                      }
                    </td>

                    {/* Eslatma yuborish */}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => sendReminder(d)}
                        disabled={sendingId === d.id}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-colors whitespace-nowrap",
                          "bg-[#5E2CA5] hover:bg-[#4a2280] text-white disabled:opacity-60"
                        )}
                      >
                        <Send className="w-3.5 h-3.5" />
                        {sendingId === d.id ? "Yuborilmoqda..." : "Eslatma yuborish"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
