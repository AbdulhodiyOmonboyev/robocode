"use client";

import { useState, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Opts = { title?: string; message?: string; confirmText?: string; danger?: boolean };

export function useConfirm() {
  const [state, setState] = useState<{ open: boolean; opts: Opts; resolve?: (v: boolean) => void }>({ open: false, opts: {} });

  const confirm = useCallback((opts: Opts = {}) => new Promise<boolean>((resolve) => {
    setState({ open: true, opts, resolve });
  }), []);

  const close = (v: boolean) => {
    state.resolve?.(v);
    setState((s) => ({ ...s, open: false }));
  };

  const danger = state.opts.danger !== false;

  const dialog = state.open ? (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={() => close(false)}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${danger ? "bg-red-100 dark:bg-red-900/30" : "bg-indigo-100 dark:bg-indigo-900/30"}`}>
          <AlertTriangle className={`w-6 h-6 ${danger ? "text-red-600" : "text-indigo-600"}`} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{state.opts.title || "Tasdiqlaysizmi?"}</h3>
        {state.opts.message && <p className="text-sm text-gray-500 mt-1">{state.opts.message}</p>}
        <div className="flex gap-2 mt-5">
          <Button variant="outline" className="flex-1" onClick={() => close(false)}>Bekor</Button>
          <button onClick={() => close(true)}
            className={`flex-1 py-2 text-white text-sm font-medium rounded-xl transition ${danger ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"}`}>
            {state.opts.confirmText || "O'chirish"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, dialog };
}
