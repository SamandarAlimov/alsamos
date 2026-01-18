import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface StructuredDataProps {
  type: "Article" | "Product" | "JobPosting" | "Organization" | "WebPage" | "FAQPage";
  data: Record<string, unknown>;
  breadcrumbs?: BreadcrumbItem[];
}

/**
 * Structured Data component for JSON-LD schemas
 * Automatically includes language-aware metadata
 */
export const StructuredData = ({ type, data, breadcrumbs }: StructuredDataProps) => {
  const { language } = useLanguage();
  
  const languageMap: Record<string, string> = {
    en: "en-US",
    uz: "uz-UZ",
    ru: "ru-RU"
  };

  const breadcrumbData = breadcrumbs && breadcrumbs.length > 0 ? {
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    }
  } : {};

  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
    inLanguage: languageMap[language],
    ...data,
    ...breadcrumbData,
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(baseSchema)}
      </script>
    </Helmet>
  );
};

// Pre-built schema generators
export const generateProductSchema = (product: {
  name: string;
  description: string;
  slug: string;
  price: string;
  category: string;
  features?: string[];
  specifications?: Array<{ label: string; value: string }>;
}) => ({
  name: product.name,
  description: product.description,
  url: `https://alsamos.com/products/${product.slug}`,
  image: ["https://alsamos.com/og-products.png"],
  sku: product.slug.toUpperCase(),
  brand: {
    "@type": "Brand",
    name: "ALSAMOS",
  },
  category: product.category,
  offers: {
    "@type": "Offer",
    price: product.price.replace(/[^0-9.]/g, '') || "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    seller: {
      "@type": "Organization",
      name: "ALSAMOS Corporation",
      url: "https://alsamos.com",
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "150",
    bestRating: "5",
    worstRating: "1",
  },
  additionalProperty: product.specifications?.map(spec => ({
    "@type": "PropertyValue",
    name: spec.label,
    value: spec.value,
  })),
});

export const generateArticleSchema = (article: {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  author: string;
  authorRole?: string;
  category: string;
  tags: string[];
  content: string;
}) => ({
  headline: article.title,
  description: article.excerpt,
  url: `https://alsamos.com/news/${article.slug}`,
  image: ["https://alsamos.com/og-news.png"],
  datePublished: article.date,
  dateModified: article.date,
  author: {
    "@type": "Person",
    name: article.author,
    jobTitle: article.authorRole,
  },
  publisher: {
    "@type": "Organization",
    name: "ALSAMOS Corporation",
    url: "https://alsamos.com",
    logo: {
      "@type": "ImageObject",
      url: "https://alsamos.com/logo.png",
      width: 512,
      height: 512,
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `https://alsamos.com/news/${article.slug}`,
  },
  keywords: article.tags.join(", "),
  articleSection: article.category,
  articleBody: article.content.slice(0, 500),
  wordCount: article.content.split(' ').length,
});

export const generateJobSchema = (job: {
  title: string;
  description: string;
  slug: string;
  posted: string;
  type: string;
  location: string;
  department: string;
  salary?: string;
  experience?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
}) => ({
  title: job.title,
  description: job.description,
  url: `https://alsamos.com/careers/${job.slug}`,
  datePosted: job.posted,
  validThrough: new Date(new Date(job.posted).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  employmentType: job.type.toUpperCase().replace(' ', '_'),
  hiringOrganization: {
    "@type": "Organization",
    name: "ALSAMOS Corporation",
    url: "https://alsamos.com",
    logo: "https://alsamos.com/logo.png",
    sameAs: [
      "https://www.linkedin.com/in/alsamos/",
      "https://x.com/AlsamosOfficial",
    ],
  },
  jobLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: job.location,
      addressCountry: job.location.includes('Remote') ? 'Worldwide' : 'UZ',
    },
  },
  baseSalary: job.salary ? {
    "@type": "MonetaryAmount",
    currency: "USD",
    value: {
      "@type": "QuantitativeValue",
      value: job.salary.replace(/[^0-9-]/g, '').split('-')[0],
      unitText: "YEAR",
    },
  } : undefined,
  experienceRequirements: job.experience,
  industry: job.department,
  skills: job.requirements?.slice(0, 5) || [],
  responsibilities: job.responsibilities?.join('. ') || '',
  jobBenefits: job.benefits?.join(', ') || '',
  applicantLocationRequirements: {
    "@type": "Country",
    name: job.location.includes('Remote') ? "Worldwide" : "Uzbekistan",
  },
});

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  mainEntity: faqs.map(faq => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export default StructuredData;
