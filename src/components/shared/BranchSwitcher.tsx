"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { ChevronDown, Building2 } from "lucide-react";
import { useBranch } from "@/contexts/BranchContext";

interface SessionUser {
  role?: string;
}

export default function BranchSwitcher() {
  const { data: session } = useSession();
  const { branches, branchId, setBranchId, loading } = useBranch();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const user = session?.user as SessionUser | undefined;
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (loading || branches.length === 0) return null;

  const activeBranch = branches.find((b) => b.id === branchId);
  const label = activeBranch ? activeBranch.name : "Barcha filiallar";

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
      >
        <Building2 className="w-4 h-4 text-gray-400" />
        <span className="max-w-[120px] truncate">{label}</span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden py-1.5">
          {isSuperAdmin && (
            <button
              onClick={() => { setBranchId(null); setOpen(false); }}
              className={`w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-[13px] transition-colors ${
                !branchId
                  ? "text-[#5E2CA5] font-medium bg-[#5E2CA5]/10"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              Barcha filiallar
            </button>
          )}
          {branches.map((b) => (
            <button
              key={b.id}
              onClick={() => { setBranchId(b.id); setOpen(false); }}
              className={`w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-[13px] truncate transition-colors ${
                branchId === b.id
                  ? "text-[#5E2CA5] font-medium bg-[#5E2CA5]/10"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
