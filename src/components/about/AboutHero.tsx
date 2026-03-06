import { motion } from "framer-motion";
import { Building2, Globe, Users, Lightbulb, Rocket, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutHero = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: Building2, value: "100+", label: t("about.stat_industries") },
    { icon: Globe, value: "50+", label: t("about.stat_countries") },
    { icon: Users, value: "10K+", label: t("about.stat_employees") },
    { icon: Lightbulb, value: "500+", label: t("about.stat_innovations") },
  ];

  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface-soft to-background" />
      
      <div className="absolute inset-0 overflow-hidden hidden sm:block">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%", opacity: 0 }}
            animate={{ y: [null, "-100%"], opacity: [0, 1, 0] }}
            transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
      </div>

      <div className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-primary/10 rounded-full blur-[60px] sm:blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-accent-cyan/10 rounded-full blur-[40px] sm:blur-[80px] animate-pulse" />

      <div className="relative z-10 container mx-auto px-4 py-10 sm:py-16 lg:py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {t("about.badge")}
          </span>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 sm:mb-6">
            {t("about.title_1")}
            <span className="bg-gradient-to-r from-primary via-primary-light to-accent-cyan bg-clip-text text-transparent">
              {t("about.title_2")}
            </span>
            <br />
            {t("about.title_3")}
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-12 px-2">
            {t("about.description")}
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-10 sm:mb-16">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full glass-card">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-foreground font-medium text-sm sm:text-base">{t("about.trusted")}</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full glass-card">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-foreground font-medium text-sm sm:text-base">{t("about.innovation_first")}</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl text-center group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-0.5 sm:mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
