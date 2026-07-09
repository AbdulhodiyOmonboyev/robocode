"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

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
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchId, setBranchIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBranchIdState(readCookie(COOKIE_KEY));
    fetch("/api/branches")
      .then((r) => r.json())
      .then((d) => setBranches(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setBranchId = useCallback((id: string | null) => {
    setBranchIdState(id);
    writeCookie(COOKIE_KEY, id);
  }, []);

  return (
    <BranchContext.Provider value={{ branches, branchId, setBranchId, loading }}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const ctx = useContext(BranchContext);
  if (!ctx) throw new Error("useBranch must be used within a BranchProvider");
  return ctx;
}
