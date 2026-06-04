"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { X, Eye, EyeOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  fullName: z.string().min(2, "Ism kamida 2 harf"),
  username: z.string().min(3).regex(/^[a-z0-9_]+$/, "Kichik harf, raqam va _ faqat"),
  email: z.string().email("Email noto'g'ri").optional().or(z.literal("")),
  phone: z.string().optional(),
  password: z.string().min(8, "Kamida 8 belgi").optional().or(z.literal("")),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "MANAGER", "OPERATOR"]),
  canManageLeads: z.boolean(),
  canManageCourses: z.boolean(),
  canManageUsers: z.boolean(),
  canViewReports: z.boolean(),
  canExportData: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  user: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

function generatePassword() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function UserFormModal({ user, onClose, onSuccess }: Props) {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedPass, setGeneratedPass] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.fullName || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      password: "",
      role: user?.role || "OPERATOR",
      canManageLeads: user?.canManageLeads ?? true,
      canManageCourses: user?.canManageCourses ?? false,
      canManageUsers: user?.canManageUsers ?? false,
      canViewReports: user?.canViewReports ?? false,
      canExportData: user?.canExportData ?? false,
    },
  });

  const handleGenerate = () => {
    const p = generatePassword();
    setGeneratedPass(p);
    setValue("password", p);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const url = user ? `/api/users/${user.id}` : "/api/users";
      const method = user ? "PATCH" : "POST";
      const body = { ...data };
      if (user && !body.password) delete (body as any).password;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(user ? "Hodim yangilandi" : "Hodim qo'shildi");
        onSuccess();
      } else {
        const err = await res.json();
        toast.error(err.error || "Xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  };

  const permissions = [
    { key: "canManageLeads", label: "Lidlarni boshqarish" },
    { key: "canManageCourses", label: "Kurslarni tahrirlash" },
    { key: "canManageUsers", label: "Foydalanuvchilar boshqarish" },
    { key: "canViewReports", label: "Hisobotlarni ko'rish" },
    { key: "canExportData", label: "Ma'lumotlarni eksport" },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {user ? "Hodimni tahrirlash" : "Yangi hodim"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="To'liq ism *" {...register("fullName")} error={errors.fullName?.message} placeholder="Aziz Karimov" />
            <Input label="Username *" {...register("username")} error={errors.username?.message} placeholder="aziz_k" disabled={!!user} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" type="email" {...register("email")} error={errors.email?.message} placeholder="aziz@example.com" />
            <Input label="Telefon" {...register("phone")} placeholder="+998901234567" />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {user ? "Yangi parol (o'zgartirmasangiz bo'sh qoldiring)" : "Parol *"}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="Kamida 8 belgi"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleGenerate} title="Avtomatik yaratish">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            {generatedPass && (
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                Parol: {generatedPass} <button type="button" onClick={() => navigator.clipboard.writeText(generatedPass)} className="underline ml-1">Nusxa</button>
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Rol *</label>
            <select
              {...register("role")}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="OPERATOR">Operator</option>
              <option value="MANAGER">Menejjer</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>

          {/* Permissions */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ruxsatlar</p>
            <div className="space-y-2">
              {permissions.map((p) => (
                <label key={p.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register(p.key)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Bekor qilish</Button>
            <Button type="submit" loading={loading}>{user ? "Saqlash" : "Qo'shish"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}