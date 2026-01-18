import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { 
  Rocket, Building, Globe, Award, Users, 
  Cpu, Satellite, GraduationCap, Heart, Zap 
} from "lucide-react";

const milestones = [
  {
    year: "2018",
    title: "ALSAMOS Founded",
    description: "Started as a small tech startup with a vision to transform industries.",
    icon: Rocket,
    color: "from-orange-500 to-red-500",
  },
  {
    year: "2019",
    title: "First Product Launch",
    description: "Launched our flagship AI platform, gaining first 1,000 users.",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
  },
  {
    year: "2020",
    title: "Series A Funding",
    description: "Raised $50M to expand into education and healthcare sectors.",
    icon: Building,
    color: "from-green-500 to-teal-500",
  },
  {
    year: "2021",
    title: "Global Expansion",
    description: "Expanded operations to 25+ countries across 3 continents.",
    icon: Globe,
    color: "from-blue-500 to-indigo-500",
  },
  {
    year: "2022",
    title: "100+ Industries",
    description: "Achieved presence in over 100 business sectors worldwide.",
    icon: Award,
    color: "from-purple-500 to-pink-500",
  },
  {
    year: "2022",
    title: "10,000 Employees",
    description: "Grew our team to 10,000+ professionals across all divisions.",
    icon: Users,
    color: "from-cyan-500 to-blue-500",
  },
  {
    year: "2023",
    title: "AI Revolution",
    description: "Launched next-gen AI models powering autonomous systems.",
    icon: Cpu,
    color: "from-indigo-500 to-purple-500",
  },
  {
    year: "2023",
    title: "Space Division",
    description: "Entered aerospace with our first satellite launch program.",
    icon: Satellite,
    color: "from-pink-500 to-rose-500",
  },
  {
    year: "2024",
    title: "Education Initiative",
    description: "Launched ALSAMOS University with 100,000+ enrolled students.",
    icon: GraduationCap,
    color: "from-emerald-500 to-green-500",
  },
  {
    year: "2024",
    title: "Today & Beyond",
    description: "Continuing to make it real—building the future of humanity.",
    icon: Heart,
    color: "from-rose-500 to-orange-500",
  },
];

const JourneySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="py-24 bg-surface-soft relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(242,108,33,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.05),transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Rocket className="w-4 h-4" />
            Our Journey
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            From Vision to Reality
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A timeline of milestones that shaped ALSAMOS into a global innovation leader.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block">
            <motion.div
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-primary to-accent-cyan"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Mobile line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border md:hidden">
            <motion.div
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-primary to-accent-cyan"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Milestones */}
          <div className="space-y-12 md:space-y-0">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`relative flex items-center md:gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content card */}
                <div className={`flex-1 ml-12 md:ml-0 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card rounded-2xl p-6 inline-block max-w-md"
                  >
                    <span className="text-sm font-bold text-primary mb-2 block">{milestone.year}</span>
                    <h3 className="text-xl font-bold text-foreground mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground text-sm">{milestone.description}</p>
                  </motion.div>
                </div>

                {/* Icon - center on desktop, left on mobile */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${milestone.color} flex items-center justify-center shadow-lg`}
                  >
                    <milestone.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </motion.div>
                </div>

                {/* Spacer for opposite side on desktop */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <p className="text-lg text-muted-foreground mb-4">
            The journey continues. Be part of our next chapter.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
            >
              Join Our Team
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-surface-muted text-foreground font-medium hover:bg-surface-soft transition-colors"
            >
              Invest in ALSAMOS
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JourneySection;
