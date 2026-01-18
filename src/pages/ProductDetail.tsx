import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { products } from "@/data/products";
import { 
  Brain, Watch, Cloud, Car, Heart, Satellite, GraduationCap, Landmark,
  Home, Glasses, Shield, Building2,
  ArrowLeft, ArrowRight, Check, Download, Play, GitCompare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Product3DViewer from "@/components/product/Product3DViewer";
import ProductComparison from "@/components/product/ProductComparison";
import PageWrapper from "@/components/PageWrapper";
import HreflangTags from "@/components/seo/HreflangTags";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Watch, Cloud, Car, Heart, Satellite, GraduationCap, Landmark,
  Home, Glasses, Shield, Building2
};

const ProductDetail = () => {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/products">View All Products</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProducts = products.filter(p => product.relatedProducts.includes(p.id));
  const IconComponent = iconMap[product.icon];

  return (
    <PageWrapper>
      <HreflangTags path={`/products/${product.slug}`} />
      <Helmet>
        <title>{product.name} | ALSAMOS Products - {product.tagline}</title>
        <meta name="description" content={`${product.description.slice(0, 155)}...`} />
        <meta name="keywords" content={`${product.name}, ALSAMOS, ${product.category}, technology, innovation, ${product.features.slice(0, 5).join(', ')}`} />
        <link rel="canonical" href={`https://alsamos.com/products/${product.slug}`} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Open Graph - Product */}
        <meta property="og:title" content={`${product.name} - ALSAMOS`} />
        <meta property="og:description" content={product.tagline} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://alsamos.com/products/${product.slug}`} />
        <meta property="og:site_name" content="ALSAMOS" />
        <meta property="og:image" content="https://alsamos.com/og-products.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        <meta property="product:price:amount" content={product.price.replace(/[^0-9.]/g, '')} />
        <meta property="product:price:currency" content="USD" />
        <meta property="product:brand" content="ALSAMOS" />
        <meta property="product:category" content={product.category} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@AlsamosOfficial" />
        <meta name="twitter:title" content={`${product.name} - ALSAMOS`} />
        <meta name="twitter:description" content={product.tagline} />
        <meta name="twitter:image" content="https://alsamos.com/og-products.png" />
        <meta name="twitter:label1" content="Price" />
        <meta name="twitter:data1" content={product.price} />
        <meta name="twitter:label2" content="Category" />
        <meta name="twitter:data2" content={product.category} />
        
        {/* JSON-LD Structured Data - Product */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.fullDescription || product.description,
            "url": `https://alsamos.com/products/${product.slug}`,
            "image": ["https://alsamos.com/og-products.png"],
            "sku": product.slug.toUpperCase(),
            "brand": {
              "@type": "Brand",
              "name": "ALSAMOS"
            },
            "category": product.category,
            "offers": {
              "@type": "Offer",
              "price": product.price.replace(/[^0-9.]/g, '') || "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              "seller": {
                "@type": "Organization",
                "name": "ALSAMOS Corporation",
                "url": "https://alsamos.com"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "150",
              "bestRating": "5",
              "worstRating": "1"
            },
            "additionalProperty": product.specifications.map(spec => ({
              "@type": "PropertyValue",
              "name": spec.label,
              "value": spec.value
            })),
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://alsamos.com" },
                { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://alsamos.com/products" },
                { "@type": "ListItem", "position": 3, "name": product.name, "item": `https://alsamos.com/products/${product.slug}` }
              ]
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        <Header />
        
        <main className="pt-20">
          {/* Breadcrumb */}
          <div className="container mx-auto px-4 py-6">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
              <span>/</span>
              <span className="text-foreground">{product.name}</span>
            </nav>
          </div>

          {/* Hero Section */}
          <section className="py-8 lg:py-16">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Product Visual */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative aspect-square"
                >
                  <Product3DViewer productType={product.category} gradient={product.gradient} />
                </motion.div>

                {/* Product Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    {product.category}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
                  <p className="text-xl text-primary font-medium mb-6">{product.tagline}</p>
                  <p className="text-lg text-muted-foreground mb-8">{product.fullDescription}</p>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-3xl font-bold text-primary">{product.price}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="gap-2">
                      <Play className="w-5 h-5" />
                      Request Demo
                    </Button>
                    <Button size="lg" variant="outline" className="gap-2">
                      <Download className="w-5 h-5" />
                      Download Brochure
                    </Button>
                    <ProductComparison 
                      initialProduct={product}
                      trigger={
                        <Button size="lg" variant="secondary" className="gap-2">
                          <GitCompare className="w-5 h-5" />
                          Compare
                        </Button>
                      }
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 lg:py-24 bg-muted/50">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
                <p className="text-lg text-muted-foreground">Everything you need, nothing you don't</p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card rounded-xl p-6 flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{feature}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Specifications */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Specifications</h2>
                <p className="text-lg text-muted-foreground">Detailed specs for technical evaluation</p>
              </motion.div>

              <div className="max-w-3xl mx-auto">
                <div className="glass-card rounded-2xl overflow-hidden">
                  {product.specifications.map((spec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex justify-between items-center p-4 ${
                        index !== product.specifications.length - 1 ? 'border-b border-border' : ''
                      }`}
                    >
                      <span className="text-muted-foreground">{spec.label}</span>
                      <span className="font-semibold">{spec.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="py-16 lg:py-24 bg-muted/50">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-3xl font-bold">Related Products</h2>
                  <Button asChild variant="outline">
                    <Link to="/products" className="gap-2">
                      View All
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {relatedProducts.map((related) => {
                    const RelatedIcon = iconMap[related.icon];
                    return (
                      <Link
                        key={related.id}
                        to={`/products/${related.slug}`}
                        className="glass-card rounded-2xl overflow-hidden group hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center gap-6 p-6">
                          <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${related.gradient} flex items-center justify-center flex-shrink-0`}>
                            {RelatedIcon && <RelatedIcon className="w-10 h-10 text-white" />}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                              {related.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{related.tagline}</p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Contact our sales team to learn more about {product.name} and how it can 
                  transform your business.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link to="/contact">Contact Sales</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/products" className="gap-2">
                      <ArrowLeft className="w-5 h-5" />
                      Back to Products
                    </Link>
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

export default ProductDetail;
