"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Phone, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LEAD_SOURCE_LABELS, TIME_PREFERENCE_LABELS, WEEKDAYS } from "@/lib/constants";

const schema = z.object({
  fullName: z.string().min(2, "Ism kamida 2 harf"),
  phone: z.string().min(9, "Telefon raqam kiriting"),
  phoneSecondary: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  age: z.coerce.number().int().min(5).max(99).optional().or(z.literal("")),
  address: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  courseId: z.string().optional(),
  timeSlotId: z.string().optional(),
  timePreference: z.enum(["MORNING","AFTERNOON","EVENING","FLEXIBLE"]),
  preferredDays: z.string().optional(),
  status: z.enum(["NEW","CONTACTED","INTERESTED","TRIAL_BOOKED","TRIAL_COMPLETED","ENROLLED","POSTPONED","LOST"]),
  source: z.enum(["INSTAGRAM","TELEGRAM","FACEBOOK","TIKTOK","REFERRAL","WEBSITE","WALK_IN","PHONE_CALL","OTHER"]),
  sourceDetails: z.string().optional(),
  notes: z.string().optional(),
  assignedToId: z.string().optional(),
  trialDate: z.string().optional(),
  reminderAt: z.string().optional(),
  reminderTitle: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Course { id: string; name: string; color: string | null; }
interface TimeSlot { id: string; label: string; }
interface User { id: string; fullName: string; }

export default function NewLeadPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [saving, setSaving] = useState(false);
  const [duplicate, setDuplicate] = useState<{ id: string } | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [showNewCourse, setShowNewCourse] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [creatingCourse, setCreatingCourse] = useState(false);

   
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- duplicate resolver type instances under Windows/pnpm resolution
    resolver: zodResolver(schema) as any,
    defaultValues: { timePreference: "FLEXIBLE", status: "NEW", source: "OTHER" },
  });

  const phone = watch("phone");

  useEffect(() => {
    Promise.all([
      fetch("/api/courses").then(r=>r.json()),
      fetch("/api/timeslots").then(r=>r.json()),
      fetch("/api/users").then(r=>r.json()),
    ]).then(([c, t, u]) => { setCourses(c); setTimeSlots(t); setUsers(u); });
  }, []);

  // Duplicate check after phone typed
  useEffect(() => {
    if (!phone || phone.length < 9) { setDuplicate(null); return; }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/leads?search=${encodeURIComponent(phone)}&limit=1`);
      if (res.ok) {
        const data = await res.json();
        const match = data.leads.find((l: { id: string; phone: string }) => l.phone === phone || l.phone.replace(/\D/g,"") === phone.replace(/\D/g,""));
        setDuplicate(match ? { id: match.id } : null);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [phone]);

  const toggleDay = (day: string) => {
    const next = selectedDays.includes(day) ? selectedDays.filter(d=>d!==day) : [...selectedDays, day];
    setSelectedDays(next);
    setValue("preferredDays", next.join(","));
  };

  const createCourse = async () => {
    if (newCourseName.trim().length < 2) { toast.error("Kurs nomi kamida 2 harf"); return; }
    setCreatingCourse(true);
    const base = newCourseName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const slug = (base || "kurs") + "-" + Date.now().toString(36).slice(-4);
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCourseName.trim(), slug, durationMonths: 6, price: 0 }),
    });
    if (res.ok) {
      const c = await res.json();
      setCourses(prev => [...prev, c]);
      setValue("courseId", c.id);
      setShowNewCourse(false); setNewCourseName("");
      toast.success("Kurs yaratildi");
    } else {
      toast.error("Kurs yaratilmadi");
    }
    setCreatingCourse(false);
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    const lessonTime = timeFrom && timeTo ? `${timeFrom}–${timeTo}` : (timeFrom || timeTo || undefined);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, lessonTime, age: data.age || null }),
    });
    if (res.ok) {
      const lead = await res.json();
      toast.success("Lid muvaffaqiyatli qo'shildi!");
      router.push(`/leads/${lead.id}`);
    } else {
      const err = await res.json();
      if (err.error === "duplicate") {
        toast.warning("Bu telefon raqam allaqachon mavjud!");
        setDuplicate({ id: err.leadId });
      } else {
        toast.error("Xatolik yuz berdi");
      }
    }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/leads" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <ArrowLeft className="w-5 h-5 text-gray-500"/>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Yangi lid</h1>
          <p className="text-sm text-gray-500">Potentsial o&apos;quvchi ma&apos;lumotlarini kiriting</p>
        </div>
      </div>

      {duplicate && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0"/>
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Bu telefon raqam allaqachon mavjud!</p>
          </div>
          <Link href={`/leads/${duplicate.id}`} className="text-xs font-medium text-amber-700 underline">Ko&apos;rish →</Link>
        </div>
      )}

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- see resolver cast above */}
      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
        {/* Basic info */}
        <Card>
          <CardHeader><CardTitle>Asosiy ma&apos;lumotlar</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="To'liq ism-familya *" {...register("fullName")} error={errors.fullName?.message} placeholder="Aziza Karimova"/>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Telefon raqam *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                  <input {...register("phone")} type="tel" placeholder="+998 90 123 45 67"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Qo'shimcha raqam" {...register("phoneSecondary")} placeholder="+998 91 ..."/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Yoshi" type="number" {...register("age")} placeholder="18"/>
              <Input label="Manzil" {...register("address")} placeholder="Toshkent, Yunusobod"/>
              <Input label="Ota-ona ismi" {...register("parentName")} placeholder="Ota yoki ona ismi"/>
              <Input label="Ota-ona telefoni" {...register("parentPhone")} placeholder="+998 90 ..."/>
            </div>
          </CardContent>
        </Card>

        {/* Course & Schedule */}
        <Card>
          <CardHeader><CardTitle>Kurs va vaqt</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {/* Course + quick create */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Kurs</label>
              <div className="flex gap-2">
                <select {...register("courseId")} className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Tanlanmagan</option>
                  {courses.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button type="button" onClick={()=>setShowNewCourse(s=>!s)}
                  className="px-3 py-2 text-sm font-medium rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition whitespace-nowrap">
                  + Yangi kurs
                </button>
              </div>
              {showNewCourse && (
                <div className="mt-2 flex gap-2">
                  <input value={newCourseName} onChange={e=>setNewCourseName(e.target.value)}
                    placeholder="Kurs nomi (masalan: IT Foundation)"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                  <Button type="button" size="sm" loading={creatingCourse} onClick={createCourse}>Yaratish</Button>
                </div>
              )}
            </div>

            {/* Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Qaysi kunlari dars oladi</label>
              <div className="flex gap-2 flex-wrap">
                {WEEKDAYS.map(d=>(
                  <button key={d.value} type="button" onClick={()=>toggleDay(d.value)}
                    className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition ${selectedDays.includes(d.value) ? "bg-indigo-600 text-white shadow-sm" : "border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lesson time from-to */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dars vaqti (soat dan – gacha)</label>
              <div className="flex items-center gap-3">
                <input type="time" value={timeFrom} onChange={e=>setTimeFrom(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                <span className="text-gray-400 font-medium">—</span>
                <input type="time" value={timeTo} onChange={e=>setTimeTo(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                {(timeFrom || timeTo) && (
                  <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{timeFrom || "—"}–{timeTo || "—"}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Note */}
        <Card>
          <CardHeader><CardTitle>Izoh</CardTitle></CardHeader>
          <CardContent>
            <textarea {...register("notes")} rows={6} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Mijoz haqida izoh, suhbat tafsilotlari... (masalan: 'Onasi bilan keldi, narx haqida o'ylab ko'rmoqchi')"/>
            <p className="mt-1 text-xs text-gray-400">Keyinchalik lid sahifasida har bir suhbatni alohida izoh qilib yozib borishingiz mumkin.</p>
          </CardContent>
        </Card>

        {/* First reminder */}
        <Card>
          <CardHeader><CardTitle>Birinchi eslatma</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Eslatma vaqti" type="datetime-local" {...register("reminderAt")}/>
              <Input label="Eslatma sarlavhasi" {...register("reminderTitle")} placeholder="Qo'ng'iroq qilish"/>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/leads"><Button type="button" variant="outline">Bekor qilish</Button></Link>
          <Button type="submit" loading={saving}>Lid qo&apos;shish</Button>
        </div>
      </form>
    </div>
  );
}
