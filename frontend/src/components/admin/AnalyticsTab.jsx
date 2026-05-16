import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Clock, Users, Eye, TrendingUp } from "lucide-react";

function fmtDuration(seconds) {
  if (!seconds) return "0s";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

const tooltipStyle = {
  background: "#0a0a0a",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 0,
  fontSize: 12,
  fontFamily: "JetBrains Mono, monospace",
};

export default function AnalyticsTab({ summary, refreshKey }) {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    api.get("/admin/analytics/timeseries?days=14").then((r) => setSeries(r.data.series || [])).catch(() => {});
  }, [refreshKey]);

  return (
    <div data-testid="analytics-tab" className="space-y-8">
      {/* Secondary KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
        <SecondaryKpi Icon={Eye} label="Today" value={summary?.today_visits ?? "—"} />
        <SecondaryKpi Icon={Users} label="Week" value={summary?.week_visits ?? "—"} />
        <SecondaryKpi Icon={TrendingUp} label="Month" value={summary?.month_visits ?? "—"} />
        <SecondaryKpi Icon={Clock} label="Avg Session" value={summary ? fmtDuration(summary.avg_session_duration_seconds) : "—"} />
      </div>

      <div className="grid lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
        {/* Visits chart */}
        <div className="lg:col-span-2 bg-[#0a0a0a] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036]">Traffic</div>
              <h3 className="font-display text-xl tracking-tight mt-1">Visits — last 14 days</h3>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              {summary?.realtime_visitors ?? 0} live now
            </span>
          </div>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <AreaChart data={series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F55036" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#F55036" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} stroke="#52525b" fontSize={11} />
                <YAxis stroke="#52525b" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#F55036", strokeOpacity: 0.3 }} />
                <Area type="monotone" dataKey="visits" stroke="#F55036" strokeWidth={2} fill="url(#gVisits)" />
                <Area type="monotone" dataKey="unique_visitors" stroke="#FFA07A" strokeWidth={1.5} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top pages */}
        <div className="bg-[#0a0a0a] p-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036]">Top pages</div>
          <h3 className="font-display text-xl tracking-tight mt-1 mb-6">Most viewed</h3>
          <ul className="space-y-3">
            {(summary?.top_pages || []).map((p) => (
              <li key={p.path} className="flex items-center justify-between text-sm border-b border-white/5 pb-2">
                <span className="font-mono text-xs text-zinc-300 truncate max-w-[60%]">{p.path}</span>
                <span className="font-display text-base">{p.visits}</span>
              </li>
            ))}
            {(!summary || (summary.top_pages || []).length === 0) && (
              <li className="text-sm text-zinc-500">No visits yet.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Inquiries chart */}
      <div className="border border-white/10 bg-[#0a0a0a] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036]">Conversions</div>
            <h3 className="font-display text-xl tracking-tight mt-1">Inquiries — last 14 days</h3>
          </div>
        </div>
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} stroke="#52525b" fontSize={11} />
              <YAxis stroke="#52525b" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(245,80,54,0.08)" }} />
              <Bar dataKey="inquiries" fill="#F55036" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function SecondaryKpi({ Icon, label, value }) {
  return (
    <div className="bg-[#0a0a0a] p-5 flex items-start gap-3">
      <div className="h-9 w-9 grid place-items-center border border-white/10 bg-[#0c0c0c]">
        <Icon size={14} strokeWidth={1.5} className="text-[#F55036]" />
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">{label}</div>
        <div className="font-display text-xl tracking-tight mt-1">{value}</div>
      </div>
    </div>
  );
}
