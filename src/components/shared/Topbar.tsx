"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Moon, Sun, Search, Plus, X, Menu, LogOut, Settings } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { formatRelativeTime, getInitials } from "@/lib/utils";
import { useDarkMode } from "@/hooks/useDarkMode";

interface Reminder {
  id: string;
  title: string;
  remindAt: string;
  lead: { fullName: string };
}

interface SessionUser {
  fullName?: string;
  name?: string;
  role?: string;
}

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/leads/kanban": "Kanban",
  "/leads/new": "Yangi lid",
  "/leads": "Lidlar",
  "/students": "O'quvchilar",
  "/groups": "Guruhlar",
  "/teachers": "O'qituvchilar",
  "/attendance": "Davomat",
  "/timetable": "Dars jadvali",
  "/exams": "Imtihonlar",
  "/leaderboard": "Reyting",
  "/courses": "Kurslar",
  "/payments": "To'lovlar",
  "/debtors": "Qarzdorlar",
  "/bonuses": "Bonuslar",
  "/incomes": "Qo'shimcha daromad",
  "/payroll": "Ish haqi",
  "/expenses": "Xarajatlar",
  "/cashflow": "Pul oqimi",
  "/reports": "Hisobotlar",
  "/analytics": "Analitika",
  "/teacher-report": "O'qituvchi hisoboti",
  "/reminders": "Eslatmalar",
  "/settings": "Sozlamalar",
  "/users": "Hodimlar",
  "/logs": "Jurnallar",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const match = Object.keys(PAGE_TITLES)
    .filter((p) => pathname.startsWith(p))
    .sort((a, b) => b.length - a.length)[0];
  return match ? PAGE_TITLES[match] : "Dashboard";
}

export default function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { dark, toggleDark } = useDarkMode();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [bellOpen, setBellOpen] = useState(false);
  const [reminderCount, setReminderCount] = useState(0);
  const [search, setSearch] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const user = session?.user as SessionUser | undefined;
  const pageTitle = getPageTitle(pathname);

  useEffect(() => {
    async function loadReminders() {
      try {
        const res = await fetch("/api/reminders?status=PENDING&limit=5");
        if (res.ok) {
          const data = await res.json();
          setReminders(data.reminders || []);
          setReminderCount(data.totalToday || 0);
        }
      } catch {}
    }
    loadReminders();
    const interval = setInterval(loadReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/leads?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <header
      className="h-16 border-b border-gray-100 dark:border-white/10 bg-white dark:bg-gray-900 flex items-center px-3 sm:px-4 gap-2 sm:gap-4"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex-shrink-0"
        aria-label="Menyu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title (left) */}
      <h1 className="text-[15px] sm:text-[17px] font-bold text-gray-900 dark:text-white truncate flex-shrink-0">
        {pageTitle}
      </h1>

      {/* Right-side cluster */}
      <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
        {/* Search */}
        <form onSubmit={handleSearch} className="hidden sm:block w-48 lg:w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Qidirish..."
              className="w-full pl-9 pr-4 py-2 text-[13px] border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5E2CA5]/30 focus:border-[#5E2CA5]/50 transition"
            />
          </div>
        </form>

        {/* Quick add lead */}
        <Link
          href="/leads/new"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#5E2CA5] hover:bg-[#4a2280] text-white text-[13px] font-medium rounded-xl transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Yangi lid
        </Link>
        <Link
          href="/leads/new"
          className="md:hidden flex items-center justify-center w-9 h-9 bg-[#5E2CA5] hover:bg-[#4a2280] text-white rounded-xl transition-colors flex-shrink-0"
          aria-label="Yangi lid"
        >
          <Plus className="w-4 h-4" />
        </Link>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex-shrink-0"
          title={dark ? "Yorug' rejim" : "Qorong'i rejim"}
        >
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Bell / notifications */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setBellOpen(!bellOpen)}
            className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {reminderCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {reminderCount > 9 ? "9+" : reminderCount}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-16 sm:top-full sm:mt-2 sm:w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/10">
                <span className="font-semibold text-gray-900 dark:text-white text-[13px]">Eslatmalar</span>
                <button onClick={() => setBellOpen(false)}>
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {reminders.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 text-[13px]">
                    Bugungi eslatmalar yo&apos;q
                  </div>
                ) : (
                  reminders.map((r) => (
                    <Link
                      key={r.id}
                      href="/reminders"
                      onClick={() => setBellOpen(false)}
                      className="flex flex-col px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-50 dark:border-white/5 last:border-0 transition-colors"
                    >
                      <span className="text-[13px] font-medium text-gray-900 dark:text-white truncate">{r.title}</span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                        {r.lead.fullName} · {formatRelativeTime(r.remindAt)}
                      </span>
                    </Link>
                  ))
                )}
              </div>
              <div className="px-4 py-2 border-t border-gray-100 dark:border-white/10">
                <Link
                  href="/reminders"
                  onClick={() => setBellOpen(false)}
                  className="block text-center text-[12px] text-[#5E2CA5] hover:text-[#4a2280] font-medium py-1 transition-colors"
                >
                  Barchasini ko&apos;rish →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-gray-100 dark:bg-white/10 flex-shrink-0" />

        {/* User avatar / menu */}
        <div className="relative flex-shrink-0" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 p-1 pr-1.5 sm:pr-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#5E2CA5]/10 dark:bg-[#5E2CA5]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-semibold text-[#5E2CA5] dark:text-purple-300">
                {user ? getInitials(user.fullName ?? user.name ?? "U") : "U"}
              </span>
            </div>
            <div className="hidden sm:block text-left min-w-0">
              <p className="text-[12px] font-medium text-gray-900 dark:text-white leading-tight truncate max-w-[110px]">
                {user?.fullName ?? user?.name ?? "Foydalanuvchi"}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{user?.role}</p>
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden py-1.5">
              <div className="px-3.5 py-2 border-b border-gray-100 dark:border-white/10 mb-1">
                <p className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">
                  {user?.fullName ?? user?.name}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{user?.role}</p>
              </div>
              <Link
                href="/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                Sozlamalar
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Chiqish
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
