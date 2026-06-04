"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";

const DAYS_UZ = ["Yak", "Du", "Se", "Ch", "Pa", "Ju", "Sh"];
const DAYS_EN = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

interface Slot { id: string; label: string; startTime: string; }
interface Lead { id: string; fullName: string; status: string; course: { name: string; color: string | null } | null; }

export default function SchedulePage() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCell, setSelectedCell] = useState<{ slotId: string; dayIndex: number } | null>(null);
  const [cellLeads, setCellLeads] = useState<Lead[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/timeslots").then(r=>r.json()),
      fetch("/api/leads?limit=200").then(r=>r.json()).then(d=>d.leads),
    ]).then(([s, l]) => { setSlots(s); setLeads(l); setLoading(false); });
  }, []);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Count leads per slot per day-of-week
  const getLeadsForCell = (slotId: string, dayIndex: number): Lead[] => {
    const dayName = DAYS_EN[dayIndex];
    return leads.filter((l: any) => {
      const hasSlot = l.timeSlotId === slotId;
      const hasDay = l.preferredDays?.includes(dayName);
      return hasSlot || hasDay;
    });
  };

  const maxCount = Math.max(1, ...slots.flatMap(slot =>
    weekDays.map((_, i) => getLeadsForCell(slot.id, i).length)
  ));

  const handleCellClick = (slotId: string, dayIndex: number) => {
    const leads = getLeadsForCell(slotId, dayIndex);
    setSelectedCell({ slotId, dayIndex });
    setCellLeads(leads);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Jadval</h1>
          <p className="text-sm text-gray-500 mt-0.5">Vaqt slotlari bo'yicha talablar</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setWeekStart(d=>addDays(d,-7))} className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            <ChevronLeft className="w-4 h-4"/>
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[200px] text-center">
            {format(weekStart,"d MMM")} — {format(addDays(weekStart,6),"d MMM yyyy")}
          </span>
          <button onClick={()=>setWeekStart(d=>addDays(d,7))} className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            <ChevronRight className="w-4 h-4"/>
          </button>
          <button onClick={()=>setWeekStart(startOfWeek(new Date(),{weekStartsOn:1}))} className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Bugun
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            {loading ? (
              <div className="p-8 text-center text-gray-400 animate-pulse">Yuklanmoqda...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 w-32">Vaqt</th>
                      {weekDays.map((day, i) => (
                        <th key={i} className={`px-2 py-3 text-center text-xs font-semibold ${isSameDay(day,new Date())?"text-indigo-600":"text-gray-500"}`}>
                          <div>{DAYS_UZ[day.getDay()]}</div>
                          <div className={`text-lg font-bold mt-0.5 ${isSameDay(day,new Date())?"text-indigo-600":""}`}>{format(day,"d")}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {slots.filter(s=>(s as any).isActive !== false).map(slot => (
                      <tr key={slot.id}>
                        <td className="px-4 py-3 text-xs font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">{slot.label}</td>
                        {weekDays.map((_, dayIdx) => {
                          const count = getLeadsForCell(slot.id, dayIdx).length;
                          const intensity = count === 0 ? 0 : Math.ceil((count / maxCount) * 5);
                          const bgColors = ["","bg-indigo-50","bg-indigo-100","bg-indigo-200","bg-indigo-300","bg-indigo-400"];
                          const textColors = ["text-gray-300","text-indigo-400","text-indigo-600","text-indigo-700","text-white","text-white"];
                          const isSelected = selectedCell?.slotId===slot.id && selectedCell?.dayIndex===dayIdx;
                          return (
                            <td key={dayIdx} className="px-2 py-2 text-center">
                              <button
                                onClick={()=>handleCellClick(slot.id, dayIdx)}
                                className={`w-full h-10 rounded-xl text-xs font-semibold transition hover:scale-105 ${isSelected?"ring-2 ring-indigo-600 ring-offset-1":""} ${count===0?"bg-gray-50 dark:bg-gray-800 text-gray-300 hover:bg-gray-100":bgColors[intensity]+" "+textColors[intensity]}`}
                              >
                                {count > 0 ? count : "—"}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <div className="flex items-center gap-3 mt-3 px-1">
            <span className="text-xs text-gray-500">Talablar zichligi:</span>
            {["Kam","O'rta","Ko'p","Juda ko'p"].map((l,i) => (
              <div key={l} className="flex items-center gap-1">
                <div className={`w-4 h-4 rounded-md ${["bg-indigo-100","bg-indigo-200","bg-indigo-300","bg-indigo-400"][i]}`}/>
                <span className="text-xs text-gray-500">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cell detail panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-4 h-4"/>
              {selectedCell ? `${slots.find(s=>s.id===selectedCell.slotId)?.label} — ${DAYS_UZ[selectedCell.dayIndex]}` : "Katak tanlang"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedCell ? (
              <p className="text-sm text-gray-400 text-center py-8">Jadvaldan katak tanlang</p>
            ) : cellLeads.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Bu vaqtda lid yo'q</p>
            ) : (
              <div className="space-y-2">
                {cellLeads.map(l => (
                  <Link key={l.id} href={`/leads/${l.id}`} className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition">
                    <div className="w-7 h-7 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex-shrink-0">
                      {l.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{l.fullName}</p>
                      {l.course && <p className="text-xs text-gray-500 truncate">{l.course.name}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
