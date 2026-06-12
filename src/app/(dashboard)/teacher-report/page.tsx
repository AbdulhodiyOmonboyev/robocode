"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

function money(v: any) { return Number(v || 0).toLocaleString("ru-RU"); }

export default function TeacherReportPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports/teacher-performance").then(r => r.json()).then(d => { setList(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">O'qituvchi samaradorligi</h1>
        <p className="text-sm text-gray-500 mt-0.5">Guruh, o'quvchi, davomat va daromad bo'yicha</p>
      </div>

      <Card><CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left font-medium px-4 py-3">O'qituvchi</th>
              <th className="text-right font-medium px-4 py-3">Guruh</th>
              <th className="text-right font-medium px-4 py-3">O'quvchi</th>
              <th className="text-right font-medium px-4 py-3">Davomat</th>
              <th className="text-right font-medium px-4 py-3">Daromad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Yuklanmoqda...</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Ma'lumot yo'q (guruhlarga o'qituvchi biriktiring)</td></tr>
            ) : list.map((t, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{t.name}</td>
                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{t.groups}</td>
                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{t.students}</td>
                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{t.attendance}%</td>
                <td className="px-4 py-3 text-right font-semibold text-green-600">{money(t.revenue)} so'm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent></Card>
    </div>
  );
}
