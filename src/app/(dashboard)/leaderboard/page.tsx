"use client";

import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function LeaderboardPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard").then(r => r.json()).then(d => { setList(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const medal = (i: number) => (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reyting</h1>
        <p className="text-sm text-gray-500 mt-0.5">Tanga bo'yicha o'quvchilar reytingi</p>
      </div>

      <Card><CardContent className="p-0 divide-y divide-gray-100 dark:divide-gray-800">
        {loading ? (
          <div className="px-4 py-8 text-center text-gray-400">Yuklanmoqda...</div>
        ) : list.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400">Hali tanga berilmagan</div>
        ) : list.map((l, i) => (
          <div key={l.id} className="flex items-center gap-4 px-4 py-3">
            <div className="w-8 text-center font-bold text-gray-500">{medal(i)}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">{l.fullName}</p>
              {l.group?.name && <p className="text-xs text-gray-400">{l.group.name}</p>}
            </div>
            <div className="flex items-center gap-1.5 text-amber-600 font-bold">
              <Trophy className="w-4 h-4" /> {l.coins}
            </div>
          </div>
        ))}
      </CardContent></Card>
    </div>
  );
}
