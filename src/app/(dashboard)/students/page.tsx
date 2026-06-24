"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { cn, getInitials, formatDate, formatPhone, phoneToTel } from "@/lib/utils";

const BRAND = "#5E2CA5";

interface Student {
  id: string; fullName: string; phone: string;
  createdAt: string; enrolledAt: string | null;
  course: { id: string; name: string; color: string | null } | null;
  group: { id: string; name: string } | null;
}

const TH = "px-4 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide whitespace-nowrap";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ status: "ENROLLED", page: String(page), limit: "20" });
    if (search) params.set("search", search);
    const res = await fetch(`/api/leads?${params}`);
    if (res.ok) {
      const data = await res.json();
      setStudents(data.leads || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    }
    setLoading(false);
  }, [search, page]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="min-h-screen bg-[#F5F6FA] dark:bg-gray-950 p-6 space-y-5" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">O&apos;quvchilar</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Ro&apos;yxatga olingan o&apos;quvchilar</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Ism yoki telefon..."
            className="pl-9 pr-4 py-2 text-[13px] border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 w-60 focus:outline-none focus:ring-2 focus:ring-[#5E2CA5]/30 focus:border-[#5E2CA5]/50 transition"
          />
        </div>
      </div>

      {/* KPI card */}
      <div className="max-w-xs">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#5E2CA5]/10 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-[#5E2CA5]" />
          </div>
          <div>
            <p className="text-[12px] text-gray-400 mb-0.5">Jami talaba</p>
            <p className="text-[22px] font-bold text-gray-900 dark:text-white leading-tight">{total}</p>
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-[13px] text-gray-400 animate-pulse">Yuklanmoqda...</div>
        ) : students.length === 0 ? (
          <div className="py-16 text-center">
            <GraduationCap className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-[13px] text-gray-400">O&apos;quvchi topilmadi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  <th className={TH}>O&apos;quvchi</th>
                  <th className={TH}>Telefon</th>
                  <th className={TH}>Kurs</th>
                  <th className={TH}>Guruh</th>
                  <th className={TH}>Ro&apos;yxatdan o&apos;tgan sana</th>
                  <th className={TH}>Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/60 dark:hover:bg-white/5 transition-colors duration-100">

                    {/* O'quvchi + avatar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                          style={{ backgroundColor: BRAND }}
                        >
                          {getInitials(s.fullName)}
                        </div>
                        <Link
                          href={`/leads/${s.id}`}
                          className="text-[13px] font-medium text-gray-900 dark:text-white hover:text-[#5E2CA5] transition-colors truncate"
                        >
                          {s.fullName}
                        </Link>
                      </div>
                    </td>

                    {/* Telefon */}
                    <td className="px-4 py-3">
                      <a href={phoneToTel(s.phone)} className="text-[13px] text-gray-500 dark:text-gray-400 font-mono hover:text-[#5E2CA5] transition-colors">
                        {formatPhone(s.phone)}
                      </a>
                    </td>

                    {/* Kurs */}
                    <td className="px-4 py-3">
                      {s.course ? (
                        <span
                          className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: (s.course.color || BRAND) + "18", color: s.course.color || BRAND }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.course.color || BRAND }} />
                          {s.course.name}
                        </span>
                      ) : <span className="text-[13px] text-gray-300">—</span>}
                    </td>

                    {/* Guruh */}
                    <td className="px-4 py-3 text-[13px] text-gray-500 dark:text-gray-400">
                      {s.group?.name || <span className="text-gray-300">—</span>}
                    </td>

                    {/* Ro'yxatdan o'tgan sana */}
                    <td className="px-4 py-3 text-[13px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                      {formatDate(s.enrolledAt || s.createdAt)}
                    </td>

                    {/* Holat badge */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        Yozilgan
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="px-5 py-3 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
            <span className="text-[13px] text-gray-400">
              {total} ta natijadan {((page - 1) * 20) + 1}–{Math.min(page * 20, total)} ko&apos;rsatilmoqda
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page <= 1}
                className="p-2 rounded-xl border border-gray-200 dark:border-white/10 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
              <span className="text-[13px] text-gray-500 px-1">{page} / {pages}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= pages}
                className="p-2 rounded-xl border border-gray-200 dark:border-white/10 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
