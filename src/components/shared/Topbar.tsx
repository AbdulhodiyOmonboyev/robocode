"use client";

import { useState, useEffect } from "react";
import { Bell, Moon, Sun, Search, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";

interface Reminder {
  id: string;
  title: string;
  remindAt: string;
  lead: { fullName: string };
}

export default function Topbar() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [bellOpen, setBellOpen] = useState(false);
  const [reminderCount, setReminderCount] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/leads?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center px-4 gap-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Qidirish... (Ctrl+K)"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </form>

      <div className="flex items-center gap-2 ml-auto">
        {/* Quick add lead */}
        <Link
          href="/leads/new"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition"
        >
          <Plus className="w-4 h-4" />
          Yangi lid
        </Link>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          title={dark ? "Yorug' rejim" : "Qorong'i rejim"}
        >
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Bell */}
        <div className="relative">
          <button
            onClick={() => setBellOpen(!bellOpen)}
            className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Bell className="w-5 h-5" />
            {reminderCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {reminderCount > 9 ? "9+" : reminderCount}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">Eslatmalar</span>
                <button onClick={() => setBellOpen(false)}>
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {reminders.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 text-sm">
                    Bugungi eslatmalar yo'q
                  </div>
                ) : (
                  reminders.map((r) => (
                    <Link
                      key={r.id}
                      href="/reminders"
                      onClick={() => setBellOpen(false)}
                      className="flex flex-col px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 border-b border-gray-50 dark:border-gray-700 last:border-0"
                    >
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{r.title}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {r.lead.fullName} · {formatRelativeTime(r.remindAt)}
                      </span>
                    </Link>
                  ))
                )}
              </div>
              <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
                <Link
                  href="/reminders"
                  onClick={() => setBellOpen(false)}
                  className="block text-center text-xs text-indigo-600 hover:text-indigo-700 font-medium py-1"
                >
                  Barchasini ko'rish →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
