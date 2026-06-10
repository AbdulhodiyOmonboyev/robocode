"use client";

import { useState, useEffect } from "react";
import { Clock, MapPin, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { WEEKDAYS } from "@/lib/constants";

interface Group {
  id: string; name: string; days: string | null; timeFrom: string | null; timeTo: string | null;
  room: string | null; course: { name: string; color: string | null } | null; teacher: { fullName: string } | null;
}

export default function TimetablePage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/groups").then((r) => r.json()).then((d) => { setGroups(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const byDay = (dayVal: string) =>
    groups
      .filter((g) => (g.days || "").split(",").map((s) => s.trim()).includes(dayVal))
      .sort((a, b) => (a.timeFrom || "").localeCompare(b.timeFrom || ""));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dars jadvali</h1>
        <p className="text-sm text-gray-500 mt-0.5">Hafta bo'yicha guruhlar darslari</p>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-20">Yuklanmoqda...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {WEEKDAYS.map((d) => {
            const list = byDay(d.value);
            return (
              <Card key={d.value}>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center justify-between">
                    {fullDay(d.value)}
                    <span className="text-xs font-normal text-gray-400">{list.length}</span>
                  </h3>
                  <div className="space-y-2">
                    {list.length === 0 ? (
                      <p className="text-xs text-gray-400 py-2">Dars yo'q</p>
                    ) : list.map((g) => (
                      <div key={g.id} className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700"
                        style={{ borderLeftWidth: "3px", borderLeftColor: g.course?.color || "#6366f1" }}>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{g.name}</p>
                        <div className="mt-1 space-y-0.5 text-xs text-gray-500">
                          {(g.timeFrom || g.timeTo) && <p className="flex items-center gap-1"><Clock className="w-3 h-3" /> {g.timeFrom}{g.timeTo ? `–${g.timeTo}` : ""}</p>}
                          {g.room && <p className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {g.room}</p>}
                          {g.teacher && <p className="flex items-center gap-1"><User className="w-3 h-3" /> {g.teacher.fullName}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function fullDay(v: string) {
  const map: Record<string, string> = { Mon: "Dushanba", Tue: "Seshanba", Wed: "Chorshanba", Thu: "Payshanba", Fri: "Juma", Sat: "Shanba", Sun: "Yakshanba" };
  return map[v] || v;
}
