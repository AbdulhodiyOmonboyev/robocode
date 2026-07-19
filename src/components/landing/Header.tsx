"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#about", label: "Biz haqimizda" },
  { href: "#courses", label: "Kurslar" },
  { href: "#team", label: "Jamoa" },
  { href: "#contact", label: "Aloqa" },
];

export function Header({ centerName, logo }: { centerName: string; logo: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        scrolled ? "bg-[#08060F]/85 backdrop-blur-md border-b border-white/10" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo || "/api/branding/logo"} alt={centerName} className="w-9 h-9 rounded-lg object-contain bg-white shadow-sm flex-shrink-0" />
          <span className="font-bold text-white truncate tracking-tight">{centerName}</span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-[#A1A1AA] hover:text-[#A3E635] transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-white/80 hover:text-white transition-colors px-3 py-2">
            Kirish
          </Link>
          <a
            href="#ariza"
            className="text-sm font-bold text-[#08060F] bg-[#A3E635] hover:brightness-110 transition-[filter] px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(163,230,53,0.35)]"
          >
            Kursga yozilish
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 -mr-2 text-white"
          aria-label={menuOpen ? "Menyuni yopish" : "Menyuni ochish"}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#08060F] px-4 pb-4 pt-2">
          <nav className="flex flex-col">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={handleNavClick}
                className="py-2.5 text-sm font-medium text-white/80 border-b border-white/5 last:border-0"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3 mt-3">
            <Link href="/login" onClick={handleNavClick} className="flex-1 text-center text-sm font-semibold text-white border border-white/15 rounded-xl py-2.5">
              Kirish
            </Link>
            <a href="#ariza" onClick={handleNavClick} className="flex-1 text-center text-sm font-bold text-[#08060F] bg-[#A3E635] rounded-xl py-2.5">
              Kursga yozilish
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
