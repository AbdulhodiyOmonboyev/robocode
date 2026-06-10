"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
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
  GraduationCap,
  UserCog,
  Pin,
  Wallet,
  ClipboardCheck,
  TrendingUp,
  Presentation,
  CalendarRange,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Lidlar", icon: Users },
  { href: "/leads/kanban", label: "Kanban", icon: Pin },
  { href: "/groups", label: "Guruhlar", icon: GraduationCap },
  { href: "/attendance", label: "Davomat", icon: ClipboardCheck },
  { href: "/timetable", label: "Dars jadvali", icon: CalendarRange },
  { href: "/payments", label: "To'lovlar", icon: Wallet },
  { href: "/reminders", label: "Eslatmalar", icon: Bell },
  { href: "/schedule", label: "Jadval", icon: Calendar },
  { href: "/courses", label: "Kurslar", icon: BookOpen },
  { href: "/teachers", label: "O'qituvchilar", icon: Presentation },
  { href: "/reports", label: "Hisobotlar", icon: BarChart3 },
  { href: "/analytics", label: "Analitika", icon: TrendingUp },
  { href: "/users", label: "Hodimlar", icon: UserCog },
  { href: "/settings", label: "Sozlamalar", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [logo, setLogo] = useState("");
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    fetch("/api/branding").then(r=>r.json()).then(d=>{ if (d.logo) setLogo(d.logo); }).catch(()=>{});
  }, []);

  const user = session?.user as any;

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
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <Icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
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
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.role}
              </p>
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
