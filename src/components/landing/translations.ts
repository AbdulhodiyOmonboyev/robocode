export type Lang = "uz" | "ru" | "en";

export const LANGS: Lang[] = ["uz", "ru", "en"];

export const NAV_ITEMS: Record<Lang, { label: string; href: string }[]> = {
  uz: [
    { label: "Biz haqimizda", href: "#about" },
    { label: "Kurslar", href: "#courses" },
    { label: "Startup Studio", href: "#startup-studio" },
    { label: "Jamoa", href: "#team" },
    { label: "Aloqa", href: "#contact" },
  ],
  ru: [
    { label: "О нас", href: "#about" },
    { label: "Курсы", href: "#courses" },
    { label: "Startup Studio", href: "#startup-studio" },
    { label: "Команда", href: "#team" },
    { label: "Контакты", href: "#contact" },
  ],
  en: [
    { label: "About us", href: "#about" },
    { label: "Courses", href: "#courses" },
    { label: "Startup Studio", href: "#startup-studio" },
    { label: "Team", href: "#team" },
    { label: "Contact", href: "#contact" },
  ],
};

export const T = {
  uz: {
    navLogin: "Kirish",
    navCta: "Kursga yozilish",
    heroBadge: "ANDIJONDAGI BIRINCHI IT AKADEMIYA",
    heroPrefix: "ROBOCODE — ",
    heroHighlight: "ANDIJONDAGI",
    heroSuffix: " BIRINCHI IT AKADEMIYA",
    heroSub: "Biz bilan doim birinchi bo’ling!",
    heroBtn1: "Kursga yozilish",
    heroBtn2: "Kurslarni ko’rish",
    aboutLabel: "Biz haqimizda",
    featuresTitle: "Sizni nimalar kutyapti",
    coursesLabel: "Kurslar",
    coursesTitle: "Sizga mos yo’nalishni tanlang",
    studioLead: "Startapingiz uchun",
    studioDesc:
      "Startup — innovatsion g’oya asosida yaratilgan loyiha bo’lib, muammoni hal qilish va tez rivojlanishga qaratilgan.",
    studioHelp:
      "Maxsus jamoamiz g’oyani shakllantirishdan MVP va xalqaro akselerator (UZCombinator) darajasigacha yordam beradi.",
    teamLabel: "Jamoa",
    teamTitle: "Tajribali jamoa bilan tanishing",
    formLabel: "Kursga yozilish",
    formTitle: "Bugun birinchi qadamni tashlang",
    formSub:
      "Formani to’ldiring — mutaxassislarimiz tez orada siz bilan bog’lanib, kurs bo’yicha barcha ma’lumotlarni beradi.",
    formName: "Ism familiya",
    formNamePlaceholder: "Aziza Karimova",
    formPhone: "Telefon raqam",
    formCourse: "Kurs tanlash",
    formCourseOptional: "Tanlang (ixtiyoriy)",
    formComment: "Izoh",
    formCommentOptional: "(ixtiyoriy)",
    formCommentPlaceholder: "Qo’shimcha ma’lumot...",
    formSubmit: "Ariza yuborish",
    formSubmitting: "Yuborilmoqda...",
    formSuccessTitle: "Rahmat!",
    formSuccess: "Arizangiz qabul qilindi.",
    formSuccessSub: "Tez orada siz bilan bog’lanamiz.",
    formAgain: "Yana ariza qoldirish",
    formErrName: "Ism familiyangizni kiriting",
    formErrPhone: "To’liq telefon raqam kiriting",
    formErrGeneric: "Xatolik. Qayta urinib ko’ring.",
    footerDesc: "Andijondagi birinchi IT akademiya — dasturlash va robototexnika bo’yicha amaliy ta’lim.",
    footerContact: "Aloqa",
    footerAddressLabel: "Manzil",
    footerPhoneLabel: "Telefon",
    footerHoursLabel: "Ish vaqti",
    footerHoursDaily: "Har kuni",
    footerSocial: "Ijtimoiy tarmoqlar",
    footerLinks: "Havolalar",
    footerLoginLink: "CRM’ga kirish",
    footerRights: "Barcha huquqlar himoyalangan.",
  },
  ru: {
    navLogin: "Войти",
    navCta: "Записаться на курс",
    heroBadge: "ПЕРВАЯ IT-АКАДЕМИЯ В АНДИЖАНЕ",
    heroPrefix: "ROBOCODE — ",
    heroHighlight: "ПЕРВАЯ",
    heroSuffix: " IT-АКАДЕМИЯ В АНДИЖАНЕ",
    heroSub: "Будьте первыми вместе с нами!",
    heroBtn1: "Записаться на курс",
    heroBtn2: "Смотреть курсы",
    aboutLabel: "О нас",
    featuresTitle: "Что вас ждёт",
    coursesLabel: "Курсы",
    coursesTitle: "Выберите подходящее направление",
    studioLead: "Инвестиции в ваш стартап —",
    studioDesc:
      "Стартап — это проект, основанный на инновационной идее, направленный на решение проблемы и быстрый рост.",
    studioHelp:
      "Наша команда поможет пройти путь от идеи до MVP и международного акселератора (UZCombinator).",
    teamLabel: "Команда",
    teamTitle: "Познакомьтесь с опытной командой",
    formLabel: "Записаться на курс",
    formTitle: "Сделайте первый шаг сегодня",
    formSub: "Заполните форму — наши специалисты свяжутся с вами и расскажут всё о курсе.",
    formName: "Имя и фамилия",
    formNamePlaceholder: "Азиза Каримова",
    formPhone: "Номер телефона",
    formCourse: "Выбор курса",
    formCourseOptional: "Выберите (необязательно)",
    formComment: "Комментарий",
    formCommentOptional: "(необязательно)",
    formCommentPlaceholder: "Дополнительная информация...",
    formSubmit: "Отправить заявку",
    formSubmitting: "Отправка...",
    formSuccessTitle: "Спасибо!",
    formSuccess: "Ваша заявка принята.",
    formSuccessSub: "Мы скоро свяжемся с вами.",
    formAgain: "Оставить ещё одну заявку",
    formErrName: "Введите имя и фамилию",
    formErrPhone: "Введите номер телефона полностью",
    formErrGeneric: "Ошибка. Попробуйте ещё раз.",
    footerDesc: "Первая IT-академия в Андижане — практическое обучение программированию и робототехнике.",
    footerContact: "Контакты",
    footerAddressLabel: "Адрес",
    footerPhoneLabel: "Телефон",
    footerHoursLabel: "Часы работы",
    footerHoursDaily: "Ежедневно",
    footerSocial: "Соцсети",
    footerLinks: "Ссылки",
    footerLoginLink: "Вход в CRM",
    footerRights: "Все права защищены.",
  },
  en: {
    navLogin: "Log in",
    navCta: "Enroll now",
    heroBadge: "ANDIJAN’S FIRST IT ACADEMY",
    heroPrefix: "ROBOCODE — ",
    heroHighlight: "ANDIJAN’S FIRST",
    heroSuffix: " IT ACADEMY",
    heroSub: "Always be first with us!",
    heroBtn1: "Enroll now",
    heroBtn2: "View courses",
    aboutLabel: "About us",
    featuresTitle: "What’s waiting for you",
    coursesLabel: "Courses",
    coursesTitle: "Choose the track that fits you",
    studioLead: "Investment for your startup —",
    studioDesc: "A startup is a project built on an innovative idea, aimed at solving a problem and growing fast.",
    studioHelp: "Our dedicated team helps you go from idea to MVP and an international accelerator (UZCombinator).",
    teamLabel: "Team",
    teamTitle: "Meet our experienced team",
    formLabel: "Enroll now",
    formTitle: "Take the first step today",
    formSub: "Fill out the form — our specialists will contact you shortly with all the course details.",
    formName: "Full name",
    formNamePlaceholder: "Aziza Karimova",
    formPhone: "Phone number",
    formCourse: "Choose a course",
    formCourseOptional: "Select (optional)",
    formComment: "Comment",
    formCommentOptional: "(optional)",
    formCommentPlaceholder: "Additional information...",
    formSubmit: "Submit application",
    formSubmitting: "Sending...",
    formSuccessTitle: "Thank you!",
    formSuccess: "Your application has been received.",
    formSuccessSub: "We’ll contact you shortly.",
    formAgain: "Submit another application",
    formErrName: "Please enter your full name",
    formErrPhone: "Please enter the complete phone number",
    formErrGeneric: "Something went wrong. Please try again.",
    footerDesc: "Andijan’s first IT academy — hands-on programming and robotics education.",
    footerContact: "Contact",
    footerAddressLabel: "Address",
    footerPhoneLabel: "Phone",
    footerHoursLabel: "Working hours",
    footerHoursDaily: "Daily",
    footerSocial: "Social",
    footerLinks: "Links",
    footerLoginLink: "CRM login",
    footerRights: "All rights reserved.",
  },
} satisfies Record<Lang, Record<string, string>>;

