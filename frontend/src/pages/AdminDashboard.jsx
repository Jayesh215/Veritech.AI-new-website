import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import InquiriesTab from "../components/admin/InquiriesTab";
import NewsletterTab from "../components/admin/NewsletterTab";
import AnalyticsTab from "../components/admin/AnalyticsTab";
import { LogOut, BarChart3, Inbox, Mail, RefreshCw, Sun, Moon } from "lucide-react";
import { toast } from "sonner";

const TABS = [
  { key: "analytics", label: "Analytics", Icon: BarChart3 },
  { key: "inquiries", label: "Inquiries", Icon: Inbox },
  { key: "newsletter", label: "Newsletter", Icon: Mail },
];

const THEME_KEY = "veritech_admin_theme";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("analytics");
  const [summary, setSummary] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "dark");

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    api.get("/admin/analytics/summary").then((r) => setSummary(r.data)).catch(() => {});
  }, [refreshKey]);

  const onLogout = () => {
    logout();
    toast.success("Signed out.");
    navigate("/admindata");
  };

  const refresh = () => {
    setRefreshKey((k) => k + 1);
    toast.success("Refreshed.");
  };

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const isLight = theme === "light";

  return (
    <div
      data-testid="admin-dashboard"
      data-theme={theme}
      className={`min-h-screen bg-[#050505] text-[#F4F4F5] ${isLight ? "admin-light" : ""}`}
    >
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 border border-white/20 grid place-items-center bg-[#0c0c0c]">
              <div className="h-2 w-2 bg-[#F55036]" />
            </div>
            <div>
              <div className="font-display text-base leading-none">Veritech<span className="text-[#F55036]">.AI</span></div>
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500 mt-1">Admin Console</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              data-testid="dashboard-theme-toggle"
              onClick={toggleTheme}
              className="h-9 w-9 grid place-items-center border border-white/15 hover:border-white/40 transition-colors"
              aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
              title={`Switch to ${isLight ? "dark" : "light"} mode`}
            >
              {isLight ? <Moon size={14} /> : <Sun size={14} />}
            </button>
            <button data-testid="dashboard-refresh" onClick={refresh} className="h-9 px-3 inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-sm transition-colors">
              <RefreshCw size={13} /> Refresh
            </button>
            <span className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              {user?.email}
            </span>
            <button data-testid="dashboard-logout" onClick={onLogout} className="h-9 px-3 inline-flex items-center gap-2 bg-[#F55036] hover:bg-[#E04830] text-black text-sm font-medium transition-colors">
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="mb-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-3">Overview</div>
          <h1 className="font-display text-3xl md:text-4xl tracking-tight">Dashboard</h1>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 mb-8">
          <Kpi label="Total Visits" value={summary?.total_visits ?? "—"} />
          <Kpi label="Unique Visitors" value={summary?.unique_visitors ?? "—"} />
          <Kpi label="Inquiries" value={summary?.total_inquiries ?? "—"} accent />
          <Kpi label="Conversion Rate" value={summary ? `${summary.conversion_rate_percent}%` : "—"} />
        </div>

        {/* Tabs */}
        <div className="border-b border-white/10 mb-8 flex gap-0 overflow-x-auto">
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              data-testid={`tab-${key}`}
              onClick={() => setTab(key)}
              className={`px-5 py-3 inline-flex items-center gap-2 text-sm border-b-2 transition-colors ${
                tab === key ? "border-[#F55036] text-white" : "border-transparent text-zinc-500 hover:text-white"
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {tab === "analytics" && <AnalyticsTab summary={summary} refreshKey={refreshKey} theme={theme} />}
        {tab === "inquiries" && <InquiriesTab refreshKey={refreshKey} />}
        {tab === "newsletter" && <NewsletterTab refreshKey={refreshKey} />}
      </main>
    </div>
  );
}

function Kpi({ label, value, accent }) {
  return (
    <div className="bg-[#0a0a0a] p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">{label}</div>
      <div className={`font-display text-3xl md:text-4xl tracking-tight mt-2 ${accent ? "text-[#F55036]" : ""}`}>{value}</div>
    </div>
  );
}
