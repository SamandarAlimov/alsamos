import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  TrendingUp, Users, Globe, Building, DollarSign, Target,
  FileText, Download, Calendar, ArrowRight, Send, BarChart3,
  PieChart as PieChartIcon, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import PageWrapper from "@/components/PageWrapper";
import HreflangTags from "@/components/seo/HreflangTags";
import { useSeoMeta, getLocaleCode } from "@/hooks/useSeoMeta";
import { useLanguage } from "@/contexts/LanguageContext";

const revenueData = [
  { year: "2019", revenue: 120 },
  { year: "2020", revenue: 280 },
  { year: "2021", revenue: 650 },
  { year: "2022", revenue: 1200 },
  { year: "2023", revenue: 2100 },
  { year: "2024", revenue: 2800 },
];

const sectorDistribution = [
  { name: "Technology", value: 35, color: "#8b5cf6" },
  { name: "Healthcare", value: 20, color: "#ec4899" },
  { name: "Education", value: 15, color: "#f59e0b" },
  { name: "Automotive", value: 12, color: "#10b981" },
  { name: "Aerospace", value: 10, color: "#3b82f6" },
  { name: "Other", value: 8, color: "#6b7280" },
];

const metrics = [
  { icon: DollarSign, label: "Revenue", value: "$2.8B", change: "+45%", description: "Annual Revenue 2024" },
  { icon: TrendingUp, label: "Growth Rate", value: "45%", change: "+12%", description: "Year-over-Year Growth" },
  { icon: Users, label: "Customers", value: "15K+", change: "+52%", description: "Enterprise Customers" },
  { icon: Globe, label: "Markets", value: "80+", change: "+15", description: "Countries Served" },
  { icon: Building, label: "Industries", value: "100+", change: "+20", description: "Sectors Covered" },
  { icon: Target, label: "ROI", value: "320%", change: "+85%", description: "Average Customer ROI" },
];

const opportunities = [
  {
    title: "Series D Funding Round",
    description: "Join our latest funding round as we scale globally across 100+ industries.",
    minInvestment: "$1M",
    status: "Open",
    deadline: "Q2 2024"
  },
  {
    title: "Strategic Partnership",
    description: "Partner with ALSAMOS to bring innovation to your industry.",
    minInvestment: "Varies",
    status: "Open",
    deadline: "Ongoing"
  },
  {
    title: "Sector-Specific Investment",
    description: "Invest in specific ALSAMOS sectors: AI, Healthcare, Automotive, etc.",
    minInvestment: "$500K",
    status: "Open",
    deadline: "Rolling"
  }
];

const documents = [
  { title: "Investor Presentation", type: "PDF", size: "12 MB" },
  { title: "Annual Report 2023", type: "PDF", size: "8 MB" },
  { title: "Financial Statements Q4", type: "PDF", size: "4 MB" },
  { title: "ESG Report 2023", type: "PDF", size: "6 MB" },
];

