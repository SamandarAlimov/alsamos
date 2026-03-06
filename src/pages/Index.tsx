import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { SectorsGrid } from "@/components/home/SectorsGrid";
import { ProductsShowcase } from "@/components/home/ProductsShowcase";
import { NewsSection } from "@/components/home/NewsSection";
import { StatsSection } from "@/components/home/StatsSection";
import { CTASection } from "@/components/home/CTASection";
import PageWrapper from "@/components/PageWrapper";
import HreflangTags from "@/components/seo/HreflangTags";
import { useSeoMeta, getLocaleCode } from "@/hooks/useSeoMeta";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const seo = useSeoMeta("home");
  const { language } = useLanguage();

  return (
    <PageWrapper>
      <HreflangTags path="/" />
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <link rel="canonical" href="https://alsamos.com" />
        
        {/* Open Graph */}
        <meta property="og:title" content={seo.ogTitle} />
        <meta property="og:description" content={seo.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alsamos.com" />
        <meta property="og:site_name" content="ALSAMOS" />
        <meta property="og:image" content="https://alsamos.com/og-image.png" />
        <meta property="og:locale" content={getLocaleCode(language)} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.ogTitle} />
        <meta name="twitter:description" content={seo.ogDescription} />
        <meta name="twitter:image" content="https://alsamos.com/og-image.png" />
        
        {/* JSON-LD Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "ALSAMOS Corporation",
            "alternateName": "ALSAMOS",
            "url": "https://alsamos.com",
            "logo": "https://alsamos.com/logo.png",
            "sameAs": [
              "https://www.linkedin.com/in/alsamos/",
              "https://instagram.com/alsamosofficial",
              "https://youtube.com/alsamos",
              "https://x.com/AlsamosOfficial",
              "https://facebook.com/AlsamosOfficial",
              "https://t.me/alsamos"
            ],
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "telephone": "+998933007709",
                "contactType": "customer service",
                "availableLanguage": ["English", "Russian", "Uzbek"]
              },
              {
                "@type": "ContactPoint",
                "email": "investors@alsamos.com",
                "contactType": "investor relations"
              }
            ],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Tashkent",
              "addressCountry": "UZ"
            },
            "foundingDate": "2019",
            "founder": {
              "@type": "Person",
              "name": "Samandar Alimov"
            },
            "numberOfEmployees": {
              "@type": "QuantitativeValue",
              "minValue": 1000
            },
            "knowsAbout": ["Technology", "AI", "Healthcare", "Education", "Automotive", "Aerospace", "Robotics", "Finance"]
          })}
        </script>
        
        {/* JSON-LD - WebSite with SearchAction for sitelinks searchbox */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ALSAMOS",
            "alternateName": "ALSAMOS Corporation",
            "url": "https://alsamos.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://alsamos.com/products?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        <Header />
        <main className="pt-0">
          <HeroSection />
          <StatsSection />
          <SectorsGrid />
          <ProductsShowcase />
          <NewsSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </PageWrapper>
  );
};

export default Index;
