"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Clock, AlertCircle, CalendarClock } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface Reminder {
  id: string;
  title: string;
  remindAt: string;
  status: string;
  lead: { fullName: string };
}

const BRAND = "#5E2CA5";

function itemIcon(remindAt: string) {
  const isOverdue = new Date(remindAt) < new Date();
  return isOverdue ? AlertCircle : CalendarClock;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/reminders?status=PENDING&limit=6");
        if (res.ok) {
          const data = await res.json();
          setReminders(data.reminders || []);
          setUnread(data.totalToday ?? (data.reminders || []).length);
        }
      } catch {}
    }
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative flex-shrink-0" ref={ref} style={{ fontFamily: "'Inter', sans-serif" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
        aria-label="Bildirishnomalar"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 ring-white dark:ring-gray-900"
            style={{ backgroundColor: BRAND }}
          />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/10">
            <span className="text-[13px] font-semibold text-gray-900 dark:text-white">Bildirishnomalar</span>
            {unread > 0 && (
              <span
                className="text-[11px] font-medium px-2 py-0.5 rounded-lg"
                style={{ backgroundColor: `${BRAND}1A`, color: BRAND }}
              >
                {unread} yangi
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {reminders.length === 0 ? (
              <div className="py-10 text-center">
                <Clock className="w-6 h-6 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-[13px] text-gray-400 dark:text-gray-500">Yaqin eslatmalar yo&apos;q</p>
              </div>
            ) : (
              reminders.map((r) => {
                const Icon = itemIcon(r.remindAt);
                return (
                  <Link
                    key={r.id}
                    href="/reminders"
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-50 dark:border-white/5 last:border-0 transition-colors"
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${BRAND}14` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: BRAND }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">{r.title}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                        {r.lead?.fullName} · {formatRelativeTime(r.remindAt)}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          <div className="px-4 py-2 border-t border-gray-100 dark:border-white/10">
            <Link
              href="/reminders"
              onClick={() => setOpen(false)}
              className="block text-center text-[12px] font-medium py-1 transition-colors hover:opacity-80"
              style={{ color: BRAND }}
            >
              Barchasini ko&apos;rish →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
