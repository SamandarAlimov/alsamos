import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import AboutHero from "@/components/about/AboutHero";
import FounderSection from "@/components/about/FounderSection";
import PhotoGallery from "@/components/about/PhotoGallery";
import LeadershipSection from "@/components/about/LeadershipSection";
import TeamSection from "@/components/about/TeamSection";
import JourneySection from "@/components/about/JourneySection";
import ValuesSection from "@/components/about/ValuesSection";
import PageWrapper from "@/components/PageWrapper";
import HreflangTags from "@/components/seo/HreflangTags";
import { useSeoMeta, getLocaleCode } from "@/hooks/useSeoMeta";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const seo = useSeoMeta("about");
  const { language } = useLanguage();

  return (
    <PageWrapper>
      <HreflangTags path="/about" />
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <link rel="canonical" href="https://alsamos.com/about" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Open Graph */}
        <meta property="og:title" content={seo.ogTitle} />
        <meta property="og:description" content={seo.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alsamos.com/about" />
        <meta property="og:site_name" content="ALSAMOS" />
        <meta property="og:image" content="https://alsamos.com/og-about.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="About ALSAMOS Corporation" />
        <meta property="og:locale" content={getLocaleCode(language)} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@AlsamosOfficial" />
        <meta name="twitter:creator" content="@AlsamosOfficial" />
        <meta name="twitter:title" content={seo.ogTitle} />
        <meta name="twitter:description" content={seo.ogDescription} />
        <meta name="twitter:image" content="https://alsamos.com/og-about.png" />
        
        {/* JSON-LD Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About ALSAMOS Corporation",
            "description": "Discover ALSAMOS - a multinational innovation corporation operating across 100+ business sectors.",
            "url": "https://alsamos.com/about",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://alsamos.com" },
                { "@type": "ListItem", "position": 2, "name": "About", "item": "https://alsamos.com/about" }
              ]
            },
            "mainEntity": {
              "@type": "Corporation",
              "name": "ALSAMOS Corporation",
              "alternateName": "ALSAMOS",
              "url": "https://alsamos.com",
              "logo": "https://alsamos.com/logo.png",
              "foundingDate": "2019",
              "founder": {
                "@type": "Person",
                "name": "Samandar Alimov",
                "jobTitle": "Founder & CEO",
                "url": "https://alsamos.com/about"
              },
              "numberOfEmployees": {
                "@type": "QuantitativeValue",
                "minValue": 1000
              },
              "slogan": "Building the Future of Everything",
              "knowsAbout": ["Technology", "AI", "Healthcare", "Education", "Automotive", "Aerospace", "Robotics", "Finance"],
              "areaServed": "Worldwide",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Tashkent",
                "addressCountry": "UZ"
              },
              "sameAs": [
                "https://www.linkedin.com/in/alsamos/",
                "https://x.com/AlsamosOfficial",
                "https://instagram.com/alsamosofficial",
                "https://youtube.com/alsamos",
                "https://facebook.com/AlsamosOfficial"
              ]
            }
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Header />
        <main>
          <AboutHero />
          <FounderSection />
          <PhotoGallery />
          <LeadershipSection />
          <TeamSection />
          <JourneySection />
          <ValuesSection />
        </main>
        <Footer />
      </div>
    </PageWrapper>
  );
};

export default About;
