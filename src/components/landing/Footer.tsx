import { InstagramGlyph } from "./InstagramGlyph";

export function Footer({ centerName, logo }: { centerName: string; logo: string }) {
  return (
    <footer id="contact" className="bg-[#08060F]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo || "/api/branding/logo"} alt={centerName} className="w-9 h-9 rounded-lg object-contain bg-white" />
            <span className="font-bold text-white">{centerName}</span>
          </div>
          <p className="mt-4 text-sm text-[#A1A1AA] leading-relaxed max-w-xs">
            Andijondagi birinchi IT akademiya — dasturlash va robototexnika bo&apos;yicha amaliy ta&apos;lim.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white text-sm uppercase tracking-wide">Aloqa</h3>
          <ul className="mt-4 space-y-3 text-sm text-[#A1A1AA]">
            <li>Manzil: tez orada to&apos;ldiriladi</li>
            <li>Telefon: tez orada to&apos;ldiriladi</li>
            <li>Ish vaqti: tez orada to&apos;ldiriladi</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white text-sm uppercase tracking-wide">Ijtimoiy tarmoqlar</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href="https://instagram.com/aka.yakubov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[#A1A1AA] hover:text-[#A3E635] transition-colors"
              >
                <InstagramGlyph className="w-4 h-4 flex-shrink-0" />
                @aka.yakubov
              </a>
            </li>
            <li className="text-[#A1A1AA]">Telegram: tez orada to&apos;ldiriladi</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white text-sm uppercase tracking-wide">Havolalar</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href="#courses" className="text-[#A1A1AA] hover:text-[#A3E635] transition-colors">Kurslar</a>
            </li>
            <li>
              <a href="#team" className="text-[#A1A1AA] hover:text-[#A3E635] transition-colors">Jamoa</a>
            </li>
            <li>
              <a href="#ariza" className="text-[#A1A1AA] hover:text-[#A3E635] transition-colors">Kursga yozilish</a>
            </li>
            <li>
              <a href="/login" className="text-[#A1A1AA] hover:text-[#A3E635] transition-colors">CRM&apos;ga kirish</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-xs text-white/40 text-center">
          © 2018 Robocode IT Academy. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </footer>
  );
}
