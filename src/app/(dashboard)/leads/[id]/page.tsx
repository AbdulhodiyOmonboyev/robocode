"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft, Phone, MessageCircle, Edit, Trash2, Bell, Pin, PinOff,
  Clock, User, BookOpen, Tag, Activity, FileText, Check, X, ExternalLink
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS, LEAD_SOURCE_LABELS, TIME_PREFERENCE_LABELS } from "@/lib/constants";
import { formatDate, formatDateTime, formatRelativeTime, formatPhone, phoneToTel, phoneToTelegram, phoneToWhatsapp, formatCurrency } from "@/lib/utils";

interface Lead {
  id: string; fullName: string; phone: string; phoneSecondary: string | null;
  email: string | null; age: number | null; address: string | null;
  parentName: string | null; parentPhone: string | null;
  status: string; source: string; sourceDetails: string | null; notes: string | null;
  payments?: any[]; attendances?: { status: string }[];
  timePreference: string; preferredDays: string | null; lessonTime: string | null; isPinned: boolean;
  trialDate: string | null; enrolledAt: string | null; lastContactedAt: string | null;
  createdAt: string; updatedAt: string;
  course: { id: string; name: string; color: string | null; price: string; durationMonths: number } | null;
  timeSlot: { id: string; label: string } | null;
  stageId: string | null;
  stage: { id: string; name: string; color: string } | null;
  assignedTo: { id: string; fullName: string; username: string } | null;
  createdBy: { id: string; fullName: string };
  tags: { id: string; name: string; color: string }[];
  reminders: any[];
  activities: any[];
}

