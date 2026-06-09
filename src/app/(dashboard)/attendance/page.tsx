"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Check, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Student { leadId: string; fullName: string; phone: string; status: string | null; }

const STATUSES = [
  { key: "present", label: "Keldi", cls: "bg-green-600 text-white", off: "text-green-700 border-green-300" },
  { key: "late", label: "Kech", cls: "bg-amber-500 text-white", off: "text-amber-700 border-amber-300" },
  { key: "excused", label: "Sababli", cls: "bg-blue-600 text-white", off: "text-blue-700 border-blue-300" },
  { key: "absent", label: "Kelmadi", cls: "bg-red-600 text-white", off: "text-red-700 border-red-300" },
];

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function AttendancePage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [groupId, setGroupId] = useState("");
  const [date, setDate] = useState(todayStr());
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/groups").then(r => r.json()).then(d => {
      const list = Array.isArray(d) ? d : [];
      setGroups(list);
      if (list.length && !groupId) setGroupId(list[0].id);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async () => {
    if (!groupId || !date) return;
    setLoading(true);
    const res = await fetch(`/api/attendance?groupId=${groupId}&date=${date}`);
    const data = await res.json();
    setStudents(data.students || []);
    setLoading(false);
  }, [groupId, date]);

  useEffect(() => { load(); }, [load]);

  const setStatus = (leadId: string, status: string) => {
    setStudents(prev => prev.map(s => s.leadId === leadId ? { ...s, status } : s));
  };
  const setAll = (status: string) => setStudents(prev => prev.map(s => ({ ...s, status })));

  const save = async () => {
    const records = students.filter(s => s.status).map(s => ({ leadId: s.leadId, status: s.status! }));
    if (!records.length) { toast.error("Hech bo'lmasa bittasini belgilang"); return; }
    setSaving(true);
    const res = await fetch("/api/attendance", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId, date, records }),
    });
    setSaving(false);
    res.ok ? toast.success("Davomat saqlandi") : toast.error("Saqlab bo'lmadi");
  };

  const counts = STATUSES.map(st => students.filter(s => s.status === st.key).length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Davomat</h1>
        <p className="text-sm text-gray-500 mt-0.5">Guruh bo'yicha dars davomati</p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Guruh</label>
          <select value={groupId} onChange={e => setGroupId(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none min-w-[180px]">
            {groups.length === 0 && <option value="">Guruh yo'q</option>}
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Sana</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <Button variant="outline" size="sm" onClick={() => setAll("present")}><Check className="w-4 h-4" /> Hammasi keldi</Button>
      </div>

      {students.length > 0 && (
        <div className="flex flex-wrap gap-2 text-sm">
          {STATUSES.map((st, i) => (
            <span key={st.key} className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">{st.label}: <b>{counts[i]}</b></span>
          ))}
        </div>
      )}

      <Card><CardContent className="p-0 divide-y divide-gray-100 dark:divide-gray-800">
        {loading ? (
          <div className="px-4 py-8 text-center text-gray-400">Yuklanmoqda...</div>
        ) : students.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400">Bu guruhda o'quvchi yo'q. Avval lidlarni guruhga qo'shing.</div>
        ) : students.map(s => (
          <div key={s.leadId} className="flex items-center justify-between gap-3 px-4 py-3 flex-wrap">
            <div className="min-w-0">
              <p className="font-medium text-gray-900 dark:text-white">{s.fullName}</p>
              <p className="text-xs text-gray-400">{s.phone}</p>
            </div>
            <div className="flex gap-1.5">
              {STATUSES.map(st => (
                <button key={st.key} onClick={() => setStatus(s.leadId, st.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${s.status === st.key ? st.cls + " border-transparent" : "bg-white dark:bg-gray-800 " + st.off + " dark:border-gray-700"}`}>
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </CardContent></Card>

      {students.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={save} loading={saving}><Save className="w-4 h-4" /> Saqlash</Button>
        </div>
      )}
    </div>
  );
}
