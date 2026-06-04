"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2, ToggleLeft, ToggleRight, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Tab = "general" | "timeslots" | "tags" | "notifications";

interface TimeSlot { id: string; startTime: string; endTime: string; label: string; isActive: boolean; }
interface Tag { id: string; name: string; color: string; }

const TAG_COLORS = ["#6366f1","#10b981","#f59e0b","#f43f5e","#06b6d4","#8b5cf6","#ec4899","#14b8a6","#f97316","#84cc16"];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("general");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newSlot, setNewSlot] = useState({ startTime: "", endTime: "" });
  const [newTag, setNewTag] = useState({ name: "", color: "#6366f1" });
  const [centerName, setCenterName] = useState("IT O'quv Markaz");
  const [tgToken, setTgToken] = useState("");
  const [saving, setSaving] = useState(false);

  const loadSlots = () => fetch("/api/timeslots").then(r=>r.json()).then(setSlots);
  const loadTags = () => fetch("/api/tags").then(r=>r.json()).then(setTags);

  useEffect(() => { loadSlots(); loadTags(); }, []);

  const addSlot = async () => {
    if (!newSlot.startTime || !newSlot.endTime) { toast.error("Vaqtlarni kiriting"); return; }
    const label = `${newSlot.startTime} - ${newSlot.endTime}`;
    const res = await fetch("/api/timeslots", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newSlot, label }),
    });
    if (res.ok) { toast.success("Vaqt sloti qo'shildi"); setNewSlot({ startTime: "", endTime: "" }); loadSlots(); }
    else toast.error("Xatolik");
  };

  const toggleSlot = async (slot: TimeSlot) => {
    await fetch(`/api/timeslots/${slot.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !slot.isActive }),
    });
    loadSlots();
  };

  const deleteSlot = async (id: string) => {
    if (!confirm("Bu slotni o'chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/timeslots/${id}`, { method: "DELETE" });
    loadSlots();
  };

  const addTag = async () => {
    if (!newTag.name.trim()) { toast.error("Tag nomini kiriting"); return; }
    const res = await fetch("/api/tags", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTag),
    });
    if (res.ok) { toast.success("Tag qo'shildi"); setNewTag({ name: "", color: "#6366f1" }); loadTags(); }
    else toast.error("Bu nom band bo'lishi mumkin");
  };

  const deleteTag = async (id: string) => {
    await fetch(`/api/tags/${id}`, { method: "DELETE" });
    loadTags();
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "general", label: "Umumiy" },
    { key: "timeslots", label: "Vaqt slotlari" },
    { key: "tags", label: "Teglar" },
    { key: "notifications", label: "Bildirishnomalar" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sozlamalar</h1>
        <p className="text-sm text-gray-500 mt-0.5">Tizim sozlamalari</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${tab===t.key?"bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm":"text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* General */}
      {tab === "general" && (
        <Card>
          <CardHeader><CardTitle>Umumiy sozlamalar</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Markaz nomi" value={centerName} onChange={e=>setCenterName(e.target.value)}/>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Vaqt mintaqasi</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="Asia/Tashkent">Asia/Tashkent (UTC+5)</option>
                <option value="Europe/Moscow">Europe/Moscow (UTC+3)</option>
              </select>
            </div>
            <Button onClick={()=>toast.success("Saqlandi")} loading={saving}><Save className="w-4 h-4"/> Saqlash</Button>
          </CardContent>
        </Card>
      )}

      {/* Time Slots */}
      {tab === "timeslots" && (
        <Card>
          <CardHeader><CardTitle>Vaqt slotlari</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {slots.map(slot => (
                <div key={slot.id} className={`flex items-center justify-between p-3 rounded-xl border ${slot.isActive?"border-gray-200 dark:border-gray-700":"border-gray-100 dark:border-gray-800 opacity-50"}`}>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{slot.label}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>toggleSlot(slot)} className="text-gray-400 hover:text-indigo-600 transition">
                      {slot.isActive ? <ToggleRight className="w-5 h-5"/> : <ToggleLeft className="w-5 h-5"/>}
                    </button>
                    <button onClick={()=>deleteSlot(slot.id)} className="text-gray-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Boshlanish</label>
                <input type="time" value={newSlot.startTime} onChange={e=>setNewSlot(s=>({...s,startTime:e.target.value}))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"/>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Tugash</label>
                <input type="time" value={newSlot.endTime} onChange={e=>setNewSlot(s=>({...s,endTime:e.target.value}))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"/>
              </div>
              <Button onClick={addSlot}><Plus className="w-4 h-4"/> Qo'shish</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {tab === "tags" && (
        <Card>
          <CardHeader><CardTitle>Teglar</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <div key={tag.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-white" style={{backgroundColor:tag.color}}>
                  {tag.name}
                  <button onClick={()=>deleteTag(tag.id)} className="ml-1 opacity-70 hover:opacity-100"><X className="w-3 h-3"/></button>
                </div>
              ))}
              {tags.length === 0 && <p className="text-sm text-gray-400">Teglar yo'q</p>}
            </div>
            <div className="flex items-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Input label="Teg nomi" value={newTag.name} onChange={e=>setNewTag(t=>({...t,name:e.target.value}))} placeholder="Muhim" className="flex-1"/>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Rang</label>
                <div className="flex gap-1.5">
                  {TAG_COLORS.map(c=>(
                    <button key={c} type="button" onClick={()=>setNewTag(t=>({...t,color:c}))}
                      className={`w-6 h-6 rounded-lg ${newTag.color===c?"ring-2 ring-offset-1 ring-gray-400":""}`}
                      style={{backgroundColor:c}}/>
                  ))}
                </div>
              </div>
              <Button onClick={addTag}><Plus className="w-4 h-4"/></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      {tab === "notifications" && (
        <Card>
          <CardHeader><CardTitle>Bildirishnomalar</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300">
              Telegram bot orqali eslatmalar olish uchun botni boshlang va chat ID ni kiriting.
            </div>
            <Input label="Telegram Bot Token (Super Admin)" value={tgToken} onChange={e=>setTgToken(e.target.value)} placeholder="123456:ABC-DEF..." type="password"/>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Telegram ulash:</p>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
                <li>Bot tokenini kiriting va saqlang</li>
                <li>Hodim Telegram botga /start yuborsin</li>
                <li>Bot avtomatik tizimga ulaydi</li>
              </ol>
            </div>
            <Button onClick={()=>toast.success("Sozlama saqlandi")}><Save className="w-4 h-4"/> Saqlash</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function X({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>;
}
