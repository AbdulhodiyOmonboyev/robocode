"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  type LucideIcon,
  LayoutDashboard,
  Users,
  BookOpen,
  Bell,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  UserCog,
  Pin,
  Wallet,
  ClipboardCheck,
  TrendingUp,
  Presentation,
  CalendarRange,
  TrendingDown,
  PlusCircle,
  Banknote,
  ArrowLeftRight,
  ClipboardList,
  Trophy,
  ScrollText,
  FileBarChart,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: LucideIcon };
type NavEntry =
  | { type: "item"; href: string; label: string; icon: LucideIcon; children?: NavItem[] }
  | { type: "group"; label: string; icon: LucideIcon; children: NavItem[] };

const navEntries: NavEntry[] = [
  { type: "item", href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    type: "item",
    href: "/leads",
    label: "Lidlar",
    icon: Users,
    children: [
      { href: "/leads/kanban", label: "Kanban", icon: Pin },
    ],
  },
  {
    type: "group",
    label: "O'quv",
    icon: GraduationCap,
    children: [
      { href: "/groups", label: "Guruhlar", icon: GraduationCap },
      { href: "/attendance", label: "Davomat", icon: ClipboardCheck },
      { href: "/exams", label: "Imtihonlar", icon: ClipboardList },
      { href: "/leaderboard", label: "Reyting", icon: Trophy },
      { href: "/timetable", label: "Dars jadvali", icon: CalendarRange },
    ],
  },
  {
    type: "group",
    label: "Moliya",
    icon: Wallet,
    children: [
      { href: "/payments", label: "To'lovlar", icon: Wallet },
      { href: "/expenses", label: "Xarajatlar", icon: TrendingDown },
      { href: "/incomes", label: "Qo'shimcha daromad", icon: PlusCircle },
      { href: "/payroll", label: "Ish haqi", icon: Banknote },
      { href: "/cashflow", label: "Pul oqimi", icon: ArrowLeftRight },
    ],
  },
  {
    type: "group",
    label: "Boshqaruv",
    icon: Settings,
    children: [
      { href: "/reminders", label: "Eslatmalar", icon: Bell },
      { href: "/schedule", label: "Jadval", icon: Calendar },
      { href: "/courses", label: "Kurslar", icon: BookOpen },
      { href: "/teachers", label: "O'qituvchilar", icon: Presentation },
    ],
  },
  {
    type: "group",
    label: "Hisobotlar",
    icon: BarChart3,
    children: [
      { href: "/reports", label: "Hisobotlar", icon: BarChart3 },
      { href: "/analytics", label: "Analitika", icon: TrendingUp },
      { href: "/teacher-report", label: "O'qituvchi hisoboti", icon: FileBarChart },
      { href: "/logs", label: "Jurnallar", icon: ScrollText },
    ],
  },
  {
    type: "group",
    label: "Tizim",
    icon: UserCog,
    children: [
      { href: "/users", label: "Hodimlar", icon: UserCog },
      { href: "/settings", label: "Sozlamalar", icon: Settings },
    ],
  },
];

const isActivePath = (href: string, pathname: string) =>
  pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

const hasActiveChild = (children: NavItem[], pathname: string) =>
  children.some(c => isActivePath(c.href, pathname));

const initOpenGroups = (pathname: string): Record<string, boolean> => {
  const result: Record<string, boolean> = {};
  for (const entry of navEntries) {
    if (entry.type === "group") {
      result[entry.label] = hasActiveChild(entry.children, pathname);
    } else if (entry.children) {
      result[entry.label] = hasActiveChild(entry.children, pathname);
    }
  }
  return result;
};

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [logo, setLogo] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => initOpenGroups(pathname)
  );

  useEffect(() => {
    fetch("/api/branding").then(r => r.json()).then(d => { if (d.logo) setLogo(d.logo); }).catch(() => {});
  }, []);

  const user = session?.user as any;

  const toggle = (key: string) =>
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));

  const linkCls = (href: string) =>
    cn(
      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
      isActivePath(href, pathname)
        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
    );

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    return (
      <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined} className={linkCls(item.href)}>
        <Icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  const renderNavEntry = (entry: NavEntry) => {
    if (entry.type === "group") {
      const open = openGroups[entry.label] ?? true;
      const Icon = entry.icon;
      if (collapsed) {
        return (
          <div key={entry.label} className="space-y-0.5 mb-1">
            {entry.children.map(renderNavItem)}
          </div>
        );
      }
      const activeInGroup = !open && hasActiveChild(entry.children, pathname);
      return (
        <div key={entry.label} className="mt-3">
          <button
            onClick={() => toggle(entry.label)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors",
              activeInGroup
                ? "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            )}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="flex-1 text-left">{entry.label}</span>
            <ChevronDown className={cn("w-3 h-3 flex-shrink-0 transition-transform duration-200", !open && "-rotate-90")} />
          </button>
          {open && (
            <div className="space-y-0.5 mt-0.5">
              {entry.children.map(renderNavItem)}
            </div>
          )}
        </div>
      );
    }

    // type: "item"
    const Icon = entry.icon;
    if (!entry.children) {
      return (
        <Link key={entry.href} href={entry.href} title={collapsed ? entry.label : undefined} className={linkCls(entry.href)}>
          <Icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
          {!collapsed && <span>{entry.label}</span>}
        </Link>
      );
    }

    const open = openGroups[entry.label] ?? true;
    return (
      <div key={entry.href}>
        <div className={cn("flex items-center", !collapsed && "gap-1")}>
          <Link href={entry.href} title={collapsed ? entry.label : undefined} className={cn(linkCls(entry.href), "flex-1")}>
            <Icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
            {!collapsed && <span>{entry.label}</span>}
          </Link>
          {!collapsed && (
            <button
              onClick={() => toggle(entry.label)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", !open && "-rotate-90")} />
            </button>
          )}
        </div>
        {open && !collapsed && (
          <div className="space-y-0.5 mt-0.5 pl-3 border-l border-gray-200 dark:border-gray-700 ml-4">
            {entry.children.map(renderNavItem)}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo || "/icon.svg"} alt="Robocode CRM" className="flex-shrink-0 w-8 h-8 rounded-lg object-contain" />
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-bold text-gray-900 dark:text-white text-sm truncate">Robocode CRM</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Lidlar tizimi</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-gray-500" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-gray-500" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        {navEntries.map(renderNavEntry)}
      </nav>

      {/* User profile + logout */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-3">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              {user ? getInitials(user.fullName || user.name || "U") : "U"}
            </span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.fullName || user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.role}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition"
              title="Chiqish"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mt-2 w-full flex justify-center p-1 text-gray-400 hover:text-red-500 transition"
            title="Chiqish"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
