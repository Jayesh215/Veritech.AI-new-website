import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { Download, FileSpreadsheet, Search } from "lucide-react";
import { toast } from "sonner";

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

async function downloadAuth(url, filename) {
  const token = localStorage.getItem("veritech_admin_token");
  const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Export failed");
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

export default function NewsletterTab({ refreshKey }) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/admin/newsletter")
      .then((r) => setItems(r.data.items || []))
      .catch(() => toast.error("Failed to load subscribers"))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) => (it.email || "").toLowerCase().includes(s));
  }, [items, q]);

  const exp = async (kind) => {
    try {
      await downloadAuth(`/api/admin/export/newsletter.${kind}`, `veritech_newsletter.${kind}`);
      toast.success(`Exported ${kind.toUpperCase()}.`);
    } catch {
      toast.error("Export failed.");
    }
  };

  return (
    <div data-testid="newsletter-tab" className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search email…"
            className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-white/10 text-sm outline-none focus:border-[#F55036]"
          />
        </div>
        <div className="flex gap-2">
          <button data-testid="export-newsletter-csv" onClick={() => exp("csv")} className="h-10 px-4 inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-sm transition-colors">
            <Download size={13} /> CSV
          </button>
          <button data-testid="export-newsletter-xlsx" onClick={() => exp("xlsx")} className="h-10 px-4 inline-flex items-center gap-2 bg-[#F55036] hover:bg-[#E04830] text-black text-sm font-medium transition-colors">
            <FileSpreadsheet size={13} /> Excel
          </button>
        </div>
      </div>

      <div className="border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0c0c0c] border-b border-white/10">
                {["Email", "Subscribed At"].map((h) => (
                  <th key={h} className="text-left font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={2} className="text-center text-zinc-500 py-10">Loading…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={2} className="text-center text-zinc-500 py-10">No subscribers yet.</td></tr>}
              {filtered.map((it) => (
                <tr key={it.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-zinc-200">{it.email}</td>
                  <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">{fmtDate(it.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
