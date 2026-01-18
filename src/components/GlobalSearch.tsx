import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Sparkles, Monitor, Package, Newspaper, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sectors } from "@/data/sectors";
import { products } from "@/data/products";
import { newsArticles } from "@/data/news";
import { jobs } from "@/data/jobs";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "industry" | "product" | "news" | "career";
  href: string;
  icon: React.ReactNode;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch = ({ isOpen, onClose }: GlobalSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const typeIcons = {
    industry: <Monitor className="w-4 h-4" />,
    product: <Package className="w-4 h-4" />,
    news: <Newspaper className="w-4 h-4" />,
    career: <Briefcase className="w-4 h-4" />,
  };

  const typeColors = {
    industry: "bg-blue-500/10 text-blue-500",
    product: "bg-primary/10 text-primary",
    news: "bg-green-500/10 text-green-500",
    career: "bg-purple-500/10 text-purple-500",
  };

  const searchContent = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const q = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search sectors
    sectors.forEach((sector) => {
      if (
        sector.name.toLowerCase().includes(q) ||
        sector.description.toLowerCase().includes(q)
      ) {
        searchResults.push({
          id: `sector-${sector.id}`,
          title: sector.name,
          description: sector.description.slice(0, 80) + "...",
          type: "industry",
          href: `/industries/${sector.slug}`,
          icon: typeIcons.industry,
        });
      }
    });

    // Search products
    products.forEach((product) => {
      if (
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q)
      ) {
        searchResults.push({
          id: `product-${product.id}`,
          title: product.name,
          description: product.tagline,
          type: "product",
          href: `/products/${product.slug}`,
          icon: typeIcons.product,
        });
      }
    });

    // Search news
    newsArticles.forEach((article) => {
      if (
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q)
      ) {
        searchResults.push({
          id: `news-${article.id}`,
          title: article.title,
          description: article.excerpt.slice(0, 80) + "...",
          type: "news",
          href: `/news/${article.slug}`,
          icon: typeIcons.news,
        });
      }
    });

    // Search jobs
    jobs.forEach((job) => {
      if (
        job.title.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
      ) {
        searchResults.push({
          id: `job-${job.id}`,
          title: job.title,
          description: `${job.department} • ${job.location}`,
          type: "career",
          href: `/careers/${job.slug}`,
          icon: typeIcons.career,
        });
      }
    });

    setResults(searchResults.slice(0, 10));
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      searchContent(query);
    }, 150);
    return () => clearTimeout(debounce);
  }, [query, searchContent]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        navigate(results[selectedIndex].href);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, navigate, onClose]);

  const quickLinks = [
    { label: "AI Solutions", href: "/products", icon: <Sparkles className="w-4 h-4" /> },
    { label: "Education", href: "/industries/education", icon: typeIcons.industry },
    { label: "Healthcare", href: "/industries/healthcare", icon: typeIcons.industry },
    { label: "Careers", href: "/careers", icon: typeIcons.career },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
          
          {/* Search Container */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative container mx-auto px-4 pt-24 sm:pt-32"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-2xl mx-auto">
              {/* Search Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Search ALSAMOS</h2>
                    <p className="text-sm text-muted-foreground">Find products, industries, news & more</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Search Input */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type to search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 text-lg bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground transition-all"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Results */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
                {results.length > 0 ? (
                  <div className="max-h-[400px] overflow-y-auto">
                    {results.map((result, index) => (
                      <Link
                        key={result.id}
                        to={result.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-start gap-4 p-4 hover:bg-accent/50 transition-colors",
                          index === selectedIndex && "bg-accent/50"
                        )}
                      >
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", typeColors[result.type])}>
                          {result.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{result.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{result.description}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={cn("text-xs px-2 py-1 rounded-full capitalize", typeColors[result.type])}>
                            {result.type}
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : query ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-foreground font-medium mb-1">No results found</p>
                    <p className="text-sm text-muted-foreground">Try a different search term</p>
                  </div>
                ) : (
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground mb-4">Quick Links</p>
                    <div className="grid grid-cols-2 gap-2">
                      {quickLinks.map((link) => (
                        <Link
                          key={link.label}
                          to={link.href}
                          onClick={onClose}
                          className="flex items-center gap-3 p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors"
                        >
                          <span className="text-primary">{link.icon}</span>
                          <span className="text-sm font-medium text-foreground">{link.label}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground text-center">
                        Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">↓</kbd> to navigate, <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">Enter</kbd> to select, <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">Esc</kbd> to close
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
