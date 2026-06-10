"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Users2, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Teacher {
  id: string; fullName: string; username: string; role: string;
  subject: string; salary: number; groupsCount: number; studentsCount: number; groups: string[];
}

function money(v: any) { return Number(v || 0).toLocaleString("ru-RU"); }

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState<Record<string, { salary: string; subject: string }>>({});

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/teachers");
    const data = await res.json();
    setTeachers(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const setEdit = (id: string, field: "salary" | "subject", value: string, t: Teacher) => {
    setEdits((e) => ({ ...e, [id]: { salary: e[id]?.salary ?? String(t.salary || ""), subject: e[id]?.subject ?? t.subject, [field]: value } }));
  };

  const save = async (t: Teacher) => {
    const e = edits[t.id];
    const res = await fetch(`/api/teachers/${t.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salary: Number(e?.salary ?? t.salary) || 0, subject: e?.subject ?? t.subject }),
    });
    if (res.ok) { toast.success("Saqlandi"); load(); }
    else toast.error("Saqlab bo'lmadi (faqat admin)");
  };

  const totalSalary = teachers.reduce((a, t) => a + (Number(edits[t.id]?.salary ?? t.salary) || 0), 0);
  const teaching = teachers.filter((t) => t.groupsCount > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">O'qituvchilar</h1>
        <p className="text-sm text-gray-500 mt-0.5">Yuklama va maosh</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center"><Users2 className="w-5 h-5 text-indigo-600" /></div>
          <div><p className="text-xs text-gray-500">Dars beruvchilar</p><p className="text-xl font-bold text-gray-900 dark:text-white">{teaching}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><Wallet className="w-5 h-5 text-green-600" /></div>
          <div><p className="text-xs text-gray-500">Jami maosh</p><p className="text-lg font-bold text-gray-900 dark:text-white">{money(totalSalary)}</p></div>
        </CardContent></Card>
      </div>

      <Card><CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left font-medium px-4 py-3">Ism</th>
              <th className="text-left font-medium px-4 py-3">Fan</th>
              <th className="text-right font-medium px-4 py-3">Guruh</th>
              <th className="text-right font-medium px-4 py-3">O'quvchi</th>
              <th className="text-left font-medium px-4 py-3">Maosh</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Yuklanmoqda...</td></tr>
            ) : teachers.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Hodim yo'q</td></tr>
            ) : teachers.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 dark:text-white">{t.fullName}</p>
                  <p className="text-xs text-gray-400">@{t.username}</p>
                </td>
                <td className="px-4 py-3">
                  <input value={edits[t.id]?.subject ?? t.subject} onChange={(e) => setEdit(t.id, "subject", e.target.value, t)}
                    placeholder="—" className="w-28 px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                </td>
                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{t.groupsCount}</td>
                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{t.studentsCount}</td>
                <td className="px-4 py-3">
                  <input type="number" value={edits[t.id]?.salary ?? (t.salary || "")} onChange={(e) => setEdit(t.id, "salary", e.target.value, t)}
                    placeholder="0" className="w-32 px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => save(t)}><Save className="w-3.5 h-3.5" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent></Card>
    </div>
  );
}