type Tab = "info" | "activity" | "reminders" | "notes";

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("info");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [newNote, setNewNote] = useState("");
  const [reminder, setReminder] = useState({ title: "", remindAt: "" });
  const [addingReminder, setAddingReminder] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);

  const load = async () => {
    const res = await fetch(`/api/leads/${id}`);
    if (res.ok) { const data = await res.json(); setLead(data); setEditData(data); }
    else router.push("/leads");
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);
  useEffect(() => {
    fetch("/api/courses").then(r=>r.json()).then(setCourses);
    fetch("/api/users").then(r=>r.json()).then(setUsers);
    fetch("/api/timeslots").then(r=>r.json()).then(setTimeSlots);
    fetch("/api/stages").then(r=>r.json()).then(setStages);
  }, []);

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    if (res.ok) { toast.success("Saqlandi"); setEditing(false); load(); }
    else toast.error("Xatolik");
    setSaving(false);
  };

  const changeStage = async (stageId: string) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stageId }),
    });
    if (res.ok) { const s = stages.find((x:any)=>x.id===stageId); toast.success(`Bosqich → ${s?.name||""}`); load(); }
  };

  const togglePin = async () => {
    await fetch(`/api/leads/${id}`, { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ isPinned: !lead?.isPinned }) });
    load();
  };

  const addReminder = async () => {
    if (!reminder.title || !reminder.remindAt) { toast.error("Sarlavha va vaqt kiriting"); return; }
    setAddingReminder(true);
    const res = await fetch("/api/reminders", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ leadId: id, ...reminder }),
    });
    if (res.ok) { toast.success("Eslatma qo'shildi"); setReminder({ title: "", remindAt: "" }); load(); }
    setAddingReminder(false);
  };

  const saveNote = async () => {
    if (!newNote.trim()) return;
    const res = await fetch("/api/leads/" + id + "/activity", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ action: "comment", details: { text: newNote.trim() } }),
    });
    if (res.ok) { toast.success("Izoh qo'shildi"); setNewNote(""); load(); }
    else toast.error("Xatolik");
  };

  const deleteLead = async () => {
    if (!confirm("Bu lidni o'chirishni tasdiqlaysizmi?")) return;
    const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Lid o'chirildi"); router.push("/leads"); }
    else toast.error("O'chirib bo'lmadi");
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-20 bg-white dark:bg-gray-900 rounded-2xl"/><div className="h-80 bg-white dark:bg-gray-900 rounded-2xl"/></div>;
  if (!lead) return null;

  const comments = lead.activities.filter((a:any)=>a.action==="comment");
  const currentStageIdx = stages.findIndex((s:any)=>s.id===lead.stageId);

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Top bar */}
      <div className="flex items-center gap-4 flex-wrap">
        <Link href="/leads" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <ArrowLeft className="w-5 h-5 text-gray-500"/>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{lead.fullName}</h1>
            {lead.stage && (
              <span className="text-xs px-2 py-0.5 rounded-lg font-medium text-white" style={{ backgroundColor: lead.stage.color }}>
                {lead.stage.name}
              </span>
            )}
            {lead.isPinned && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg">📌 Pinlangan</span>}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            Qo'shilgan: {formatDate(lead.createdAt)} · {lead.createdBy.fullName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={togglePin} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500" title={lead.isPinned?"Pindan olib tashlash":"Pinlash"}>
            {lead.isPinned ? <PinOff className="w-4 h-4"/> : <Pin className="w-4 h-4"/>}
          </button>
          {editing ? (
            <>
              <Button size="sm" variant="outline" onClick={()=>setEditing(false)}>Bekor</Button>
              <Button size="sm" loading={saving} onClick={save}>Saqlash</Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={()=>setEditing(true)}><Edit className="w-4 h-4"/> Tahrirlash</Button>
          )}
          <Button size="sm" variant="danger" onClick={deleteLead}><Trash2 className="w-4 h-4"/></Button>
        </div>
      </div>

      {/* Stage pipeline */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-0 overflow-x-auto">
            {stages.map((s:any, i:number) => (
              <div key={s.id} className="flex items-center flex-shrink-0">
                <button onClick={()=>changeStage(s.id)}
                  style={ s.id === lead.stageId ? { backgroundColor: s.color } : undefined }
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition whitespace-nowrap ${
                    s.id === lead.stageId ? "text-white" :
                    i < currentStageIdx ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                    "bg-gray-100 text-gray-500 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}>
                  {i < currentStageIdx ? "✓ " : ""}{s.name}
                </button>
                {i < stages.length - 1 && <div className="w-6 h-0.5 bg-gray-200 dark:bg-gray-700 flex-shrink-0"/>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <Card>
            <div className="flex border-b border-gray-100 dark:border-gray-800 px-4">
              {(["info","activity","reminders","notes"] as Tab[]).map(t=>(
                <button key={t} onClick={()=>setTab(t)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition ${tab===t ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                  {t==="info"?"Ma'lumotlar":t==="activity"?"Tarix":t==="reminders"?"Eslatmalar":"Izohlar"}
                  {t==="reminders" && lead.reminders.length>0 && <span className="ml-1.5 bg-indigo-100 text-indigo-700 text-xs px-1.5 py-0.5 rounded-full">{lead.reminders.filter(r=>r.status==="PENDING").length}</span>}
                </button>
              ))}
            </div>
            <CardContent>
              {tab === "info" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {[
                    ["To'liq ism", "fullName", lead.fullName],
                    ["Telefon", "phone", formatPhone(lead.phone)],
                    ["Qo'shimcha tel", "phoneSecondary", lead.phoneSecondary || "—"],
                    ["Email", "email", lead.email || "—"],
                    ["Yoshi", "age", lead.age ? `${lead.age} yosh` : "—"],
                    ["Manzil", "address", lead.address || "—"],
                    ["Ota-ona ismi", "parentName", lead.parentName || "—"],
                    ["Ota-ona tel", "parentPhone", lead.parentPhone || "—"],
                    ["Manba", null, LEAD_SOURCE_LABELS[lead.source as keyof typeof LEAD_SOURCE_LABELS]],
                    ["Manba detali", "sourceDetails", lead.sourceDetails || "—"],
                    ["Dars kunlari", "preferredDays", lead.preferredDays || "—"],
                    ["Dars vaqti", "lessonTime", lead.lessonTime || "—"],
                    ["Sinov darsi", null, lead.trialDate ? formatDateTime(lead.trialDate) : "—"],
                    ["Yozilgan sana", null, lead.enrolledAt ? formatDate(lead.enrolledAt) : "—"],
                  ].map(([label, field, value]) => (
                    <div key={label as string}>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
                      {editing && field ? (
                        <input value={editData[field as string] || ""} onChange={e=>setEditData((d:any)=>({...d,[field as string]:e.target.value}))}
                          className="mt-1 block w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"/>
                      ) : (
                        <p className="mt-1 text-gray-900 dark:text-white font-medium">{value as string}</p>
                      )}
                    </div>
                  ))}
                  {editing && (
                    <>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase">Kurs</span>
                        <select value={editData.courseId||""} onChange={e=>setEditData((d:any)=>({...d,courseId:e.target.value||null}))}
                          className="mt-1 block w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none">
                          <option value="">Tanlanmagan</option>
                          {courses.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase">Mas'ul</span>
                        <select value={editData.assignedToId||""} onChange={e=>setEditData((d:any)=>({...d,assignedToId:e.target.value||null}))}
                          className="mt-1 block w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none">
                          <option value="">Tayinlanmagan</option>
                          {users.map((u:any)=><option key={u.id} value={u.id}>{u.fullName}</option>)}
                        </select>
                      </div>
                    </>
                  )}
                </div>
              )}

              {tab === "activity" && (
                <div className="space-y-3">
                  {lead.activities.length === 0 ? <p className="text-center text-gray-400 py-8">Faollik yo'q</p> : (
                    <div className="relative">
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-800"/>
                      <div className="space-y-3">
                        {lead.activities.map((a:any) => (
                          <div key={a.id} className="relative flex items-start gap-4 pl-8">
                            <div className="absolute left-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center flex-shrink-0">
                              <Activity className="w-3 h-3 text-indigo-600 dark:text-indigo-400"/>
                            </div>
                            <div>
                              <p className="text-sm text-gray-800 dark:text-gray-200">
                                <span className="font-medium">{a.user.fullName}</span>{" "}
                                {a.action === "status_changed" ? `statusni "${(LEAD_STATUS_LABELS as any)[a.details?.from]}" → "${(LEAD_STATUS_LABELS as any)[a.details?.to]}" ga o'zgartirdi` :
                                 a.action === "lead_created" ? "lidni qo'shdi" :
                                 a.action === "comment" ? `izoh qoldirdi: "${a.details?.text || ""}"` :
                                 a.action === "note_added" ? "izoh qo'shdi" :
                                 a.action === "reminder_created" ? "eslatma yaratdi" :
                                 a.action === "lead_updated" ? "ma'lumotni yangiladi" : a.action}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(a.createdAt)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tab === "reminders" && (
                <div className="space-y-3">
                  {lead.reminders.map((r:any) => (
                    <div key={r.id} className={`flex items-start gap-3 p-3 rounded-xl border ${r.status==="PENDING"?"border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20":r.status==="DONE"?"border-emerald-200 bg-emerald-50 dark:border-emerald-800":"border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"}`}>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{r.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{formatDateTime(r.remindAt)} · {r.user.fullName}</p>
                        {r.description && <p className="text-xs text-gray-500 mt-1">{r.description}</p>}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${r.status==="DONE"?"bg-emerald-100 text-emerald-700":r.status==="MISSED"?"bg-red-100 text-red-700":"bg-indigo-100 text-indigo-700"}`}>
                        {r.status==="PENDING"?"Kutilmoqda":r.status==="DONE"?"Bajarildi":r.status==="MISSED"?"O'tkazildi":"Bekor"}
                      </span>
                    </div>
                  ))}
                  {lead.reminders.length === 0 && <p className="text-center text-gray-400 py-6">Eslatmalar yo'q</p>}
                </div>
              )}

              {tab === "notes" && (
                <div className="space-y-4">
                  {/* Add comment */}
                  <div>
                    <textarea value={newNote} onChange={e=>setNewNote(e.target.value)} rows={2}
                      placeholder="Mijoz bilan suhbatingizni yozing... (masalan: 'Telefon qildim, 2 kundan keyin qayta aloqaga chiqaman dedi')"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"/>
                    <div className="flex justify-end mt-2">
                      <Button size="sm" onClick={saveNote} disabled={!newNote.trim()}>Izoh qo&apos;shish</Button>
                    </div>
                  </div>

                  {/* Comments timeline */}
                  {comments.length === 0 ? (
                    <p className="text-center text-gray-400 py-6 text-sm">Hozircha izoh yo&apos;q. Mijoz bilan har bir suhbatingizni shu yerga yozib boring.</p>
                  ) : (
                    <div className="space-y-3">
                      {comments.map((a:any)=>(
                        <div key={a.id} className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-semibold text-indigo-600 dark:text-indigo-300 flex-shrink-0">
                            {a.user.fullName.slice(0,2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{a.user.fullName}</span>
                              <span className="text-xs text-gray-400">{formatRelativeTime(a.createdAt)}</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5 whitespace-pre-wrap break-words">{a.details?.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Initial note (from create form) */}
                  {lead.notes && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl p-3 text-sm">
                      <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Dastlabki izoh</span>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mt-1">{lead.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: contact + quick actions */}
        <div className="space-y-4">
          {/* Contact panel */}
          <Card>
            <CardHeader><CardTitle>Aloqa</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <a href={phoneToTel(lead.phone)} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl hover:bg-green-100 transition">
                <Phone className="w-4 h-4 text-green-600"/> <span className="text-sm font-medium text-green-700">{formatPhone(lead.phone)}</span>
              </a>
              {lead.phoneSecondary && (
                <a href={phoneToTel(lead.phoneSecondary)} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 transition">
                  <Phone className="w-4 h-4 text-gray-500"/> <span className="text-sm text-gray-700 dark:text-gray-300">{formatPhone(lead.phoneSecondary)}</span>
                </a>
              )}
              <div className="flex gap-2">
                <a href={phoneToTelegram(lead.phone)} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 rounded-xl hover:bg-blue-100 transition">
                  <MessageCircle className="w-3.5 h-3.5"/> Telegram
                </a>
                <a href={phoneToWhatsapp(lead.phone)} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl hover:bg-green-100 transition">
                  <MessageCircle className="w-3.5 h-3.5"/> WhatsApp
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Add Reminder */}
          <Card>
            <CardHeader><CardTitle>Eslatma qo'shish</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <input value={reminder.title} onChange={e=>setReminder(r=>({...r,title:e.target.value}))}
                placeholder="Sarlavha..." className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"/>
              <input type="datetime-local" value={reminder.remindAt} onChange={e=>setReminder(r=>({...r,remindAt:e.target.value}))}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"/>
              <Button size="sm" className="w-full" onClick={addReminder} loading={addingReminder}>
                <Bell className="w-4 h-4"/> Eslatma qo'shish
              </Button>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader><CardTitle>Umumiy ma'lumot</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {lead.course && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5"/> Kurs</span>
                  <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{backgroundColor:lead.course.color||"#6366f1"}}/>
                    {lead.course.name}
                  </span>
                </div>
              )}
              {lead.course && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Narx</span>
                  <span className="font-semibold text-indigo-600">{formatCurrency(lead.course.price)}</span>
                </div>
              )}
              {lead.assignedTo && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5"/> Mas'ul</span>
                  <span className="font-medium text-gray-900 dark:text-white">{lead.assignedTo.fullName}</span>
                </div>
              )}
              {lead.lessonTime && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> Dars vaqti</span>
                  <span className="font-medium text-gray-900 dark:text-white">{lead.lessonTime}</span>
                </div>
              )}
              {lead.preferredDays && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Kunlar</span>
                  <span className="font-medium text-gray-900 dark:text-white">{lead.preferredDays}</span>
                </div>
              )}
              {lead.timeSlot && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> Slot</span>
                  <span className="font-medium text-gray-900 dark:text-white">{lead.timeSlot.label}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Manba</span>
                <span className="font-medium text-gray-900 dark:text-white">{LEAD_SOURCE_LABELS[lead.source as keyof typeof LEAD_SOURCE_LABELS]}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Qo'shilgan</span>
                <span className="text-gray-600 dark:text-gray-400">{formatDate(lead.createdAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payments & Attendance */}
          <Card>
            <CardHeader><CardTitle>To'lovlar va davomat</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {(() => {
                const total = (lead.payments || []).reduce((a: number, p: any) => a + Number(p.amount || 0), 0);
                const att = lead.attendances || [];
                const present = att.filter((a) => a.status === "present").length;
                const absent = att.filter((a) => a.status === "absent").length;
                const late = att.filter((a) => a.status === "late").length;
                return (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Jami to'lov</span>
                      <span className="font-semibold text-green-600">{total.toLocaleString("ru-RU")} so'm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Davomat</span>
                      <span className="text-gray-700 dark:text-gray-300">✅ {present} · ⏰ {late} · ❌ {absent}</span>
                    </div>
                  </>
                );
              })()}
              {(lead.payments || []).length > 0 && (
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1.5">
                  {(lead.payments || []).slice(0, 5).map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{new Date(p.paidAt).toLocaleDateString("ru-RU")}{p.forMonth ? ` · ${p.forMonth}` : ""}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{Number(p.amount).toLocaleString("ru-RU")}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
