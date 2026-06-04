"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp, Bell, GraduationCap, BarChart2, Clock } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LEAD_STATUS_LABELS, LEAD_SOURCE_LABELS } from "@/lib/constants";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  NEW: "#6366f1", CONTACTED: "#f59e0b", INTERESTED: "#f97316",
  TRIAL_BOOKED: "#8b5cf6", TRIAL_COMPLETED: "#06b6d4",
  ENROLLED: "#10b981", POSTPONED: "#9ca3af", LOST: "#f43f5e",
};

interface DashboardData {
  kpis: { totalLeads: number; todayLeads: number; enrolledThisMonth: number; todayReminders: number; conversionRate: string };
  statusDistribution: { status: string; count: number }[];
  sourceDistribution: { source: string; count: number }[];
  leadsByDay: { date: string; count: number }[];
  topCourses: { courseId: string; course: { name: string; color: string } | null; count: number }[];
  recentLeads: any[];
  recentActivities: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data) return <p className="text-center text-gray-500 py-20">Ma'lumot yuklanmadi</p>;

  const kpiCards = [
    { label: "Jami lidlar", value: data.kpis.totalLeads, icon: Users, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" },
    { label: "Bugungi yangi", value: data.kpis.todayLeads, icon: TrendingUp, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Bugun qo'ng'iroq", value: data.kpis.todayReminders, icon: Bell, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
    { label: "Bu oy yozilganlar", value: data.kpis.enrolledThisMonth, icon: GraduationCap, color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20" },
    { label: "Konversiya", value: `${data.kpis.conversionRate}%`, icon: BarChart2, color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Bugungi holat va statistika</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${kpi.color}`}>
                  <kpi.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{kpi.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{kpi.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leads over 30 days */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Lidlar dinamikasi (30 kun)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.leadsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" name="Lidlar" stroke="#6366f1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Pie */}
        <Card>
          <CardHeader>
            <CardTitle>Status taqsimoti</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.statusDistribution} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={75} label={(props: any) => `${((props.percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                  {data.statusDistribution.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || "#9ca3af"} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, (LEAD_STATUS_LABELS as any)[n as string] || n]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Manbalar bo'yicha</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.sourceDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="source" type="category" tick={{ fontSize: 11 }} width={90} tickFormatter={(v) => (LEAD_SOURCE_LABELS as any)[v as string] || v} />
                <Tooltip formatter={(v, n) => [v, "Lidlar"]} />
                <Bar dataKey="count" name="Lidlar" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Top kurslar</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.topCourses.map((c) => ({ name: c.course?.name || "Noma'lum", count: c.count }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Lidlar" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent leads + Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>So'nggi lidlar</CardTitle>
            <Link href="/leads" className="text-xs text-indigo-600 hover:underline">Barchasini →</Link>
          </CardHeader>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.recentLeads.slice(0, 8).map((lead: any) => (
              <Link key={lead.id} href={`/leads/${lead.id}`} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    {lead.fullName.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{lead.fullName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{lead.course?.name || "Kurs tanlanmagan"}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${getStatusClass(lead.status)}`}>
                  {(LEAD_STATUS_LABELS as any)[lead.status]}
                </span>
              </Link>
            ))}
          </div>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>So'nggi faollik</CardTitle>
            <Clock className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-96 overflow-y-auto">
            {data.recentActivities.map((act: any) => (
              <div key={act.id} className="px-6 py-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{act.user.fullName}</span>{" "}
                  <span className="text-gray-500">{activityLabel(act.action)}</span>
                  {act.lead && <span> — <span className="text-indigo-600 dark:text-indigo-400">{act.lead.fullName}</span></span>}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(act.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function getStatusClass(status: string) {
  const map: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-700",
    CONTACTED: "bg-yellow-100 text-yellow-700",
    INTERESTED: "bg-orange-100 text-orange-700",
    TRIAL_BOOKED: "bg-purple-100 text-purple-700",
    TRIAL_COMPLETED: "bg-cyan-100 text-cyan-700",
    ENROLLED: "bg-green-100 text-green-700",
    POSTPONED: "bg-gray-100 text-gray-700",
    LOST: "bg-red-100 text-red-700",
  };
  return map[status] || "bg-gray-100 text-gray-700";
}

function activityLabel(action: string) {
  const map: Record<string, string> = {
    lead_created: "yangi lid qo'shdi",
    status_changed: "statusni o'zgartirdi",
    note_added: "izoh qo'shdi",
    reminder_created: "eslatma yaratdi",
    called: "qo'ng'iroq qildi",
    lead_updated: "ma'lumotni yangiladi",
    lead_deleted: "lidni o'chirdi",
  };
  return map[action] || action;
}
