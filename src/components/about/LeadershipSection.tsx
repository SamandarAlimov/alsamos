import { motion } from "framer-motion";
import { Crown, Linkedin, Twitter, Mail, ExternalLink } from "lucide-react";
import ceoImage from "@/assets/ceo-leadership.jpg";

const leaders = [
  {
    name: "Samandar Otabek",
    role: "Founder & CEO",
    image: ceoImage,
    bio: "Visionary entrepreneur leading ALSAMOS across 100+ industries.",
    linkedin: "#",
    twitter: "#",
    email: "ceo@alsamos.com",
  },
  {
    name: "Alexandra Chen",
    role: "Chief Technology Officer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    bio: "Former Google engineer driving our tech innovation.",
    linkedin: "#",
    twitter: "#",
    email: "cto@alsamos.com",
  },
  {
    name: "Michael Roberts",
    role: "Chief Financial Officer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    bio: "20+ years of financial leadership in Fortune 500 companies.",
    linkedin: "#",
    twitter: "#",
    email: "cfo@alsamos.com",
  },
  {
    name: "Dr. Fatima Al-Hassan",
    role: "Chief Innovation Officer",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    bio: "PhD in AI, leading breakthrough R&D initiatives.",
    linkedin: "#",
    twitter: "#",
    email: "cio@alsamos.com",
  },
  {
    name: "David Park",
    role: "Chief Operating Officer",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
    bio: "Streamlining global operations across 50+ countries.",
    linkedin: "#",
    twitter: "#",
    email: "coo@alsamos.com",
  },
  {
    name: "Sarah Williams",
    role: "Chief Marketing Officer",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
    bio: "Building the ALSAMOS brand into a global phenomenon.",
    linkedin: "#",
    twitter: "#",
    email: "cmo@alsamos.com",
  },
];

const LeadershipSection = () => {
  return (
    <section className="py-24 bg-surface-soft relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-primary/5 to-transparent" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Crown className="w-4 h-4" />
            Our Leadership
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Executive Leadership Team
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet the visionaries guiding ALSAMOS towards a brighter future.
          </p>
        </motion.div>

        {/* Leadership grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {leaders.map((leader, index) => (
            <motion.div
              key={leader.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="glass-card rounded-3xl overflow-hidden">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Social links overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                    <a
                      href={leader.linkedin}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={leader.twitter}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href={`mailto:${leader.email}`}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>

                  {/* CEO badge for first leader */}
                  {index === 0 && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold">
                      CEO
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-1">{leader.name}</h3>
                  <p className="text-primary font-medium text-sm mb-3">{leader.role}</p>
                  <p className="text-muted-foreground text-sm mb-4">{leader.bio}</p>
                  
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-colors"
                  >
                    View Profile
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
