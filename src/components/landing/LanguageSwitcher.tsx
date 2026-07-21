"use client";

import { LANGS } from "./translations";
import { useLang } from "./LangContext";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLang();

  return (
    <div className={`flex gap-0.5 bg-[#A657F2]/10 border border-[#A657F2]/30 rounded-lg p-0.5 ${className || ""}`}>
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          className={`px-2.5 py-1.5 text-xs font-bold rounded-md transition-colors ${
            code === lang ? "bg-gradient-to-br from-[#7C3AED] to-[#A657F2] text-white" : "text-[#A1A1AA] hover:text-white"
          }`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
