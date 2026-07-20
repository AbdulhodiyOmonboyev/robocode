import { InstagramGlyph } from "./InstagramGlyph";
import { TelegramGlyph } from "./TelegramGlyph";

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
            <li>
              Manzil:{" "}
              <a
                href="https://www.google.com/maps/search/?api=1&query=P8WW%2BP7G+Ulitsa+Lermontova+Andijan+Uzbekistan"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#A3E635] transition-colors"
              >
                Lermontov ko&apos;chasi, Andijon (P8WW+P7G)
              </a>
            </li>
            <li>
              Telefon:{" "}
              <a href="tel:+998998999005" className="hover:text-[#A3E635] transition-colors">
                +998 99 899 9005
              </a>
              ,{" "}
              <a href="tel:+998930759005" className="hover:text-[#A3E635] transition-colors">
                +998 93 075 9005
              </a>
            </li>
            <li>Ish vaqti: 9:00 – 18:00</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white text-sm uppercase tracking-wide">Ijtimoiy tarmoqlar</h3>
          <div className="mt-4 flex items-start gap-8 text-sm">
            <div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-white/50 uppercase tracking-wide">
                <InstagramGlyph className="w-3.5 h-3.5 flex-shrink-0" /> Instagram
              </span>
              <ul className="mt-2 space-y-2">
                <li>
                  <a
                    href="https://instagram.com/aka.yakubov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A1A1AA] hover:text-[#A3E635] transition-colors"
                  >
                    @aka.yakubov
                  </a>
                </li>
                <li>
                  <a
                    href="https://robocode.uz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A1A1AA] hover:text-[#A3E635] transition-colors"
                  >
                    @robocode.uz
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-white/50 uppercase tracking-wide">
                <TelegramGlyph className="w-3.5 h-3.5 flex-shrink-0" /> Telegram
              </span>
              <ul className="mt-2 space-y-2">
                <li>
                  <a
                    href="https://t.me/robocodee"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A1A1AA] hover:text-[#A3E635] transition-colors"
                  >
                    @robocodee
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me/robocodeadmin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A1A1AA] hover:text-[#A3E635] transition-colors"
                  >
                    @robocodeadmin
                  </a>
                </li>
              </ul>
            </div>
          </div>
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
