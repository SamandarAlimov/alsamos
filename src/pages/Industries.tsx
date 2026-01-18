import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { 
  Search, ArrowRight, ExternalLink, Grid3X3, List,
  Monitor, GraduationCap, Heart, Car, Rocket, Brain,
  Bot, Wallet, Building2, Smartphone, Shirt, Film,
  UtensilsCrossed, Activity, ShoppingCart, Gamepad2,
  BookOpen, Zap, Wheat, FileText, CloudSun, School,
  Utensils, Navigation, Users, UserCheck, Mail, Newspaper, Moon,
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
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sectors } from "@/data/sectors";
import PageWrapper from "@/components/PageWrapper";
import HreflangTags from "@/components/seo/HreflangTags";
import { useSeoMeta, getLocaleCode } from "@/hooks/useSeoMeta";
import { useLanguage } from "@/contexts/LanguageContext";

const iconMap: Record<string, React.ComponentType<any>> = {
  Monitor, GraduationCap, Heart, Car, Rocket, Brain,
  Bot, Wallet, Building2, Smartphone, Shirt, Film,
  UtensilsCrossed, Activity, ShoppingCart, Gamepad2,
  BookOpen, Zap, Wheat, FileText, CloudSun, School,
  Utensils, Navigation, Users, UserCheck, Mail, Newspaper, Moon, Search,
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

const Industries = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const seo = useSeoMeta("industries");
  const { language } = useLanguage();

  const filteredSectors = sectors.filter((sector) =>
    sector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sector.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageWrapper>
      <HreflangTags path="/industries" />
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <link rel="canonical" href="https://alsamos.com/industries" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Open Graph */}
        <meta property="og:title" content={seo.ogTitle} />
        <meta property="og:description" content={seo.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alsamos.com/industries" />
        <meta property="og:site_name" content="ALSAMOS" />
        <meta property="og:image" content="https://alsamos.com/og-industries.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={getLocaleCode(language)} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@AlsamosOfficial" />
        <meta name="twitter:title" content={seo.ogTitle} />
        <meta name="twitter:description" content={seo.ogDescription} />
        <meta name="twitter:image" content="https://alsamos.com/og-industries.png" />
        
        {/* JSON-LD Structured Data - ItemList for Industries */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "ALSAMOS Industries",
            "description": "Explore ALSAMOS's presence across 100+ industries including IT, Education, Healthcare, Automotive, Aerospace, AI, Robotics, and more.",
            "url": "https://alsamos.com/industries",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://alsamos.com" },
                { "@type": "ListItem", "position": 2, "name": "Industries", "item": "https://alsamos.com/industries" }
              ]
            },
            "isPartOf": {
              "@type": "WebSite",
              "name": "ALSAMOS",
              "url": "https://alsamos.com"
            },
            "mainEntity": {
              "@type": "ItemList",
              "name": "ALSAMOS Industry Sectors",
              "numberOfItems": sectors.length,
              "itemListElement": sectors.slice(0, 20).map((sector, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Organization",
                  "name": `ALSAMOS ${sector.name}`,
                  "description": sector.description,
                  "url": `https://alsamos.com/industries/${sector.slug}`,
                  "sameAs": `https://${sector.subdomain}`
                }
              }))
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        <Header />
        
        <main className="pt-16 sm:pt-20 lg:pt-24">
          {/* Hero Section */}
          <section className="py-10 sm:py-16 lg:py-24 bg-gradient-to-b from-primary/5 to-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6"
                >
                  100+ Industries,{" "}
                  <span className="gradient-text">One Vision</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-2"
                >
                  From AI to Agriculture, Healthcare to Aerospace — discover how ALSAMOS 
                  is building the infrastructure for humanity's future.
                </motion.p>

                {/* Search */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative max-w-xl mx-auto px-2"
                >
                  <Search className="absolute left-6 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search industries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 sm:h-14 pl-12 pr-4 rounded-xl bg-surface border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
                  />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Industries Grid */}
          <section className="py-8 sm:py-12 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <p className="text-sm sm:text-base text-muted-foreground">
                  Showing {filteredSectors.length} of {sectors.length} industries
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredSectors.map((sector, index) => {
                    const IconComponent = iconMap[sector.icon] || Monitor;
                    return (
                      <motion.div
                        key={sector.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl group"
                      >
                        <div className={cn(
                          "w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-3 sm:mb-4",
                          sector.gradient
                        )}>
                          <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {sector.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                          {sector.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4">
                          {sector.metrics.slice(0, 2).map((metric) => (
                            <div key={metric.label} className="text-center p-1.5 sm:p-2 rounded-lg bg-surface-soft">
                              <p className="text-xs sm:text-sm font-bold text-primary">{metric.value}</p>
                              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{metric.label}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button asChild variant="outline" size="sm" className="flex-1 text-xs sm:text-sm h-8 sm:h-9">
                            <Link to={`/industries/${sector.slug}`}>
                              Learn More
                            </Link>
                          </Button>
                          <Button asChild size="sm" className="flex-1 bg-primary hover:bg-primary-dark text-xs sm:text-sm h-8 sm:h-9">
                            <a href={`https://${sector.subdomain}`} target="_blank" rel="noopener noreferrer">
                              Visit
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="space-y-4">
                  {filteredSectors.map((sector, index) => {
                    const IconComponent = iconMap[sector.icon] || Monitor;
                    return (
                      <motion.div
                        key={sector.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="glass-card p-4 lg:p-6 rounded-xl flex flex-col lg:flex-row items-start lg:items-center gap-4 group"
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white flex-shrink-0",
                          sector.gradient
                        )}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {sector.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {sector.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          {sector.metrics.slice(0, 2).map((metric) => (
                            <div key={metric.label} className="text-right hidden md:block">
                              <p className="text-sm font-bold text-primary">{metric.value}</p>
                              <p className="text-xs text-muted-foreground">{metric.label}</p>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/industries/${sector.slug}`}>
                                Learn More
                              </Link>
                            </Button>
                            <Button asChild size="sm" className="bg-primary hover:bg-primary-dark">
                              <a href={`https://${sector.subdomain}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {filteredSectors.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No industries found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
};

export default Industries;
