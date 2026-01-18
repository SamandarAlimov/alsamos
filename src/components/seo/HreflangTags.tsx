import { Helmet } from "react-helmet-async";

interface HreflangTagsProps {
  path: string; // The path relative to root, e.g., "/about", "/news/my-article"
}

/**
 * Adds hreflang tags for multilingual SEO support.
 * Supports English (default), Uzbek, and Russian language versions.
 * 
 * Since the site uses client-side language switching (not URL-based),
 * we use x-default for the same URL across all languages.
 * This signals to search engines that the page adapts to user's language preference.
 */
export const HreflangTags = ({ path }: HreflangTagsProps) => {
  const baseUrl = "https://alsamos.com";
  const canonicalUrl = `${baseUrl}${path}`;

  return (
    <Helmet>
      {/* Default/fallback for users who don't match any language */}
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      
      {/* English - Primary language */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      
      {/* Uzbek */}
      <link rel="alternate" hrefLang="uz" href={canonicalUrl} />
      
      {/* Russian */}
      <link rel="alternate" hrefLang="ru" href={canonicalUrl} />
      
      {/* Regional variations for better targeting */}
      <link rel="alternate" hrefLang="en-US" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-GB" href={canonicalUrl} />
      <link rel="alternate" hrefLang="uz-UZ" href={canonicalUrl} />
      <link rel="alternate" hrefLang="ru-RU" href={canonicalUrl} />
      <link rel="alternate" hrefLang="ru-UZ" href={canonicalUrl} />
    </Helmet>
  );
};

export default HreflangTags;
