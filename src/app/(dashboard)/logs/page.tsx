"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

const ACTIONS: Record<string, string> = {
  payment_created: "To'lov qo'shdi",
  payment_deleted: "To'lovni o'chirdi",
  lead_deleted: "Lidni o'chirdi",
  expense_created: "Xarajat qo'shdi",
  expense_deleted: "Xarajatni o'chirdi",
};

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/logs").then(r => r.json()).then(d => { setLogs(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Jurnallar</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kim, qachon, nima qildi</p>
      </div>

      <Card><CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left font-medium px-4 py-3">Sana</th>
              <th className="text-left font-medium px-4 py-3">Kim</th>
              <th className="text-left font-medium px-4 py-3">Amal</th>
              <th className="text-left font-medium px-4 py-3">Obyekt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Yuklanmoqda...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Yozuv yo'q</td></tr>
            ) : logs.map(l => (
              <tr key={l.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{new Date(l.createdAt).toLocaleString("ru-RU")}</td>
                <td className="px-4 py-3 text-gray-900 dark:text-white">{l.userName || "—"}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{ACTIONS[l.action] || l.action}</td>
                <td className="px-4 py-3 text-gray-500">{l.entity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent></Card>
    </div>
  );
}
