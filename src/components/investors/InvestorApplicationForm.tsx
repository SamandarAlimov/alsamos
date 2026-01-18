import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Building, DollarSign, User, Mail, Phone, Globe } from "lucide-react";
import { z } from "zod";

const investmentTypes = [
  { value: "seed", label: "Seed Funding" },
  { value: "series_a", label: "Series A" },
  { value: "series_b", label: "Series B" },
  { value: "series_c", label: "Series C" },
  { value: "angel", label: "Angel Investment" },
  { value: "venture_capital", label: "Venture Capital" },
  { value: "private_equity", label: "Private Equity" },
];

const formSchema = z.object({
  fullName: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Valid email is required").max(255),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  companyWebsite: z.string().url().optional().or(z.literal("")),
  investmentType: z.enum(["seed", "series_a", "series_b", "series_c", "angel", "venture_capital", "private_equity"]),
  investmentAmountMin: z.number().positive().optional(),
  investmentAmountMax: z.number().positive().optional(),
  message: z.string().max(2000).optional(),
});

export const InvestorApplicationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    companyWebsite: "",
    investmentType: "",
    investmentAmountMin: "",
    investmentAmountMax: "",
    message: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const dataToValidate = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        companyName: formData.companyName || undefined,
        companyWebsite: formData.companyWebsite || undefined,
        investmentType: formData.investmentType as any,
        investmentAmountMin: formData.investmentAmountMin ? parseFloat(formData.investmentAmountMin) : undefined,
        investmentAmountMax: formData.investmentAmountMax ? parseFloat(formData.investmentAmountMax) : undefined,
        message: formData.message || undefined,
      };

      const result = formSchema.safeParse(dataToValidate);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase.from("investor_applications").insert({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        company_name: formData.companyName || null,
        company_website: formData.companyWebsite || null,
        investment_type: formData.investmentType as any,
        investment_amount_min: formData.investmentAmountMin ? parseFloat(formData.investmentAmountMin) : null,
        investment_amount_max: formData.investmentAmountMax ? parseFloat(formData.investmentAmountMax) : null,
        message: formData.message || null,
      });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Our investor relations team will contact you within 2 business days.",
      });

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        companyName: "",
        companyWebsite: "",
        investmentType: "",
        investmentAmountMin: "",
        investmentAmountMax: "",
        message: "",
      });
    } catch (err: any) {
      toast({
        title: "Submission Failed",
        description: err.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card rounded-2xl p-6 sm:p-8"
    >
      <h3 className="text-xl sm:text-2xl font-bold mb-6">Investor Application</h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="pl-10"
              />
            </div>
            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="pl-10"
              />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="companyName"
                placeholder="Your Company Inc."
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyWebsite">Company Website</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="companyWebsite"
              placeholder="https://yourcompany.com"
              value={formData.companyWebsite}
              onChange={(e) => handleChange("companyWebsite", e.target.value)}
              className="pl-10"
            />
          </div>
          {errors.companyWebsite && <p className="text-sm text-destructive">{errors.companyWebsite}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="investmentType">Investment Type *</Label>
          <Select value={formData.investmentType} onValueChange={(v) => handleChange("investmentType", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select investment type" />
            </SelectTrigger>
            <SelectContent>
              {investmentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.investmentType && <p className="text-sm text-destructive">{errors.investmentType}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="investmentAmountMin">Min Investment ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="investmentAmountMin"
                type="number"
                placeholder="100,000"
                value={formData.investmentAmountMin}
                onChange={(e) => handleChange("investmentAmountMin", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="investmentAmountMax">Max Investment ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="investmentAmountMax"
                type="number"
                placeholder="1,000,000"
                value={formData.investmentAmountMax}
                onChange={(e) => handleChange("investmentAmountMax", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Tell us about your investment interests and goals..."
            rows={4}
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </motion.div>
  );
};
