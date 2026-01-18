import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Filter, ChevronDown } from "lucide-react";

const departments = ["All", "Engineering", "Design", "Marketing", "Sales", "Operations", "R&D"];

const teamMembers = [
  { name: "James Wilson", role: "Lead Engineer", department: "Engineering", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
  { name: "Emily Zhang", role: "UX Director", department: "Design", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80" },
  { name: "Omar Hassan", role: "Marketing Lead", department: "Marketing", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80" },
  { name: "Lisa Anderson", role: "Sales Director", department: "Sales", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80" },
  { name: "Ryan Kim", role: "DevOps Lead", department: "Engineering", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80" },
  { name: "Maria Garcia", role: "Product Designer", department: "Design", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80" },
  { name: "Alex Thompson", role: "Research Lead", department: "R&D", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&q=80" },
  { name: "Nina Patel", role: "Operations Manager", department: "Operations", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80" },
  { name: "Chris Lee", role: "Frontend Lead", department: "Engineering", image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&q=80" },
  { name: "Sophie Martin", role: "Brand Manager", department: "Marketing", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&q=80" },
  { name: "David Brown", role: "AI Researcher", department: "R&D", image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&q=80" },
  { name: "Anna Kowalski", role: "UI Designer", department: "Design", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&q=80" },
];

const TeamSection = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredMembers = selectedDepartment === "All"
    ? teamMembers
    : teamMembers.filter(member => member.department === selectedDepartment);

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            Our Team
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            The People Behind Innovation
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A diverse team of experts driving ALSAMOS forward across every sector.
          </p>
        </motion.div>

        {/* Department filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          {/* Desktop filter */}
          <div className="hidden md:flex flex-wrap justify-center gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedDepartment === dept
                    ? "bg-primary text-white"
                    : "bg-surface-soft text-muted-foreground hover:bg-surface-muted"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Mobile dropdown */}
          <div className="md:hidden relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-surface-soft text-foreground font-medium"
            >
              <Filter className="w-4 h-4" />
              {selectedDepartment}
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-xl shadow-lg border border-border overflow-hidden z-20"
              >
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => {
                      setSelectedDepartment(dept);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                      selectedDepartment === dept
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-surface-soft"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Team grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6"
        >
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.name}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -10 }}
              className="group text-center"
            >
              <div className="relative mb-4">
                <div className="w-full aspect-square rounded-2xl overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <span className="text-white text-xs font-medium px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                    {member.department}
                  </span>
                </div>
              </div>
              <h4 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                {member.name}
              </h4>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "10,000+", label: "Team Members" },
            { value: "50+", label: "Nationalities" },
            { value: "40%", label: "Women in Tech" },
            { value: "95%", label: "Employee Satisfaction" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-surface-soft">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;
