{/* Background Ambient Glows */}
  <div className="fixed top-0 left-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none -z-10 animate-glow"></div>
  <div className="fixed bottom-1/3 right-10 w-[500px] h-[500px] bg-brand-neon/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow"></div>
  <div className="fixed top-1/2 left-10 w-80 h-80 bg-brand-glow/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

  {/* Header / Navigation Bar: Full-width & rounded-none at top; floating rounded-full pill on scroll */}
  <header id="main-header" className="sticky top-0 z-40 transition-all duration-300">
    <div id="navbar-wrapper" className="transition-all duration-300 w-full px-0 pt-0">
      <div id="navbar-pill" className="transition-all duration-300 w-full bg-brand-dark/95 backdrop-blur-md border-b border-brand-border/60 rounded-none shadow-none px-4 sm:px-8 py-4 flex items-center justify-between">
        
        {/* Left: Robocode Logo & Brand */}
        <a href="#hero" className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-neon rounded-lg p-1 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-neon p-0.5 shadow-md shadow-brand-purple/40 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
            <img src="/assets/landing/landing_img_0.jpg" alt="Robocode Logo" className="w-full h-full object-cover rounded-[10px]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-brand-light transition-colors">Robocode</span>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-brand-purple/40 text-brand-light border border-brand-purple/50 font-medium">Academy</span>
            </div>
            <span className="text-[10px] text-brand-light/60 -mt-0.5 hidden sm:block">Andijondagi 1-IT Markaz</span>
          </div>
        </a>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-8 text-sm font-medium text-slate-300">
          <a href="#about" className="hover:text-brand-light transition-colors py-1">Biz haqimizda</a>
          <a href="#courses" className="hover:text-brand-light transition-colors py-1">Kurslar</a>
          <a href="#startup" className="hover:text-brand-light transition-colors py-1">Startup $20k</a>
          <a href="#crm-preview" className="hover:text-brand-light transition-colors py-1">CRM Tizimi</a>
          <a href="#team" className="hover:text-brand-light transition-colors py-1">Jamoa</a>
          <a href="#faq" className="hover:text-brand-light transition-colors py-1">Savollar</a>
        </nav>

        {/* Right Side Controls: Language Switcher + Ariza topshirish (CRM button removed) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Language Switcher UZ | RU | EN */}
          <div className="flex items-center bg-brand-card/90 border border-brand-border/80 rounded-full px-2.5 py-1 text-xs font-semibold text-slate-300">
            <button id="lang-uz" className="px-2 py-0.5 rounded-full bg-brand-purple text-white shadow-sm transition-colors">UZ</button>
            <button id="lang-ru" className="px-2 py-0.5 rounded-full hover:text-white transition-colors">RU</button>
            <button id="lang-en" className="px-2 py-0.5 rounded-full hover:text-white transition-colors">EN</button>
          </div>

          {/* Ariza topshirish CTA Button */}
          <a href="#ariza" className="inline-flex items-center justify-center px-5 sm:px-7 py-2.5 rounded-full bg-gradient-to-r from-brand-purple to-brand-neon hover:from-purple-600 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-brand-purple/30 hover:shadow-brand-purple/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0">
            Ariza topshirish
          </a>

          {/* Mobile Hamburger Menu Button */}
          <button id="mobile-menu-btn" aria-label="Menyuni ochish" className="lg:hidden p-2 rounded-xl bg-brand-card border border-brand-border text-slate-200 hover:text-white focus:outline-none">
            <svg id="menu-icon" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"  /></svg>
            <svg id="close-icon" className="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"  /></svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      <div id="mobile-menu" className="hidden lg:hidden bg-brand-surface/95 border-b border-brand-border px-5 pt-4 pb-6 space-y-3 shadow-2xl transition-all">
        <a href="#about" className="block text-slate-300 hover:text-white py-1">Biz haqimizda</a>
        <a href="#courses" className="block text-slate-300 hover:text-white py-1">Kurslar</a>
        <a href="#startup" className="block text-slate-300 hover:text-white py-1">Startup $20k</a>
        <a href="#crm-preview" className="block text-slate-300 hover:text-white py-1 flex items-center justify-between">
          <span>CRM Boshqaruv Tizimi</span>
          
        </a>
        <a href="#team" className="block text-slate-300 hover:text-white py-1">Jamoa</a>
        <a href="#faq" className="block text-slate-300 hover:text-white py-1">Savollar</a>
        <div className="pt-3 border-t border-brand-border/60">
          <a href="#ariza" className="block w-full py-2.5 rounded-full text-xs font-semibold bg-brand-purple hover:bg-brand-neon text-white text-center transition-colors shadow-md">
            Ariza topshirish
          </a>
        </div>
      </div>
    </div>
  </header>

  {/* SECTION 1: HERO SECTION */}
  <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Hero Content */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-card/90 border border-brand-neon/40 text-xs font-medium text-brand-light shadow-md shadow-brand-purple/20">
            <span className="text-brand-neon font-bold text-sm">✦</span>
            <span>Andijondagi 1-raqamli IT va Robototexnika Akademiyasi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            ROBOCODE — <br />
            <span className="bg-gradient-to-r from-brand-light via-brand-neon to-brand-purple bg-clip-text text-transparent neon-text-glow">
              ANDIJONDAGI BIRINCHI
            </span> <br />
            IT AKADEMIYA
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
            Biz bilan doim birinchi bo‘ling! Zamonaviy dasturlash tillari, robototexnika, AI vositalari, amaliy loyihalar va $20 000 lik startap inkubatsiyasi.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <a href="#courses" className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-purple to-brand-neon hover:from-purple-600 hover:to-indigo-500 shadow-xl shadow-brand-purple/40 hover:shadow-brand-purple/60 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"  /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"  /></svg>
              Kurslarni ko‘rish
            </a>
            <a href="#ariza" className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold text-brand-light bg-brand-card hover:bg-brand-surface border border-brand-border hover:border-brand-neon transition-all flex items-center justify-center gap-2">
              <span>Konsultatsiya olish</span>
              <svg className="w-4 h-4 text-brand-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"  /></svg>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">✓</span>
              <span>100% Amaliy ta’lim</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">✓</span>
              <span>Rasmiy Diplom & Sertifikat</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">✓</span>
              <span>Ish bilan ta’minlash ko‘magi</span>
            </div>
          </div>
        </div>

        {/* Right Hero Visual: Three.js 3D Robot Mascot in Glowing Rounded Box (as in image_6f4620.png) */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
          
          {/* Glowing Rounded Box Container (Mascot Qutichasi) */}
          <div id="hero-robot-box" className="relative w-full max-w-[360px] glass-card rounded-[32px] p-5 sm:p-6 border-2 border-brand-neon/60 shadow-2xl shadow-purple-950/70 relative neon-border-glow flex flex-col items-center group cursor-pointer" title="Robotga bosing! Chat ochilib, istalgan savolingizga javob beradi">
            
            {/* Dynamic Speech / Emotion Bubble */}
            <div id="robot-speech-bubble" className="mb-2 px-4 py-2 rounded-2xl bg-brand-dark/80 border border-brand-neon/40 text-xs text-white shadow-xl transition-all duration-500 flex items-center gap-2 max-w-xs text-center">
              <span id="robot-speech-icon" className="w-6 h-6 flex items-center justify-center shrink-0"></span>
              <span id="robot-speech-text" className="font-medium text-slate-200">Salom! Savolingiz bo‘lsa, meni bosing!</span>
            </div>

            {/* 3D Three.js Canvas Container */}
            <div id="robot-canvas-container" className="relative w-full h-[260px] sm:h-[280px] flex items-center justify-center select-none">
              <div className="absolute inset-4 bg-gradient-to-tr from-brand-purple/40 via-brand-neon/20 to-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
              <canvas id="robot-3d-canvas" className="w-full h-full block rounded-2xl"></canvas>
            </div>

            {/* Box Bottom Badge & Chat Trigger */}
            <div className="mt-3 w-full flex items-center justify-between pt-3 border-t border-brand-border/60 text-xs">
              <div className="flex items-center gap-2">
                <span id="robot-status-dot" className="w-2.5 h-2.5 rounded-full bg-brand-neon"></span>
                <span id="robot-status-text" className="font-medium text-slate-300">Robocode AI Yordamchi</span>
              </div>
              <button id="open-chat-from-hero" className="px-3 py-1.5 rounded-xl bg-brand-purple/40 hover:bg-brand-purple text-brand-light hover:text-white border border-brand-purple text-[11px] font-semibold transition-all flex items-center gap-1.5 shadow-md">
                <span>Savol berish</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"  /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KEY METRICS BAR */}
      <div className="mt-16 sm:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 sm:p-8 rounded-2xl text-center group transition-all duration-300">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white group-hover:text-brand-light transition-colors">3500+</div>
          <p className="mt-2 text-sm font-medium text-brand-light/80">Muvaffaqiyatli Bitiruvchilar</p>
          <div className="mt-3 text-xs text-slate-400">Andijon va butun O‘zbekiston bo‘ylab</div>
        </div>
        <div className="glass-card p-6 sm:p-8 rounded-2xl text-center group transition-all duration-300">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white group-hover:text-brand-light transition-colors">85%</div>
          <p className="mt-2 text-sm font-medium text-brand-light/80">Daromad Topayotganlar</p>
          <div className="mt-3 text-xs text-slate-400">Kursni tamomlagan bitiruvchilar bandligi</div>
        </div>
        <div className="glass-card p-6 sm:p-8 rounded-2xl text-center group transition-all duration-300">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white group-hover:text-brand-light transition-colors">$150 – $2500</div>
          <p className="mt-2 text-sm font-medium text-brand-light/80">O‘rtacha Oylik Maosh</p>
          <div className="mt-3 text-xs text-slate-400">Junior dan Senior darajagacha daromad</div>
        </div>
      </div>
    </div>
  </section>

  {/* SECTION 2: SIZNI NIMALAR KUTYAPTI? */}
  <section id="about" className="py-20 relative bg-brand-surface/40 border-t border-brand-border/40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs font-bold tracking-widest text-brand-neon uppercase mb-2">Imkoniyatlar</h2>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white">SIZNI NIMALAR KUTYAPTI</h3>
        <p className="mt-3 text-sm sm:text-base text-slate-400">
          Robocode IT akademiyasida har bir talaba faqat nazariya bilan cheklanmay, real ish bozori talablariga mos tajriba to‘playdi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl flex items-start gap-5 group hover:bg-brand-card/90 transition-all">
          <div className="w-12 h-12 rounded-xl bg-brand-purple/30 border border-brand-purple/60 flex items-center justify-center text-brand-neon shrink-0 group-hover:scale-110 transition-transform"><svg className="w-6 h-6 text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg></div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white group-hover:text-brand-light transition-colors">Real Startup loyihalarda amaliy tajriba</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              O‘quv davomida har bir talaba haqiqiy mijozlar uchun dastur, bot yoki veb-sayt yaratadi hamda eng iqtidorlilar jamoamizga ishga taklif qilinadi.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl flex items-start gap-5 group hover:bg-brand-card/90 transition-all">
          <div className="w-12 h-12 rounded-xl bg-brand-purple/30 border border-brand-purple/60 flex items-center justify-center text-brand-neon shrink-0 group-hover:scale-110 transition-transform"><svg className="w-6 h-6 text-brand-neon drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="m18 8 4-2-4-2v4z"/></svg></div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white group-hover:text-brand-light transition-colors">Tajribali Team Lead rahbarligida doimiy o‘sish</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              Katta xalqaro va mahalliy kompaniyalarda faoliyat yuritgan tajribali dasturchilar sizga har kuni kod tahlili (Code Review) va mentorlik qiladi.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl flex items-start gap-5 group hover:bg-brand-card/90 transition-all">
          <div className="w-12 h-12 rounded-xl bg-brand-purple/30 border border-brand-purple/60 flex items-center justify-center text-brand-neon shrink-0 group-hover:scale-110 transition-transform"><svg className="w-6 h-6 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg></div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white group-hover:text-brand-light transition-colors">Bepul grant imkoniyati</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              Kuchli bilim bazasi va ingliz tili darajasiga ega bo‘lgan iqtidorli yoshlar uchun to‘liq yoki qisman bepul o‘qish grantlari mavjud.
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl flex items-start gap-5 group hover:bg-brand-card/90 transition-all">
          <div className="w-12 h-12 rounded-xl bg-brand-purple/30 border border-brand-purple/60 flex items-center justify-center text-brand-neon shrink-0 group-hover:scale-110 transition-transform"><svg className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white group-hover:text-brand-light transition-colors">Faqat bilim emas — haqiqiy karyera</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              GitHub portfolioni shakllantirish, rezyume tayyorlash, texnik intervyulardan o‘tish va xalqaro frilans birjalarida buyurtma olish o‘rgatiladi.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* SECTION 3: BIZNI TANLASH UCHUN SABABLAR (with 3D Icons Banner & Motivational Pedestal Cards) */}
  <section className="py-20 relative overflow-hidden" id="about">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-xs font-bold tracking-widest text-brand-neon uppercase mb-2">Afzalliklarimiz</h2>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white">BIZNI TANLASH UCHUN SABABLAR</h3>
        <p className="mt-3 text-sm sm:text-base text-slate-400">
          Andijonda zamonaviy ta’lim standartlarini o‘rnatgan akademiyamizning 5 ta asosiy ustuni va motivatsiyasi.
        </p>
      </div>

      {/* 3D Feature Icons Showcase Banner (The 5 Pedestals / Kubiklar) */}
      <div className="glass-card rounded-3xl p-3 sm:p-6 mb-8 border-brand-neon/30 overflow-hidden shadow-2xl">
        <div className="relative rounded-2xl overflow-hidden group">
          <img src="/assets/landing/landing_img_1.jpg" alt="3D Feature Icons Set" className="w-full h-auto object-cover rounded-2xl transform group-hover:scale-[1.01] transition-transform duration-500" />
        </div>
      </div>

      {/* 5 Motivational Cards Aligned Directly to the 5 Pedestals (Kubiklarga mos motivatsion yozuvlar) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Kubik 1: Asboblar (Wrench & Hammer) */}
        <div className="glass-card p-5 rounded-2xl border border-brand-purple/40 hover:border-brand-neon/80 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px] shadow-lg group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-9 h-9 rounded-xl bg-purple-900/50 border border-brand-purple/60 text-cyan-400 flex items-center justify-center text-lg shadow-sm"><svg className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-card text-brand-light border border-brand-border">1-USTUN</span>
            </div>
            <h4 className="font-bold text-white text-sm mb-2 group-hover:text-brand-light transition-colors">Amaliyot & Real Loyihalar</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nazariya bilan cheklanmang! Birinchi oydanoq o‘z qo‘lingiz bilan real dasturlar va robotlar yarating. Har bir amaliy loyiha — katta IT sohasiga qo‘yilgan dadil qadamdir.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-brand-border/60">
            <span className="text-[11px] font-semibold text-brand-neon flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-pink-400 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg> O‘rgan, Yasa, Natijaga Erish!
            </span>
          </div>
        </div>

        {/* Kubik 2: Diplom va Shapka (Graduation Cap & Diploma) */}
        <div className="glass-card p-5 rounded-2xl border border-brand-purple/40 hover:border-brand-neon/80 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px] shadow-lg group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-9 h-9 rounded-xl bg-purple-900/50 border border-brand-purple/60 text-purple-400 flex items-center justify-center text-lg shadow-sm"><svg className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-card text-brand-light border border-brand-border">2-USTUN</span>
            </div>
            <h4 className="font-bold text-white text-sm mb-2 group-hover:text-brand-light transition-colors">Xalqaro Sertifikat & Bilim</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Haqiqiy bilim — sizning eng ishonchli sarmoyangiz! Xalqaro darajadagi nufuzli sertifikatga ega bo‘lib, nafaqat O‘zbekiston, balki xorijiy IT bozorida ham yuqori qadrlaning.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-brand-border/60">
            <span className="text-[11px] font-semibold text-brand-neon flex items-center gap-1">
              ⭐ Bilim — Kelajak Eshigining Kaliti!
            </span>
          </div>
        </div>

        {/* Kubik 3: CPU Mikrosxema (Central Processor) */}
        <div className="glass-card p-5 rounded-2xl border border-brand-purple/40 hover:border-brand-neon/80 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px] shadow-lg group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-9 h-9 rounded-xl bg-purple-900/50 border border-brand-purple/60 text-brand-neon flex items-center justify-center text-lg shadow-sm">⚡</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-card text-brand-light border border-brand-border">3-USTUN</span>
            </div>
            <h4 className="font-bold text-white text-sm mb-2 group-hover:text-brand-light transition-colors">Ilg‘or Texnologiya & AI</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Kelajakni kutmang, uni o‘zingiz dasturlang! Zamonaviy datchiklar, aqlli mikrosxemalar va sun’iy intellekt vositalarini o‘rganib, texnologiyalar asrining yetakchisiga aylaning.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-brand-border/60">
            <span className="text-[11px] font-semibold text-brand-neon flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-amber-300 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg> Innovatsiyani Boshqar, Birinchi Bo‘l!
            </span>
          </div>
        </div>

        {/* Kubik 4: Qalqon va Sifat (Shield & Quality Checkmark) */}
        <div className="glass-card p-5 rounded-2xl border border-brand-purple/40 hover:border-brand-neon/80 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px] shadow-lg group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-9 h-9 rounded-xl bg-purple-900/50 border border-brand-purple/60 text-blue-400 flex items-center justify-center text-lg shadow-sm"><svg className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg></span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-card text-brand-light border border-brand-border">4-USTUN</span>
            </div>
            <h4 className="font-bold text-white text-sm mb-2 group-hover:text-brand-light transition-colors">Kafolatlangan Sifat & Natija</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Biz sifatga va sizning natijangizga 100% kafolat beramiz! Shaxsiy mentorlik, doimiy sifat nazorati va har bir mavzuni chuqur o‘zlashtirish orqali kutilgan maqsadga erishing.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-brand-border/60">
            <span className="text-[11px] font-semibold text-brand-neon flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-rose-400 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> Ishonchli Sifat — Mustahkam Kelajak!
            </span>
          </div>
        </div>

        {/* Kubik 5: Do'stona Robotlar Jamoasi (Team of Avatars) */}
        <div className="glass-card p-5 rounded-2xl border border-brand-purple/40 hover:border-brand-neon/80 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px] shadow-lg group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-9 h-9 rounded-xl bg-purple-900/50 border border-brand-purple/60 text-emerald-400 flex items-center justify-center text-lg shadow-sm"><svg className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m11 17 2 2a1 1 0 0 0 1.4 0l6.6-6.6a2 2 0 0 0 0-2.8l-4.2-4.2a2 2 0 0 0-2.8 0L7 12"/><path d="m18 10 1.4-1.4a2 2 0 0 0 0-2.8l-1.4-1.4a2 2 0 0 0-2.8 0L14 6"/><path d="M10 14 7 17a2 2 0 0 1-2.8 0l-1.4-1.4a2 2 0 0 1 0-2.8L6 10"/><path d="m2 17 4 4"/></svg></span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-card text-brand-light border border-brand-border">5-USTUN</span>
            </div>
            <h4 className="font-bold text-white text-sm mb-2 group-hover:text-brand-light transition-colors">Do‘stona Hamjamiyat & Jamoa</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Yolg‘iz o‘rganishdan ko‘ra, kuchlilar safida bo‘ling! Tajribali ustozlar va intiluvchan safdoshlar muhiti sizni har kuni yangi marralar sari ilhomlantiradi.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-brand-border/60">
            <span className="text-[11px] font-semibold text-brand-neon flex items-center gap-1">
              ✨ Birgalikda Biz Yengilmas Jamoamiz!
            </span>
          </div>
        </div>

      </div>
    </div>
  </section>

  {/* SECTION 4: SIZGA MOS YO'NALISHNI TANLANG (Courses Showcase) */}
  <section id="courses" className="py-20 relative bg-brand-surface/40 border-t border-brand-border/40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-block px-3 py-1 rounded-full bg-brand-purple/30 border border-brand-purple/60 text-xs font-semibold text-brand-light mb-3">
          Barcha kurslarimiz oyiga atigi 743 ming so‘mdan boshlanadi
        </div>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white">SIZGA MOS YO‘NALISHNI TANLANG</h3>
        <p className="mt-3 text-sm sm:text-base text-slate-400">
          Bolalar, maktab o‘quvchilari va kattalar uchun zamonaviy IT va robototexnika sohalari.
        </p>
      </div>

      {/* 3D Courses Showcase Visual Grid */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 mb-12 border-brand-neon/30 overflow-hidden shadow-2xl">
        <img src="/assets/landing/landing_img_2.jpg" alt="Robocode Course Showcase 3D" className="w-full h-auto object-cover rounded-2xl" />
      </div>

      {/* Interactive Course Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
        <button className="course-tab-btn active px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-purple text-white shadow-md transition-all" data-filter="all">Barchasi (8)</button>
        <button className="course-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-card text-slate-300 hover:text-white border border-brand-border transition-all" data-filter="coding">Dasturlash</button>
        <button className="course-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-card text-slate-300 hover:text-white border border-brand-border transition-all" data-filter="robotics">Robototexnika & AI</button>
        <button className="course-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-card text-slate-300 hover:text-white border border-brand-border transition-all" data-filter="design">Dizayn</button>
        <button className="course-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-card text-slate-300 hover:text-white border border-brand-border transition-all" data-filter="startup">Startup</button>
      </div>

      {/* Courses 8 Cards Grid */}
      <div id="course-cards-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. Robototexnika */}
        <div className="course-card glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-brand-neon transition-all" data-cat="robotics">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">10 oy</span>
              <span className="text-xs text-slate-400">743 000 so‘m/oy</span>
            </div>
            <h4 className="text-lg font-bold text-white">ROBOTOTEXNIKA</h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Elektronika va fizika — mikrosxemalar</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Dasturlash: Scratch, mBlock, o‘yinlar</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Aqlli robotlar, datchiklar, Wi-Fi boshqaruvi</li>
            </ul>
          </div>
          <button className="select-course-btn w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-purple/40 hover:bg-brand-purple text-white border border-brand-purple transition-all" data-course="Robototexnika">
            Kursga yozilish
          </button>
        </div>

        {/* 2. Foundation */}
        <div className="course-card glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-brand-neon transition-all" data-cat="coding">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-brand-purple/20 text-brand-light border border-brand-purple/40">2 oy</span>
              <span className="text-xs text-slate-400">743 000 so‘m/oy</span>
            </div>
            <h4 className="text-lg font-bold text-white">FOUNDATION</h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Kompyuter asoslari va tizimlar</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Word, Excel, PowerPoint, Canva</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> AI tools, Figma va Cloud vositalar</li>
            </ul>
          </div>
          <button className="select-course-btn w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-purple/40 hover:bg-brand-purple text-white border border-brand-purple transition-all" data-course="Foundation">
            Kursga yozilish
          </button>
        </div>

        {/* 3. Front-End */}
        <div className="course-card glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-brand-neon transition-all" data-cat="coding">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">6 oy</span>
              <span className="text-xs text-slate-400">743 000 so‘m/oy</span>
            </div>
            <h4 className="text-lg font-bold text-white">FRONT-END</h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> HTML5, CSS3, Flexbox, Tailwind</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> JavaScript DOM, funksiyalar, API</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> React.js va real SPA loyihalar</li>
            </ul>
          </div>
          <button className="select-course-btn w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-purple/40 hover:bg-brand-purple text-white border border-brand-purple transition-all" data-course="Front-End">
            Kursga yozilish
          </button>
        </div>

        {/* 4. Back-End */}
        <div className="course-card glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-brand-neon transition-all" data-cat="coding">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">6 oy</span>
              <span className="text-xs text-slate-400">743 000 so‘m/oy</span>
            </div>
            <h4 className="text-lg font-bold text-white">BACK-END</h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> REST API, ma’lumotlar bazasi (SQL)</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Autentifikatsiya, xavfsizlik, JWT</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Serverga joylash va GitHub portfolio</li>
            </ul>
          </div>
          <button className="select-course-btn w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-purple/40 hover:bg-brand-purple text-white border border-brand-purple transition-all" data-course="Back-End">
            Kursga yozilish
          </button>
        </div>

        {/* 5. Web & UI/UX Dizayn */}
        <div className="course-card glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-brand-neon transition-all" data-cat="design">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40">6 oy</span>
              <span className="text-xs text-slate-400">743 000 so‘m/oy</span>
            </div>
            <h4 className="text-lg font-bold text-white">WEB (UI/UX) DIZAYN</h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Figma, Auto-layout, komponentlar</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Responsiv veb-sayt va mobil ilovalar</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> UX audit, prototip va brending</li>
            </ul>
          </div>
          <button className="select-course-btn w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-purple/40 hover:bg-brand-purple text-white border border-brand-purple transition-all" data-course="UI/UX Dizayn">
            Kursga yozilish
          </button>
        </div>

        {/* 6. Grafik Dizayn */}
        <div className="course-card glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-brand-neon transition-all" data-cat="design">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">6 oy</span>
              <span className="text-xs text-slate-400">743 000 so‘m/oy</span>
            </div>
            <h4 className="text-lg font-bold text-white">GRAFIK DIZAYN</h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Adobe Photoshop — 3 oy fotomanipulyatsiya</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Adobe Illustrator — 3 oy vektor grafika</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> SMM postlar, logotip va bannerlar</li>
            </ul>
          </div>
          <button className="select-course-btn w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-purple/40 hover:bg-brand-purple text-white border border-brand-purple transition-all" data-course="Grafik Dizayn">
            Kursga yozilish
          </button>
        </div>

        {/* 7. Vibe Coding */}
        <div className="course-card glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-brand-neon transition-all" data-cat="coding">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">2 oy</span>
              <span className="text-xs text-slate-400">743 000 so‘m/oy</span>
            </div>
            <h4 className="text-lg font-bold text-white">VIBE CODING (AI + DEV)</h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Zamonaviy front-end va AI yordamchilari</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Tezkor interfeyslar va prototiplar</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> Haqiqiy mijoz loyihalari bilan ishlash</li>
            </ul>
          </div>
          <button className="select-course-btn w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-purple/40 hover:bg-brand-purple text-white border border-brand-purple transition-all" data-course="Vibe Coding">
            Kursga yozilish
          </button>
        </div>

        {/* 8. Startup Inkubator */}
        <div className="course-card glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-brand-neon transition-all" data-cat="startup">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">5 oy</span>
              <span className="text-xs text-slate-400">Grant asosida</span>
            </div>
            <h4 className="text-lg font-bold text-white">STARTUP INKUBATOR</h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> G‘oya va MVP mahsulot yaratish</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> API + AI integratsiya, Auth, Dashboard</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-neon">▸</span> $20 000 gacha investitsiya jalb qilish</li>
            </ul>
          </div>
          <button className="select-course-btn w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-purple/40 hover:bg-brand-purple text-white border border-brand-purple transition-all" data-course="Startup Inkubator">
            Kursga yozilish
          </button>
        </div>
      </div>
    </div>
  </section>

  {/* SECTION 5: STARTUP $20,000 INKUBATSIYA */}
  <section id="startup" className="py-20 relative overflow-hidden border-t border-brand-border/40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden border-brand-neon/40 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="px-3 py-1 rounded-full bg-brand-neon/20 text-brand-light text-xs font-bold border border-brand-neon/40">
              UZCombinator Hamkorligida
            </span>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white">
              STARTAPINGIZ UCHUN <br />
              <span className="text-brand-neon neon-text-glow">$20 000 INVESTITSIYA</span>
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Startup — innovatsion g‘oya asosida yaratilgan loyiha bo‘lib, muammoni hal qilish va tez rivojlanishga qaratilgan. Robocode akademiyasida eng yaxshi bitiruvchilar o‘z startap loyihalari uchun moliyaviy va texnik ko‘mak oladilar.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-brand-dark/60 border border-brand-border">
                <div className="text-brand-neon font-bold text-lg flex items-center gap-2"><svg className="w-5 h-5 text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.7)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg> Innovatsiya</div>
                <div className="text-xs text-slate-300 mt-1">Yangi yechimlar va texnologiyalar orqali muammolarni hal qilish</div>
              </div>
              <div className="p-4 rounded-xl bg-brand-dark/60 border border-brand-border">
                <div className="text-brand-neon font-bold text-lg flex items-center gap-2"><svg className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> Tez Rivojlanish</div>
                <div className="text-xs text-slate-300 mt-1">Qisqa vaqt ichida katta miqyosda o‘sish va bozorga chiqish</div>
              </div>
            </div>
            <div className="pt-2">
              <a href="#ariza" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-neon shadow-lg shadow-brand-purple/30 transition-all">
                <span>Startap loyihani topshirish</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"  /></svg>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full rounded-2xl overflow-hidden glass-card p-3 border-brand-neon/30">
              <img src="/assets/landing/landing_img_3.jpg" alt="3D Startup Tech Illustration" className="w-full h-auto object-cover rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* SECTION 6: ROBOCODE CRM BOSHQARUV TIZIMI */}
  <section id="crm-preview" className="py-20 relative bg-brand-surface/40 border-t border-brand-border/40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
          Avtomatlashtirilgan Ta’lim
        </span>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">ROBOCODE CRM — O‘QUV MARKAZ TIZIMI</h3>
        <p className="mt-3 text-sm sm:text-base text-slate-400">
          O‘quvchilar, guruhlar jadvallari, o‘qituvchilar maoshi, to‘lovlar va davomat monitoringini yagona raqamli tizimda boshqaring.
        </p>
      </div>

      {/* CRM Mockup Showcase Card */}
      <div className="glass-card rounded-3xl p-4 sm:p-8 border-brand-neon/40 shadow-2xl overflow-hidden mb-12">
        <div className="relative group rounded-2xl overflow-hidden">
          <img src="/assets/landing/landing_img_4.jpg" alt="Robocode CRM Dashboard UI" className="w-full h-auto object-cover rounded-2xl" />
          <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
            <button id="view-interactive-crm" className="px-6 py-3 rounded-xl bg-brand-purple text-white font-bold text-sm shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"  /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"  /></svg>
              Interaktiv CRM Demoni Ochish
            </button>
          </div>
        </div>
      </div>

      {/* CRM Key Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-brand-purple/50 flex items-center justify-center text-brand-neon"><svg className="w-6 h-6 text-brand-neon drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg></div>
          <h4 className="font-bold text-white text-base">To‘liq hisobot va tahlillar</h4>
          <p className="text-xs text-slate-300">O‘quvchilar soni, daromadlar o‘sishi va guruhlar yuklamasining real vaqt statistikasi.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-900/40 border border-cyan-500/50 flex items-center justify-center text-cyan-400"><svg className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <h4 className="font-bold text-white text-base">Avtomatik davomat</h4>
          <p className="text-xs text-slate-300">Har bir dars bo‘yicha QR-kod yoki planshet orqali tezkor davomat yuritish.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-2">
          <div className="w-10 h-10 rounded-xl bg-pink-900/40 border border-pink-500/50 flex items-center justify-center text-pink-400"><svg className="w-6 h-6 text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg></div>
          <h4 className="font-bold text-white text-base">To‘lovlar nazorati</h4>
          <p className="text-xs text-slate-300">Payme, Click va naqd to‘lovlar integratsiyasi, qarzdorlik haqida avtomatik SMS eslatmalar.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-2">
          <div className="w-10 h-10 rounded-xl bg-rose-900/40 border border-rose-500/50 flex items-center justify-center text-rose-400"><svg className="w-6 h-6 text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div>
          <h4 className="font-bold text-white text-base">Lidlar va arizalar</h4>
          <p className="text-xs text-slate-300">Sayt va ijtimoiy tarmoqlardan tushgan barcha yangi arizalarni avtomatik saralash.</p>
        </div>
      </div>
    </div>
  </section>

  {/* SECTION 7: ANDIJONDAGI AMALIY O'QUV MUHITI & JAMOA */}
  <section id="team" className="py-20 relative border-t border-brand-border/40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-xs font-bold tracking-widest text-brand-neon uppercase mb-2">Muhit va Mentorlar</h2>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white">ANDIJONDAGI O‘QUV MUHITI VA TAJRIBALI JAMOA</h3>
        <p className="mt-3 text-sm sm:text-base text-slate-400">
          Akademiyamizda har bir o‘quvchi zamonaviy texnologik laboratoriyada tajribali ustozlar ko‘magida bilim oladi.
        </p>
      </div>

      {/* Real Classroom Experience Photo */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 mb-16 border-brand-neon/30 overflow-hidden shadow-2xl">
        <div className="relative rounded-2xl overflow-hidden group">
          <img src="/assets/landing/landing_img_5.jpg" alt="Robocode Classroom Environment" className="w-full h-auto object-cover rounded-2xl transform group-hover:scale-[1.01] transition-transform duration-500" />
          <div className="absolute bottom-4 left-4 glass-card px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-white">
            <svg className="w-3.5 h-3.5 text-rose-400 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Andijon shahri, P8WW+P7G, Ulitsa Lermontova, Robocode IT markazi laboratoriyasi
          </div>
        </div>
      </div>

      {/* Team Members Grid (Full 10 Verified Mentors from CRM) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
        {/* 1. Abdulaziz Yakubov */}
        <div className="glass-card p-5 rounded-2xl text-center space-y-2 border border-brand-border/60 hover:border-brand-neon transition-all">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-neon flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-brand-purple/30">
            AY
          </div>
          <h4 className="font-bold text-white text-sm">Abdulaziz Yakubov</h4>
          <p className="text-[11px] text-brand-neon font-semibold">Founder & Asoschi</p>
          <p className="text-[11px] text-slate-400 leading-tight">Yoshlar Ventures direktori, 10+ yil IT tajriba, serial startapper. @aka.yakubov</p>
        </div>

        {/* 2. Akhmadullo Nurmakhamatov */}
        <div className="glass-card p-5 rounded-2xl text-center space-y-2 border border-brand-border/60 hover:border-brand-neon transition-all">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-blue-500/30">
            AN
          </div>
          <h4 className="font-bold text-white text-sm">Akhmadullo Nurmakhamatov</h4>
          <p className="text-[11px] text-brand-neon font-semibold">Team Lead & Senior Dev</p>
          <p className="text-[11px] text-slate-400 leading-tight">Politecnico di Torino bitiruvchisi, 6+ yil xalqaro tajriba. React, TS, Scrum.</p>
        </div>

        {/* 3. Shuxratbek Aliyev */}
        <div className="glass-card p-5 rounded-2xl text-center space-y-2 border border-brand-border/60 hover:border-brand-neon transition-all">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-pink-500/30">
            SA
          </div>
          <h4 className="font-bold text-white text-sm">Shuxratbek Aliyev</h4>
          <p className="text-[11px] text-brand-neon font-semibold">UI/UX & Grafik Lead</p>
          <p className="text-[11px] text-slate-400 leading-tight">Vodiy Brend asoschisi, 5 yil tajriba. 30+ brend va 150+ shogird tayyorlagan.</p>
        </div>

        {/* 4. Ziyodullo Shuxratbekov */}
        <div className="glass-card p-5 rounded-2xl text-center space-y-2 border border-brand-border/60 hover:border-brand-neon transition-all">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-amber-500/30">
            ZS
          </div>
          <h4 className="font-bold text-white text-sm">Ziyodullo Shuxratbekov</h4>
          <p className="text-[11px] text-brand-neon font-semibold">Startup Mentor</p>
          <p className="text-[11px] text-slate-400 leading-tight">EduCompass asoschisi, $250 000 loyiha muallifi, $700 000+ investitsiya jalb qilgan.</p>
        </div>

        {/* 5. Nazrullo Raxmatov */}
        <div className="glass-card p-5 rounded-2xl text-center space-y-2 border border-brand-border/60 hover:border-brand-neon transition-all">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-emerald-500/30">
            NR
          </div>
          <h4 className="font-bold text-white text-sm">Nazrullo Raxmatov</h4>
          <p className="text-[11px] text-brand-neon font-semibold">Back-End Mentor</p>
          <p className="text-[11px] text-slate-400 leading-tight">EduCompass jamoasi, 3+ yil tajriba. 20+ yirik backend loyihalar me’mori.</p>
        </div>

        {/* 6. Abduvahob Qahhorov */}
        <div className="glass-card p-5 rounded-2xl text-center space-y-2 border border-brand-border/60 hover:border-brand-neon transition-all">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-indigo-500/30">
            AQ
          </div>
          <h4 className="font-bold text-white text-sm">Abduvahob Qahhorov</h4>
          <p className="text-[11px] text-brand-neon font-semibold">Back-End / System Architect</p>
          <p className="text-[11px] text-slate-400 leading-tight">UIC Group va Prolab tajribasi, 5+ yil staj. Murakkab server arxitekturasi mutaxassisi.</p>
        </div>

        {/* 7. Saidislom To'lqinov */}
        <div className="glass-card p-5 rounded-2xl text-center space-y-2 border border-brand-border/60 hover:border-brand-neon transition-all">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-cyan-500/30">
            ST
          </div>
          <h4 className="font-bold text-white text-sm">Saidislom To‘lqinov</h4>
          <p className="text-[11px] text-brand-neon font-semibold">Front-End / 3D Mentor</p>
          <p className="text-[11px] text-slate-400 leading-tight">NFINITE (Fransiya) muhandisi, 5 yil tajriba. Walmart, Castorama loyihalari.</p>
        </div>

        {/* 8. Husanboy Zafarov */}
        <div className="glass-card p-5 rounded-2xl text-center space-y-2 border border-brand-border/60 hover:border-brand-neon transition-all">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-violet-500/30">
            HZ
          </div>
          <h4 className="font-bold text-white text-sm">Husanboy Zafarov</h4>
          <p className="text-[11px] text-brand-neon font-semibold">Front-End Mentor</p>
          <p className="text-[11px] text-slate-400 leading-tight">EduCompass va Bozorly dasturchisi, 3+ yil tajriba. Figma va zamonaviy SPA.</p>
        </div>

        {/* 9. Hasanboy Zafarov */}
        <div className="glass-card p-5 rounded-2xl text-center space-y-2 border border-brand-border/60 hover:border-brand-neon transition-all">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-purple-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-fuchsia-500/30">
            HZ
          </div>
          <h4 className="font-bold text-white text-sm">Hasanboy Zafarov</h4>
          <p className="text-[11px] text-brand-neon font-semibold">Vibe Coding & AI Mentor</p>
          <p className="text-[11px] text-slate-400 leading-tight">Robocode tezkor AI-dasturlash murabbiyi, responsiv web-interfeyslar ustasi.</p>
        </div>

        {/* 10. Alimjanov Saidmurod */}
        <div className="glass-card p-5 rounded-2xl text-center space-y-2 border border-brand-border/60 hover:border-brand-neon transition-all">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-rose-500/30">
            AS
          </div>
          <h4 className="font-bold text-white text-sm">Alimjanov Saidmurod</h4>
          <p className="text-[11px] text-brand-neon font-semibold">Front-End / Foundation</p>
          <p className="text-[11px] text-slate-400 leading-tight">Bozorly loyihasi muhandisi, 2+ yil staj. O‘zbek va rus tillarida interaktiv darslar.</p>
        </div>
      </div>

      {/* Testimonials / Bitiruvchilar Fikrlari (from CRM) */}
      <div className="mt-14">
        <div className="text-center mb-8">
          <h3 className="text-xs font-bold tracking-widest text-brand-neon uppercase">Muvaffaqiyat Tarixlari</h3>
          <p className="text-xl sm:text-2xl font-extrabold text-white mt-1">BITIRUVCHILARIMIZ NATIJALARI VA FIKRLARI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <div className="glass-card p-6 rounded-2xl border border-brand-border/60 space-y-4 hover:border-brand-neon transition-all">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-purple-900/50 border border-brand-purple/60 flex items-center justify-center font-bold text-white text-sm">
                BT
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">Bekzod Toshpulatov</h5>
                <p className="text-[11px] text-brand-neon font-medium">STEM markazi instruktori</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Robototexnika kursi menga nafaqat texnik bilim, balki o‘quvchilarga ta’lim berish tajribasini ham berdi. Hozir o‘zim STEM markazida dars beraman."
            </p>
            <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 pt-2 border-t border-brand-border/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Robototexnika kursi bitiruvchisi
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="glass-card p-6 rounded-2xl border border-brand-border/60 space-y-4 hover:border-brand-neon transition-all">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-pink-900/50 border border-pink-500/60 flex items-center justify-center font-bold text-white text-sm">
                MY
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">Madina Yusupova</h5>
                <p className="text-[11px] text-pink-400 font-medium">Frilanser UI/UX dizayner</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Figma va UI/UX asoslarini Robocode‘da o‘rgandim. Kursdan keyin darhol frilans loyihalar bilan ishlay boshladim va o‘z mijozlar bazamni shakllantirdim."
            </p>
            <div className="text-[11px] font-semibold text-pink-400 flex items-center gap-1.5 pt-2 border-t border-brand-border/40">
              <span className="w-2 h-2 rounded-full bg-pink-400"></span> Grafik & Web Dizayn bitiruvchisi
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="glass-card p-6 rounded-2xl border border-brand-border/60 space-y-4 hover:border-brand-neon transition-all">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-900/50 border border-blue-500/60 flex items-center justify-center font-bold text-white text-sm">
                AK
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">Aziza Karimova</h5>
                <p className="text-[11px] text-blue-400 font-medium">Frontend Developer</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Robocode‘dagi 6 oy davomida noldan React‘da real loyihalar qura oladigan darajaga yetdim. Mentorlar har doim kod tahlilida yordamga tayyor edi."
            </p>
            <div className="text-[11px] font-semibold text-blue-400 flex items-center gap-1.5 pt-2 border-t border-brand-border/40">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span> Front-End kursi bitiruvchisi
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* SECTION 8: BIZ BILAN HAMKORLAR (Partners Showcase with Official Logos) */}
  <section className="py-20 relative bg-brand-surface/50 border-t border-brand-border/60">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-neon/40 text-brand-neon text-xs font-bold uppercase tracking-wider mb-3">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m11 17 2 2a1 1 0 0 0 1.4 0l6.6-6.6a2 2 0 0 0 0-2.8l-4.2-4.2a2 2 0 0 0-2.8 0L7 12"/><path d="m18 10 1.4-1.4a2 2 0 0 0 0-2.8l-1.4-1.4a2 2 0 0 0-2.8 0L14 6"/><path d="M10 14 7 17a2 2 0 0 1-2.8 0l-1.4-1.4a2 2 0 0 1 0-2.8L6 10"/><path d="m2 17 4 4"/></svg>
          Ishonchli Hamkorlarimiz
        </div>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white">BIZ BILAN HAMKOR TASHKILOTLAR</h3>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl mx-auto">
          O‘quvchilarimiz va bitiruvchilarimizga xalqaro standartdagi ta’lim, stajirovka hamda $20 000 gacha startap investitsiyalari taqdim etuvchi nufuzli ekotizim hamkorlari.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {/* 1. IT Park Uzbekistan */}
        <div className="glass-card p-6 rounded-2xl border border-brand-border/60 hover:border-emerald-400/80 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col items-center justify-between text-center group">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            {/* IT Park Hexagonal Cube SVG */}
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
              <polygon points="24,4 42,14 42,34 24,44 6,34 6,14" stroke="#00D285" strokeWidth="2.5" fill="rgba(0,210,133,0.15)"/>
              <line x1="24" y1="4" x2="24" y2="44" stroke="#00D285" strokeWidth="2"/>
              <line x1="24" y1="24" x2="42" y2="14" stroke="#00D285" strokeWidth="2"/>
              <line x1="24" y1="24" x2="6" y2="14" stroke="#00D285" strokeWidth="2"/>
              <circle cx="24" cy="24" r="3" fill="#00D285"/>
            </svg>
          </div>
          <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">IT PARK UZBEKISTAN</h4>
          <span className="mt-1 text-[11px] font-medium text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Rasmiy Rezidentlik & Sertifikat</span>
          <p className="mt-2 text-[11px] text-slate-400">Raqamli texnologiyalar vazirligi qoshidagi IT ekotizim</p>
        </div>

        {/* 2. Yoshlar Texnoparki */}
        <div className="glass-card p-6 rounded-2xl border border-brand-border/60 hover:border-cyan-400/80 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col items-center justify-between text-center group">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            {/* Yoshlar Texnoparki Emblem SVG */}
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="18" stroke="#06B6D4" strokeWidth="2" strokeDasharray="4 2" fill="rgba(6,182,212,0.12)"/>
              <path d="M16 16 L24 28 L32 16" stroke="#22D3EE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="24" y1="28" x2="24" y2="36" stroke="#22D3EE" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="24" cy="14" r="2.5" fill="#38BDF8"/>
            </svg>
          </div>
          <h4 className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">YOSHLAR TEXNOPARKI</h4>
          <span className="mt-1 text-[11px] font-medium text-cyan-400/90 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">Innovatsion Laboratoriya</span>
          <p className="mt-2 text-[11px] text-slate-400">Robototexnika va ixtirochilik bo‘yicha texnopark</p>
        </div>

        {/* 3. Turin Polytechnic University */}
        <div className="glass-card p-6 rounded-2xl border border-brand-border/60 hover:border-blue-400/80 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 flex flex-col items-center justify-between text-center group">
          <div className="w-16 h-16 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            {/* Academic Gear & Pillar SVG */}
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
              <path d="M24 6 L38 14 L38 34 L24 42 L10 34 L10 14 Z" stroke="#3B82F6" strokeWidth="2" fill="rgba(59,130,246,0.15)"/>
              <circle cx="24" cy="24" r="8" stroke="#60A5FA" strokeWidth="2"/>
              <path d="M24 18 V30 M18 24 H30" stroke="#93C5FD" strokeWidth="1.8"/>
              <polygon points="24,10 27,15 21,15" fill="#F59E0B"/>
            </svg>
          </div>
          <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">TURIN POLYTECHNIC</h4>
          <span className="mt-1 text-[11px] font-medium text-blue-400/90 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">Xalqaro Ta’lim Hamkori</span>
          <p className="mt-2 text-[11px] text-slate-400">Toshkentdagi Turin Politexnika Universiteti (TTPU)</p>
        </div>

        {/* 4. UZCombinator */}
        <div className="glass-card p-6 rounded-2xl border border-brand-border/60 hover:border-amber-400/80 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 flex flex-col items-center justify-between text-center group">
          <div className="w-16 h-16 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            {/* UZCombinator Startup Rocket Emblem SVG */}
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="8" width="32" height="32" rx="10" stroke="#F59E0B" strokeWidth="2" fill="rgba(245,158,11,0.15)"/>
              <path d="M16 16 L24 32 L32 16" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M24 24 L24 36" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="24" cy="16" r="3" fill="#F59E0B"/>
            </svg>
          </div>
          <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">UZCOMBINATOR</h4>
          <span className="mt-1 text-[11px] font-medium text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">$20 000 Startup Track</span>
          <p className="mt-2 text-[11px] text-slate-400">Xalqaro venchur va startap akselerator jamg‘armasi</p>
        </div>

        {/* 5. MECON */}
        <div className="glass-card p-6 rounded-2xl border border-brand-border/60 hover:border-purple-400/80 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 flex flex-col items-center justify-between text-center group">
          <div className="w-16 h-16 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            {/* MECON Engineering Hexagon SVG */}
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
              <polygon points="24,6 40,15 40,33 24,42 8,33 8,15" stroke="#A855F7" strokeWidth="2" fill="rgba(168,85,247,0.15)"/>
              <path d="M14 30 V18 L24 25 L34 18 V30" stroke="#C084FC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h4 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">MECON ENGINEERING</h4>
          <span className="mt-1 text-[11px] font-medium text-purple-400/90 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">Sanoat & Robototexnika</span>
          <p className="mt-2 text-[11px] text-slate-400">Muhandislik va texnik loyihalar konsaltingi</p>
        </div>

        {/* 6. Yandex Ecosystem */}
        <div className="glass-card p-6 rounded-2xl border border-brand-border/60 hover:border-rose-400/80 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-300 flex flex-col items-center justify-between text-center group">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            {/* Yandex Circle Badge SVG */}
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="18" fill="#E11D48"/>
              <circle cx="24" cy="24" r="16" fill="#180B2B"/>
              <path d="M28 14 H24 C20 14 17 17 17 21 C17 24 19 26 21 28 L16 34 H20 L25 28 H26 V34 H29 V14 Z M26 25 H24 C22 25 20 23.5 20 21 C20 18.5 22 17 24 17 H26 V25 Z" fill="#FFFFFF"/>
            </svg>
          </div>
          <h4 className="font-bold text-white text-sm group-hover:text-rose-400 transition-colors">YANDEX ECOSYSTEM</h4>
          <span className="mt-1 text-[11px] font-medium text-rose-400/90 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">AI & Cloud Amaliyot</span>
          <p className="mt-2 text-[11px] text-slate-400">Yandex bulut va xaritalar texnologiyalari integratsiyasi</p>
        </div>

        {/* 7. Yoshlar Agentligi */}
        <div className="glass-card p-6 rounded-2xl border border-brand-border/60 hover:border-indigo-400/80 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col items-center justify-between text-center group">
          <div className="w-16 h-16 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            {/* Yoshlar Agentligi Wings Emblem SVG */}
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
              <path d="M24 8 C14 18 10 26 12 36 C18 38 24 34 24 34 C24 34 30 38 36 36 C38 26 34 18 24 8 Z" stroke="#6366F1" strokeWidth="2" fill="rgba(99,102,241,0.15)"/>
              <circle cx="24" cy="22" r="4" fill="#818CF8"/>
              <path d="M16 26 C20 30 28 30 32 26" stroke="#A5B4FC" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">YOSHLAR ISHLARI AGENTLIGI</h4>
          <span className="mt-1 text-[11px] font-medium text-indigo-400/90 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">Ijtimoiy & Ta’lim Grantlari</span>
          <p className="mt-2 text-[11px] text-slate-400">Andijon yoshlarining IT sohasidagi faol tashabbuslari</p>
        </div>

        {/* 8. EPAM Systems */}
        <div className="glass-card p-6 rounded-2xl border border-brand-border/60 hover:border-teal-400/80 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 flex flex-col items-center justify-between text-center group">
          <div className="w-16 h-16 rounded-2xl bg-teal-950/40 border border-teal-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            {/* EPAM Tag Brackets SVG */}
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
              <rect x="6" y="10" width="36" height="28" rx="8" stroke="#14B8A6" strokeWidth="2" fill="rgba(20,184,166,0.15)"/>
              <path d="M16 20 L12 24 L16 28" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M32 20 L36 24 L32 28" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="26" y1="18" x2="22" y2="30" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h4 className="font-bold text-white text-sm group-hover:text-teal-400 transition-colors">EPAM SYSTEMS</h4>
          <span className="mt-1 text-[11px] font-medium text-teal-400/90 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">Global Dasturiy Tajriba</span>
          <p className="mt-2 text-[11px] text-slate-400">Xalqaro dasturlash metodologiyasi va Code Review</p>
        </div>
      </div>
    </div>
  </section>

  {/* SECTION 9: KO'P BERILADIGAN SAVOLLAR (FAQ) */}
  <section id="faq" className="py-20 relative border-t border-brand-border/40">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h3 className="text-xs font-bold tracking-widest text-brand-neon uppercase">Yordam & Javoblar</h3>
        <p className="text-2xl sm:text-4xl font-extrabold text-white mt-1">KO‘P BERILADIGAN SAVOLLAR</p>
      </div>

      <div className="space-y-4">
        {/* FAQ Item 1 */}
        <div className="faq-item glass-card rounded-2xl overflow-hidden border-brand-border">
          <button className="faq-btn w-full p-5 text-left flex items-center justify-between font-bold text-white hover:text-brand-light transition-colors">
            <span>Dasturlash yoki robototexnikani o‘rganish uchun yosh chegarasi bormi?</span>
            <span className="faq-icon text-brand-neon text-xl font-bold transition-transform">+</span>
          </button>
          <div className="faq-content hidden px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-brand-border/40 pt-3">
            Yo‘q, kurslarimiz 7 yoshdan boshlab (Robototexnika va Scratch) to talabalar va kattalargacha (Full-Stack, UI/UX, Startup) mo‘ljallangan guruhlarga ajratilgan.
          </div>
        </div>

        {/* FAQ Item 2 */}
        <div className="faq-item glass-card rounded-2xl overflow-hidden border-brand-border">
          <button className="faq-btn w-full p-5 text-left flex items-center justify-between font-bold text-white hover:text-brand-light transition-colors">
            <span>Avvaldan hech qanday bilim bo‘lmasa ham o‘qisa bo‘ladimi?</span>
            <span className="faq-icon text-brand-neon text-xl font-bold transition-transform">+</span>
          </button>
          <div className="faq-content hidden px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-brand-border/40 pt-3">
            Albatta! Barcha kurslarimiz noldan boshlab bosqichma-bosqich o‘rgatiladi. Dastlabki 2 haftada tayyorgarlik va asosiy tushunchalar mustahkamlanadi.
          </div>
        </div>

        {/* FAQ Item 3 */}
        <div className="faq-item glass-card rounded-2xl overflow-hidden border-brand-border">
          <button className="faq-btn w-full p-5 text-left flex items-center justify-between font-bold text-white hover:text-brand-light transition-colors">
            <span>Darslar qachon va qaysi vaqtlarda o‘tiladi?</span>
            <span className="faq-icon text-brand-neon text-xl font-bold transition-transform">+</span>
          </button>
          <div className="faq-content hidden px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-brand-border/40 pt-3">
            Darslar haftada 3 kun, 2 soatdan o‘tiladi. Ertalabki, tushki va kechki qulay vaqt oraliqlaridan birini tanlashingiz mumkin.
          </div>
        </div>

        {/* FAQ Item 4 */}
        <div className="faq-item glass-card rounded-2xl overflow-hidden border-brand-border">
          <button className="faq-btn w-full p-5 text-left flex items-center justify-between font-bold text-white hover:text-brand-light transition-colors">
            <span>Kurs yakunida sertifikat beriladimi va ish topishda yordam berasizmi?</span>
            <span className="faq-icon text-brand-neon text-xl font-bold transition-transform">+</span>
          </button>
          <div className="faq-content hidden px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-brand-border/40 pt-3">
            Ha, barcha bitiruvchilarga rasmiy sertifikat taqdim etiladi. Eng a’lochi talabalar esa akademiyamizning ichki loyihalariga yoki hamkor IT kompaniyalarga ishga tavsiya etiladi.
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* SECTION 10: ARIZA TOPSHIRISH / KURSGA YOZILISH */}
  <section id="ariza" className="py-20 relative bg-brand-surface/60 border-t border-brand-border/60">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass-card rounded-3xl p-8 sm:p-12 border-brand-neon/40 shadow-2xl relative">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="px-3 py-1 rounded-full bg-brand-purple/40 text-brand-light text-xs font-bold border border-brand-purple">
            Birinchi dars — Bepul sinov darsi!
          </span>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">KURSGA YOZILISH VA KONSULTATSIYA</h3>
          <p className="mt-2 text-sm text-slate-300">
            Ma’lumotlaringizni qoldiring, administratorlarimiz 15 daqiqa ichida siz bilan bog‘lanib, bepul sinov darsiga yozib qo‘yadilar.
          </p>
        </div>

        <form id="lead-form" className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Ism va familiyangiz *</label>
              <input type="text" id="lead-name" required placeholder="Masalan: Sardor Aliyev" className="w-full px-4 py-3 rounded-xl bg-brand-dark/80 border border-brand-border text-white text-sm focus:outline-none focus:border-brand-neon transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Telefon raqamingiz *</label>
              <input type="tel" id="lead-phone" required placeholder="+998 90 123 45 67" value="+998 " className="w-full px-4 py-3 rounded-xl bg-brand-dark/80 border border-brand-border text-white text-sm focus:outline-none focus:border-brand-neon transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">Qiziqqan yo‘nalishingiz *</label>
            <select id="lead-course" className="w-full px-4 py-3 rounded-xl bg-brand-dark/80 border border-brand-border text-white text-sm focus:outline-none focus:border-brand-neon transition-colors">
              <option value="Robototexnika">Robototexnika (10 oy)</option>
              <option value="Front-End">Front-End Dasturlash (6 oy)</option>
              <option value="Back-End">Back-End Dasturlash (6 oy)</option>
              <option value="UI/UX Dizayn">Web & UI/UX Dizayn (6 oy)</option>
              <option value="Foundation">Foundation — IT Asoslari (2 oy)</option>
              <option value="Grafik Dizayn">Grafik Dizayn (6 oy)</option>
              <option value="Vibe Coding">Vibe Coding & AI (2 oy)</option>
              <option value="Startup Inkubator">Startup Inkubator ($20 000)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">Qo‘shimcha izoh yoki savollaringiz</label>
            <textarea id="lead-note" rows="3" placeholder="Qo‘shimcha savolingiz bo‘lsa yozing..." className="w-full px-4 py-3 rounded-xl bg-brand-dark/80 border border-brand-border text-white text-sm focus:outline-none focus:border-brand-neon transition-colors"></textarea>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-purple via-brand-neon to-indigo-600 hover:opacity-95 shadow-xl shadow-brand-purple/40 transition-all flex items-center justify-center gap-2">
              <span>Arizani yuborish</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"  /></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>

  {/* FOOTER */}
  <footer className="bg-brand-dark border-t border-brand-border py-12 text-slate-400 text-xs">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <span>Robocode IT Academy</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Andijondagi birinchi va yetakchi IT akademiyasi. Bolalar va yoshlarni kelajak kasblariga tayyorlaymiz.
          </p>
          <p className="text-slate-500 text-[11px]">© 2018–2026 Robocode IT Academy. Barcha huquqlar himoyalangan.</p>
        </div>

        {/* Col 2 */}
        <div className="space-y-2">
          <h4 className="text-white font-bold text-sm">Yo‘nalishlar</h4>
          <ul className="space-y-1.5">
            <li><a href="#courses" className="hover:text-brand-light">Robototexnika</a></li>
            <li><a href="#courses" className="hover:text-brand-light">Front-End & Back-End</a></li>
            <li><a href="#courses" className="hover:text-brand-light">Web & UI/UX Dizayn</a></li>
            <li><a href="#courses" className="hover:text-brand-light">Startup Inkubator</a></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-2">
          <h4 className="text-white font-bold text-sm">Aloqa</h4>
          <p className="flex items-center gap-1.5"><svg className="w-4 h-4 text-rose-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Manzil: Andijon shahri, P8WW+P7G, Ulitsa Lermontova (Robocode IT Markazi)</p>
          <p className="flex items-center gap-1.5"><svg className="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> Tel: +998 99 899 9005 / +998 93 075 9005</p>
          <p>✉️ Email: info@robocode.uz</p>
        </div>

        {/* Col 4 */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm">CRM Tizimi</h4>
          <p className="text-slate-400">O‘quv markaz xodimlari va administratorlar uchun boshqaruv portali.</p>
          <button id="footer-crm-btn" className="px-4 py-2 rounded-lg bg-brand-card hover:bg-brand-surface border border-brand-border text-brand-light font-semibold text-xs flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-brand-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"  /></svg>
            <span>Tizimga kirish (/login)</span>
          </button>
        </div>
      </div>
    </div>
  </footer>

  {/* MODAL: INTERACTIVE CRM DASHBOARD DEMO */}
  <div id="crm-modal" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md hidden flex items-center justify-center p-4">
    <div className="bg-brand-surface border border-brand-neon/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-brand-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-purple flex items-center justify-center text-white font-bold">R</div>
          <div>
            <h3 className="font-bold text-white text-base">Robocode CRM — Markaz Boshqaruv Tizimi</h3>
            <p className="text-xs text-brand-light">Administrator Demo Paneli (Jonli rejim)</p>
          </div>
        </div>
        <button id="close-crm-modal" className="p-2 rounded-lg bg-brand-card text-slate-400 hover:text-white">✕</button>
      </div>

      {/* CRM Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-brand-card border border-brand-border">
          <span className="text-xs text-slate-400">Jami O‘quvchilar</span>
          <div className="text-2xl font-bold text-white mt-1">3,520</div>
          <span className="text-[10px] text-emerald-400">+12% o‘sish</span>
        </div>
        <div className="p-4 rounded-xl bg-brand-card border border-brand-border">
          <span className="text-xs text-slate-400">O‘rtacha Davomat</span>
          <div className="text-2xl font-bold text-white mt-1">94.2%</div>
          <span className="text-[10px] text-emerald-400">Yuqori faollik</span>
        </div>
        <div className="p-4 rounded-xl bg-brand-card border border-brand-border">
          <span className="text-xs text-slate-400">Faol Guruhlar</span>
          <div className="text-2xl font-bold text-white mt-1">128 ta</div>
          <span className="text-[10px] text-brand-neon">Dasturlash & Robototexnika</span>
        </div>
        <div className="p-4 rounded-xl bg-brand-card border border-brand-border">
          <span className="text-xs text-slate-400">Yangi Lidlar (Haftalik)</span>
          <div className="text-2xl font-bold text-white mt-1">214 ta</div>
          <span className="text-[10px] text-emerald-400">Qabul davom etmoqda</span>
        </div>
      </div>

      {/* CRM Table */}
      <div>
        <h4 className="text-sm font-bold text-white mb-3">So‘nggi qabul qilingan o‘quvchilar ro‘yxati</h4>
        <div className="overflow-x-auto rounded-xl border border-brand-border">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-brand-card text-slate-400 border-b border-brand-border">
              <tr>
                <th className="p-3">O‘quvchi</th>
                <th className="p-3">Yo‘nalish</th>
                <th className="p-3">Guruh</th>
                <th className="p-3">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40">
              <tr className="hover:bg-brand-card/40">
                <td className="p-3 font-semibold text-white">Davronbek Ismoilov</td>
                <td className="p-3">Front-End React</td>
                <td className="p-3">FE-104</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">To‘langan</span></td>
              </tr>
              <tr className="hover:bg-brand-card/40">
                <td className="p-3 font-semibold text-white">Madinabonu Rahimova</td>
                <td className="p-3">Robototexnika</td>
                <td className="p-3">ROBO-22</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">To‘langan</span></td>
              </tr>
              <tr className="hover:bg-brand-card/40">
                <td className="p-3 font-semibold text-white">Jasurbek Qodirov</td>
                <td className="p-3">UI/UX Dizayn</td>
                <td className="p-3">UX-12</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Kutilmoqda</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button id="close-crm-modal-btn" className="px-5 py-2.5 rounded-xl bg-brand-purple text-white text-xs font-semibold hover:bg-brand-neon transition-colors">
          Yopish
        </button>
      </div>
    </div>
  </div>

  {/* TOAST NOTIFICATION */}
  <div id="toast" className="fixed bottom-6 right-6 z-50 glass-card border border-emerald-500/50 text-white px-5 py-4 rounded-xl shadow-2xl hidden flex items-center gap-3">
    <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
    <span id="toast-message" className="text-xs font-semibold">Arizangiz muvaffaqiyatli qabul qilindi! Tez orada bog‘lanamiz.</span>
  </div>

  {/* JAVASCRIPT LOGIC */}