import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Linkedin, Instagram, Youtube, Twitter, Facebook, 
  Send, Mail, Phone, MapPin, ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import alsamosLogo from "@/assets/alsamos-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

const socialLinks = [
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/alsamos/" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/alsamosofficial" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/alsamos" },
  { name: "X", icon: Twitter, href: "https://x.com/AlsamosOfficial" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/AlsamosOfficial" },
  { name: "Telegram", icon: Send, href: "https://t.me/alsamos" },
];

export const Footer = () => {
  const { t } = useLanguage();

  const footerLinks = {
    company: [
      { name: t("footer.about_us"), href: "/about" },
      { name: t("footer.leadership"), href: "/about#leadership" },
      { name: t("footer.careers"), href: "/careers" },
      { name: t("footer.press"), href: "/news" },
      { name: t("footer.contact"), href: "/contact" },
    ],
    industries: [
      { name: t("footer.it_tech"), href: "/industries/it" },
      { name: t("footer.education"), href: "/industries/education" },
      { name: t("footer.healthcare"), href: "/industries/medicine" },
      { name: t("footer.automotive"), href: "/industries/automotive" },
      { name: t("footer.aerospace"), href: "/industries/aerospace" },
      { name: t("footer.all_industries"), href: "/industries" },
    ],
    products: [
      { name: t("footer.alsamos_cloud"), href: "/products/cloud" },
      { name: t("footer.alsamos_ai"), href: "/products/ai" },
      { name: t("footer.alsamos_ev"), href: "/products/ev" },
      { name: t("footer.smart_devices"), href: "/products/devices" },
      { name: t("footer.all_products"), href: "/products" },
    ],
    investors: [
      { name: t("footer.investor_relations"), href: "/investors" },
      { name: t("footer.financial_reports"), href: "/investors#reports" },
      { name: t("footer.stock_info"), href: "/investors#stock" },
      { name: t("footer.governance"), href: "/investors#governance" },
      { name: t("footer.become_investor"), href: "/investors#join" },
    ],
  };

  return (
    <footer className="bg-surface-soft dark:bg-surface-muted border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              {t("footer.newsletter_title")}
            </motion.h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">{t("footer.newsletter_subtitle")}</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input type="email" placeholder={t("footer.newsletter_placeholder")}
                className="flex-1 h-12 px-4 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground" />
              <Button className="h-12 px-6 bg-primary hover:bg-primary-dark text-primary-foreground">
                {t("footer.subscribe")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-12">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 sm:mb-6">
              <img src={alsamosLogo} alt="ALSAMOS Logo" className="w-9 h-9 sm:w-10 sm:h-10 object-contain" />
              <span className="text-lg sm:text-xl font-bold text-primary">ALSAMOS</span>
            </Link>
            <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6 max-w-xs">{t("footer.brand_desc")}</p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                  aria-label={social.name}>
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-sm sm:text-base mb-3 sm:mb-4">{t("footer.company")}</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-sm sm:text-base mb-3 sm:mb-4">{t("footer.industries")}</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.industries.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden sm:block">
            <h4 className="font-semibold text-foreground text-sm sm:text-base mb-3 sm:mb-4">{t("footer.products")}</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block">
            <h4 className="font-semibold text-foreground text-sm sm:text-base mb-3 sm:mb-4">{t("footer.investors")}</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.investors.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 lg:gap-12 text-xs sm:text-sm text-muted-foreground">
            <a href="mailto:alsamos.company@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />alsamos.company@gmail.com
            </a>
            <a href="tel:+998933007709" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />+998 93 300 77 09
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />Tashkent, Uzbekistan
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <p>{t("footer.rights").replace("{year}", String(new Date().getFullYear()))}</p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-6">
              <Link to="/privacy" className="hover:text-primary transition-colors">{t("footer.privacy")}</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">{t("footer.terms")}</Link>
              <Link to="/cookies" className="hover:text-primary transition-colors">{t("footer.cookies")}</Link>
              <Link to="/sitemap" className="hover:text-primary transition-colors">{t("footer.sitemap")}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