export const STATS: Record<Lang, { value: string; label: string }[]> = {
  uz: [
    { value: "+3000", label: "Bitiruvchi" },
    { value: "70%", label: "Kursni tamomlaganlar daromad topib kelmoqda" },
    { value: "$300 – $3000", label: "Bitiruvchilarning o’rtacha daromadi" },
  ],
  ru: [
    { value: "+3000", label: "Выпускников" },
    { value: "70%", label: "Выпускников уже зарабатывают" },
    { value: "$300 – $3000", label: "Средний доход выпускников" },
  ],
  en: [
    { value: "+3000", label: "Graduates" },
    { value: "70%", label: "Of graduates already earning" },
    { value: "$300 – $3000", label: "Average graduate income" },
  ],
};

export const FEATURES: Record<Lang, { icon: "handshake" | "chart" | "gift" | "target"; text: string }[]> = {
  uz: [
    { icon: "handshake", text: "Real startup loyihalarda amaliy tajriba va jamoaga taklif" },
    { icon: "chart", text: "Tajribali Team Lead rahbarligida doimiy rivojlanish" },
    { icon: "gift", text: "Bepul ishtirok imkoniyati (talab: bilim bazasi va ingliz tili)" },
    { icon: "target", text: "Faqat bilim emas — haqiqiy tajriba, real loyihalar va kuchli karyera" },
  ],
  ru: [
    { icon: "handshake", text: "Практический опыт в реальных стартап-проектах и приглашение в команду" },
    { icon: "chart", text: "Постоянное развитие под руководством опытного Team Lead" },
    { icon: "gift", text: "Возможность бесплатного участия (при базовых знаниях и английском)" },
    { icon: "target", text: "Не только знания — реальный опыт, проекты и сильная карьера" },
  ],
  en: [
    { icon: "handshake", text: "Hands-on experience in real startup projects, with a team invitation" },
    { icon: "chart", text: "Continuous growth guided by an experienced Team Lead" },
    { icon: "gift", text: "Free participation available (requires base knowledge & English)" },
    { icon: "target", text: "Not just knowledge — real experience, real projects, a strong career" },
  ],
};

