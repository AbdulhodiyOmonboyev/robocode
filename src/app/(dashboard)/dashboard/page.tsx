"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Users, TrendingUp, Bell, GraduationCap, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardData {
  kpis: { totalLeads: number; todayLeads: number; enrolledThisMonth: number; todayReminders: number; conversionRate: string };
  stageDistribution: { stageId: string; name: string; color: string; count: number }[];
  sourceDistribution: { source: string; count: number }[];
  leadsByDay: { date: string; count: number }[];
  topCourses: { courseId: string; course: { name: string; color: string } | null; count: number }[];
  recentLeads: { id: string; fullName: string; course: { name: string } | null; stage: { name: string; color: string } | null }[];
  recentActivities: { id: string; action: string; createdAt: string; user: { fullName: string } | null; lead: { fullName: string } | null }[];
}

const ChartsSkeleton = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 h-80 bg-white dark:bg-gray-900 rounded-2xl animate-pulse" />
      <div className="h-80 bg-white dark:bg-gray-900 rounded-2xl animate-pulse" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white dark:bg-gray-900 rounded-2xl animate-pulse" />)}
    </div>
    <div className="h-48 bg-white dark:bg-gray-900 rounded-2xl animate-pulse" />
  </div>
);

const DashboardCharts = dynamic(() => import("./DashboardCharts"), {
  ssr: false,
  loading: ChartsSkeleton,
});

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F6FA] dark:bg-gray-950 p-3 sm:p-4 lg:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-white dark:bg-gray-900 rounded-2xl animate-pulse" />
          ))}
        </div>
        <ChartsSkeleton />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#F5F6FA] dark:bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Ma&apos;lumot yuklanmadi</p>
      </div>
    );
  }

  const kpiCards = [
    {
      label: "Jami lidlar", value: data.kpis.totalLeads,
      badge: `+${data.kpis.todayLeads} bugun`, icon: Users,
      chipBg: "bg-[#5E2CA5]/10 dark:bg-[#5E2CA5]/20", chipColor: "text-[#5E2CA5]",
    },
    {
      label: "Bu oy yozilganlar", value: data.kpis.enrolledThisMonth,
      badge: `${data.kpis.conversionRate}% konversiya`, icon: GraduationCap,
      chipBg: "bg-emerald-500/10 dark:bg-emerald-500/20", chipColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Bugungi yangi lidlar", value: data.kpis.todayLeads,
      badge: "yangi bugun", icon: TrendingUp,
      chipBg: "bg-amber-500/10 dark:bg-amber-500/20", chipColor: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Bugun qo'ng'iroqlar", value: data.kpis.todayReminders,
      badge: "eslatma", icon: Bell,
      chipBg: "bg-sky-500/10 dark:bg-sky-500/20", chipColor: "text-sky-600 dark:text-sky-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F6FA] dark:bg-gray-950 p-3 sm:p-4 lg:p-6 space-y-5 sm:space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Bugungi holat va statistika</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
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

      {/* Charts + feeds (lazy loaded) */}
      <DashboardCharts data={data} />
    </div>
  );
}
