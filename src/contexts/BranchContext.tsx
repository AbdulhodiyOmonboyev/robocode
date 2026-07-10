"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

export interface Branch {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  isActive: boolean;
}

interface BranchContextValue {
  branches: Branch[];
  branchId: string | null;
  setBranchId: (id: string | null) => void;
  loading: boolean;
  multiBranchEnabled: boolean;
}

const BranchContext = createContext<BranchContextValue | null>(null);

const COOKIE_KEY = "branchId";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string | null) {
  if (typeof document === "undefined") return;
  if (value) {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 365}`;
  } else {
    document.cookie = `${name}=; path=/; max-age=0`;
  }
}

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchId, setBranchIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [multiBranchEnabled, setMultiBranchEnabled] = useState(true);
  const autoCreateAttempted = useRef(false);

  useEffect(() => {
    setBranchIdState(readCookie(COOKIE_KEY));
    Promise.all([
      fetch("/api/branches").then((r) => r.json()).catch(() => []),
      fetch("/api/settings?prefix=multi_branch_enabled").then((r) => r.json()).catch(() => ({})),
    ])
      .then(([branchesData, settingsData]) => {
        setBranches(Array.isArray(branchesData) ? branchesData : []);
        setMultiBranchEnabled(settingsData?.multi_branch_enabled !== "false");
      })
      .finally(() => setLoading(false));
  }, []);

  // First run with no branches yet: seed a default "Asosiy filial" so the
  // multi-branch UI isn't empty. Only admins can create branches server-side.
  useEffect(() => {
    if (loading || branches.length > 0 || autoCreateAttempted.current) return;
    if (status !== "authenticated") return;
    const role = session?.user?.role;
    if (role !== "SUPER_ADMIN" && role !== "ADMIN") return;

    autoCreateAttempted.current = true;
    fetch("/api/branches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Asosiy filial" }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((b) => { if (b) setBranches((prev) => (prev.length ? prev : [b])); })
      .catch(() => {});
  }, [loading, branches.length, status, session?.user?.role]);

  const setBranchId = useCallback((id: string | null) => {
    setBranchIdState(id);
    writeCookie(COOKIE_KEY, id);
  }, []);

  return (
    <BranchContext.Provider value={{ branches, branchId, setBranchId, loading, multiBranchEnabled }}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const ctx = useContext(BranchContext);
  if (!ctx) throw new Error("useBranch must be used within a BranchProvider");
  return ctx;
}
