"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  type LucideIcon,
  Search, X, CornerDownLeft, ArrowUp, ArrowDown,
  LayoutDashboard, Users, GraduationCap, Presentation, ClipboardCheck,
  CalendarRange, ClipboardList, Trophy, BookOpen, Wallet, AlertCircle,
  Gift, PlusCircle, Banknote, TrendingDown, ArrowLeftRight, BarChart3,
  TrendingUp, FileBarChart, Bell, Settings, UserCog, ScrollText, Pin,
} from "lucide-react";
import { cn, getInitials, formatPhone } from "@/lib/utils";

const BRAND = "#5E2CA5";

interface PageEntry { href: string; label: string; icon: LucideIcon; keywords?: string }

const PAGES: PageEntry[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Lidlar", icon: Users },
  { href: "/leads/kanban", label: "Kanban", icon: Pin },
  { href: "/students", label: "Talabalar", icon: GraduationCap },
  { href: "/groups", label: "Guruhlar", icon: GraduationCap },
  { href: "/teachers", label: "O'qituvchilar", icon: Presentation },
  { href: "/attendance", label: "Davomat", icon: ClipboardCheck },
  { href: "/timetable", label: "Dars jadvali", icon: CalendarRange },
  { href: "/exams", label: "Imtihonlar", icon: ClipboardList },
  { href: "/leaderboard", label: "Reyting", icon: Trophy },
  { href: "/courses", label: "Kurslar", icon: BookOpen },
  { href: "/payments", label: "To'lovlar", icon: Wallet },
  { href: "/debtors", label: "Qarzdorlar", icon: AlertCircle, keywords: "qarz debt" },
  { href: "/bonuses", label: "Bonuslar", icon: Gift },
  { href: "/incomes", label: "Qo'shimcha daromad", icon: PlusCircle },
  { href: "/payroll", label: "Ish haqi", icon: Banknote },
  { href: "/expenses", label: "Xarajatlar", icon: TrendingDown },
  { href: "/cashflow", label: "Pul oqimi", icon: ArrowLeftRight },
  { href: "/reports", label: "Hisobotlar", icon: BarChart3 },
  { href: "/analytics", label: "Analitika", icon: TrendingUp },
  { href: "/teacher-report", label: "O'qituvchi hisoboti", icon: FileBarChart },
  { href: "/reminders", label: "Eslatmalar", icon: Bell },
  { href: "/settings", label: "Sozlamalar", icon: Settings },
  { href: "/users", label: "Hodimlar", icon: UserCog },
  { href: "/logs", label: "Jurnallar", icon: ScrollText },
];

interface LeadResult {
  id: string;
  fullName: string;
  phone: string;
  course?: { name: string } | null;
}

type ResultItem =
  | { type: "page"; key: string; href: string; label: string; icon: LucideIcon }
  | { type: "lead"; key: string; href: string; label: string; sub: string; phone: string };

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [leads, setLeads] = useState<LeadResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setLeads([]);
    setActiveIndex(0);
  }, []);

  // Global Ctrl+K / Cmd+K shortcut + Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        close();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Autofocus input when opened
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Debounced lead search
  useEffect(() => {
    if (!open || query.trim().length < 2) { setLeads([]); return; }
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/leads?search=${encodeURIComponent(query.trim())}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setLeads(data.leads || []);
        }
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, open]);

  const pageMatches = PAGES.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return p.label.toLowerCase().includes(q) || p.keywords?.toLowerCase().includes(q);
  }).slice(0, query.trim() ? 8 : 6);

  const results: ResultItem[] = [
    ...pageMatches.map((p) => ({ type: "page" as const, key: `page-${p.href}`, href: p.href, label: p.label, icon: p.icon })),
    ...leads.map((l) => ({
      type: "lead" as const,
      key: `lead-${l.id}`,
      href: `/leads/${l.id}`,
      label: l.fullName,
      sub: l.course?.name || formatPhone(l.phone),
      phone: l.phone,
    })),
  ];

  useEffect(() => { setActiveIndex(0); }, [query, leads.length]);

  const navigateTo = (href: string) => {
    router.push(href);
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[activeIndex];
      if (item) navigateTo(item.href);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 pt-[12vh] animate-modal-overlay"
      onClick={close}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-modal-content"
        style={{ fontFamily: "'Inter', sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-white/10">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Sahifa yoki lid qidirish..."
            className="flex-1 text-[14px] bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
          {searching && (
            <div className="w-3.5 h-3.5 border-2 border-gray-200 border-t-[#5E2CA5] rounded-full animate-spin flex-shrink-0" />
          )}
          <button
            onClick={close}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-1.5">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-[13px] text-gray-400">
              {query.trim() ? "Hech narsa topilmadi" : "Yozishni boshlang..."}
            </p>
          ) : (
            <>
              {pageMatches.length > 0 && (
                <p className="px-4 pt-2 pb-1 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Sahifalar
                </p>
              )}
              {pageMatches.map((p, idx) => {
                const Icon = p.icon;
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={`page-${p.href}`}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => navigateTo(p.href)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                      isActive ? "bg-[#5E2CA5]/8 dark:bg-[#5E2CA5]/15" : "hover:bg-gray-50 dark:hover:bg-white/5"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      isActive ? "bg-[#5E2CA5] text-white" : "bg-gray-100 dark:bg-white/8 text-gray-500 dark:text-gray-400"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={cn(
                      "text-[13px] font-medium truncate",
                      isActive ? "text-[#5E2CA5] dark:text-purple-300" : "text-gray-700 dark:text-gray-200"
                    )}>
                      {p.label}
                    </span>
                  </button>
                );
              })}

              {leads.length > 0 && (
                <p className="px-4 pt-3 pb-1 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Lidlar
                </p>
              )}
              {leads.map((l, i) => {
                const idx = pageMatches.length + i;
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={`lead-${l.id}`}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => navigateTo(`/leads/${l.id}`)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                      isActive ? "bg-[#5E2CA5]/8 dark:bg-[#5E2CA5]/15" : "hover:bg-gray-50 dark:hover:bg-white/5"
                    )}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                      style={{ backgroundColor: BRAND }}
                    >
                      {getInitials(l.fullName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        "text-[13px] font-medium truncate",
                        isActive ? "text-[#5E2CA5] dark:text-purple-300" : "text-gray-900 dark:text-white"
                      )}>
                        {l.fullName}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">
                        {l.course?.name || formatPhone(l.phone)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-gray-100 dark:border-white/10 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <ArrowUp className="w-3 h-3" /><ArrowDown className="w-3 h-3" /> tanlash
          </span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3" /> o&apos;tish
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 font-mono text-[10px]">Esc</kbd> yopish
          </span>
        </div>
      </div>
    </div>
  );
}
