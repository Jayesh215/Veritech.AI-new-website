import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { Download, FileSpreadsheet, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { DeleteConfirm } from "./InquiriesTab";

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
  const [picks, setPicks] = useState(new Set());
  const [confirm, setConfirm] = useState(null);
  const [internalKey, setInternalKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    setPicks(new Set());
    api
      .get("/admin/newsletter")
      .then((r) => setItems(r.data.items || []))
      .catch(() => toast.error("Failed to load subscribers"))
      .finally(() => setLoading(false));
  }, [refreshKey, internalKey]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) => (it.email || "").toLowerCase().includes(s));
  }, [items, q]);

  const allChecked = filtered.length > 0 && filtered.every((it) => picks.has(it.id));
  const someChecked = picks.size > 0 && !allChecked;

  const toggle = (id) => {
    setPicks((p) => {
      const next = new Set(p);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllVisible = () => {
    if (allChecked) setPicks(new Set());
    else setPicks(new Set(filtered.map((it) => it.id)));
  };

  const exp = async (kind) => {
    try {
      await downloadAuth(`/api/admin/export/newsletter.${kind}`, `veritech_newsletter.${kind}`);
      toast.success(`Exported ${kind.toUpperCase()}.`);
    } catch {
      toast.error("Export failed.");
    }
  };

  const doDelete = async () => {
    if (!confirm) return;
    try {
      const body = confirm.all ? { all: true } : { ids: Array.from(confirm.ids) };
      const { data } = await api.post("/admin/newsletter/delete", body);
      toast.success(`Deleted ${data.deleted} subscriber${data.deleted === 1 ? "" : "s"}.`);
      setPicks(new Set());
      setConfirm(null);
      setInternalKey((k) => k + 1);
    } catch {
      toast.error("Delete failed.");
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
        <div className="flex gap-2 flex-wrap">
          <button
            data-testid="delete-all-newsletter"
            onClick={() => setConfirm({ all: true, count: items.length })}
            disabled={items.length === 0}
            className="h-10 px-4 inline-flex items-center gap-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 size={13} /> Clear All
          </button>
          <button data-testid="export-newsletter-csv" onClick={() => exp("csv")} className="h-10 px-4 inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-sm transition-colors">
            <Download size={13} /> CSV
          </button>
          <button data-testid="export-newsletter-xlsx" onClick={() => exp("xlsx")} className="h-10 px-4 inline-flex items-center gap-2 bg-[#F55036] hover:bg-[#E04830] text-black text-sm font-medium transition-colors">
            <FileSpreadsheet size={13} /> Excel
          </button>
        </div>
      </div>

      {picks.size > 0 && (
        <div className="flex items-center justify-between border border-[#F55036]/40 bg-[#F55036]/[0.06] px-4 py-3">
          <div className="text-sm"><span className="font-medium">{picks.size}</span> selected</div>
          <div className="flex gap-2">
            <button onClick={() => setPicks(new Set())} className="px-3 py-2 inline-flex items-center gap-2 border border-white/15 text-xs hover:border-white/40 transition-colors">
              <X size={12} /> Clear
            </button>
            <button
              data-testid="bulk-delete-newsletter"
              onClick={() => setConfirm({ ids: new Set(picks), count: picks.size })}
              className="px-3 py-2 inline-flex items-center gap-2 bg-red-500/90 hover:bg-red-500 text-white text-xs font-medium transition-colors"
            >
              <Trash2 size={12} /> Delete selected
            </button>
          </div>
        </div>
      )}

      <div className="border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0c0c0c] border-b border-white/10">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    ref={(el) => el && (el.indeterminate = someChecked)}
                    onChange={toggleAllVisible}
                    aria-label="Select all"
                    className="accent-[#F55036] cursor-pointer"
                  />
                </th>
                {["Email", "Subscribed At", ""].map((h) => (
                  <th key={h} className="text-left font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={4} className="text-center text-zinc-500 py-10">Loading…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={4} className="text-center text-zinc-500 py-10">No subscribers yet.</td></tr>}
              {filtered.map((it) => (
                <tr key={it.id} className={`border-b border-white/5 hover:bg-white/[0.02] ${picks.has(it.id) ? "bg-[#F55036]/[0.04]" : ""}`}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={picks.has(it.id)}
                      onChange={() => toggle(it.id)}
                      aria-label={`Select ${it.email}`}
                      className="accent-[#F55036] cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 text-zinc-200">{it.email}</td>
                  <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">{fmtDate(it.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setConfirm({ ids: new Set([it.id]), count: 1, name: it.email })}
                      className="text-zinc-400 hover:text-red-400 inline-flex items-center gap-1.5 text-xs"
                      aria-label="Delete subscriber"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {confirm && (
        <DeleteConfirm
          confirm={confirm}
          label="newsletter"
          onCancel={() => setConfirm(null)}
          onConfirm={doDelete}
        />
      )}
    </div>
  );
}
