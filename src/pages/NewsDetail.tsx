import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { newsArticles } from "@/data/news";
import { Calendar, Clock, User, ArrowLeft, Share2, Linkedin, Twitter, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageWrapper from "@/components/PageWrapper";
import HreflangTags from "@/components/seo/HreflangTags";

const NewsDetail = () => {
  const { slug } = useParams();
  const article = newsArticles.find(a => a.slug === slug);
  
  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/news">View All News</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedArticles = newsArticles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return (
    <PageWrapper>
      <HreflangTags path={`/news/${article.slug}`} />
      <Helmet>
        <title>{article.title} | ALSAMOS News & Insights</title>
        <meta name="description" content={article.excerpt.slice(0, 160)} />
        <meta name="keywords" content={`${article.tags.join(', ')}, ALSAMOS, news, ${article.category}, technology updates`} />
        <link rel="canonical" href={`https://alsamos.com/news/${article.slug}`} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content={article.author} />
        
        {/* Open Graph - Article */}
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://alsamos.com/news/${article.slug}`} />
        <meta property="og:site_name" content="ALSAMOS" />
        <meta property="og:image" content="https://alsamos.com/og-news.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        <meta property="article:published_time" content={article.date} />
        <meta property="article:modified_time" content={article.date} />
        <meta property="article:author" content={article.author} />
        <meta property="article:section" content={article.category} />
        {article.tags.map((tag, idx) => (
          <meta key={idx} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@AlsamosOfficial" />
        <meta name="twitter:creator" content="@AlsamosOfficial" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt} />
        <meta name="twitter:image" content="https://alsamos.com/og-news.png" />
        
        {/* JSON-LD Structured Data - NewsArticle */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": article.title,
            "description": article.excerpt,
            "url": `https://alsamos.com/news/${article.slug}`,
            "image": ["https://alsamos.com/og-news.png"],
            "datePublished": article.date,
            "dateModified": article.date,
            "author": {
              "@type": "Person",
              "name": article.author,
              "jobTitle": article.authorRole
            },
            "publisher": {
              "@type": "Organization",
              "name": "ALSAMOS Corporation",
              "url": "https://alsamos.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://alsamos.com/logo.png",
                "width": 512,
                "height": 512
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://alsamos.com/news/${article.slug}`
            },
            "keywords": article.tags.join(", "),
            "articleSection": article.category,
            "articleBody": article.content.slice(0, 500),
            "wordCount": article.content.split(' ').length,
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://alsamos.com" },
                { "@type": "ListItem", "position": 2, "name": "News", "item": "https://alsamos.com/news" },
                { "@type": "ListItem", "position": 3, "name": article.title, "item": `https://alsamos.com/news/${article.slug}` }
              ]
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        <Header />
        
        <main className="py-12 lg:py-20">
          <article className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link to="/news" className="hover:text-primary transition-colors">News</Link>
              <span>/</span>
              <span className="text-foreground line-clamp-1">{article.title}</span>
            </nav>

            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {article.category}
                  </span>
                  {article.featured && (
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      Featured
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  {article.title}
                </h1>

                <p className="text-xl text-muted-foreground mb-8">{article.excerpt}</p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pb-8 border-b border-border">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {article.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(article.date).toLocaleDateString('en-US', { 
                      month: 'long', day: 'numeric', year: 'numeric' 
                    })}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {article.readTime} read
                  </span>
                </div>
              </motion.header>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="prose prose-lg max-w-none mb-12"
              >
                {article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-foreground/90 leading-relaxed mb-6">
                    {paragraph}
                  </p>
                ))}
              </motion.div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pb-8 border-b border-border mb-8">
                {article.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Share */}
              <div className="flex items-center justify-between mb-16">
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/news">
                    <ArrowLeft className="w-4 h-4" />
                    Back to News
                  </Link>
                </Button>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share:
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="w-9 h-9">
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-9 h-9">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-9 h-9">
                      <Facebook className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedArticles.map((related) => (
                      <Link
                        key={related.id}
                        to={`/news/${related.slug}`}
                        className="glass-card rounded-xl p-4 hover:border-primary/50 transition-colors group"
                      >
                        <span className="text-xs text-primary font-medium">{related.category}</span>
                        <h3 className="font-semibold mt-2 group-hover:text-primary transition-colors line-clamp-2">
                          {related.title}
                        </h3>
                        <span className="text-xs text-muted-foreground mt-2 block">
                          {related.readTime}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </article>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
};

export default NewsDetail;
