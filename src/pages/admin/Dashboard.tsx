import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, Briefcase, Users, FileText, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface Stats {
  totalNews: number;
  totalJobs: number;
  totalInvestorApps: number;
  totalJobApps: number;
  pendingInvestorApps: number;
  pendingJobApps: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalNews: 0,
    totalJobs: 0,
    totalInvestorApps: 0,
    totalJobApps: 0,
    pendingInvestorApps: 0,
    pendingJobApps: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [newsRes, jobsRes, investorAppsRes, jobAppsRes, pendingInvestorRes, pendingJobRes] = await Promise.all([
        supabase.from("news").select("id", { count: "exact", head: true }),
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase.from("investor_applications").select("id", { count: "exact", head: true }),
        supabase.from("job_applications").select("id", { count: "exact", head: true }),
        supabase.from("investor_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("job_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);

      setStats({
        totalNews: newsRes.count || 0,
        totalJobs: jobsRes.count || 0,
        totalInvestorApps: investorAppsRes.count || 0,
        totalJobApps: jobAppsRes.count || 0,
        pendingInvestorApps: pendingInvestorRes.count || 0,
        pendingJobApps: pendingJobRes.count || 0,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: Newspaper, label: "Total News", value: stats.totalNews, href: "/admin/news", color: "bg-blue-500" },
    { icon: Briefcase, label: "Active Jobs", value: stats.totalJobs, href: "/admin/jobs", color: "bg-green-500" },
    { icon: Users, label: "Investor Applications", value: stats.totalInvestorApps, href: "/admin/investors", color: "bg-purple-500" },
    { icon: FileText, label: "Job Applications", value: stats.totalJobApps, href: "/admin/job-applications", color: "bg-orange-500" },
  ];

  const pendingItems = [
    { label: "Pending Investor Applications", value: stats.pendingInvestorApps, href: "/admin/investors" },
    { label: "Pending Job Applications", value: stats.pendingJobApps, href: "/admin/job-applications" },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to ALSAMOS Admin Panel</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={stat.href}
                  className="block glass-card rounded-xl p-5 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg">Pending Actions</h2>
              </div>
              <div className="space-y-4">
                {pendingItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <span className="text-sm">{item.label}</span>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
                      {item.value}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card rounded-xl p-6"
            >
              <h2 className="font-bold text-lg mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/admin/news"
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center"
                >
                  <Newspaper className="w-6 h-6 mb-2 text-primary" />
                  <span className="text-sm font-medium">Add News</span>
                </Link>
                <Link
                  to="/admin/jobs"
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center"
                >
                  <Briefcase className="w-6 h-6 mb-2 text-primary" />
                  <span className="text-sm font-medium">Add Job</span>
                </Link>
                <Link
                  to="/admin/investors"
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center"
                >
                  <Users className="w-6 h-6 mb-2 text-primary" />
                  <span className="text-sm font-medium">View Investors</span>
                </Link>
                <Link
                  to="/admin/job-applications"
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center"
                >
                  <FileText className="w-6 h-6 mb-2 text-primary" />
                  <span className="text-sm font-medium">View Applicants</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
