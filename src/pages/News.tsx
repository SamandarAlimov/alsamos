import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { newsArticles, newsCategories } from "@/data/news";
import { Search, Calendar, Clock, ArrowRight, Newspaper } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageWrapper from "@/components/PageWrapper";
import HreflangTags from "@/components/seo/HreflangTags";
import { useSeoMeta, getLocaleCode } from "@/hooks/useSeoMeta";
import { useLanguage } from "@/contexts/LanguageContext";

const News = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const seo = useSeoMeta("news");
  const { language } = useLanguage();

  const filteredArticles = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = filteredArticles.filter(a => a.featured);
  const regularArticles = filteredArticles.filter(a => !a.featured);

  return (
    <PageWrapper>
      <HreflangTags path="/news" />
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <link rel="canonical" href="https://alsamos.com/news" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Open Graph */}
        <meta property="og:title" content={seo.ogTitle} />
        <meta property="og:description" content={seo.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alsamos.com/news" />
        <meta property="og:site_name" content="ALSAMOS" />
        <meta property="og:image" content="https://alsamos.com/og-news.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={getLocaleCode(language)} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@AlsamosOfficial" />
        <meta name="twitter:title" content={seo.ogTitle} />
        <meta name="twitter:description" content={seo.ogDescription} />
        <meta name="twitter:image" content="https://alsamos.com/og-news.png" />
        
        {/* JSON-LD Structured Data - ItemList for News */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "ALSAMOS News & Insights",
            "description": "Stay updated with the latest news, insights, and announcements from ALSAMOS.",
            "url": "https://alsamos.com/news",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://alsamos.com" },
                { "@type": "ListItem", "position": 2, "name": "News", "item": "https://alsamos.com/news" }
              ]
            },
            "isPartOf": {
              "@type": "WebSite",
              "name": "ALSAMOS",
              "url": "https://alsamos.com"
            },
            "mainEntity": {
              "@type": "ItemList",
              "name": "Latest ALSAMOS News",
              "numberOfItems": newsArticles.length,
              "itemListElement": newsArticles.slice(0, 10).map((article, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "NewsArticle",
                  "headline": article.title,
                  "description": article.excerpt,
                  "url": `https://alsamos.com/news/${article.slug}`,
                  "datePublished": article.date,
                  "author": { "@type": "Person", "name": article.author }
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
                  <Newspaper className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  <span className="text-xs sm:text-sm font-medium text-primary">News & Insights</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                  Latest <span className="text-primary">Updates</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
                  Stay informed with the latest news, insights, and announcements from 
                  ALSAMOS and the industries we serve.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Search & Filters */}
          <section className="py-4 sm:py-6 lg:py-8 border-b border-border">
            <div className="container mx-auto px-4">
              <div className="flex flex-col gap-4">
                <div className="relative w-full sm:w-72 lg:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 sm:pl-10 h-10 sm:h-11 text-sm"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                  {newsCategories.map((category) => (
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

          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <section className="py-16">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-8">Featured Stories</h2>
                <div className="grid lg:grid-cols-2 gap-8">
                  {featuredArticles.slice(0, 2).map((article, index) => (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <Link to={`/news/${article.slug}`} className="block">
                        <div className="glass-card rounded-2xl overflow-hidden h-full">
                          <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/5">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Newspaper className="w-24 h-24 text-primary/30" />
                            </div>
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                Featured
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <span className="text-primary font-medium">{article.category}</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(article.date).toLocaleDateString('en-US', { 
                                  month: 'short', day: 'numeric', year: 'numeric' 
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {article.readTime}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                            <span className="inline-flex items-center gap-2 text-primary font-medium">
                              Read More
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* All Articles */}
          <section className="py-16 lg:py-24 bg-muted/50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8">All Articles</h2>
              {regularArticles.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularArticles.map((article, index) => (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <Link to={`/news/${article.slug}`} className="block h-full">
                        <div className="glass-card rounded-xl overflow-hidden h-full flex flex-col">
                          <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Newspaper className="w-16 h-16 text-muted-foreground/30" />
                            </div>
                          </div>
                          <div className="p-5 flex-1 flex flex-col">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                              <span className="text-primary font-medium">{article.category}</span>
                              <span>{article.readTime}</span>
                            </div>
                            <h3 className="font-bold mb-2 group-hover:text-primary transition-colors flex-1">
                              {article.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {article.excerpt}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-border">
                              <span className="text-xs text-muted-foreground">
                                {new Date(article.date).toLocaleDateString('en-US', { 
                                  month: 'short', day: 'numeric', year: 'numeric' 
                                })}
                              </span>
                              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground">No articles found matching your criteria.</p>
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

          {/* Newsletter CTA */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Stay Informed
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Subscribe to our newsletter for the latest updates, insights, and 
                  exclusive content delivered directly to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input type="email" placeholder="Enter your email" className="flex-1" />
                  <Button>Subscribe</Button>
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

export default News;
