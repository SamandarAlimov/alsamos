import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/xml; charset=utf-8",
};

const BASE_URL = "https://alsamos.com";
const LANGUAGES = ["en", "uz", "ru"];

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/about", priority: "0.9", changefreq: "monthly" },
  { path: "/industries", priority: "0.8", changefreq: "weekly" },
  { path: "/products", priority: "0.8", changefreq: "weekly" },
  { path: "/news", priority: "0.8", changefreq: "daily" },
  { path: "/careers", priority: "0.7", changefreq: "weekly" },
  { path: "/investors", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
];

// Static product slugs (from data/products.ts)
const PRODUCT_SLUGS = [
  "alsamos-mind", "alsamos-watch", "alsamos-cloud", "alsamos-drive",
  "alsamos-health", "alsamos-sat", "alsamos-edu", "alsamos-fin",
  "alsamos-home", "alsamos-vision", "alsamos-guard", "alsamos-build"
];

// Static industry/sector slugs (from data/sectors.ts) - comprehensive list
const SECTOR_SLUGS = [
  "information-technology", "education", "healthcare", "automotive",
  "aerospace", "artificial-intelligence", "robotics", "finance",
  "real-estate", "fashion", "entertainment", "food-beverage",
  "sports", "e-commerce", "gaming", "publishing", "energy",
  "agriculture", "legal", "weather", "childcare", "culinary",
  "navigation", "human-resources", "recruitment", "communication",
  "journalism", "astronomy", "linguistics", "music", "libraries",
  "aviation", "television", "social-media", "fast-food", "cybersecurity",
  "semiconductors", "manufacturing", "marine", "mining", "jewelry",
  "environmental", "water-management", "forestry", "renewable-energy",
  "solar-energy", "nuclear", "biotechnology", "pharmaceutical",
  "medical-devices", "fitness", "photography", "art-design",
  "graphic-design", "telecommunications", "radio-broadcasting",
  "internet-services", "cloud-computing", "data-science", "blockchain",
  "consulting", "venture-capital", "banking", "insurance", "credit",
  "savings", "construction", "architecture", "civil-engineering",
  "logistics", "shipping", "railways", "public-transport",
  "beauty", "childcare-products", "pet-care", "floristry",
  "coffee", "wine", "brewing", "tobacco", "gift-retail",
  "luxury-watches", "eyewear", "footwear", "furniture",
  "lighting", "bathroom", "home-furnishing", "bedding",
  "home-appliances", "kitchen-appliances", "laundry",
  "climate-control", "heating", "refrigeration", "thermometry",
  "measurement", "tools", "painting", "cleaning"
];

function buildUrlEntry(path: string, lastmod: string, priority: string, changefreq: string): string {
  const fullUrl = `${BASE_URL}${path}`;
  const hreflangs = LANGUAGES.map(
    (lang) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${fullUrl}" />`
  ).join("\n");

  return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="x-default" href="${fullUrl}" />
${hreflangs}
  </url>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date().toISOString().split("T")[0];

    // Fetch published news and active jobs in parallel
    const [newsResult, jobsResult] = await Promise.all([
      supabase
        .from("news")
        .select("slug, updated_at, published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false }),
      supabase
        .from("jobs")
        .select("slug, updated_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false }),
    ]);

    const urls: string[] = [];

    // Static pages
    for (const page of STATIC_PAGES) {
      urls.push(buildUrlEntry(page.path, now, page.priority, page.changefreq));
    }

    // Product pages (static data)
    for (const slug of PRODUCT_SLUGS) {
      urls.push(buildUrlEntry(`/products/${slug}`, now, "0.7", "monthly"));
    }

    // Industry/Sector pages (static data)
    for (const slug of SECTOR_SLUGS) {
      urls.push(buildUrlEntry(`/industries/${slug}`, now, "0.6", "monthly"));
    }

    // News articles (dynamic from DB)
    if (newsResult.data) {
      for (const article of newsResult.data) {
        const lastmod = (article.updated_at || article.published_at || now).split("T")[0];
        urls.push(buildUrlEntry(`/news/${article.slug}`, lastmod, "0.7", "monthly"));
      }
    }

    // Job listings (dynamic from DB)
    if (jobsResult.data) {
      for (const job of jobsResult.data) {
        const lastmod = (job.updated_at || now).split("T")[0];
        urls.push(buildUrlEntry(`/careers/${job.slug}`, lastmod, "0.6", "weekly"));
      }
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

    return new Response(sitemap, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
});
