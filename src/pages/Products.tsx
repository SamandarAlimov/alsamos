import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { products, productCategories } from "@/data/products";
import { 
  Brain, Watch, Cloud, Car, Heart, Satellite, GraduationCap, Landmark,
  ArrowRight, Search, Sparkles, Home, Glasses, Shield, Building2, GitCompare
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductComparison from "@/components/product/ProductComparison";
import PageWrapper from "@/components/PageWrapper";
import HreflangTags from "@/components/seo/HreflangTags";
import { useSeoMeta, getLocaleCode } from "@/hooks/useSeoMeta";
import { useLanguage } from "@/contexts/LanguageContext";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Watch, Cloud, Car, Heart, Satellite, GraduationCap, Landmark,
  Home, Glasses, Shield, Building2
};

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const seo = useSeoMeta("products");
  const { language } = useLanguage();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageWrapper>
      <HreflangTags path="/products" />
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <link rel="canonical" href="https://alsamos.com/products" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Open Graph */}
        <meta property="og:title" content={seo.ogTitle} />
        <meta property="og:description" content={seo.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alsamos.com/products" />
        <meta property="og:site_name" content="ALSAMOS" />
        <meta property="og:image" content="https://alsamos.com/og-products.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={getLocaleCode(language)} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@AlsamosOfficial" />
        <meta name="twitter:title" content={seo.ogTitle} />
        <meta name="twitter:description" content={seo.ogDescription} />
        <meta name="twitter:image" content="https://alsamos.com/og-products.png" />
        
        {/* JSON-LD Structured Data - ItemList for Products */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "ALSAMOS Products & Solutions",
            "description": "Explore ALSAMOS's innovative products across AI, consumer electronics, automotive, healthcare, and more.",
            "url": "https://alsamos.com/products",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://alsamos.com" },
                { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://alsamos.com/products" }
              ]
            },
            "isPartOf": {
              "@type": "WebSite",
              "name": "ALSAMOS",
              "url": "https://alsamos.com"
            },
            "mainEntity": {
              "@type": "ItemList",
              "name": "ALSAMOS Product Catalog",
              "numberOfItems": products.length,
              "itemListElement": products.slice(0, 12).map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Product",
                  "name": product.name,
                  "description": product.description,
                  "url": `https://alsamos.com/products/${product.slug}`,
                  "brand": { "@type": "Brand", "name": "ALSAMOS" },
                  "category": product.category
                }
              }))
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        <Header />
        
        <main className="pt-16 sm:pt-20">
          {/* Hero Section */}
          <section className="relative py-10 sm:py-16 lg:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-4xl mx-auto"
              >
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  <span className="text-xs sm:text-sm font-medium text-primary">Innovation Portfolio</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                  Products & <span className="text-primary">Solutions</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
                  Discover our comprehensive range of innovative products designed to transform 
                  industries and empower businesses worldwide.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Search & Filters */}
          <section className="py-4 sm:py-6 lg:py-8 border-b border-border">
            <div className="container mx-auto px-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                  <div className="relative w-full sm:w-72 lg:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 sm:pl-10 h-10 sm:h-11 text-sm"
                    />
                  </div>
                  <ProductComparison 
                    trigger={
                      <Button variant="secondary" size="sm" className="gap-2 h-10 sm:h-11 text-xs sm:text-sm">
                        <GitCompare className="w-4 h-4" />
                        <span className="hidden xs:inline">Compare</span> Products
                      </Button>
                    }
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center overflow-x-auto pb-1 -mx-1 px-1">
                  {productCategories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="text-xs sm:text-sm h-8 sm:h-9 px-2.5 sm:px-3 whitespace-nowrap flex-shrink-0"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Products Grid */}
          <section className="py-10 sm:py-16 lg:py-24">
            <div className="container mx-auto px-4">
              {filteredProducts.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {filteredProducts.map((product, index) => {
                    const IconComponent = iconMap[product.icon];
                    return (
                      <motion.article
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group"
                      >
                        <div className="glass-card rounded-xl sm:rounded-2xl overflow-hidden h-full flex flex-col">
                          {/* Product Visual */}
                          <div className={`relative h-36 sm:h-48 bg-gradient-to-br ${product.gradient} p-6 sm:p-8 flex items-center justify-center`}>
                            <div className="absolute inset-0 bg-black/10" />
                            {IconComponent && (
                              <IconComponent className="w-16 h-16 sm:w-24 sm:h-24 text-white/90 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                            )}
                            <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                              <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-medium">
                                {product.category}
                              </span>
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="p-4 sm:p-6 flex-1 flex flex-col">
                            <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2 group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-primary font-medium mb-2 sm:mb-3">{product.tagline}</p>
                            <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 flex-1 line-clamp-3">
                              {product.description}
                            </p>

                            {/* Features Preview */}
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                              {product.features.slice(0, 3).map((feature, idx) => (
                                <span 
                                  key={idx}
                                  className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-muted text-[10px] sm:text-xs text-muted-foreground"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>

                            {/* Price & CTA */}
                            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border">
                              <span className="text-xs sm:text-sm font-semibold text-primary">
                                {product.price}
                              </span>
                              <Link
                                to={`/products/${product.slug}`}
                                className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-foreground hover:text-primary transition-colors"
                              >
                                Learn More
                                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 lg:py-24 bg-muted/50">
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Need a Custom Solution?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Our team of experts can help you find the perfect product or create a 
                  tailored solution for your specific needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link to="/contact">Contact Sales</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/industries">Explore Industries</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
};

export default Products;
