"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function money(v: any) { return Number(v || 0).toLocaleString("ru-RU"); }
function short(v: number) { return v >= 1000000 ? (v / 1000000).toFixed(1) + "M" : Math.round(v / 1000) + "k"; }

export default function CashflowPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cashflow").then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) return <div className="text-center text-gray-400 py-20">Yuklanmoqda...</div>;
  if (!data || !data.months) return <div className="text-center text-gray-400 py-20">Ma'lumot yo'q</div>;

  const max = Math.max(1, ...data.months.flatMap((m: any) => [m.income, m.outflow]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pul oqimi</h1>
        <p className="text-sm text-gray-500 mt-0.5">Daromad, chiqim va sof foyda (6 oy)</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-green-600" /></div>
          <div><p className="text-xs text-gray-500">Jami daromad</p><p className="text-lg font-bold text-gray-900 dark:text-white">{money(data.totals.income)}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center"><TrendingDown className="w-5 h-5 text-red-600" /></div>
          <div><p className="text-xs text-gray-500">Jami chiqim</p><p className="text-lg font-bold text-gray-900 dark:text-white">{money(data.totals.outflow)}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center"><Wallet className="w-5 h-5 text-indigo-600" /></div>
          <div><p className="text-xs text-gray-500">Sof foyda</p><p className={`text-lg font-bold ${data.totals.profit >= 0 ? "text-green-600" : "text-red-600"}`}>{money(data.totals.profit)}</p></div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Oylar kesimida (yashil — daromad, qizil — chiqim)</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-52">
            {data.months.map((m: any) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end justify-center gap-1" style={{ height: "160px" }}>
                  <div className="w-1/2 max-w-[26px] bg-green-500 rounded-t" style={{ height: `${(m.income / max) * 100}%`, minHeight: m.income > 0 ? "3px" : "0" }} title={`Daromad: ${money(m.income)}`} />
                  <div className="w-1/2 max-w-[26px] bg-red-500 rounded-t" style={{ height: `${(m.outflow / max) * 100}%`, minHeight: m.outflow > 0 ? "3px" : "0" }} title={`Chiqim: ${money(m.outflow)}`} />
                </div>
                <span className="text-[10px] text-gray-500">{m.month.slice(5)}</span>
                <span className={`text-[10px] font-medium ${m.profit >= 0 ? "text-green-600" : "text-red-600"}`}>{short(m.profit)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card><CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left font-medium px-4 py-3">Oy</th>
              <th className="text-right font-medium px-4 py-3">Daromad</th>
              <th className="text-right font-medium px-4 py-3">Chiqim</th>
              <th className="text-right font-medium px-4 py-3">Sof foyda</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.months.map((m: any) => (
              <tr key={m.month} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{m.month}</td>
                <td className="px-4 py-3 text-right text-green-600">{money(m.income)}</td>
                <td className="px-4 py-3 text-right text-red-600">{money(m.outflow)}</td>
                <td className={`px-4 py-3 text-right font-semibold ${m.profit >= 0 ? "text-green-600" : "text-red-600"}`}>{money(m.profit)} so'm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent></Card>
    </div>
  );
}
