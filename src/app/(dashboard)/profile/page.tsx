"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { User as UserIcon, KeyRound, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROLE_LABELS } from "@/lib/permissions";
import { getInitials } from "@/lib/utils";

const ROLE_BADGE_CLS: Record<string, string> = {
  SUPER_ADMIN: "bg-[#5E2CA5]/10 text-[#5E2CA5] dark:bg-[#5E2CA5]/20",
  ADMIN: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  OPERATOR: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  MANAGER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
};

interface SessionUser {
  id: string;
  fullName?: string;
  name?: string;
  username?: string;
  role?: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user as SessionUser | undefined;

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const changePassword = async () => {
    if (!user?.id) return;
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Barcha maydonlarni to'ldiring");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Yangi parol kamida 8 ta belgi bo'lsin");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Parollar mos kelmadi");
      return;
    }

    setSaving(true);
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword, oldPassword }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (res.ok) {
      toast.success("Parol muvaffaqiyatli o'zgartirildi");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(data.error || "Parolni o'zgartirib bo'lmadi");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profil</h1>
        <p className="text-sm text-gray-500 mt-0.5">Shaxsiy ma&apos;lumotlar va xavfsizlik sozlamalari</p>
      </div>

      {/* User info */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-[#5E2CA5]" />
            Foydalanuvchi ma&apos;lumotlari
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#5E2CA5]/10 dark:bg-[#5E2CA5]/20 flex items-center justify-center">
              <span className="text-lg font-semibold text-[#5E2CA5] dark:text-purple-400">
                {user ? getInitials(user.fullName ?? user.name ?? "U") : "U"}
              </span>
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
                {user?.fullName ?? user?.name ?? "—"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">@{user?.username ?? "—"}</p>
              {user?.role && (
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                    ROLE_BADGE_CLS[user.role] || "bg-gray-100 text-gray-600 dark:bg-white/8 dark:text-gray-400"
                  }`}
                >
                  {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] || user.role}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change password */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#5E2CA5]" />
            Parolni o&apos;zgartirish
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Eski parol"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="••••••••"
            className="focus:ring-[#5E2CA5] focus:border-transparent"
          />
          <Input
            label="Yangi parol"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Kamida 8 ta belgi"
            className="focus:ring-[#5E2CA5] focus:border-transparent"
          />
          <Input
            label="Yangi parolni tasdiqlang"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="focus:ring-[#5E2CA5] focus:border-transparent"
          />
          <Button
            onClick={changePassword}
            loading={saving}
            className="bg-[#5E2CA5] hover:bg-[#4e2488] text-white shadow-sm"
          >
            <Save className="w-4 h-4" /> Saqlash
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
