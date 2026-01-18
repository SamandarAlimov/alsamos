import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocaleCode } from "@/hooks/useSeoMeta";

interface DynamicSeoMetaProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl: string;
  ogType?: "website" | "article" | "product";
  ogImage?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
}

/**
 * Dynamic SEO Meta component that automatically handles:
 * - Language-specific og:locale
 * - Canonical URLs
 * - Open Graph meta tags
 * - Twitter Card meta tags
 * - Robots directives
 */
export const DynamicSeoMeta = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = "website",
  ogImage = "https://alsamos.com/og-image.png",
  author,
  publishedTime,
  modifiedTime,
  section,
  tags,
  noIndex = false,
}: DynamicSeoMetaProps) => {
  const { language } = useLanguage();
  const locale = getLocaleCode(language);
  
  // Get alternate locales
  const alternateLocales = ["en_US", "uz_UZ", "ru_RU"].filter(l => l !== locale);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      
      {/* Language */}
      <html lang={language} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="ALSAMOS" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content={locale} />
      {alternateLocales.map(altLocale => (
        <meta key={altLocale} property="og:locale:alternate" content={altLocale} />
      ))}
      
      {/* Article-specific meta */}
      {ogType === "article" && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags?.map((tag, idx) => (
            <meta key={idx} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@AlsamosOfficial" />
      <meta name="twitter:creator" content="@AlsamosOfficial" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Author */}
      {author && <meta name="author" content={author} />}
    </Helmet>
  );
};

export default DynamicSeoMeta;
