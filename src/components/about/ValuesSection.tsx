import { motion } from "framer-motion";
import { 
  Lightbulb, Users, Shield, Leaf, 
  Rocket, Heart, Globe, Zap,
  Target, Award
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ValuesSection = () => {
  const { t } = useLanguage();

  const coreValues = [
    { icon: Lightbulb, title: t("values.innovation"), description: t("values.innovation_desc"), gradient: "from-orange-500 to-red-500" },
    { icon: Users, title: t("values.people"), description: t("values.people_desc"), gradient: "from-blue-500 to-cyan-500" },
    { icon: Shield, title: t("values.integrity"), description: t("values.integrity_desc"), gradient: "from-purple-500 to-pink-500" },
    { icon: Leaf, title: t("values.sustainability"), description: t("values.sustainability_desc"), gradient: "from-green-500 to-emerald-500" },
    { icon: Rocket, title: t("values.excellence"), description: t("values.excellence_desc"), gradient: "from-indigo-500 to-violet-500" },
    { icon: Heart, title: t("values.passion"), description: t("values.passion_desc"), gradient: "from-rose-500 to-pink-500" },
  ];

  const principles = [
    { icon: Globe, text: t("values.think_global") },
    { icon: Zap, text: t("values.speed") },
    { icon: Target, text: t("values.customer") },
    { icon: Award, text: t("values.learning") },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Heart className="w-4 h-4" />
            {t("values.badge")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{t("values.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("values.subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {coreValues.map((value, index) => (
            <motion.div key={value.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }} className="group">
              <div className="h-full glass-card rounded-3xl p-8 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-3xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t("values.principles_title")}</h3>
            <p className="text-muted-foreground">{t("values.principles_subtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle, index) => (
              <motion.div key={principle.text} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.05 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-surface-soft hover:bg-surface-muted transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <principle.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="font-medium text-foreground">{principle.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ scale: 0.9 }} whileInView={{ scale: 1 }} viewport={{ once: true }} className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent-cyan/20 to-primary/20 blur-3xl" />
              <div className="relative glass-card rounded-3xl p-10 md:p-16">
                <h3 className="text-lg font-medium text-primary mb-4">{t("values.mission_label")}</h3>
                <p className="text-2xl md:text-4xl font-bold text-foreground leading-tight">{t("values.mission_text")}</p>
                <div className="mt-8 flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-muted-foreground font-medium">{t("values.mission_tagline")}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ValuesSection;
