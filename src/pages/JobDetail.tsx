import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { jobs } from "@/data/jobs";
import { MapPin, Clock, Briefcase, ArrowLeft, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import PageWrapper from "@/components/PageWrapper";
import HreflangTags from "@/components/seo/HreflangTags";

const JobDetail = () => {
  const { slug } = useParams();
  const job = jobs.find(j => j.slug === slug);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-8">The position you're looking for doesn't exist or has been filled.</p>
          <Button asChild>
            <Link to="/careers">View All Positions</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Application Submitted!",
      description: "Thank you for your interest. We'll review your application and get back to you soon.",
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <PageWrapper>
      <HreflangTags path={`/careers/${job.slug}`} />
      <Helmet>
        <title>{job.title} | Careers at ALSAMOS - {job.location}</title>
        <meta name="description" content={`${job.description.slice(0, 155)}... Apply now for ${job.type} position in ${job.department}.`} />
        <meta name="keywords" content={`${job.title}, ${job.department} jobs, ALSAMOS careers, ${job.location}, ${job.type}, technology jobs`} />
        <link rel="canonical" href={`https://alsamos.com/careers/${job.slug}`} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Open Graph - Job */}
        <meta property="og:title" content={`${job.title} - Careers at ALSAMOS`} />
        <meta property="og:description" content={job.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://alsamos.com/careers/${job.slug}`} />
        <meta property="og:site_name" content="ALSAMOS" />
        <meta property="og:image" content="https://alsamos.com/og-careers.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@AlsamosOfficial" />
        <meta name="twitter:title" content={`${job.title} - ALSAMOS Careers`} />
        <meta name="twitter:description" content={`${job.type} position in ${job.department} at ${job.location}`} />
        <meta name="twitter:image" content="https://alsamos.com/og-careers.png" />
        <meta name="twitter:label1" content="Location" />
        <meta name="twitter:data1" content={job.location} />
        <meta name="twitter:label2" content="Type" />
        <meta name="twitter:data2" content={job.type} />
        
        {/* JSON-LD Structured Data - JobPosting */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            "title": job.title,
            "description": job.description,
            "url": `https://alsamos.com/careers/${job.slug}`,
            "datePosted": job.posted,
            "validThrough": new Date(new Date(job.posted).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            "employmentType": job.type.toUpperCase().replace(' ', '_'),
            "hiringOrganization": {
              "@type": "Organization",
              "name": "ALSAMOS Corporation",
              "url": "https://alsamos.com",
              "logo": "https://alsamos.com/logo.png",
              "sameAs": [
                "https://www.linkedin.com/in/alsamos/",
                "https://x.com/AlsamosOfficial"
              ]
            },
            "jobLocation": {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": job.location,
                "addressCountry": job.location.includes('Remote') ? 'Worldwide' : 'US'
              }
            },
            "baseSalary": job.salary ? {
              "@type": "MonetaryAmount",
              "currency": "USD",
              "value": {
                "@type": "QuantitativeValue",
                "value": job.salary.replace(/[^0-9-]/g, '').split('-')[0],
                "unitText": "YEAR"
              }
            } : undefined,
            "experienceRequirements": job.experience,
            "industry": job.department,
            "skills": job.requirements?.slice(0, 5) || [],
            "responsibilities": job.responsibilities?.join('. ') || '',
            "jobBenefits": job.benefits?.join(', ') || '',
            "applicantLocationRequirements": {
              "@type": "Country",
              "name": job.location.includes('Remote') ? "Worldwide" : "United States"
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://alsamos.com" },
                { "@type": "ListItem", "position": 2, "name": "Careers", "item": "https://alsamos.com/careers" },
                { "@type": "ListItem", "position": 3, "name": job.title, "item": `https://alsamos.com/careers/${job.slug}` }
              ]
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        <Header />
        
        <main className="py-12 lg:py-20">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link to="/careers" className="hover:text-primary transition-colors">Careers</Link>
              <span>/</span>
              <span className="text-foreground line-clamp-1">{job.title}</span>
            </nav>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {job.department}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">
                        {job.type}
                      </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">{job.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        {job.experience}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Posted {new Date(job.posted).toLocaleDateString('en-US', { 
                          month: 'long', day: 'numeric', year: 'numeric' 
                        })}
                      </span>
                    </div>
                    {job.salary && (
                      <p className="text-xl font-semibold text-primary mt-4">{job.salary}</p>
                    )}
                  </div>

                  {/* Description */}
                  <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">About This Role</h2>
                    <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                  </section>

                  {/* Responsibilities */}
                  <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Responsibilities</h2>
                    <ul className="space-y-3">
                      {job.responsibilities.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Requirements */}
                  <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Requirements</h2>
                    <ul className="space-y-3">
                      {job.requirements.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Benefits */}
                  <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Benefits</h2>
                    <ul className="space-y-3">
                      {job.benefits.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <Button asChild variant="outline" className="gap-2">
                    <Link to="/careers">
                      <ArrowLeft className="w-4 h-4" />
                      Back to All Positions
                    </Link>
                  </Button>
                </motion.div>
              </div>

              {/* Application Form */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="glass-card rounded-2xl p-6 sticky top-24"
                >
                  <h2 className="text-xl font-bold mb-6">Apply Now</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" name="name" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" name="email" type="email" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn Profile</Label>
                      <Input id="linkedin" name="linkedin" type="url" placeholder="https://linkedin.com/in/..." className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="portfolio">Portfolio/Website</Label>
                      <Input id="portfolio" name="portfolio" type="url" placeholder="https://..." className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="resume">Resume/CV *</Label>
                      <Input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" required className="mt-1" />
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOC, or DOCX (max 5MB)</p>
                    </div>
                    <div>
                      <Label htmlFor="cover">Cover Letter</Label>
                      <Textarea 
                        id="cover" 
                        name="cover" 
                        rows={4} 
                        placeholder="Tell us why you're interested in this role..."
                        className="mt-1"
                      />
                    </div>
                    <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
};

export default JobDetail;