const Investors = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const seo = useSeoMeta("investors");
  const { language } = useLanguage();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Thank You for Your Interest!",
      description: "Our investor relations team will contact you within 2 business days.",
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <PageWrapper>
      <HreflangTags path="/investors" />
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <link rel="canonical" href="https://alsamos.com/investors" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Open Graph */}
        <meta property="og:title" content={seo.ogTitle} />
        <meta property="og:description" content={seo.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alsamos.com/investors" />
        <meta property="og:site_name" content="ALSAMOS" />
        <meta property="og:image" content="https://alsamos.com/og-investors.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={getLocaleCode(language)} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@AlsamosOfficial" />
        <meta name="twitter:title" content={seo.ogTitle} />
        <meta name="twitter:description" content={seo.ogDescription} />
        <meta name="twitter:image" content="https://alsamos.com/og-investors.png" />
        <meta name="twitter:label1" content="Revenue" />
        <meta name="twitter:data1" content="$2.8B" />
        <meta name="twitter:label2" content="Growth" />
        <meta name="twitter:data2" content="45% YoY" />
        
        {/* JSON-LD Structured Data - InvestmentOrFinancialService */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "ALSAMOS Investor Relations",
            "description": "Explore investment opportunities with ALSAMOS. Access financial reports, growth metrics, and connect with our investor relations team.",
            "url": "https://alsamos.com/investors",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://alsamos.com" },
                { "@type": "ListItem", "position": 2, "name": "Investors", "item": "https://alsamos.com/investors" }
              ]
            },
            "isPartOf": {
              "@type": "WebSite",
              "name": "ALSAMOS",
              "url": "https://alsamos.com"
            },
            "about": {
              "@type": "Corporation",
              "name": "ALSAMOS Corporation",
              "url": "https://alsamos.com",
              "foundingDate": "2019",
              "numberOfEmployees": {
                "@type": "QuantitativeValue",
                "minValue": 1000
              }
            },
            "mainEntity": {
              "@type": "FinancialProduct",
              "name": "ALSAMOS Investment Opportunities",
              "description": "Series D Funding, Strategic Partnership, and Sector-Specific Investment opportunities",
              "provider": {
                "@type": "Corporation",
                "name": "ALSAMOS Corporation"
              },
              "feesAndCommissionsSpecification": "Minimum investment varies by opportunity type"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        <Header />
        
        <main className="pt-20">
          {/* Hero Section */}
          <section className="relative py-12 sm:py-20 lg:py-28 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-4xl mx-auto"
              >
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  <span className="text-xs sm:text-sm font-medium text-primary">Investor Relations</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                  Invest in the <span className="text-primary">Future</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
                  Join us in building the future of innovation. ALSAMOS offers unique investment 
                  opportunities across 100+ industries with proven growth and strong fundamentals.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="gap-2 h-11 sm:h-12 text-sm sm:text-base"
                    onClick={() => document.getElementById('investor-contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                    Become an Investor
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2 h-11 sm:h-12 text-sm sm:text-base">
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    Download Deck
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Key Metrics */}
          <section className="py-10 sm:py-16 lg:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-8 sm:mb-12"
              >
                <span className="text-primary font-medium text-xs sm:text-sm uppercase tracking-wider">Performance</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 mb-3 sm:mb-4">Key Metrics</h2>
                <p className="text-base sm:text-lg text-muted-foreground">Our performance at a glance</p>
              </motion.div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {metrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-6 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2 sm:mb-3 lg:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center">
                        <metric.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary" />
                      </div>
                      <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] sm:text-xs lg:text-sm font-medium">
                        {metric.change}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-0.5 sm:mb-1">{metric.value}</h3>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground line-clamp-2">{metric.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Growth Charts Placeholder */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Growth Trajectory</h2>
                <p className="text-lg text-muted-foreground">Consistent growth across all metrics</p>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Revenue Chart */}
                <motion.div 
                  className="glass-card rounded-2xl p-6"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    <h3 className="font-bold">Revenue Growth ($M)</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--primary))" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Sector Distribution */}
                <motion.div 
                  className="glass-card rounded-2xl p-6"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <PieChartIcon className="w-6 h-6 text-primary" />
                    <h3 className="font-bold">Revenue by Sector</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <ResponsiveContainer width="100%" height={200} className="sm:w-[55%]">
                      <PieChart>
                        <Pie
                          data={sectorDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={75}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {sectorDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-1 gap-2">
                      {sectorDistribution.map((sector) => (
                        <div key={sector.name} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: sector.color }}
                          />
                          <span className="text-xs text-muted-foreground truncate">{sector.name}</span>
                          <span className="text-xs font-medium ml-auto">{sector.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Investment Opportunities */}
          <section className="py-16 lg:py-24 bg-muted/50">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Investment Opportunities</h2>
                <p className="text-lg text-muted-foreground">Current opportunities to invest in ALSAMOS</p>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-8">
                {opportunities.map((opp, index) => (
                  <motion.div
                    key={opp.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-medium">
                        {opp.status}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {opp.deadline}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{opp.title}</h3>
                    <p className="text-muted-foreground mb-4">{opp.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <span className="text-sm text-muted-foreground">Min. Investment</span>
                        <p className="font-bold text-primary">{opp.minInvestment}</p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Documents */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Investor Documents</h2>
                <p className="text-lg text-muted-foreground">Access our latest reports and presentations</p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {documents.map((doc, index) => (
                  <motion.div
                    key={doc.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card rounded-xl p-5 hover:border-primary/50 transition-colors cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{doc.type} • {doc.size}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Investor Application Form */}
          <section id="investor-contact" className="py-16 lg:py-24 bg-muted/50 scroll-mt-20">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Interested in investing with ALSAMOS? Our investor relations team is ready 
                    to answer your questions and discuss opportunities.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Send className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a href="mailto:investors@alsamos.com" className="font-medium hover:text-primary transition-colors">
                          investors@alsamos.com
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="glass-card rounded-2xl p-8"
                >
                  <h3 className="text-xl font-bold mb-6">Request Information</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" name="firstName" required className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" name="lastName" required className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" name="email" type="email" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="company">Company/Organization</Label>
                      <Input id="company" name="company" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="investmentRange">Investment Range</Label>
                      <Input id="investmentRange" name="investmentRange" placeholder="e.g., $500K - $1M" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        rows={4}
                        placeholder="Tell us about your investment interests..."
                        className="mt-1"
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                  </form>
                </motion.div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
};

export default Investors;
