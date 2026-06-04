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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
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
        const match = data.leads.find((l: any) => l.phone === phone || l.phone.replace(/\D/g,"") === phone.replace(/\D/g,""));
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

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, age: data.age || null }),
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
          <p className="text-sm text-gray-500">Potentsial o'quvchi ma'lumotlarini kiriting</p>
        </div>
      </div>

      {duplicate && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0"/>
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Bu telefon raqam allaqachon mavjud!</p>
          </div>
          <Link href={`/leads/${duplicate.id}`} className="text-xs font-medium text-amber-700 underline">Ko'rish →</Link>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
        {/* Basic info */}
        <Card>
          <CardHeader><CardTitle>Asosiy ma'lumotlar</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="To'liq ism-familya *" {...register("fullName")} error={errors.fullName?.message} placeholder="Aziza Karimova"/>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Telefon raqam *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                  <input {...register("phone")} type="tel" placeholder="+998 90 123 45 67"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Qo'shimcha raqam" {...register("phoneSecondary")} placeholder="+998 91 ..."/>
              <Input label="Email" type="email" {...register("email")} placeholder="email@example.com"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Yoshi" type="number" {...register("age")} placeholder="18"/>
              <Input label="Manzil" {...register("address")} placeholder="Toshkent, Yunusobod"/>
            </div>
          </CardContent>
        </Card>

        {/* Course & Schedule */}
        <Card>
          <CardHeader><CardTitle>Kurs va vaqt</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Qaysi kursga qiziqyapti</label>
                <select {...register("courseId")} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Tanlanmagan</option>
                  {courses.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Aniq vaqt slot</label>
                <select {...register("timeSlotId")} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Tanlanmagan</option>
                  {timeSlots.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vaqt afzalligi</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(TIME_PREFERENCE_LABELS).map(([val,label])=>(
                  <label key={val} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value={val} {...register("timePreference")} className="text-indigo-600"/>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Qulay kunlar</label>
              <div className="flex gap-2 flex-wrap">
                {WEEKDAYS.map(d=>(
                  <button key={d.value} type="button" onClick={()=>toggleDay(d.value)}
                    className={`px-3 py-1 text-sm font-medium rounded-lg transition ${selectedDays.includes(d.value) ? "bg-indigo-600 text-white" : "border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <Input label="Sinov darsi sanasi" type="datetime-local" {...register("trialDate")}/>
          </CardContent>
        </Card>

        {/* Source & Status */}
        <Card>
          <CardHeader><CardTitle>Holat va manba</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Holat</label>
                <select {...register("status")} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {[["NEW","Yangi"],["CONTACTED","Bog'lanildi"],["INTERESTED","Qiziqyapti"],["TRIAL_BOOKED","Sinov darsiga yozildi"],["ENROLLED","Yozildi"],["POSTPONED","Keyinroqqa"],["LOST","Yo'qotildi"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Manba</label>
                <select {...register("source")} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {Object.entries(LEAD_SOURCE_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>
            <Input label="Manba haqida qo'shimcha" {...register("sourceDetails")} placeholder="@instagram_username yoki 'Do'stim Sherzod tavsiya qildi'"/>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mas'ul hodim</label>
              <select {...register("assignedToId")} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Tayinlanmagan</option>
                {users.map(u=><option key={u.id} value={u.id}>{u.fullName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Izohlar</label>
              <textarea {...register("notes")} rows={3} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Qo'shimcha ma'lumotlar..."/>
            </div>
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
          <Button type="submit" loading={saving}>Lid qo'shish</Button>
        </div>
      </form>
    </div>
  );
}
