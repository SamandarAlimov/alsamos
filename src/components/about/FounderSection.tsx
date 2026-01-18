import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Image, FileText, Sparkles, 
  Award, Building, GraduationCap, Globe,
  Linkedin, Twitter, Instagram, Youtube,
  Quote, ChevronRight, Star
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import founderMainPhoto from "@/assets/founder-ceo.jpg";
import founder1 from "@/assets/founder-1.jpg";
import founder2 from "@/assets/founder-2.jpg";
import founder3 from "@/assets/founder-3.jpg";
import founder4 from "@/assets/founder-4.jpg";
import founder5 from "@/assets/founder-5.jpg";
import founder6 from "@/assets/founder-6.jpg";
import founder7 from "@/assets/founder-7.jpg";
import founder8 from "@/assets/founder-8.jpg";

const tabItems = [
  { id: "overview", label: "Overview", icon: User },
  { id: "gallery", label: "Photo Gallery", icon: Image },
  { id: "biography", label: "Biography", icon: FileText },
  { id: "vision", label: "Vision & Philosophy", icon: Sparkles },
];

const achievements = [
  { icon: Award, title: "Forbes 30 Under 30", year: "2022" },
  { icon: Building, title: "Founded ALSAMOS", year: "2018" },
  { icon: GraduationCap, title: "MBA, Harvard Business School", year: "2016" },
  { icon: Globe, title: "Expanded to 50+ Countries", year: "2023" },
];

const founderPhotos = [
  founderMainPhoto,
  founder1,
  founder2,
  founder3,
  founder4,
  founder5,
  founder6,
  founder7,
  founder8,
];

const quotes = [
  "Innovation is not just about technology—it's about transforming lives and building a better future for humanity.",
  "At ALSAMOS, we don't follow trends. We create them.",
  "The impossible is just the untried. We make it real.",
];

