import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  Mail, Phone, MapPin, Clock, Send, MessageSquare, Headphones,
  Building, Users, Briefcase, ChevronDown, ChevronUp,
  Linkedin, Instagram, Youtube, Twitter, Facebook
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import PageWrapper from "@/components/PageWrapper";
import HreflangTags from "@/components/seo/HreflangTags";
import { useSeoMeta, getLocaleCode } from "@/hooks/useSeoMeta";
import { useLanguage } from "@/contexts/LanguageContext";

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/alsamos/", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com/alsamosofficial", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/alsamos", label: "YouTube" },
  { icon: Twitter, href: "https://x.com/AlsamosOfficial", label: "X (Twitter)" },
  { icon: Facebook, href: "https://facebook.com/AlsamosOfficial", label: "Facebook" },
];

const faqKeys = [
  { q: "contact.faq_q1", a: "contact.faq_a1" },
  { q: "contact.faq_q2", a: "contact.faq_a2" },
  { q: "contact.faq_q3", a: "contact.faq_a3" },
  { q: "contact.faq_q4", a: "contact.faq_a4" },
  { q: "contact.faq_q5", a: "contact.faq_a5" },
  { q: "contact.faq_q6", a: "contact.faq_a6" },
];

const faqs = [
  {
    question: "What industries does ALSAMOS operate in?",
    answer: "ALSAMOS operates in over 100 industries including IT, Education, Medicine, Finance, Automotive, Aerospace, AI, Robotics, Fashion, Media, and many more. We're constantly expanding into new sectors."
  },
  {
    question: "How can I invest in ALSAMOS?",
    answer: "Visit our Investor Relations page or contact our investor relations team at investors@alsamos.com. We offer various investment opportunities including funding rounds and sector-specific investments."
  },
  {
    question: "Where is ALSAMOS headquartered?",
    answer: "ALSAMOS is headquartered in Tashkent, Uzbekistan, with offices in San Francisco, London, Dubai, Singapore, Tokyo, and other major cities worldwide."
  },
  {
    question: "How can I apply for a job at ALSAMOS?",
    answer: "Visit our Careers page to see all open positions. You can apply directly through our website by submitting your resume and application."
  },
  {
    question: "Does ALSAMOS offer partnerships?",
    answer: "Yes, we actively seek strategic partnerships across all industries. Contact our business development team to discuss partnership opportunities."
  },
  {
    question: "How can I get product support?",
    answer: "For product support, you can contact our support team through this form, email support@alsamos.com, or call our support hotline during business hours."
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const seo = useSeoMeta("contact");
  const { language, t } = useLanguage();

  const contactCategories = [
    { icon: MessageSquare, title: t("contact.general"), description: t("contact.general_desc") },
    { icon: Briefcase, title: t("contact.partnership"), description: t("contact.partnership_desc") },
    { icon: Headphones, title: t("contact.support"), description: t("contact.support_desc") },
    { icon: Users, title: t("contact.careers_cat"), description: t("contact.careers_desc") },
    { icon: Building, title: t("contact.investor_cat"), description: t("contact.investor_desc") },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: t("contact.toast_title"),
      description: t("contact.toast_desc"),
    });
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <PageWrapper>
      <HreflangTags path="/contact" />
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <link rel="canonical" href="https://alsamos.com/contact" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta property="og:title" content={seo.ogTitle} />
        <meta property="og:description" content={seo.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alsamos.com/contact" />
        <meta property="og:site_name" content="ALSAMOS" />
        <meta property="og:image" content="https://alsamos.com/og-contact.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={getLocaleCode(language)} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@AlsamosOfficial" />
        <meta name="twitter:title" content={seo.ogTitle} />
        <meta name="twitter:description" content={seo.ogDescription} />
        <meta name="twitter:image" content="https://alsamos.com/og-contact.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact ALSAMOS",
            "url": "https://alsamos.com/contact",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://alsamos.com" },
                { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://alsamos.com/contact" }
              ]
            },
            "mainEntity": {
              "@type": "Organization",
              "name": "ALSAMOS Corporation",
              "url": "https://alsamos.com",
              "email": "alsamos.company@gmail.com",
              "telephone": "+998933007709"
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
            }))
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
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  <span className="text-xs sm:text-sm font-medium text-primary">{t("contact.badge")}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                  {t("contact.title_1")}<span className="text-primary">{t("contact.title_2")}</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
                  {t("contact.subtitle")}
                </p>
              </motion.div>
            </div>
          </section>

          {/* Contact Categories */}
          <section className="py-6 sm:py-10 lg:py-12 border-b border-border">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
                {contactCategories.map((category, index) => (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <category.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">{category.title}</h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">{category.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Form & Info */}
          <section className="py-10 sm:py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{t("contact.send_message")}</h2>
                  <form onSubmit={handleSubmit} className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div>
                        <Label htmlFor="firstName" className="text-sm">{t("contact.first_name")} *</Label>
                        <Input id="firstName" name="firstName" required className="mt-1 h-10 sm:h-11" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">{t("contact.last_name")} *</Label>
                        <Input id="lastName" name="lastName" required className="mt-1" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="email">{t("contact.email")} *</Label>
                      <Input id="email" name="email" type="email" required className="mt-1" />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="phone">{t("contact.phone")}</Label>
                      <Input id="phone" name="phone" type="tel" className="mt-1" />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="subject">{t("contact.subject")} *</Label>
                      <Select name="subject" required>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder={t("contact.select_topic")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">{t("contact.subject_general")}</SelectItem>
                          <SelectItem value="partnership">{t("contact.subject_partnership")}</SelectItem>
                          <SelectItem value="support">{t("contact.subject_support")}</SelectItem>
                          <SelectItem value="careers">{t("contact.subject_careers")}</SelectItem>
                          <SelectItem value="investors">{t("contact.subject_investors")}</SelectItem>
                          <SelectItem value="media">{t("contact.subject_media")}</SelectItem>
                          <SelectItem value="other">{t("contact.subject_other")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mb-6">
                      <Label htmlFor="message">{t("contact.message")} *</Label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        rows={5}
                        required
                        placeholder={t("contact.message_placeholder")}
                        className="mt-1"
                      />
                    </div>
                    <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                      {isSubmitting ? t("contact.sending") : (
                        <>
                          <Send className="w-4 h-4" />
                          {t("contact.send")}
                        </>
                      )}
                    </Button>
                  </form>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-bold mb-6">{t("contact.info_title")}</h2>
                  
                  <div className="space-y-6 mb-8">
                    <div className="glass-card rounded-xl p-5 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{t("contact.email_label")}</h3>
                        <a href="mailto:alsamos.company@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                          alsamos.company@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="glass-card rounded-xl p-5 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{t("contact.phone_label")}</h3>
                        <a href="tel:+998933007709" className="text-muted-foreground hover:text-primary transition-colors">
                          +998 93 300 77 09
                        </a>
                      </div>
                    </div>

                    <div className="glass-card rounded-xl p-5 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{t("contact.headquarters")}</h3>
                        <p className="text-muted-foreground">Tashkent, Uzbekistan</p>
                      </div>
                    </div>

                    <div className="glass-card rounded-xl p-5 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{t("contact.business_hours")}</h3>
                        <p className="text-muted-foreground">{t("contact.hours_value")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="glass-card rounded-xl p-5">
                    <h3 className="font-semibold mb-4">{t("contact.follow_us")}</h3>
                    <div className="flex flex-wrap gap-3">
                      {socialLinks.map((social) => (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                          aria-label={social.label}
                        >
                          <social.icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Map Section */}
          <section className="py-16 lg:py-24 bg-muted/50">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("contact.map_title")}</h2>
                <p className="text-lg text-muted-foreground">{t("contact.map_subtitle")}</p>
              </motion.div>

              <div className="glass-card rounded-2xl overflow-hidden h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d191885.50264869498!2d69.11455595!3d41.31152225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ALSAMOS Headquarters Location"
                />
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("contact.faq_title")}</h2>
                <p className="text-lg text-muted-foreground">{t("contact.faq_subtitle")}</p>
              </motion.div>

              <div className="max-w-3xl mx-auto space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full p-5 flex items-center justify-between text-left"
                    >
                      <span className="font-semibold pr-4">{faq.question}</span>
                      {expandedFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="px-5 pb-5">
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
};

export default Contact;
