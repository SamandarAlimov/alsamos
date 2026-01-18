import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { 
  Globe, Users, Building2, Briefcase, Award, 
  GraduationCap, Heart, Rocket 
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    icon: Globe,
    value: 180,
    suffix: "+",
    label: "Countries",
    description: "Global presence across continents",
  },
  {
    icon: Users,
    value: 50,
    suffix: "M+",
    label: "Users Worldwide",
    description: "People using our products daily",
  },
  {
    icon: Building2,
    value: 100,
    suffix: "+",
    label: "Industries",
    description: "Sectors we operate in",
  },
  {
    icon: Briefcase,
    value: 250,
    suffix: "K+",
    label: "Employees",
    description: "Team members worldwide",
  },
  {
    icon: Award,
    value: 15,
    suffix: "K+",
    label: "Patents",
    description: "Innovations protected globally",
  },
  {
    icon: GraduationCap,
    value: 500,
    suffix: "K+",
    label: "Students",
    description: "Learning through our platforms",
  },
  {
    icon: Heart,
    value: 25,
    suffix: "M+",
    label: "Patients Served",
    description: "Lives impacted by healthcare",
  },
  {
    icon: Rocket,
    value: 200,
    suffix: "+",
    label: "Launches",
    description: "Space missions completed",
  },
];

const AnimatedNumber = ({ 
  value, 
  suffix, 
  inView 
}: { 
  value: number; 
  suffix: string; 
  inView: boolean;
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, inView]);

  return (
    <span>
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block text-primary font-medium text-sm uppercase tracking-wider"
          >
            Our Impact
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6"
          >
            Numbers That{" "}
            <span className="gradient-text">Inspire</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Every number represents lives changed, innovations delivered, 
            and progress made toward a better future.
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="glass-card p-6 lg:p-8 rounded-2xl text-center group hover:border-primary/30 transition-colors"
            >
              <motion.div 
                className="w-12 h-12 lg:w-14 lg:h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <stat.icon className="w-6 h-6 lg:w-7 lg:h-7 text-primary" />
              </motion.div>
              <p className="text-3xl lg:text-4xl xl:text-5xl font-bold gradient-text mb-2">
                <AnimatedNumber 
                  value={stat.value} 
                  suffix={stat.suffix} 
                  inView={isInView} 
                />
              </p>
              <p className="text-foreground font-semibold mb-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground hidden lg:block">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
