"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, TrendingUp, Users, DollarSign, GraduationCap } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LEAD_STATUS_LABELS, LEAD_SOURCE_LABELS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  NEW:"#6366f1",CONTACTED:"#f59e0b",INTERESTED:"#f97316",TRIAL_BOOKED:"#8b5cf6",
  TRIAL_COMPLETED:"#06b6d4",ENROLLED:"#10b981",POSTPONED:"#9ca3af",LOST:"#f43f5e",
};

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const res = await fetch(`/api/reports?${params}`);
    if (res.ok) setData(await res.json());
    setLoading(false);
  }, [from, to]);

  useEffect(() => { load(); }, [load]);

  const exportCSV = async () => {
    const res = await fetch("/api/reports/export");
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "leads.csv"; a.click();
    }
  };

  const kpis = data ? [
    { label: "Jami lidlar", value: data.totalLeads, icon: Users, color: "text-indigo-600 bg-indigo-50" },
    { label: "Yozilganlar", value: data.enrolledCount, icon: GraduationCap, color: "text-emerald-600 bg-emerald-50" },
    { label: "Konversiya", value: `${data.conversionRate}%`, icon: TrendingUp, color: "text-purple-600 bg-purple-50" },
    { label: "Haqiqiy daromad", value: formatCurrency(data.actualRevenue), icon: DollarSign, color: "text-amber-600 bg-amber-50" },
    { label: "Potentsial daromad", value: formatCurrency(data.potentialRevenue), icon: DollarSign, color: "text-cyan-600 bg-cyan-50" },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hisobotlar</h1>
          <p className="text-sm text-gray-500 mt-0.5">Statistika va analitika</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input type="date" value={from} onChange={e=>setFrom(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          <span className="text-gray-400">—</span>
          <input type="date" value={to} onChange={e=>setTo(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          <Button variant="outline" size="sm" onClick={exportCSV}><Download className="w-4 h-4"/> CSV</Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">{Array.from({length:5}).map((_,i)=><div key={i} className="h-24 bg-white dark:bg-gray-900 rounded-2xl animate-pulse"/>)}</div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {kpis.map(k => (
              <Card key={k.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${k.color}`}>
                      <k.icon className="w-5 h-5"/>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{k.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{k.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Status distribution */}
            <Card>
              <CardHeader><CardTitle>Holat bo'yicha</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={data.statusDistribution} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label={(props:any)=>`${((props.percent??0)*100).toFixed(0)}%`} labelLine={false}>
                      {data.statusDistribution.map((e:any) => <Cell key={e.status} fill={STATUS_COLORS[e.status]||"#9ca3af"}/>)}
                    </Pie>
                    <Tooltip formatter={(v:any,n:any)=>[v, LEAD_STATUS_LABELS[n as keyof typeof LEAD_STATUS_LABELS]||n]}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 flex flex-wrap gap-2 justify-center">
                  {data.statusDistribution.map((s:any) => (
                    <div key={s.status} className="flex items-center gap-1 text-xs text-gray-600">
                      <span className="w-2 h-2 rounded-full" style={{backgroundColor:STATUS_COLORS[s.status]}}/>
                      {LEAD_STATUS_LABELS[s.status as keyof typeof LEAD_STATUS_LABELS]} ({s.count})
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Source distribution */}
            <Card>
              <CardHeader><CardTitle>Manbalar bo'yicha</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.sourceDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                    <XAxis type="number" tick={{fontSize:11}}/>
                    <YAxis dataKey="source" type="category" width={110} tick={{fontSize:10}} tickFormatter={(v)=>LEAD_SOURCE_LABELS[v as keyof typeof LEAD_SOURCE_LABELS]||v}/>
                    <Tooltip formatter={(v:any)=>[v,"Lidlar"]}/>
                    <Bar dataKey="count" fill="#6366f1" radius={[0,4,4,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Course stats */}
            <Card>
              <CardHeader><CardTitle>Kurslar bo'yicha lidlar</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.courseStats.map((c:any)=>({name:c.course?.name||"Noma'lum",count:c.count}))}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name" tick={{fontSize:10}}/>
                    <YAxis tick={{fontSize:11}}/>
                    <Tooltip/>
                    <Bar dataKey="count" fill="#10b981" radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Employee stats */}
            <Card>
              <CardHeader><CardTitle>Hodimlar samaradorligi</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.userStats.sort((a:any,b:any)=>b.totalLeads-a.totalLeads).map((u:any) => (
                    <div key={u.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-xs font-bold text-indigo-700">
                        {u.fullName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{u.fullName}</span>
                          <span className="text-xs text-gray-500 ml-2">{u.totalLeads} lid</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                          <div className="bg-indigo-500 h-1.5 rounded-full" style={{width:`${Math.min((u.totalLeads/(data.totalLeads||1))*100,100)}%`}}/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
