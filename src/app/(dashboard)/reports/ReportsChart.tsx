"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const BRAND = "#5E2CA5";

interface CourseStatItem {
  courseId: string | null;
  course: { name: string; color: string } | null;
  count: number;
}

export default function ReportsChart({ courseStats }: { courseStats: CourseStatItem[] }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5">
      <h2 className="text-[14px] font-semibold text-gray-900 dark:text-white mb-4">Kurslar bo&apos;yicha lidlar</h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={courseStats.map(c => ({ name: c.course?.name || "Noma'lum", count: c.count }))}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f5" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={{ stroke: "#f1f1f5" }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #f1f1f5", fontSize: 12 }}
            cursor={{ fill: BRAND, fillOpacity: 0.06 }}
          />
          <Bar dataKey="count" fill={BRAND} radius={[8, 8, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
