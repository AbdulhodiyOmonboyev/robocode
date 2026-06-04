"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Bell, Check, Clock, X, Phone, RefreshCw, ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatRelativeTime, isOverdue, phoneToTel } from "@/lib/utils";
import { addMinutes, format } from "date-fns";

interface Reminder {
  id: string; title: string; description: string | null;
  remindAt: string; status: string; completedAt: string | null;
  lead: { id: string; fullName: string; phone: string };
  user: { fullName: string };
}

interface ReminderData {
  overdue: Reminder[]; today: Reminder[]; upcoming: Reminder[]; done: Reminder[];
  totalToday: number;
}

export default function RemindersPage() {
  const [data, setData] = useState<ReminderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [collapsedDone, setCollapsedDone] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/reminders");
    if (res.ok) setData(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (id: string, status: string, snoozeMin?: number) => {
    const body: any = { status };
    if (status === "PENDING" && snoozeMin) {
      body.remindAt = format(addMinutes(new Date(), snoozeMin), "yyyy-MM-dd'T'HH:mm");
      body.status = "PENDING";
    }
    const res = await fetch(`/api/reminders/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    if (res.ok) {
      toast.success(status === "DONE" ? "Bajarildi ✓" : status === "CANCELLED" ? "Bekor qilindi" : "Kechiktirildi");
      load();
    }
  };

  const ReminderCard = ({ r, showSnooze = false }: { r: Reminder; showSnooze?: boolean }) => {
    const overdue = isOverdue(r.remindAt) && r.status === "PENDING";
    return (
      <div className={`flex items-start gap-3 p-4 rounded-xl border transition ${
        overdue ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10" :
        r.status === "DONE" ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10 opacity-70" :
        "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
      }`}>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${overdue?"bg-red-100 dark:bg-red-900":r.status==="DONE"?"bg-emerald-100 dark:bg-emerald-900":"bg-indigo-100 dark:bg-indigo-900"}`}>
          {r.status === "DONE" ? <Check className="w-4 h-4 text-emerald-600"/> : <Bell className={`w-4 h-4 ${overdue?"text-red-600":"text-indigo-600"}`}/>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{r.title}</p>
            <span className={`text-xs px-2 py-0.5 rounded-lg font-medium flex-shrink-0 ${overdue?"bg-red-100 text-red-700":r.status==="DONE"?"bg-emerald-100 text-emerald-700":"bg-indigo-100 text-indigo-700"}`}>
              {overdue?"Kechikkan":r.status==="DONE"?"Bajarildi":r.status==="MISSED"?"O'tkazib yuborildi":formatRelativeTime(r.remindAt)}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <Link href={`/leads/${r.lead.id}`} className="text-xs text-indigo-600 hover:underline font-medium">{r.lead.fullName}</Link>
            <a href={phoneToTel(r.lead.phone)} className="text-xs text-gray-500 hover:text-green-600 flex items-center gap-1">
              <Phone className="w-3 h-3"/>{r.lead.phone}
            </a>
          </div>
          {r.description && <p className="text-xs text-gray-500 mt-1">{r.description}</p>}
          <p className="text-xs text-gray-400 mt-1">{formatDateTime(r.remindAt)}</p>
        </div>
        {r.status === "PENDING" && (
          <div className="flex flex-col gap-1 flex-shrink-0">
            <button onClick={()=>setStatus(r.id,"DONE")} className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition" title="Bajarildi">
              <Check className="w-3.5 h-3.5"/>
            </button>
            {showSnooze && (
              <button onClick={()=>setStatus(r.id,"PENDING",15)} className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition" title="15 daqiqa kechiktirish">
                <Clock className="w-3.5 h-3.5"/>
              </button>
            )}
            <button onClick={()=>setStatus(r.id,"CANCELLED")} className="p-1.5 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-lg transition" title="Bekor qilish">
              <X className="w-3.5 h-3.5"/>
            </button>
          </div>
        )}
      </div>
    );
  };

  const Section = ({ title, items, color, icon, showSnooze = false }: { title: string; items: Reminder[]; color: string; icon: React.ReactNode; showSnooze?: boolean }) => (
    items.length > 0 ? (
      <div>
        <div className={`flex items-center gap-2 mb-3 px-1`}>
          <span className={`w-2 h-2 rounded-full ${color}`}/>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</span>
          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{items.length}</span>
        </div>
        <div className="space-y-2">
          {items.map(r => <ReminderCard key={r.id} r={r} showSnooze={showSnooze}/>)}
        </div>
      </div>
    ) : null
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Eslatmalar</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data?.totalToday || 0} ta bugungi eslatma</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}><RefreshCw className="w-4 h-4"/> Yangilash</Button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({length:5}).map((_,i)=><div key={i} className="h-20 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 animate-pulse"/>)}</div>
      ) : !data || (data.overdue.length+data.today.length+data.upcoming.length+data.done.length) === 0 ? (
        <Card>
          <div className="py-20 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4"/>
            <p className="text-gray-500 font-medium">Eslatmalar yo'q</p>
            <p className="text-sm text-gray-400 mt-1">Lid sahifasidan eslatma qo'shing</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <Section title="Kechikkanlar" items={data?.overdue||[]} color="bg-red-500" icon={null} showSnooze/>
          <Section title="Bugun" items={data?.today||[]} color="bg-amber-400" icon={null} showSnooze/>
          <Section title="Kelgusi 7 kun" items={data?.upcoming||[]} color="bg-indigo-400" icon={null}/>

          {/* Done / Cancelled */}
          {(data?.done?.length || 0) > 0 && (
            <div>
              <button onClick={()=>setCollapsedDone(!collapsedDone)} className="flex items-center gap-2 mb-3 px-1 text-sm font-semibold text-gray-400 hover:text-gray-600 transition">
                {collapsedDone ? <ChevronRight className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                <span>Yakunlangan / Bekor ({data?.done?.length})</span>
              </button>
              {!collapsedDone && (
                <div className="space-y-2">
                  {data?.done?.map(r => <ReminderCard key={r.id} r={r}/>)}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
