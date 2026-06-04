"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#6366f1","#10b981","#f59e0b","#f43f5e","#06b6d4","#8b5cf6","#ec4899","#14b8a6"];

const schema = z.object({
  name: z.string().min(2, "Kamida 2 harf"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Kichik harf va - faqat"),
  description: z.string().optional(),
  durationMonths: z.coerce.number().int().min(1),
  price: z.coerce.number().min(0),
  color: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Course {
  id: string; name: string; slug: string; description: string | null;
  durationMonths: number; price: string; currency: string;
  isActive: boolean; color: string | null;
  _count: { leads: number };
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: { durationMonths: 3, price: 500000, color: "#6366f1" },
  });

  const selectedColor = watch("color");

  const load = async () => {
    const res = await fetch("/api/courses");
    if (res.ok) setCourses(await res.json());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ name: "", slug: "", description: "", durationMonths: 3, price: 500000, color: "#6366f1" });
    setModalOpen(true);
  };

  const openEdit = (c: Course) => {
    setEditing(c);
    reset({ name: c.name, slug: c.slug, description: c.description || "", durationMonths: c.durationMonths, price: parseFloat(c.price), color: c.color || "#6366f1" });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    const url = editing ? `/api/courses/${editing.id}` : "/api/courses";
    const method = editing ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) {
      toast.success(editing ? "Kurs yangilandi" : "Kurs qo'shildi");
      setModalOpen(false); load();
    } else {
      const e = await res.json();
      toast.error(e.error || "Xatolik");
    }
    setSaving(false);
  };

  const toggleActive = async (c: Course) => {
    await fetch(`/api/courses/${c.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !c.isActive }) });
    load();
  };

  const deleteCourse = async (c: Course) => {
    if (!confirm(`"${c.name}" kursini o'chirishni tasdiqlaysizmi?`)) return;
    const res = await fetch(`/api/courses/${c.id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Kurs o'chirildi"); load(); }
    else toast.error("O'chirib bo'lmadi — bog'liq lidlar mavjud bo'lishi mumkin");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kurslar</h1>
          <p className="text-sm text-gray-500 mt-1">{courses.length} ta kurs</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Kurs qo'shish</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({length:5}).map((_,i)=><div key={i} className="h-40 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 animate-pulse"/>)}
        </div>
      ) : courses.length === 0 ? (
        <Card>
          <div className="py-20 text-center">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-gray-500 font-medium">Hali kurs yo'q</p>
            <Button className="mt-4" onClick={openCreate}><Plus className="w-4 h-4"/>Birinchi kursni qo'shing</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(c => (
            <Card key={c.id} className={!c.isActive ? "opacity-60" : ""}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ backgroundColor: c.color || "#6366f1" }} />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{c.name}</h3>
                      <p className="text-xs text-gray-400">/{c.slug}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${c.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {c.isActive ? "Faol" : "Nofaol"}
                  </span>
                </div>
                {c.description && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{c.description}</p>}
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="font-semibold text-indigo-600">{formatCurrency(c.price, c.currency)}</span>
                  <span className="text-gray-500">{c.durationMonths} oy</span>
                  <span className="text-gray-500">{c._count.leads} lid</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(c)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-400">
                    <Edit className="w-3 h-3"/> Tahrirlash
                  </button>
                  <button onClick={() => toggleActive(c)} className="p-1.5 text-gray-400 hover:text-amber-600 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-amber-50 transition" title={c.isActive?"O'chirish":"Yoqish"}>
                    {c.isActive ? <ToggleRight className="w-4 h-4"/> : <ToggleLeft className="w-4 h-4"/>}
                  </button>
                  <button onClick={() => deleteCourse(c)} className="p-1.5 text-gray-400 hover:text-red-600 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-red-50 transition">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editing ? "Kursni tahrirlash" : "Yangi kurs"}</h2>
              <button onClick={()=>setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <Input label="Kurs nomi *" {...register("name")} error={errors.name?.message} placeholder="Frontend Development"/>
              <Input label="Slug *" {...register("slug")} error={errors.slug?.message} placeholder="frontend-dev"/>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tavsif</label>
                <textarea {...register("description")} rows={2} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Qisqa tavsif..."/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Narxi (UZS) *" type="number" {...register("price")} error={errors.price?.message}/>
                <Input label="Davomiyligi (oy) *" type="number" {...register("durationMonths")} error={errors.durationMonths?.message}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rang</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(color => (
                    <button key={color} type="button" onClick={()=>setValue("color", color)}
                      className={`w-7 h-7 rounded-lg transition ${selectedColor===color?"ring-2 ring-offset-2 ring-indigo-500 scale-110":""}`}
                      style={{backgroundColor:color}}/>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={()=>setModalOpen(false)}>Bekor</Button>
                <Button type="submit" loading={saving}>{editing?"Saqlash":"Qo'shish"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
