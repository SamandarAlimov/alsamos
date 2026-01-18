import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "uz" | "ru";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    "nav.home": "Home",
    "nav.industries": "Industries",
    "nav.products": "Products",
    "nav.news": "News",
    "nav.about": "About",
    "nav.investors": "Investors",
    "nav.careers": "Careers",
    "nav.contact": "Contact",
    "header.explore_industries": "Explore 100+ Industries",
    "header.view_all": "View All Industries",
    
    // Hero
    "hero.badge": "Innovation Across 100+ Industries",
    "hero.title": "MAKE IT REAL",
    "hero.subtitle": "Building the future of humanity through innovation.",
    "hero.subtitle2": "From AI to Aerospace, Education to Healthcare.",
    "hero.cta_investor": "Become an Investor",
    "hero.cta_explore": "Explore Industries",
    "hero.watch_story": "Watch Our Story",
    
    // Stats
    "stats.industries": "Industries",
    "stats.users": "Users Worldwide",
    "stats.countries": "Countries",
    "stats.assets": "Assets Managed",
    
    // Common
    "common.learn_more": "Learn More",
    "common.visit_site": "Visit Site",
    "common.read_more": "Read More",
    "common.view_all": "View All",
    "common.search": "Search...",
  },
  uz: {
    // Header
    "nav.home": "Bosh sahifa",
    "nav.industries": "Sohalar",
    "nav.products": "Mahsulotlar",
    "nav.news": "Yangiliklar",
    "nav.about": "Biz haqimizda",
    "nav.investors": "Investorlar",
    "nav.careers": "Karyera",
    "nav.contact": "Aloqa",
    "header.explore_industries": "100+ sohani o'rganing",
    "header.view_all": "Barcha sohalar",
    
    // Hero
    "hero.badge": "100+ sohada innovatsiya",
    "hero.title": "HAQIQATGA AYLANTIR",
    "hero.subtitle": "Innovatsiya orqali insoniyat kelajagini quramiz.",
    "hero.subtitle2": "Sun'iy intellektdan kosmik texnologiyagacha, ta'limdan sog'liqni saqlashgacha.",
    "hero.cta_investor": "Investor bo'ling",
    "hero.cta_explore": "Sohalarni o'rganing",
    "hero.watch_story": "Bizning hikoyamiz",
    
    // Stats
    "stats.industries": "Sohalar",
    "stats.users": "Foydalanuvchilar",
    "stats.countries": "Mamlakatlar",
    "stats.assets": "Boshqariladigan aktivlar",
    
    // Common
    "common.learn_more": "Batafsil",
    "common.visit_site": "Saytga o'tish",
    "common.read_more": "Davomini o'qish",
    "common.view_all": "Barchasini ko'rish",
    "common.search": "Qidirish...",
  },
  ru: {
    // Header
    "nav.home": "Главная",
    "nav.industries": "Индустрии",
    "nav.products": "Продукты",
    "nav.news": "Новости",
    "nav.about": "О нас",
    "nav.investors": "Инвесторы",
    "nav.careers": "Карьера",
    "nav.contact": "Контакты",
    "header.explore_industries": "Изучите 100+ индустрий",
    "header.view_all": "Все индустрии",
    
    // Hero
    "hero.badge": "Инновации в 100+ индустриях",
    "hero.title": "ВОПЛОЩАЕМ В РЕАЛЬНОСТЬ",
    "hero.subtitle": "Строим будущее человечества через инновации.",
    "hero.subtitle2": "От ИИ до аэрокосмических технологий, от образования до здравоохранения.",
    "hero.cta_investor": "Стать инвестором",
    "hero.cta_explore": "Изучить индустрии",
    "hero.watch_story": "Наша история",
    
    // Stats
    "stats.industries": "Индустрий",
    "stats.users": "Пользователей",
    "stats.countries": "Стран",
    "stats.assets": "Управляемые активы",
    
    // Common
    "common.learn_more": "Подробнее",
    "common.visit_site": "Перейти на сайт",
    "common.read_more": "Читать далее",
    "common.view_all": "Посмотреть все",
    "common.search": "Поиск...",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && ["en", "uz", "ru"].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