const FounderSection = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-surface-soft relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-accent-cyan/5 rounded-full blur-[60px] sm:blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Meet Our Founder & CEO
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Visionary Leadership Driving
            <br />
            <span className="text-primary">Innovation Across Industries</span>
          </h2>
        </motion.div>

        {/* Founder intro card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 mb-8 sm:mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-center lg:items-start">
            {/* Photo */}
            <div className="relative flex-shrink-0">
              <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-xl sm:rounded-2xl overflow-hidden border-4 border-primary/20">
                <img
                  src={founderMainPhoto}
                  alt="Samandar Otabek - Founder & CEO"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center">
                <span className="text-white text-[10px] sm:text-xs font-bold text-center">
                  FOUNDER<br />&amp; CEO
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1.5 sm:mb-2">
                Samandar (Alimov) Otabek Olim Ortiq O'sar Suyar
              </h3>
              <p className="text-primary font-medium text-sm sm:text-base mb-3 sm:mb-4">
                Businessman • Developer • Economist
              </p>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-2xl">
                A visionary entrepreneur who founded ALSAMOS Corporation with the mission to transform 
                100+ industries through innovation, technology, and sustainable business practices. 
                Under his leadership, ALSAMOS has grown into a global powerhouse.
              </p>
              
              {/* Social links */}
              <div className="flex gap-2 sm:gap-3 justify-center lg:justify-start mb-4 sm:mb-6">
                {[Linkedin, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.a>
                ))}
              </div>

              {/* Quick achievements */}
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
                {achievements.slice(0, 2).map((achievement, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-surface-muted text-xs sm:text-sm"
                  >
                    <achievement.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    <span className="text-foreground">{achievement.title}</span>
                    <span className="text-muted-foreground hidden sm:inline">({achievement.year})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs section */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-center gap-2 bg-transparent mb-8">
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 px-6 py-3 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white bg-surface-muted text-muted-foreground hover:bg-surface-muted/80 transition-all"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {/* Achievements */}
              <div className="glass-card rounded-2xl p-8">
                <h4 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Key Achievements
                </h4>
                <div className="space-y-4">
                  {achievements.map((achievement, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-surface-soft hover:bg-surface-muted transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <achievement.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{achievement.title}</div>
                        <div className="text-sm text-muted-foreground">{achievement.year}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quotes */}
              <div className="glass-card rounded-2xl p-8">
                <h4 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Quote className="w-5 h-5 text-primary" />
                  Inspiring Quotes
                </h4>
                <div className="space-y-6">
                  {quotes.map((quote, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.2 }}
                      className="relative pl-6 border-l-2 border-primary/30"
                    >
                      <Quote className="absolute -left-3 -top-1 w-6 h-6 text-primary bg-surface-soft" />
                      <p className="text-muted-foreground italic">{quote}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Photo Gallery Tab */}
          <TabsContent value="gallery">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {founderPhotos.map((photo, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  onClick={() => setSelectedPhoto(photo)}
                  className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
                >
                  <img
                    src={photo}
                    alt={`Founder photo ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium">View Full Size</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Lightbox */}
            <AnimatePresence>
              {selectedPhoto && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedPhoto(null)}
                  className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                >
                  <motion.img
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    src={selectedPhoto}
                    alt="Full size"
                    className="max-w-full max-h-[90vh] rounded-2xl object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Biography Tab */}
          <TabsContent value="biography">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-8 md:p-12"
            >
              <h4 className="text-2xl font-bold text-foreground mb-6">The Journey of a Visionary</h4>
              
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="mb-6">
                  Samandar (Alimov) Otabek Olim Ortiq O'sar Suyar was born with an innate curiosity for technology 
                  and an unwavering determination to make a difference in the world. From his early years, he 
                  demonstrated exceptional aptitude in mathematics, computer science, and economics—a unique 
                  combination that would later define his approach to business and innovation.
                </p>
                
                <p className="mb-6">
                  After completing his undergraduate studies in Computer Science with honors, Samandar pursued 
                  an MBA at Harvard Business School, where he developed his vision for a corporation that would 
                  operate across multiple industries, leveraging technology to solve humanity's most pressing 
                  challenges.
                </p>
                
                <p className="mb-6">
                  In 2018, at the age of 28, he founded ALSAMOS Corporation with a bold mission: to create a 
                  diversified conglomerate that would span 100+ industries and become a driving force for global 
                  innovation. What started as a small tech startup has now grown into a multinational powerhouse 
                  with operations in IT, Education, Medicine, Finance, Aerospace, AI, Robotics, and dozens of 
                  other sectors.
                </p>
                
                <p className="mb-6">
                  Under Samandar's leadership, ALSAMOS has achieved remarkable milestones: launching revolutionary 
                  products, establishing presence in 50+ countries, employing over 10,000 people worldwide, and 
                  receiving numerous awards for innovation and corporate excellence. His philosophy of "Make It Real" 
                  has become the cornerstone of ALSAMOS's culture, inspiring teams to transform ambitious ideas into 
                  tangible solutions.
                </p>
                
                <p>
                  Today, Samandar continues to lead ALSAMOS with the same passion and vision that drove him from 
                  the beginning. He remains actively involved in R&D initiatives, mentors young entrepreneurs, 
                  and advocates for sustainable business practices. His story serves as an inspiration to aspiring 
                  innovators worldwide, proving that with determination and vision, it is possible to build 
                  something truly extraordinary.
                </p>
              </div>
            </motion.div>
          </TabsContent>

          {/* Vision & Philosophy Tab */}
          <TabsContent value="vision">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <div className="glass-card rounded-2xl p-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-2xl font-bold text-foreground mb-4">Our Vision</h4>
                <p className="text-muted-foreground mb-6">
                  To become the world's most innovative and diversified corporation, operating across 100+ 
                  industries and impacting billions of lives through technology, education, and sustainable 
                  solutions. We envision a future where ALSAMOS products and services touch every aspect of 
                  human life, making it better, more efficient, and more meaningful.
                </p>
                <ul className="space-y-3">
                  {["Global Innovation Leader", "Sustainable Growth", "Technology for Humanity", "Cross-Industry Excellence"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground">
                      <ChevronRight className="w-5 h-5 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card rounded-2xl p-8">
                <div className="w-16 h-16 rounded-2xl bg-accent-cyan/10 flex items-center justify-center mb-6">
                  <FileText className="w-8 h-8 text-accent-cyan" />
                </div>
                <h4 className="text-2xl font-bold text-foreground mb-4">Our Philosophy</h4>
                <p className="text-muted-foreground mb-6">
                  "Make It Real" is more than a slogan—it's our way of life. We believe that every ambitious 
                  idea deserves a chance to become reality. Our philosophy centers on three core principles:
                </p>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-surface-soft">
                    <h5 className="font-bold text-foreground mb-1">Innovation Without Limits</h5>
                    <p className="text-sm text-muted-foreground">Push boundaries, challenge conventions, create the impossible.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-soft">
                    <h5 className="font-bold text-foreground mb-1">People First</h5>
                    <p className="text-sm text-muted-foreground">Every innovation must serve humanity and improve lives.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-soft">
                    <h5 className="font-bold text-foreground mb-1">Sustainable Future</h5>
                    <p className="text-sm text-muted-foreground">Build for tomorrow while protecting our planet today.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button size="lg" className="bg-primary hover:bg-primary-dark text-white px-8">
            Join Our Vision — Become an Investor
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FounderSection;
