import { useLanguage } from "@/contexts/LanguageContext";

type Language = "en" | "uz" | "ru";

interface SeoMetaData {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string;
}

type PageSeoData = Record<Language, SeoMetaData>;

const seoTranslations: Record<string, PageSeoData> = {
  home: {
    en: {
      title: "ALSAMOS - Make It Real | Global Innovation Corporation",
      description: "ALSAMOS is a multinational innovation corporation operating across 100+ industries including IT, Education, Medicine, Automotive, Aerospace, AI, and more. Building the future of humanity through innovation.",
      ogTitle: "ALSAMOS - Make It Real | Global Innovation Corporation",
      ogDescription: "Building the future of humanity through innovation across 100+ industries worldwide.",
      keywords: "ALSAMOS, innovation, technology, AI, education, healthcare, automotive, aerospace, investment"
    },
    uz: {
      title: "ALSAMOS - Haqiqatga Aylantir | Global Innovatsiya Korporatsiyasi",
      description: "ALSAMOS - IT, Ta'lim, Tibbiyot, Avtomobil, Aerokosmik, Sun'iy intellekt va boshqa 100+ sohada faoliyat yurituvchi ko'pmillatli innovatsiya korporatsiyasi. Innovatsiya orqali insoniyat kelajagini quramiz.",
      ogTitle: "ALSAMOS - Haqiqatga Aylantir | Global Innovatsiya Korporatsiyasi",
      ogDescription: "Butun dunyo bo'ylab 100+ sohada innovatsiya orqali insoniyat kelajagini quramiz.",
      keywords: "ALSAMOS, innovatsiya, texnologiya, sun'iy intellekt, ta'lim, tibbiyot, avtomobil, aerokosmik, investitsiya"
    },
    ru: {
      title: "ALSAMOS - Воплощаем в Реальность | Глобальная Инновационная Корпорация",
      description: "ALSAMOS - многонациональная инновационная корпорация, работающая в 100+ отраслях: IT, образование, медицина, автомобили, аэрокосмос, ИИ и другие. Строим будущее человечества через инновации.",
      ogTitle: "ALSAMOS - Воплощаем в Реальность | Глобальная Инновационная Корпорация",
      ogDescription: "Строим будущее человечества через инновации в 100+ отраслях по всему миру.",
      keywords: "ALSAMOS, инновации, технологии, ИИ, образование, здравоохранение, автомобили, аэрокосмос, инвестиции"
    }
  },
  about: {
    en: {
      title: "About ALSAMOS | Global Innovation Corporation | 100+ Industries",
      description: "Discover ALSAMOS Corporation - a multinational innovation powerhouse operating across 100+ business sectors. Meet our visionary founder Samandar Alimov and world-class leadership team driving global transformation.",
      ogTitle: "About ALSAMOS | Global Innovation Corporation",
      ogDescription: "Discover ALSAMOS - a multinational innovation corporation operating across 100+ business sectors with $2.8B revenue.",
      keywords: "ALSAMOS, about us, company history, Samandar Alimov, founder, CEO, leadership, innovation, technology corporation, global company, 100 industries"
    },
    uz: {
      title: "ALSAMOS Haqida | Global Innovatsiya Korporatsiyasi | 100+ Soha",
      description: "ALSAMOS korporatsiyasini kashf eting - 100+ biznes sektorida faoliyat yurituvchi ko'pmillatli innovatsiya giganti. Vizioner asoschimiz Samandar Alimov va global transformatsiyani boshqaruvchi jahon darajasidagi rahbariyat jamoasi bilan tanishing.",
      ogTitle: "ALSAMOS Haqida | Global Innovatsiya Korporatsiyasi",
      ogDescription: "ALSAMOS - 100+ biznes sektorida faoliyat yurituvchi ko'pmillatli innovatsiya korporatsiyasini kashf eting.",
      keywords: "ALSAMOS, biz haqimizda, kompaniya tarixi, Samandar Alimov, asoschisi, bosh direktor, rahbariyat, innovatsiya"
    },
    ru: {
      title: "О ALSAMOS | Глобальная Инновационная Корпорация | 100+ Отраслей",
      description: "Откройте для себя ALSAMOS Corporation - многонациональный инновационный гигант, работающий в 100+ бизнес-секторах. Познакомьтесь с нашим основателем Самандаром Алимовым и командой мирового класса.",
      ogTitle: "О ALSAMOS | Глобальная Инновационная Корпорация",
      ogDescription: "Откройте ALSAMOS - многонациональную инновационную корпорацию, работающую в 100+ бизнес-секторах.",
      keywords: "ALSAMOS, о нас, история компании, Самандар Алимов, основатель, генеральный директор, руководство, инновации"
    }
  },
  news: {
    en: {
      title: "News & Updates | ALSAMOS Corporation",
      description: "Stay updated with the latest news, press releases, and announcements from ALSAMOS Corporation. Discover our innovations, partnerships, and global initiatives across 100+ industries.",
      ogTitle: "News & Updates | ALSAMOS Corporation",
      ogDescription: "Latest news and updates from ALSAMOS - innovations, partnerships, and global initiatives.",
      keywords: "ALSAMOS news, press releases, company updates, announcements, innovations, partnerships"
    },
    uz: {
      title: "Yangiliklar va Yangilanishlar | ALSAMOS Korporatsiyasi",
      description: "ALSAMOS korporatsiyasining so'nggi yangiliklari, press-relizlari va e'lonlari bilan tanishing. 100+ sohada innovatsiyalar, hamkorliklar va global tashabbuslarimizni kashf eting.",
      ogTitle: "Yangiliklar va Yangilanishlar | ALSAMOS Korporatsiyasi",
      ogDescription: "ALSAMOS'dan so'nggi yangiliklar - innovatsiyalar, hamkorliklar va global tashabbuslar.",
      keywords: "ALSAMOS yangiliklar, press-relizlar, kompaniya yangiliklari, e'lonlar, innovatsiyalar, hamkorliklar"
    },
    ru: {
      title: "Новости и Обновления | ALSAMOS Corporation",
      description: "Будьте в курсе последних новостей, пресс-релизов и объявлений от ALSAMOS Corporation. Узнайте о наших инновациях, партнерствах и глобальных инициативах в 100+ отраслях.",
      ogTitle: "Новости и Обновления | ALSAMOS Corporation",
      ogDescription: "Последние новости от ALSAMOS - инновации, партнерства и глобальные инициативы.",
      keywords: "ALSAMOS новости, пресс-релизы, обновления компании, объявления, инновации, партнерства"
    }
  },
  products: {
    en: {
      title: "Products & Solutions | ALSAMOS Corporation",
      description: "Explore ALSAMOS's innovative products and solutions across AI, robotics, education platforms, healthcare systems, and more. Cutting-edge technology transforming industries worldwide.",
      ogTitle: "Products & Solutions | ALSAMOS Corporation",
      ogDescription: "Cutting-edge products and solutions from ALSAMOS transforming industries worldwide.",
      keywords: "ALSAMOS products, solutions, AI, robotics, education platforms, healthcare systems, technology"
    },
    uz: {
      title: "Mahsulotlar va Yechimlar | ALSAMOS Korporatsiyasi",
      description: "ALSAMOS'ning sun'iy intellekt, robototexnika, ta'lim platformalari, sog'liqni saqlash tizimlari va boshqa sohalardagi innovatsion mahsulotlari va yechimlarini o'rganing.",
      ogTitle: "Mahsulotlar va Yechimlar | ALSAMOS Korporatsiyasi",
      ogDescription: "Butun dunyo bo'ylab sohalarni o'zgartiruvchi ALSAMOS'ning ilg'or mahsulotlari va yechimlari.",
      keywords: "ALSAMOS mahsulotlar, yechimlar, sun'iy intellekt, robototexnika, ta'lim platformalari, texnologiya"
    },
    ru: {
      title: "Продукты и Решения | ALSAMOS Corporation",
      description: "Изучите инновационные продукты и решения ALSAMOS в области ИИ, робототехники, образовательных платформ, систем здравоохранения и других отраслей.",
      ogTitle: "Продукты и Решения | ALSAMOS Corporation",
      ogDescription: "Передовые продукты и решения от ALSAMOS, трансформирующие отрасли по всему миру.",
      keywords: "ALSAMOS продукты, решения, ИИ, робототехника, образовательные платформы, технологии"
    }
  },
  industries: {
    en: {
      title: "Industries & Sectors | ALSAMOS - 100+ Business Verticals",
      description: "Explore ALSAMOS's presence across 100+ industries including Technology, Healthcare, Education, Automotive, Aerospace, Finance, and more. Discover how we're transforming every sector.",
      ogTitle: "Industries & Sectors | ALSAMOS Corporation",
      ogDescription: "ALSAMOS operates across 100+ industries - Technology, Healthcare, Education, Automotive, Aerospace, and more.",
      keywords: "ALSAMOS industries, sectors, technology, healthcare, education, automotive, aerospace, finance, business"
    },
    uz: {
      title: "Sohalar va Sektorlar | ALSAMOS - 100+ Biznes Yo'nalishi",
      description: "ALSAMOS'ning Texnologiya, Sog'liqni saqlash, Ta'lim, Avtomobil, Aerokosmik, Moliya va boshqa 100+ sohadagi faoliyatini o'rganing. Har bir sektorni qanday o'zgartirganini bilib oling.",
      ogTitle: "Sohalar va Sektorlar | ALSAMOS Korporatsiyasi",
      ogDescription: "ALSAMOS 100+ sohada faoliyat yuritadi - Texnologiya, Sog'liqni saqlash, Ta'lim, Avtomobil, Aerokosmik.",
      keywords: "ALSAMOS sohalar, sektorlar, texnologiya, sog'liqni saqlash, ta'lim, avtomobil, aerokosmik, moliya"
    },
    ru: {
      title: "Отрасли и Секторы | ALSAMOS - 100+ Бизнес-Направлений",
      description: "Изучите присутствие ALSAMOS в 100+ отраслях: технологии, здравоохранение, образование, автомобили, аэрокосмос, финансы и другие. Узнайте, как мы трансформируем каждый сектор.",
      ogTitle: "Отрасли и Секторы | ALSAMOS Corporation",
      ogDescription: "ALSAMOS работает в 100+ отраслях - технологии, здравоохранение, образование, автомобили, аэрокосмос.",
      keywords: "ALSAMOS отрасли, секторы, технологии, здравоохранение, образование, автомобили, аэрокосмос, финансы"
    }
  },
  careers: {
    en: {
      title: "Careers at ALSAMOS | Join Our Global Team",
      description: "Join ALSAMOS and be part of a global team shaping the future. Explore career opportunities across technology, engineering, design, marketing, and more. Build your career with us.",
      ogTitle: "Careers at ALSAMOS | Join Our Global Team",
      ogDescription: "Join ALSAMOS and build your career with a global innovation leader across 100+ industries.",
      keywords: "ALSAMOS careers, jobs, employment, technology jobs, engineering, design, marketing, global opportunities"
    },
    uz: {
      title: "ALSAMOS'da Karyera | Bizning Global Jamoamizga Qo'shiling",
      description: "ALSAMOS'ga qo'shiling va kelajakni shakllantirayotgan global jamoaning bir qismi bo'ling. Texnologiya, muhandislik, dizayn, marketing va boshqa sohalarda karyera imkoniyatlarini o'rganing.",
      ogTitle: "ALSAMOS'da Karyera | Bizning Global Jamoamizga Qo'shiling",
      ogDescription: "ALSAMOS'ga qo'shiling va 100+ sohada global innovatsiya yetakchisi bilan karyerangizni qurying.",
      keywords: "ALSAMOS karyera, ish o'rinlari, bandlik, texnologiya ishlari, muhandislik, dizayn, marketing"
    },
    ru: {
      title: "Карьера в ALSAMOS | Присоединяйтесь к Нашей Глобальной Команде",
      description: "Присоединяйтесь к ALSAMOS и станьте частью глобальной команды, формирующей будущее. Изучите карьерные возможности в технологиях, инженерии, дизайне, маркетинге и других областях.",
      ogTitle: "Карьера в ALSAMOS | Присоединяйтесь к Нашей Глобальной Команде",
      ogDescription: "Присоединяйтесь к ALSAMOS и стройте карьеру с глобальным лидером инноваций в 100+ отраслях.",
      keywords: "ALSAMOS карьера, вакансии, работа, технологии, инженерия, дизайн, маркетинг"
    }
  },
  contact: {
    en: {
      title: "Contact ALSAMOS | Get in Touch With Our Global Team",
      description: "Get in touch with ALSAMOS Corporation. Contact our global offices for business inquiries, partnerships, media requests, or general information. We're here to help.",
      ogTitle: "Contact ALSAMOS | Get in Touch",
      ogDescription: "Contact ALSAMOS Corporation for business inquiries, partnerships, or general information.",
      keywords: "ALSAMOS contact, get in touch, business inquiries, partnerships, media requests, offices"
    },
    uz: {
      title: "ALSAMOS Bilan Bog'laning | Bizning Global Jamoamiz Bilan Aloqa",
      description: "ALSAMOS korporatsiyasi bilan bog'laning. Biznes so'rovlari, hamkorliklar, media so'rovlari yoki umumiy ma'lumot uchun global ofislarimiz bilan bog'laning. Biz yordam berishga tayyormiz.",
      ogTitle: "ALSAMOS Bilan Bog'laning | Aloqa",
      ogDescription: "Biznes so'rovlari, hamkorliklar yoki umumiy ma'lumot uchun ALSAMOS korporatsiyasi bilan bog'laning.",
      keywords: "ALSAMOS aloqa, bog'lanish, biznes so'rovlari, hamkorliklar, media so'rovlari, ofislar"
    },
    ru: {
      title: "Связаться с ALSAMOS | Свяжитесь с Нашей Глобальной Командой",
      description: "Свяжитесь с ALSAMOS Corporation. Обратитесь в наши глобальные офисы по бизнес-вопросам, партнерствам, медиа-запросам или за общей информацией.",
      ogTitle: "Связаться с ALSAMOS | Контакты",
      ogDescription: "Свяжитесь с ALSAMOS Corporation по бизнес-вопросам, партнерствам или за общей информацией.",
      keywords: "ALSAMOS контакты, связаться, бизнес-запросы, партнерства, медиа-запросы, офисы"
    }
  },
  investors: {
    en: {
      title: "Investor Relations | ALSAMOS Corporation",
      description: "Explore investment opportunities with ALSAMOS Corporation. Access financial reports, investor updates, and partnership opportunities across our 100+ industry portfolio.",
      ogTitle: "Investor Relations | ALSAMOS Corporation",
      ogDescription: "Investment opportunities and financial information from ALSAMOS Corporation.",
      keywords: "ALSAMOS investors, investment, financial reports, partnerships, portfolio, investor relations"
    },
    uz: {
      title: "Investor Munosabatlari | ALSAMOS Korporatsiyasi",
      description: "ALSAMOS korporatsiyasi bilan investitsiya imkoniyatlarini o'rganing. Moliyaviy hisobotlar, investor yangilanishlari va 100+ sohali portfelimiz bo'ylab hamkorlik imkoniyatlariga kirish.",
      ogTitle: "Investor Munosabatlari | ALSAMOS Korporatsiyasi",
      ogDescription: "ALSAMOS korporatsiyasidan investitsiya imkoniyatlari va moliyaviy ma'lumotlar.",
      keywords: "ALSAMOS investorlar, investitsiya, moliyaviy hisobotlar, hamkorliklar, portfel"
    },
    ru: {
      title: "Отношения с Инвесторами | ALSAMOS Corporation",
      description: "Изучите инвестиционные возможности с ALSAMOS Corporation. Получите доступ к финансовым отчетам, обновлениям для инвесторов и возможностям партнерства в нашем портфеле из 100+ отраслей.",
      ogTitle: "Отношения с Инвесторами | ALSAMOS Corporation",
      ogDescription: "Инвестиционные возможности и финансовая информация от ALSAMOS Corporation.",
      keywords: "ALSAMOS инвесторы, инвестиции, финансовые отчеты, партнерства, портфель"
    }
  }
};

export const useSeoMeta = (pageKey: string): SeoMetaData => {
  const { language } = useLanguage();
  
  const pageSeo = seoTranslations[pageKey];
  if (!pageSeo) {
    // Return default English values if page not found
    return {
      title: "ALSAMOS Corporation",
      description: "Global innovation corporation operating across 100+ industries.",
      ogTitle: "ALSAMOS Corporation",
      ogDescription: "Global innovation corporation.",
      keywords: "ALSAMOS, innovation, technology"
    };
  }
  
  return pageSeo[language];
};

export const getLocaleCode = (language: Language): string => {
  const localeMap: Record<Language, string> = {
    en: "en_US",
    uz: "uz_UZ",
    ru: "ru_RU"
  };
  return localeMap[language];
};

export default useSeoMeta;
