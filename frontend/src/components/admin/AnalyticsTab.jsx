import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Clock, Users, Eye, TrendingUp, Calendar } from "lucide-react";

function fmtDuration(seconds) {
  if (!seconds) return "0s";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

const darkTooltip = {
  background: "#0a0a0a",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 0,
  fontSize: 12,
  fontFamily: "JetBrains Mono, monospace",
};
const lightTooltip = {
  background: "#ffffff",
  border: "1px solid rgba(0,0,0,0.1)",
  borderRadius: 0,
  fontSize: 12,
  fontFamily: "JetBrains Mono, monospace",
  color: "#18181b",
};

const RANGE_PRESETS = [
  { key: "today", label: "Today", days: 1, chartDays: 7 },
  { key: "7d", label: "7 days", days: 7, chartDays: 14 },
  { key: "30d", label: "30 days", days: 30, chartDays: 30 },
  { key: "90d", label: "90 days", days: 90, chartDays: 90 },
  { key: "all", label: "All time", days: null, chartDays: 30 },
  { key: "custom", label: "Custom", days: null, chartDays: 30 },
];

function isoStartOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString();
}
function isoEndOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x.toISOString();
}
function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
function dateMinusDays(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export default function AnalyticsTab({ summary: initialSummary, refreshKey, theme = "dark" }) {
  const [series, setSeries] = useState([]);
  const [summary, setSummary] = useState(initialSummary);
  const [range, setRange] = useState("7d");
  const [customFrom, setCustomFrom] = useState(dateMinusDays(7));
  const [customTo, setCustomTo] = useState(todayStr());

  const isLight = theme === "light";
  const axisColor = isLight ? "#71717a" : "#52525b";
  const gridColor = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";
  const tooltipStyle = isLight ? lightTooltip : darkTooltip;

  const { fromIso, toIso, chartDays } = useMemo(() => {
    const preset = RANGE_PRESETS.find((p) => p.key === range);
    if (range === "custom") {
      return {
        fromIso: isoStartOfDay(customFrom),
        toIso: isoEndOfDay(customTo),
        chartDays: 30,
      };
    }
    if (range === "today") {
      return { fromIso: isoStartOfDay(new Date()), toIso: isoEndOfDay(new Date()), chartDays: 7 };
    }
    if (range === "all" || !preset?.days) {
      return { fromIso: null, toIso: null, chartDays: preset?.chartDays || 30 };
    }
    return {
      fromIso: isoStartOfDay(dateMinusDays(preset.days - 1)),
      toIso: isoEndOfDay(new Date()),
      chartDays: preset.chartDays,
    };
  }, [range, customFrom, customTo]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (fromIso) params.set("from", fromIso);
    if (toIso) params.set("to", toIso);
    api.get(`/admin/analytics/summary${params.toString() ? `?${params}` : ""}`).then((r) => setSummary(r.data)).catch(() => {});
    api.get(`/admin/analytics/timeseries?days=${chartDays}`).then((r) => setSeries(r.data.series || [])).catch(() => {});
  }, [fromIso, toIso, chartDays, refreshKey]);

  return (
    <div data-testid="analytics-tab" className="space-y-8">
      {/* Date Range Filters */}
      <div className="border border-white/10 bg-[#0a0a0a] p-4 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mr-2">
          <Calendar size={12} /> Range
        </div>
        <div className="flex flex-wrap gap-1.5">
          {RANGE_PRESETS.map((p) => (
            <button
              key={p.key}
              data-testid={`range-${p.key}`}
              onClick={() => setRange(p.key)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-[0.16em] border transition-colors ${
                range === p.key
                  ? "border-[#F55036] bg-[#F55036] text-black"
                  : "border-white/15 hover:border-white/40 text-zinc-300"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        {range === "custom" && (
          <div className="flex items-center gap-2 ml-auto">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="bg-[#0c0c0c] border border-white/15 px-3 py-1.5 text-xs outline-none focus:border-[#F55036]"
            />
            <span className="text-zinc-500 text-xs">→</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="bg-[#0c0c0c] border border-white/15 px-3 py-1.5 text-xs outline-none focus:border-[#F55036]"
            />
          </div>
        )}
      </div>

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
              <h3 className="font-display text-xl tracking-tight mt-1">Visits — last {chartDays} days</h3>
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
                <CartesianGrid stroke={gridColor} />
                <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} stroke={axisColor} fontSize={11} />
                <YAxis stroke={axisColor} fontSize={11} allowDecimals={false} />
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
            <h3 className="font-display text-xl tracking-tight mt-1">Inquiries — last {chartDays} days</h3>
          </div>
        </div>
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke={gridColor} />
              <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} stroke={axisColor} fontSize={11} />
              <YAxis stroke={axisColor} fontSize={11} allowDecimals={false} />
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
