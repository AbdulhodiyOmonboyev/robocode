"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { WEEKDAYS } from "@/lib/constants";

const BRAND = "#5E2CA5";

interface Group {
  id: string; name: string; days: string | null; timeFrom: string | null; timeTo: string | null;
  room: string | null; course: { name: string; color: string | null } | null; teacher: { fullName: string } | null;
}

const GRID_DAYS = WEEKDAYS.filter((d) => d.value !== "Sun");

const DAY_NAMES: Record<string, string> = {
  Mon: "Dushanba", Tue: "Seshanba", Wed: "Chorshanba", Thu: "Payshanba", Fri: "Juma", Sat: "Shanba", Sun: "Yakshanba",
};

function hexAlpha(hex: string, alpha: string) {
  return hex.startsWith("#") ? `${hex}${alpha}` : hex;
}

function getWeekRange(offset: number) {
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = (day === 0 ? -6 : 1 - day) + offset * 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  const saturday = new Date(monday);
  saturday.setDate(monday.getDate() + 5);
  const fmt = (d: Date) => d.toLocaleDateString("uz-UZ", { day: "numeric", month: "long" });
  return `${fmt(monday)} – ${fmt(saturday)}`;
}

export default function TimetablePage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupFilter, setGroupFilter] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    fetch("/api/groups").then((r) => r.json()).then((d) => { setGroups(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const filteredGroups = useMemo(
    () => (groupFilter ? groups.filter((g) => g.id === groupFilter) : groups),
    [groups, groupFilter]
  );

  const byDay = (dayVal: string) =>
    filteredGroups
      .filter((g) => (g.days || "").split(",").map((s) => s.trim()).includes(dayVal))
      .sort((a, b) => (a.timeFrom || "").localeCompare(b.timeFrom || ""));

  const timeSlots = useMemo(() => {
    const set = new Set<string>();
    filteredGroups.forEach((g) => { if (g.timeFrom) set.add(g.timeFrom); });
    return Array.from(set).sort();
  }, [filteredGroups]);

  const groupOptions = [
    { value: "", label: "Barcha guruhlar" },
    ...groups.map((g) => ({ value: g.id, label: g.name })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dars jadvali</h1>
          <div className="flex items-center gap-1 mt-1">
            <button
              onClick={() => setWeekOffset((w) => w - 1)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">{getWeekRange(weekOffset)}</span>
            <button
              onClick={() => setWeekOffset((w) => w + 1)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            options={groupOptions}
            className="w-48"
          />
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium text-white shadow-sm transition-colors duration-150"
            style={{ backgroundColor: BRAND }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4a2280")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND)}
          >
            <Plus className="w-4 h-4" /> Dars qo&apos;shish
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-20">Yuklanmoqda...</div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[840px]">
              <thead>
                <tr>
                  <th className="w-24 p-3 text-left text-xs font-medium text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-white/5">
                    Vaqt
                  </th>
                  {GRID_DAYS.map((d) => (
                    <th
                      key={d.value}
                      className="p-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-l border-gray-100 dark:border-white/5 uppercase tracking-wide"
                    >
                      {DAY_NAMES[d.value]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.length === 0 ? (
                  <tr>
                    <td colSpan={GRID_DAYS.length + 1} className="p-12 text-center text-sm text-gray-400">
                      Darslar topilmadi
                    </td>
                  </tr>
                ) : (
                  timeSlots.map((time) => (
                    <tr key={time}>
                      <td className="p-3 text-xs font-medium text-gray-400 dark:text-gray-500 align-top border-b border-gray-100 dark:border-white/5 whitespace-nowrap">
                        {time}
                      </td>
                      {GRID_DAYS.map((d) => {
                        const lessons = byDay(d.value).filter((g) => g.timeFrom === time);
                        return (
                          <td
                            key={d.value}
                            className="p-2 align-top border-b border-l border-gray-100 dark:border-white/5"
                          >
                            <div className="space-y-1.5">
                              {lessons.map((g) => {
                                const color = g.course?.color || "#6366f1";
                                return (
                                  <div
                                    key={g.id}
                                    title={g.teacher ? g.teacher.fullName : undefined}
                                    className="rounded-lg px-2.5 py-1.5 text-xs"
                                    style={{ backgroundColor: hexAlpha(color, "17"), borderLeft: `3px solid ${color}` }}
                                  >
                                    <p className="font-semibold truncate" style={{ color }}>
                                      {g.name}{g.room ? ` / ${g.room}` : ""}
                                    </p>
                                    {(g.timeFrom || g.timeTo) && (
                                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                                        {g.timeFrom}{g.timeTo ? `–${g.timeTo}` : ""}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
