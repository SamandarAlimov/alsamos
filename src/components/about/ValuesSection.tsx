import { motion } from "framer-motion";
import { 
  Lightbulb, Users, Shield, Leaf, 
  Rocket, Heart, Globe, Zap,
  Target, Award
} from "lucide-react";

const coreValues = [
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We push boundaries and challenge conventions to create breakthrough solutions.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Users,
    title: "People Centered",
    description: "Every innovation must serve humanity and improve lives meaningfully.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Integrity Always",
    description: "We build trust through transparency, honesty, and ethical practices.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Building for tomorrow while protecting our planet today.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Rocket,
    title: "Excellence",
    description: "We strive for perfection in everything we create and deliver.",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "We love what we do and it shows in every product and service.",
    gradient: "from-rose-500 to-pink-500",
  },
];

const principles = [
  { icon: Globe, text: "Think Global, Act Local" },
  { icon: Zap, text: "Speed Without Compromise" },
  { icon: Target, text: "Customer Obsession" },
  { icon: Award, text: "Continuous Learning" },
];

const ValuesSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Heart className="w-4 h-4" />
            Our Values
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            What Drives Us Forward
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our core values are the foundation of everything we do at ALSAMOS.
          </p>
        </motion.div>

        {/* Values grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {coreValues.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="h-full glass-card rounded-3xl p-8 relative overflow-hidden">
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Guiding principles */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 md:p-12"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Guiding Principles
            </h3>
            <p className="text-muted-foreground">
              The principles that guide our daily decisions and actions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.text}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-surface-soft hover:bg-surface-muted transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <principle.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="font-medium text-foreground">{principle.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent-cyan/20 to-primary/20 blur-3xl" />
              <div className="relative glass-card rounded-3xl p-10 md:p-16">
                <h3 className="text-lg font-medium text-primary mb-4">Our Mission</h3>
                <p className="text-2xl md:text-4xl font-bold text-foreground leading-tight">
                  "To transform industries, empower communities, and build a better future for humanity through relentless innovation and unwavering commitment to excellence."
                </p>
                <div className="mt-8 flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-muted-foreground font-medium">
                    ALSAMOS Corporation — Make It Real
                  </span>
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