export type Course = { name: string; duration: string | null; modules: string[] };

export const COURSES: Record<Lang, Course[]> = {
  uz: [
    {
      name: "Robototexnika",
      duration: "12 oy",
      modules: [
        "Elektronika va fizika — real amaliyot, tranzistorlar, mikrosxemalar",
        "Dasturlash asoslari — Scratch, mBlock, multfilm va o’yinlar",
        "Aqlli robotlar — kod yozish, datchiklar, Wi-Fi/Bluetooth boshqaruvi",
      ],
    },
    {
      name: "Front-end",
      duration: "6 oy",
      modules: ["1-oy: HTML", "2–3-oy: CSS — Flexbox, Grid, adaptiv", "4–5-oy: JavaScript — DOM, funksiyalar", "6-oy: React + real loyihalar"],
    },
    {
      name: "Back-end",
      duration: "6 oy",
      modules: ["REST API, ma’lumotlar bazasi, autentifikatsiya", "Real loyihalar — Blog API, Todo App", "Natija: GitHub portfolio, serverga joylash, login tizimi"],
    },
    {
      name: "Grafik va Web dizayn",
      duration: "12 oy",
      modules: ["Photoshop — 3 oy", "Illustrator — 3 oy", "UI/UX & Web dizayn — Figma, 6 oy", "Natija: grafik dizaynerdan UI/UX mutaxassisiga"],
    },
    {
      name: "Startup",
      duration: "2 oy",
      modules: ["Blog platforma", "Online do’kon", "Auth + Dashboard", "API + AI integratsiya", "Final startup — deploy"],
    },
    {
      name: "Foundation",
      duration: "14 kun",
      modules: ["Computer asoslari, OT + Google", "Word/Docs, Excel/Sheets, PowerPoint/Canva", "AI tools, Figma + UI tools, Cloud tools", "Imtihon va mentor session"],
    },
    {
      name: "Web (UI/UX) dizayn",
      duration: null,
      modules: ["Figma", "Responsive saytlar", "Mobil ilovalar", "Branding"],
    },
    {
      name: "Vibe Coding",
      duration: null,
      modules: ["Zamonaviy front-end texnologiyalari va AI yordamida tez ishlab chiqish", "Responsive web interfeyslar", "Real mijoz loyihalari"],
    },
  ],
  ru: [
    {
      name: "Робототехника",
      duration: "12 мес",
      modules: [
        "Электроника и физика — практика, транзисторы, микросхемы",
        "Основы программирования — Scratch, mBlock, мультфильмы и игры",
        "Умные роботы — код, датчики, управление по Wi-Fi/Bluetooth",
      ],
    },
    {
      name: "Front-end",
      duration: "6 мес",
      modules: ["1 мес: HTML", "2–3 мес: CSS — Flexbox, Grid, адаптив", "4–5 мес: JavaScript — DOM, функции", "6 мес: React + реальные проекты"],
    },
    {
      name: "Back-end",
      duration: "6 мес",
      modules: ["REST API, базы данных, аутентификация", "Реальные проекты — Blog API, Todo App", "Результат: портфолио на GitHub, деплой, система входа"],
    },
    {
      name: "Графика и веб-дизайн",
      duration: "12 мес",
      modules: ["Photoshop — 3 мес", "Illustrator — 3 мес", "UI/UX и веб-дизайн — Figma, 6 мес", "Результат: от графического дизайнера до UI/UX специалиста"],
    },
    {
      name: "Startup",
      duration: "2 мес",
      modules: ["Блог-платформа", "Интернет-магазин", "Auth + Dashboard", "API + AI интеграция", "Финальный стартап — деплой"],
    },
    {
      name: "Foundation",
      duration: "14 дней",
      modules: ["Основы компьютера, ОС + Google", "Word/Docs, Excel/Sheets, PowerPoint/Canva", "AI-инструменты, Figma, Cloud", "Экзамен и сессия с ментором"],
    },
    {
      name: "Веб (UI/UX) дизайн",
      duration: null,
      modules: ["Figma", "Адаптивные сайты", "Мобильные приложения", "Брендинг"],
    },
    {
      name: "Vibe Coding",
      duration: null,
      modules: ["Современные front-end технологии и быстрая разработка с AI", "Адаптивные веб-интерфейсы", "Реальные проекты клиентов"],
    },
  ],
  en: [
    {
      name: "Robotics",
      duration: "12 mo",
      modules: [
        "Electronics & physics — hands-on practice, transistors, chips",
        "Programming basics — Scratch, mBlock, animations and games",
        "Smart robots — coding, sensors, Wi-Fi/Bluetooth control",
      ],
    },
    {
      name: "Front-end",
      duration: "6 mo",
      modules: ["Month 1: HTML", "Months 2–3: CSS — Flexbox, Grid, responsive", "Months 4–5: JavaScript — DOM, functions", "Month 6: React + real projects"],
    },
    {
      name: "Back-end",
      duration: "6 mo",
      modules: ["REST API, databases, authentication", "Real projects — Blog API, Todo App", "Result: GitHub portfolio, deployment, login system"],
    },
    {
      name: "Graphic & Web Design",
      duration: "12 mo",
      modules: ["Photoshop — 3 mo", "Illustrator — 3 mo", "UI/UX & Web Design — Figma, 6 mo", "Result: from graphic designer to UI/UX specialist"],
    },
    {
      name: "Startup",
      duration: "2 mo",
      modules: ["Blog platform", "Online store", "Auth + Dashboard", "API + AI integration", "Final startup — deploy"],
    },
    {
      name: "Foundation",
      duration: "14 days",
      modules: ["Computer basics, OS + Google", "Word/Docs, Excel/Sheets, PowerPoint/Canva", "AI tools, Figma + UI tools, Cloud tools", "Exam and mentor session"],
    },
    {
      name: "Web (UI/UX) Design",
      duration: null,
      modules: ["Figma", "Responsive websites", "Mobile apps", "Branding"],
    },
    {
      name: "Vibe Coding",
      duration: null,
      modules: ["Modern front-end technologies and fast AI-assisted development", "Responsive web interfaces", "Real client projects"],
    },
  ],
};

