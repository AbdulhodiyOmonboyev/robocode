"use client";

import { useState, useEffect } from "react";
import { Users, GraduationCap, Wallet, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function money(v: any) { return Number(v || 0).toLocaleString("ru-RU"); }

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics").then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) return <div className="text-center text-gray-400 py-20">Yuklanmoqda...</div>;
  if (!data) return <div className="text-center text-gray-400 py-20">Ma'lumot yo'q</div>;

  const maxRev = Math.max(1, ...data.monthly.map((m: any) => m.revenue));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analitika</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manba, menejer va daromad tahlili</p>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center"><Users className="w-5 h-5 text-indigo-600" /></div>
          <div><p className="text-xs text-gray-500">Jami lidlar</p><p className="text-xl font-bold text-gray-900 dark:text-white">{data.totals.leads}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><GraduationCap className="w-5 h-5 text-green-600" /></div>
          <div><p className="text-xs text-gray-500">O'qishga yozildi</p><p className="text-xl font-bold text-gray-900 dark:text-white">{data.totals.enrolled}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"><Wallet className="w-5 h-5 text-amber-600" /></div>
          <div><p className="text-xs text-gray-500">Jami daromad</p><p className="text-lg font-bold text-gray-900 dark:text-white">{money(data.totals.revenue)}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-violet-600" /></div>
          <div><p className="text-xs text-gray-500">Prognoz (keyingi oy)</p><p className="text-lg font-bold text-gray-900 dark:text-white">{money(data.forecast)}</p></div>
        </CardContent></Card>
      </div>

      {/* Monthly revenue */}
      <Card>
        <CardHeader><CardTitle>Oylik daromad (6 oy)</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 h-48">
            {data.monthly.map((m: any) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center" style={{ height: "150px" }}>
                  <div className="w-full max-w-[48px] bg-indigo-500 rounded-t-lg transition-all" style={{ height: `${(m.revenue / maxRev) * 100}%`, minHeight: m.revenue > 0 ? "4px" : "0" }} title={money(m.revenue)} />
                </div>
                <span className="text-[10px] text-gray-500">{m.month.slice(5)}</span>
                <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">{m.revenue >= 1000000 ? (m.revenue / 1000000).toFixed(1) + "M" : Math.round(m.revenue / 1000) + "k"}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By source */}
        <Card>
          <CardHeader><CardTitle>Manba bo'yicha</CardTitle></CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs uppercase">
                <tr><th className="text-left font-medium px-4 py-2.5">Manba</th><th className="text-right font-medium px-4 py-2.5">Lid</th><th className="text-right font-medium px-4 py-2.5">Yozildi</th><th className="text-right font-medium px-4 py-2.5">Konv.</th><th className="text-right font-medium px-4 py-2.5">Daromad</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.bySource.map((s: any) => (
                  <tr key={s.source}>
                    <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">{s.source}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600 dark:text-gray-300">{s.count}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600 dark:text-gray-300">{s.enrolled}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600 dark:text-gray-300">{s.conversion}%</td>
                    <td className="px-4 py-2.5 text-right font-medium text-green-600">{money(s.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* By manager */}
        <Card>
          <CardHeader><CardTitle>Menejerlar reytingi</CardTitle></CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs uppercase">
                <tr><th className="text-left font-medium px-4 py-2.5">Menejer</th><th className="text-right font-medium px-4 py-2.5">Lid</th><th className="text-right font-medium px-4 py-2.5">Yozildi</th><th className="text-right font-medium px-4 py-2.5">Konv.</th><th className="text-right font-medium px-4 py-2.5">Daromad</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.byManager.map((m: any, i: number) => (
                  <tr key={i}>
                    <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">{m.name}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600 dark:text-gray-300">{m.total}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600 dark:text-gray-300">{m.enrolled}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600 dark:text-gray-300">{m.conversion}%</td>
                    <td className="px-4 py-2.5 text-right font-medium text-green-600">{money(m.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
