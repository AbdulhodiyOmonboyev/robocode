"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp, Bell, GraduationCap, BarChart2, Clock, ArrowUpRight } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { LEAD_SOURCE_LABELS } from "@/lib/constants";
import { formatRelativeTime } from "@/lib/utils";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardData {
  kpis: { totalLeads: number; todayLeads: number; enrolledThisMonth: number; todayReminders: number; conversionRate: string };
  stageDistribution: { stageId: string; name: string; color: string; count: number }[];
  sourceDistribution: { source: string; count: number }[];
  leadsByDay: { date: string; count: number }[];
  topCourses: { courseId: string; course: { name: string; color: string } | null; count: number }[];
  recentLeads: any[];
  recentActivities: any[];
}

const BRAND = "#5E2CA5";

function getInitial(name: string) {
  return name?.charAt(0)?.toUpperCase() ?? "?";
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
      <div className="min-h-screen bg-[#F5F6FA] dark:bg-gray-950 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-white dark:bg-gray-900 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-80 bg-white dark:bg-gray-900 rounded-2xl animate-pulse" />
          <div className="h-80 bg-white dark:bg-gray-900 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#F5F6FA] dark:bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Ma'lumot yuklanmadi</p>
      </div>
    );
  }

  const kpiCards = [
    {
      label: "Jami lidlar",
      value: data.kpis.totalLeads,
      badge: `+${data.kpis.todayLeads} bugun`,
      icon: Users,
      chipBg: "bg-[#5E2CA5]/10 dark:bg-[#5E2CA5]/20",
      chipColor: "text-[#5E2CA5]",
    },
    {
      label: "Bu oy yozilganlar",
      value: data.kpis.enrolledThisMonth,
      badge: `${data.kpis.conversionRate}% konversiya`,
      icon: GraduationCap,
      chipBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      chipColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Bugungi yangi lidlar",
      value: data.kpis.todayLeads,
      badge: "yangi bugun",
      icon: TrendingUp,
      chipBg: "bg-amber-500/10 dark:bg-amber-500/20",
      chipColor: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Bugun qo'ng'iroqlar",
      value: data.kpis.todayReminders,
      badge: "eslatma",
      icon: Bell,
      chipBg: "bg-sky-500/10 dark:bg-sky-500/20",
      chipColor: "text-sky-600 dark:text-sky-400",
    },
  ];

  const activeStages = data.stageDistribution.filter((s) => s.count > 0);

  return (
    <div
      className="min-h-screen bg-[#F5F6FA] dark:bg-gray-950 p-6 space-y-6"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Bugungi holat va statistika</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", kpi.chipBg)}>
                  <Icon className={cn("w-5 h-5", kpi.chipColor)} />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3 h-3" />
                  {kpi.badge}
                </span>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white leading-none">{kpi.value}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main 2-column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Big chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Lidlar dinamikasi</h2>
              <p className="text-xs text-gray-400 mt-0.5">So'nggi 30 kun</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data.leadsByDay} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="brandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BRAND} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={BRAND} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", fontSize: 12 }}
                cursor={{ stroke: BRAND, strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Area type="monotone" dataKey="count" name="Lidlar" stroke={BRAND} strokeWidth={2} fill="url(#brandGrad)" dot={false} activeDot={{ r: 4, fill: BRAND }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent leads */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">So'nggi lidlar</h2>
              <p className="text-xs text-gray-400 mt-0.5">Oxirgi qo'shilganlar</p>
            </div>
            <Link href="/leads" className="text-[11px] font-medium text-[#5E2CA5] hover:underline flex items-center gap-0.5">
              Barchasi <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-white/5">
            {data.recentLeads.slice(0, 8).map((lead: any) => (
              <Link
                key={lead.id}
                href={`/leads/${lead.id}`}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-150"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold"
                  style={{ backgroundColor: BRAND }}
                >
                  {getInitial(lead.fullName)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">{lead.fullName}</p>
                  <p className="text-[11px] text-gray-400 truncate">{lead.course?.name ?? "Kurs tanlanmagan"}</p>
                </div>
                {lead.stage && (
                  <span
                    className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: lead.stage.color }}
                  >
                    {lead.stage.name}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Second row: Sources + Stage + Top courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Sources */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Manbalar</h2>
          <p className="text-xs text-gray-400 mb-4">Qayerdan kelmoqda</p>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={data.sourceDistribution} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis
                dataKey="source"
                type="category"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                width={80}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => (LEAD_SOURCE_LABELS as Record<string, string>)[v] ?? v}
              />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", fontSize: 12 }}
                cursor={{ fill: "#f5f3ff" }}
                formatter={(v) => [v, "Lidlar"]}
              />
              <Bar dataKey="count" name="Lidlar" fill={BRAND} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stage distribution */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Bosqich taqsimoti</h2>
          <p className="text-xs text-gray-400 mb-4">Lidlar holati</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={activeStages}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
              >
                {activeStages.map((entry) => (
                  <Cell key={entry.stageId} fill={entry.color || "#9ca3af"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", fontSize: 12 }}
                formatter={(v, n) => [v, n]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
            {activeStages.slice(0, 4).map((s) => (
              <div key={s.stageId} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-[10px] text-gray-500 dark:text-gray-400">{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top courses */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Top kurslar</h2>
          <p className="text-xs text-gray-400 mb-4">Eng ko'p tanlanganlar</p>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart
              data={data.topCourses.map((c) => ({ name: c.course?.name ?? "Noma'lum", count: c.count }))}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", fontSize: 12 }}
                cursor={{ fill: "#f5f3ff" }}
              />
              <Bar dataKey="count" name="Lidlar" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity feed */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">So'nggi faollik</h2>
            <p className="text-xs text-gray-400 mt-0.5">Tizimda bo'lgan amallar</p>
          </div>
          <Clock className="w-4 h-4 text-gray-300 dark:text-gray-600" />
        </div>
        <div className="divide-y divide-gray-50 dark:divide-white/5 max-h-72 overflow-y-auto">
          {data.recentActivities.map((act: any) => (
            <div key={act.id} className="flex items-start gap-3 px-6 py-3">
              <div
                className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-semibold"
                style={{ backgroundColor: BRAND }}
              >
                {getInitial(act.user?.fullName ?? "?")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-gray-700 dark:text-gray-300">
                  <span className="font-medium text-gray-900 dark:text-white">{act.user?.fullName}</span>{" "}
                  <span className="text-gray-400">{activityLabel(act.action)}</span>
                  {act.lead && (
                    <span>
                      {" — "}
                      <span className="text-[#5E2CA5] dark:text-purple-400">{act.lead.fullName}</span>
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">{formatRelativeTime(act.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function activityLabel(action: string): string {
  const map: Record<string, string> = {
    lead_created: "yangi lid qo'shdi",
    status_changed: "statusni o'zgartirdi",
    note_added: "izoh qo'shdi",
    reminder_created: "eslatma yaratdi",
    called: "qo'ng'iroq qildi",
    lead_updated: "ma'lumotni yangiladi",
    lead_deleted: "lidni o'chirdi",
  };
  return map[action] ?? action;
}
