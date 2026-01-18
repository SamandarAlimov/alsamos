import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Mail, Phone, Building, Globe, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface InvestorApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  company_website: string | null;
  investment_type: string;
  investment_amount_min: number | null;
  investment_amount_max: number | null;
  message: string | null;
  status: string;
  created_at: string;
}

const investmentTypeLabels: Record<string, string> = {
  seed: "Seed Funding",
  series_a: "Series A",
  series_b: "Series B",
  series_c: "Series C",
  angel: "Angel Investment",
  venture_capital: "Venture Capital",
  private_equity: "Private Equity",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  reviewing: "bg-blue-500/10 text-blue-500",
  approved: "bg-green-500/10 text-green-500",
  rejected: "bg-red-500/10 text-red-500",
};

const AdminInvestors = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<InvestorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<InvestorApplication | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("investor_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: "pending" | "reviewing" | "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("investor_applications")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      toast({ title: `Status updated to ${status}` });
      fetchApplications();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const viewDetails = (app: InvestorApplication) => {
    setSelectedApp(app);
    setDialogOpen(true);
  };

  const formatAmount = (amount: number | null) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold">Investor Applications</h1>
        <p className="text-muted-foreground mt-1">Manage investor application submissions</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-xl">
          <p className="text-muted-foreground">No investor applications yet.</p>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Company</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{app.full_name}</p>
                      <p className="text-xs text-muted-foreground">{app.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{app.company_name || "-"}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-sm">{investmentTypeLabels[app.investment_type] || app.investment_type}</span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={app.status}
                      onValueChange={(value: "pending" | "reviewing" | "approved" | "rejected") => updateStatus(app.id, value)}
                    >
                      <SelectTrigger className="w-28 h-8">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {format(new Date(app.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => viewDetails(app)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4 mt-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">
                    {selectedApp.full_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedApp.full_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Applied {format(new Date(selectedApp.created_at), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedApp.email}</span>
                </div>
                {selectedApp.phone && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedApp.phone}</span>
                  </div>
                )}
                {selectedApp.company_name && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedApp.company_name}</span>
                  </div>
                )}
                {selectedApp.company_website && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a href={selectedApp.company_website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {selectedApp.company_website}
                    </a>
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Investment Type</p>
                  <p className="font-medium">{investmentTypeLabels[selectedApp.investment_type]}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Investment Range</p>
                  <p className="font-medium">
                    {formatAmount(selectedApp.investment_amount_min)} - {formatAmount(selectedApp.investment_amount_max)}
                  </p>
                </div>
              </div>

              {selectedApp.message && (
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-2">Message</p>
                  <p className="text-sm p-4 rounded-lg bg-muted/50">{selectedApp.message}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => window.open(`mailto:${selectedApp.email}`, "_blank")}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInvestors;
