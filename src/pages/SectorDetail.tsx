import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { 
  ArrowLeft, ExternalLink, ArrowRight, Download,
  Monitor, GraduationCap, Heart, Car, Rocket, Brain,
  Bot, Wallet, Building2, Smartphone, Shirt, Film,
  UtensilsCrossed, Activity, ShoppingCart, Gamepad2,
  BookOpen, Zap, Wheat, CheckCircle2
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSectorBySlug, sectors } from "@/data/sectors";
import PageWrapper from "@/components/PageWrapper";
import HreflangTags from "@/components/seo/HreflangTags";

const iconMap: Record<string, React.ComponentType<any>> = {
  Monitor, GraduationCap, Heart, Car, Rocket, Brain,
  Bot, Wallet, Building2, Smartphone, Shirt, Film,
  UtensilsCrossed, Activity, ShoppingCart, Gamepad2,
  BookOpen, Zap, Wheat
};

const SectorDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const sector = getSectorBySlug(slug || "");

  if (!sector) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Industry Not Found</h1>
            <p className="text-muted-foreground mb-8">The industry you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/industries">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Industries
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const IconComponent = iconMap[sector.icon] || Monitor;
  const relatedSectors = sectors.filter(s => s.id !== sector.id).slice(0, 4);

  return (
    <PageWrapper>
      <HreflangTags path={`/industries/${sector.slug}`} />
      <Helmet>
        <title>{sector.name} Industry Solutions | ALSAMOS - {sector.subdomain}</title>
        <meta name="description" content={`${sector.fullDescription.slice(0, 155)}...`} />
        <meta name="keywords" content={`ALSAMOS ${sector.name}, ${sector.name.toLowerCase()} industry, innovation, technology, ${sector.products.map(p => p.name).join(', ')}`} />
        <link rel="canonical" href={`https://alsamos.com/industries/${sector.slug}`} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${sector.name} - ALSAMOS Industries`} />
        <meta property="og:description" content={sector.fullDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://alsamos.com/industries/${sector.slug}`} />
        <meta property="og:site_name" content="ALSAMOS" />
        <meta property="og:image" content="https://alsamos.com/og-industries.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@AlsamosOfficial" />
        <meta name="twitter:title" content={`${sector.name} - ALSAMOS Industries`} />
        <meta name="twitter:description" content={sector.description} />
        <meta name="twitter:image" content="https://alsamos.com/og-industries.png" />
        
        {/* JSON-LD Structured Data - Industry/Service */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `${sector.name} - ALSAMOS Industries`,
            "description": sector.fullDescription,
            "url": `https://alsamos.com/industries/${sector.slug}`,
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://alsamos.com" },
                { "@type": "ListItem", "position": 2, "name": "Industries", "item": "https://alsamos.com/industries" },
                { "@type": "ListItem", "position": 3, "name": sector.name, "item": `https://alsamos.com/industries/${sector.slug}` }
              ]
            },
            "isPartOf": {
              "@type": "WebSite",
              "name": "ALSAMOS",
              "url": "https://alsamos.com"
            },
            "mainEntity": {
              "@type": "Organization",
              "name": `ALSAMOS ${sector.name}`,
              "url": `https://${sector.subdomain}`,
              "parentOrganization": {
                "@type": "Corporation",
                "name": "ALSAMOS Corporation",
                "url": "https://alsamos.com"
              },
              "description": sector.fullDescription,
              "numberOfEmployees": sector.metrics.find(m => m.label.toLowerCase().includes('employee'))?.value || "500+",
              "makesOffer": sector.products.map(product => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Product",
                  "name": product.name,
                  "description": product.description
                }
              }))
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        <Header />
        
        <main className="pt-20 lg:pt-24">
          {/* Hero Section */}
          <section className="relative py-16 lg:py-24 overflow-hidden">
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-10",
              sector.gradient
            )} />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              {/* Breadcrumb */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
              >
                <Link to="/" className="hover:text-primary">Home</Link>
                <span>/</span>
                <Link to="/industries" className="hover:text-primary">Industries</Link>
                <span>/</span>
                <span className="text-foreground">{sector.name}</span>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white mb-6",
                      sector.gradient
                    )}
                  >
                    <IconComponent className="w-10 h-10" />
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6"
                  >
                    {sector.name}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-muted-foreground mb-8"
                  >
                    {sector.fullDescription}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Button
                      asChild
                      size="lg"
                      className="bg-primary hover:bg-primary-dark text-primary-foreground rounded-xl"
                    >
                      <a href={`https://${sector.subdomain}`} target="_blank" rel="noopener noreferrer">
                        Visit {sector.name} Site
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-xl">
                      <Download className="w-4 h-4 mr-2" />
                      Download Brochure
                    </Button>
                  </motion.div>
                </div>

                {/* Metrics */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-2 gap-4"
                >
                  {sector.metrics.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="glass-card p-6 rounded-2xl text-center"
                    >
                      <p className="text-3xl lg:text-4xl font-bold gradient-text mb-2">
                        {metric.value}
                      </p>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          {/* Products Section */}
          <section className="py-16 lg:py-24 bg-surface-soft dark:bg-surface-muted">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Products & Solutions
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Discover our innovative products and solutions in {sector.name.toLowerCase()}.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sector.products.map((product, index) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-6 rounded-2xl group"
                  >
                    <div className="aspect-video rounded-xl bg-surface-muted mb-4 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">{product.description}</p>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Case Studies Section */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Case Studies
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Real-world impact and success stories from our {sector.name.toLowerCase()} division.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {sector.caseStudies.map((study, index) => (
                  <motion.div
                    key={study.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-8 rounded-2xl"
                  >
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {study.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{study.description}</p>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Result</p>
                        <p className="text-sm text-muted-foreground">{study.result}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Related Sectors */}
          <section className="py-16 lg:py-24 bg-surface-soft dark:bg-surface-muted">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Related Industries
                </h2>
                <Button asChild variant="outline">
                  <Link to="/industries">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedSectors.map((related, index) => {
                  const RelatedIcon = iconMap[related.icon] || Monitor;
                  return (
                    <motion.div
                      key={related.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={`/industries/${related.slug}`}
                        className="glass-card p-6 rounded-2xl block group"
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-4",
                          related.gradient
                        )}>
                          <RelatedIcon className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {related.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                          {related.description}
                        </p>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="glass-card p-8 lg:p-12 rounded-3xl text-center">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Ready to Partner with Us?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Discover how ALSAMOS {sector.name} can transform your business or become an investor in our growing ecosystem.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground rounded-xl">
                    <Link to="/investors">
                      Become an Investor
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-xl">
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
};

export default SectorDetail;
