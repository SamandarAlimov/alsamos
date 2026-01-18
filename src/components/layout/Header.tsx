import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, Search, Sun, Moon, ChevronDown, Globe,
  Monitor, GraduationCap, Heart, Car, Rocket, Brain,
  Bot, Wallet, Building2, Smartphone, Shirt, Film,
  UtensilsCrossed, Activity, ShoppingCart, Gamepad2,
  BookOpen, Zap, Wheat
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sectors } from "@/data/sectors";
import { GlobalSearch } from "@/components/GlobalSearch";
import { useLanguage } from "@/contexts/LanguageContext";
import alsamosLogo from "@/assets/alsamos-logo.png";
const iconMap: Record<string, React.ComponentType<any>> = {
  Monitor, GraduationCap, Heart, Car, Rocket, Brain,
  Bot, Wallet, Building2, Smartphone, Shirt, Film,
  UtensilsCrossed, Activity, ShoppingCart, Gamepad2,
  BookOpen, Zap, Wheat
};

const navItems = [
  { name: "Home", href: "/" },
  { name: "Industries", href: "/industries", hasDropdown: true },
  { name: "Products", href: "/products" },
  { name: "News", href: "/news" },
  { name: "About", href: "/about" },
  { name: "Investors", href: "/investors" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

const languages = [
  { code: "en" as const, name: "English", flag: "🇺🇸" },
  { code: "uz" as const, name: "O'zbekcha", flag: "🇺🇿" },
  { code: "ru" as const, name: "Русский", flag: "🇷🇺" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isIndustriesOpen, setIsIndustriesOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(savedTheme === "dark" || (!savedTheme && prefersDark));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsIndustriesOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled 
            ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-lg" 
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img 
                  src={alsamosLogo} 
                  alt="ALSAMOS Logo" 
                  className="w-10 h-10 lg:w-12 lg:h-12 object-contain"
                />
                <div className="absolute inset-0 rounded-xl bg-primary/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
              <span className="text-xl lg:text-2xl font-bold text-primary hidden sm:block">
                ALSAMOS
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <button
                      onMouseEnter={() => setIsIndustriesOpen(true)}
                      onMouseLeave={() => setIsIndustriesOpen(false)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1",
                        location.pathname.startsWith("/industries")
                          ? "text-primary bg-primary/10"
                          : "text-foreground hover:text-primary hover:bg-primary/5"
                      )}
                    >
                      {t(`nav.${item.name.toLowerCase()}`)}
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform",
                        isIndustriesOpen && "rotate-180"
                      )} />
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        location.pathname === item.href
                          ? "text-primary bg-primary/10"
                          : "text-foreground hover:text-primary hover:bg-primary/5"
                      )}
                    >
                      {t(`nav.${item.name.toLowerCase()}`)}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="text-foreground hover:text-primary"
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Language Switcher */}
              <div className="relative hidden md:block">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="text-foreground hover:text-primary"
                >
                  <Globe className="w-5 h-5" />
                </Button>
                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-40 rounded-xl bg-card border border-border shadow-xl overflow-hidden"
                    >
                      {languages.map((lang) => (
                        <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left text-sm flex items-center gap-3 hover:bg-accent transition-colors",
                        language === lang.code && "bg-primary/10 text-primary"
                      )}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-foreground hover:text-primary"
              >
                <AnimatePresence mode="wait">
                  {isDarkMode ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <Sun className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                    >
                      <Moon className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-foreground"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Industries Mega Menu */}
        <AnimatePresence>
          {isIndustriesOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onMouseEnter={() => setIsIndustriesOpen(true)}
              onMouseLeave={() => setIsIndustriesOpen(false)}
              className="absolute left-0 right-0 top-full bg-card/98 backdrop-blur-xl border-b border-border shadow-2xl hidden lg:block"
            >
              <div className="container mx-auto px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">{t("header.explore_industries")}</h3>
                  <Link 
                    to="/industries" 
                    className="text-primary hover:text-primary-dark text-sm font-medium flex items-center gap-1"
                  >
                    {t("header.view_all")}
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                  </Link>
                </div>
                <div className="grid grid-cols-4 xl:grid-cols-5 gap-3">
                  {sectors.slice(0, 20).map((sector) => {
                    const IconComponent = iconMap[sector.icon] || Monitor;
                    return (
                      <Link
                        key={sector.id}
                        to={`/industries/${sector.slug}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-all group"
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white",
                          sector.gradient
                        )}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground group-hover:text-primary truncate">
                            {sector.name}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-background/95 backdrop-blur-xl">
              <div className="flex flex-col h-full pt-20 pb-6 px-6 overflow-y-auto">
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "px-4 py-3 rounded-xl text-lg font-medium transition-all",
                        location.pathname === item.href
                          ? "text-primary bg-primary/10"
                          : "text-foreground hover:text-primary hover:bg-primary/5"
                      )}
                    >
                      {t(`nav.${item.name.toLowerCase()}`)}
                    </Link>
                  ))}
                </nav>

                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">Quick Industries</p>
                  <div className="grid grid-cols-2 gap-2">
                    {sectors.slice(0, 8).map((sector) => {
                      const IconComponent = iconMap[sector.icon] || Monitor;
                      return (
                        <Link
                          key={sector.id}
                          to={`/industries/${sector.slug}`}
                          className="flex items-center gap-2 p-3 rounded-xl bg-surface-soft hover:bg-accent/50 transition-all"
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white",
                            sector.gradient
                          )}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-foreground truncate">
                            {sector.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Language Switcher Mobile */}
                <div className="mt-auto pt-8">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1",
                          language === lang.code
                            ? "text-primary bg-primary/10"
                            : "text-foreground hover:text-primary hover:bg-primary/5"
                        )}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="text-xs">{lang.code.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Search */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