export const STUDIO_CARDS: Record<Lang, { title: string; desc: string }[]> = {
  uz: [
    { title: "Innovatsiya", desc: "Yangi yechimlar va texnologiyalar orqali muammolarni hal qilish" },
    { title: "Tez rivojlanish", desc: "Qisqa vaqt ichida katta miqyosda o’sish imkoniyati" },
  ],
  ru: [
    { title: "Инновации", desc: "Решение проблем через новые решения и технологии" },
    { title: "Быстрый рост", desc: "Возможность значительного роста за короткое время" },
  ],
  en: [
    { title: "Innovation", desc: "Solving problems through new solutions and technologies" },
    { title: "Fast growth", desc: "The chance to grow significantly in a short time" },
  ],
};

export const TIMELINE: Record<Lang, string[]> = {
  uz: ["G’oya shakllantirish", "MVP yaratish", "Texnik rivojlanish", "Bozorga chiqish"],
  ru: ["Формирование идеи", "Создание MVP", "Техническое развитие", "Выход на рынок"],
  en: ["Idea formation", "Building MVP", "Technical development", "Market launch"],
};

export type Mentor = { name: string; role: string; bio: string; instagram?: string };

const MENTORS_BASE: { name: string; role: Record<Lang, string>; bio: Record<Lang, string>; instagram?: string }[] = [
  {
    name: "Abdulaziz Yakubov",
    role: { uz: "Asoschisi", ru: "Основатель", en: "Founder" },
    bio: {
      uz: "Yoshlar Ventures direktori (2025-fevral). Dasturchi, Team Leader, CEO — IT sohasida +10 yil tajriba, startapper.",
      ru: "Директор Yoshlar Ventures (февраль 2025). Разработчик, Team Leader, CEO — более 10 лет в IT, стартапер.",
      en: "Director of Yoshlar Ventures (Feb 2025). Developer, Team Leader, CEO — 10+ years in IT, startupper.",
    },
    instagram: "aka.yakubov",
  },
  {
    name: "Akhmadullo Nurmakhamatov",
    role: { uz: "Team Lead", ru: "Team Lead", en: "Team Lead" },
    bio: {
      uz: "6+ yil xalqaro IT tajribasi. Politecnico di Torino (Italiya) bitiruvchisi. React, TypeScript, Agile (Scrum). Senior Software Engineer, Mentor.",
      ru: "6+ лет международного опыта в IT. Выпускник Politecnico di Torino (Италия). React, TypeScript, Agile (Scrum). Senior Software Engineer, ментор.",
      en: "6+ years of international IT experience. Politecnico di Torino (Italy) graduate. React, TypeScript, Agile (Scrum). Senior Software Engineer, mentor.",
    },
  },
  {
    name: "Shuxratbek Aliyev",
    role: { uz: "Grafik va UX/UI ustoz", ru: "Преподаватель графики и UX/UI", en: "Graphic & UX/UI mentor" },
    bio: {
      uz: "5 yil tajriba, Robocode yetakchi mentori. Vodiy Brend Startup asoschisi — 30+ brend, 150+ bitiruvchi.",
      ru: "5 лет опыта, ведущий ментор Robocode. Основатель Vodiy Brend Startup — 30+ брендов, 150+ выпускников.",
      en: "5 years of experience, Robocode’s lead mentor. Founder of Vodiy Brend Startup — 30+ brands, 150+ graduates.",
    },
  },
  {
    name: "Ziyodullo Shuxratbekov",
    role: { uz: "Startup mentor", ru: "Startup-ментор", en: "Startup mentor" },
    bio: {
      uz: "EduCompass asoschisi. 250 000$ qiymatdagi loyiha muallifi, 20+ startap, 700 000$+ investitsiya jalb qilgan.",
      ru: "Основатель EduCompass. Автор проекта стоимостью $250 000, 20+ стартапов, привлечено $700 000+ инвестиций.",
      en: "Founder of EduCompass. Author of a $250,000 project, 20+ startups, $700,000+ raised in investment.",
    },
  },
  {
    name: "Nazrullo Raxmatov",
    role: { uz: "Back-end ustoz", ru: "Преподаватель Back-end", en: "Back-end mentor" },
    bio: {
      uz: "3+ yil IT tajribasi. Robocode bitiruvchisi va ustozi. EduCompass backend jamoasida, 20+ backend loyiha.",
      ru: "3+ года опыта в IT. Выпускник и преподаватель Robocode. В команде backend EduCompass, 20+ проектов.",
      en: "3+ years of IT experience. Robocode graduate and mentor. EduCompass backend team, 20+ backend projects.",
    },
  },
  {
    name: "Abduvahob Qahhorov",
    role: { uz: "Back-end ustoz", ru: "Преподаватель Back-end", en: "Back-end mentor" },
    bio: {
      uz: "5+ yil tajriba. UIC Group va Prolab loyihalarida ishlagan — tizim arxitekturasi va server logikasi bo’yicha mutaxassis.",
      ru: "5+ лет опыта. Работал над проектами UIC Group и Prolab — специалист по архитектуре систем и серверной логике.",
      en: "5+ years of experience. Worked on UIC Group and Prolab projects — specialist in system architecture and server logic.",
    },
  },
  {
    name: "Saidislom To’lqinov",
    role: { uz: "Front-end / 3D ustoz", ru: "Преподаватель Front-end / 3D", en: "Front-end / 3D mentor" },
    bio: {
      uz: "5 yil tajriba, Fransiyadagi \"NFINITE\"da ishlaydi. CANFORAMA, CASTORAMA, LECLERC, WALLMART bilan hamkorlik. 25+ shogird.",
      ru: "5 лет опыта, работает в \"NFINITE\" (Франция). Сотрудничество с CANFORAMA, CASTORAMA, LECLERC, WALLMART. 25+ учеников.",
      en: "5 years of experience, works at \"NFINITE\" in France. Collaborations with CANFORAMA, CASTORAMA, LECLERC, WALLMART. 25+ mentees.",
    },
  },
  {
    name: "Husanboy Zafarov",
    role: { uz: "Front-end ustoz", ru: "Преподаватель Front-end", en: "Front-end mentor" },
    bio: {
      uz: "3+ yil tajriba, Robocode bitiruvchisi. EduCompass va Bozorly loyihalarida ishlagan, Figma’da UI dizayn.",
      ru: "3+ года опыта, выпускник Robocode. Работал над проектами EduCompass и Bozorly, UI-дизайн в Figma.",
      en: "3+ years of experience, Robocode graduate. Worked on EduCompass and Bozorly projects, UI design in Figma.",
    },
  },
  {
    name: "Hasanboy Zafarov",
    role: { uz: "Vibe Coding ustoz", ru: "Преподаватель Vibe Coding", en: "Vibe Coding mentor" },
    bio: {
      uz: "Robocode front-end mentori. Responsive web interfeyslar va zamonaviy front-end texnologiyalari bo’yicha ustoz.",
      ru: "Front-end ментор Robocode. Преподаёт адаптивные веб-интерфейсы и современные front-end технологии.",
      en: "Robocode front-end mentor. Teaches responsive web interfaces and modern front-end technologies.",
    },
  },
  {
    name: "Alimjanov Saidmurod",
    role: { uz: "Front-end / Foundation ustoz", ru: "Преподаватель Front-end / Foundation", en: "Front-end / Foundation mentor" },
    bio: {
      uz: "2+ yil tajriba. Darslarni rus va o’zbek tillarida olib boradi. Bozorly loyihasida ishtirok etgan.",
      ru: "2+ года опыта. Ведёт занятия на русском и узбекском языках. Участвовал в проекте Bozorly.",
      en: "2+ years of experience. Teaches classes in Russian and Uzbek. Contributed to the Bozorly project.",
    },
  },
];

export const MENTORS: Record<Lang, Mentor[]> = {
  uz: MENTORS_BASE.map((m) => ({ name: m.name, role: m.role.uz, bio: m.bio.uz, instagram: m.instagram })),
  ru: MENTORS_BASE.map((m) => ({ name: m.name, role: m.role.ru, bio: m.bio.ru, instagram: m.instagram })),
  en: MENTORS_BASE.map((m) => ({ name: m.name, role: m.role.en, bio: m.bio.en, instagram: m.instagram })),
};
