import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ExternalLink, ChevronDown,
  Monitor, GraduationCap, Heart, Car, Rocket, Brain,
  Bot, Wallet, Building2, Smartphone, Shirt, Film,
  UtensilsCrossed, Activity, ShoppingCart, Gamepad2,
  BookOpen, Zap, Wheat, FileText, CloudSun, School,
  Utensils, Navigation, Search, Users, UserCheck, Mail, Newspaper, Moon,
  Languages, Music, Library, Plane, Tv, MessageCircle,
  Pizza, ShieldCheck, Cpu, Factory, Anchor, Pickaxe, Gem,
  Leaf, Droplets, TreePine, Wind, Sun, Atom, Microscope,
  Pill, Stethoscope, Dumbbell, Camera, Palette, PenTool,
  Globe, Radio, Wifi, Server, Database, Lock, Cloud,
  Briefcase, TrendingUp, Landmark, CreditCard, PiggyBank,
  Home, Hammer, HardHat, Truck, Ship, Train, Bus,
  Scissors, Baby, Dog, Flower2, Coffee, Wine, Beer,
  Cigarette, Gift, Watch, Glasses, Footprints, Armchair,
  Lamp, Bath, Sofa, Bed, Refrigerator, Microwave,
  WashingMachine, Fan, Heater, Snowflake, Thermometer,
  Ruler, Wrench, PaintBucket, Brush, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sectors } from "@/data/sectors";

const iconMap: Record<string, React.ComponentType<any>> = {
  Monitor, GraduationCap, Heart, Car, Rocket, Brain,
  Bot, Wallet, Building2, Smartphone, Shirt, Film,
  UtensilsCrossed, Activity, ShoppingCart, Gamepad2,
  BookOpen, Zap, Wheat, FileText, CloudSun, School,
  Utensils, Navigation, Search, Users, UserCheck, Mail, Newspaper, Moon,
  Languages, Music, Library, Plane, Tv, MessageCircle,
  Pizza, ShieldCheck, Cpu, Factory, Anchor, Pickaxe, Gem,
  Leaf, Droplets, TreePine, Wind, Sun, Atom, Microscope,
  Pill, Stethoscope, Dumbbell, Camera, Palette, PenTool,
  Globe, Radio, Wifi, Server, Database, Lock, Cloud,
  Briefcase, TrendingUp, Landmark, CreditCard, PiggyBank,
  Home, Hammer, HardHat, Truck, Ship, Train, Bus,
  Scissors, Baby, Dog, Flower2, Coffee, Wine, Beer,
  Cigarette, Gift, Watch, Glasses, Footprints, Armchair,
  Lamp, Bath, Sofa, Bed, Refrigerator, Microwave,
  WashingMachine, Fan, Heater, Snowflake, Thermometer,
  Ruler, Wrench, PaintBucket, Brush, Sparkles
};

const sectorContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const sectorItemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 20,
    },
  },
};

export const SectorsGrid = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayedSectors = showAll ? sectors : sectors.slice(0, 12);

  return (
    <section className="py-20 lg:py-32 bg-surface-soft dark:bg-surface-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block text-primary font-medium text-sm uppercase tracking-wider"
          >
            Our Ecosystem
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6"
          >
            100+ Industries,{" "}
            <span className="gradient-text">One Vision</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            From AI to Agriculture, Healthcare to Aerospace — we're building the infrastructure for humanity's future.
          </motion.p>
        </motion.div>

        {/* Sectors Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
          variants={sectorContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {displayedSectors.map((sector, index) => {
            const IconComponent = iconMap[sector.icon] || Monitor;
            const isExpanded = expandedId === sector.id;

            return (
              <motion.div
                key={sector.id}
                variants={sectorItemVariants}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "group relative rounded-2xl overflow-hidden transition-all duration-300",
                  isExpanded ? "sm:col-span-2 lg:col-span-2" : ""
                )}
              >
                <div className="glass-card h-full p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white",
                      sector.gradient
                    )}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : sector.id)}
                      className="p-2 rounded-lg hover:bg-accent/50 transition-colors"
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      <ChevronDown className={cn(
                        "w-5 h-5 text-muted-foreground transition-transform",
                        isExpanded && "rotate-180"
                      )} />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {sector.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {sector.description}
                  </p>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-border">
                          <p className="text-sm text-muted-foreground mb-6">
                            {sector.fullDescription}
                          </p>
                          
                          {/* Metrics */}
                          <div className="grid grid-cols-2 gap-3 mb-6">
                            {sector.metrics.slice(0, 4).map((metric) => (
                              <div key={metric.label} className="bg-surface-soft rounded-lg p-3">
                                <p className="text-lg font-bold text-primary">{metric.value}</p>
                                <p className="text-xs text-muted-foreground">{metric.label}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-auto pt-4">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 text-xs"
                    >
                      <Link to={`/industries/${sector.slug}`}>
                        Learn More
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="flex-1 h-9 text-xs bg-primary hover:bg-primary-dark text-primary-foreground"
                    >
                      <a 
                        href={`https://${sector.subdomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Site
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Show More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          {!showAll ? (
            <Button
              onClick={() => setShowAll(true)}
              variant="outline"
              size="lg"
              className="rounded-xl"
            >
              View All {sectors.length} Industries
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-primary hover:bg-primary-dark text-primary-foreground"
            >
              <Link to="/industries">
                Explore All Industries
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
};
