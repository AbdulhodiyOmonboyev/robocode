"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Trash2, Users, Clock, Calendar, BookOpen, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WEEKDAYS } from "@/lib/constants";
import { formatPhone } from "@/lib/utils";

const dayLabel = (v: string) => WEEKDAYS.find(d=>d.value===v)?.label || v;

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [days, setDays] = useState<string[]>([]);
  const [form, setForm] = useState({ name:"", courseId:"", teacherId:"", timeFrom:"", timeTo:"", room:"", startDate:"" });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [members, setMembers] = useState<Record<string, any[]>>({});

  const load = async () => {
    setLoading(true);
    const g = await fetch("/api/groups").then(r=>r.json());
    setGroups(Array.isArray(g) ? g : []);
    setLoading(false);
  };
  useEffect(() => {
    load();
    fetch("/api/courses").then(r=>r.json()).then(setCourses);
    fetch("/api/users").then(r=>r.json()).then(setUsers);
  }, []);

  const create = async () => {
    if (form.name.trim().length < 1) { toast.error("Guruh nomini kiriting"); return; }
    setCreating(true);
    const res = await fetch("/api/groups", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({
      ...form, days: days.join(","), courseId: form.courseId||null, teacherId: form.teacherId||null, startDate: form.startDate||null,
    })});
    if (res.ok) { toast.success("Guruh yaratildi"); setShowCreate(false); setForm({name:"",courseId:"",teacherId:"",timeFrom:"",timeTo:"",room:"",startDate:""}); setDays([]); load(); }
    else toast.error("Yaratilmadi");
    setCreating(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Bu guruhni o'chirasizmi? A'zolar guruhdan chiqariladi (lidlar o'chmaydi).")) return;
    const res = await fetch("/api/groups/"+id, { method:"DELETE" });
    if (res.ok) { toast.success("Guruh o'chirildi"); load(); }
    else toast.error("O'chirib bo'lmadi");
  };

  const toggleExpand = async (id: string) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (!members[id]) {
      const det = await fetch("/api/groups/"+id).then(r=>r.json());
      setMembers(m => ({ ...m, [id]: det.leads || [] }));
    }
  };

  const toggleDay = (v: string) => setDays(arr => arr.includes(v) ? arr.filter(x=>x!==v) : [...arr, v]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Guruhlar</h1>
          <p className="text-sm text-gray-500 mt-0.5">O&apos;quv guruhlari va a&apos;zolari</p>
        </div>
        <Button size="sm" onClick={()=>setShowCreate(s=>!s)}><Plus className="w-4 h-4"/> Yangi guruh</Button>
      </div>

      {showCreate && (
        <Card>
          <CardContent className="space-y-3 py-4">
            <input placeholder="Guruh nomi" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"/>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select value={form.courseId} onChange={e=>setForm(f=>({...f,courseId:e.target.value}))} className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Kurs (ixtiyoriy)</option>
                {courses.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={form.teacherId} onChange={e=>setForm(f=>({...f,teacherId:e.target.value}))} className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">O&apos;qituvchi (ixtiyoriy)</option>
                {users.map((u:any)=><option key={u.id} value={u.id}>{u.fullName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Qaysi kunlar</label>
              <div className="flex gap-2 flex-wrap">
                {WEEKDAYS.map(d=>(
                  <button key={d.value} type="button" onClick={()=>toggleDay(d.value)}
                    className={`px-3 py-1 text-sm font-medium rounded-lg transition ${days.includes(d.value)?"bg-indigo-600 text-white":"border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"}`}>{d.label}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="block text-xs text-gray-500 mb-1.5">Soat (dan)</label><input type="time" value={form.timeFrom} onChange={e=>setForm(f=>({...f,timeFrom:e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"/></div>
              <div><label className="block text-xs text-gray-500 mb-1.5">Soat (gacha)</label><input type="time" value={form.timeTo} onChange={e=>setForm(f=>({...f,timeTo:e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"/></div>
              <div><label className="block text-xs text-gray-500 mb-1.5">Boshlanish</label><input type="date" value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"/></div>
              <div><label className="block text-xs text-gray-500 mb-1.5">Xona</label><input value={form.room} onChange={e=>setForm(f=>({...f,room:e.target.value}))} placeholder="masalan: 1-xona" className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"/></div>
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={()=>setShowCreate(false)}>Bekor</Button>
              <Button size="sm" loading={creating} onClick={create}>Yaratish</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="py-16 text-center text-gray-400 animate-pulse">Yuklanmoqda...</div>
      ) : groups.length === 0 ? (
        <div className="py-16 text-center">
          <div className="text-5xl mb-3">👥</div>
          <p className="text-gray-500 font-medium">Hali guruh yo&apos;q</p>
          <p className="text-sm text-gray-400 mt-1">Lidlar ro&apos;yxatida bir nechta lidni belgilab &quot;Guruhga qo&apos;shish&quot; orqali guruh ochishingiz mumkin.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((g:any)=>(
            <Card key={g.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{g.name}</h3>
                      {g.course && <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg" style={{backgroundColor:(g.course.color||"#6366f1")+"20",color:g.course.color||"#6366f1"}}><BookOpen className="w-3 h-3"/>{g.course.name}</span>}
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"><Users className="w-3 h-3"/>{g._count?.leads ?? 0} a&apos;zo</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
                      {g.days && <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/>{g.days.split(",").map(dayLabel).join(", ")}</span>}
                      {(g.timeFrom || g.timeTo) && <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5"/>{g.timeFrom||"?"}–{g.timeTo||"?"}</span>}
                      {g.teacher && <span>O&apos;qituvchi: {g.teacher.fullName}</span>}
                      {g.startDate && <span>Boshlanish: {new Date(g.startDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={()=>toggleExpand(g.id)} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg transition flex items-center gap-1 text-xs">
                      A&apos;zolar <ChevronDown className={`w-4 h-4 transition ${expanded===g.id?"rotate-180":""}`}/>
                    </button>
                    <button onClick={()=>remove(g.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>

                {expanded === g.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-1.5">
                    {(members[g.id] || []).length === 0 ? (
                      <p className="text-sm text-gray-400">A&apos;zolar yo&apos;q</p>
                    ) : (members[g.id] || []).map((m:any)=>(
                      <div key={m.id} className="flex items-center justify-between text-sm">
                        <Link href={`/leads/${m.id}`} className="font-medium text-gray-800 dark:text-gray-200 hover:text-indigo-600">{m.fullName}</Link>
                        <div className="flex items-center gap-3">
                          {m.stage && <span className="text-xs px-2 py-0.5 rounded-lg text-white" style={{backgroundColor:m.stage.color}}>{m.stage.name}</span>}
                          <span className="text-xs text-gray-500 font-mono">{formatPhone(m.phone)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
