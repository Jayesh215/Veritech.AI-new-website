import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { Download, FileSpreadsheet, Search, Eye } from "lucide-react";
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

export default function InquiriesTab({ refreshKey }) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/admin/inquiries")
      .then((r) => setItems(r.data.items || []))
      .catch(() => toast.error("Failed to load inquiries"))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) =>
      [it.name, it.email, it.company, it.service, it.message].some((v) => (v || "").toLowerCase().includes(s))
    );
  }, [items, q]);

  const exp = async (kind) => {
    try {
      const ext = kind;
      await downloadAuth(`/api/admin/export/inquiries.${ext}`, `veritech_inquiries.${ext}`);
      toast.success(`Exported ${ext.toUpperCase()}.`);
    } catch {
      toast.error("Export failed.");
    }
  };

  return (
    <div data-testid="inquiries-tab" className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            data-testid="inquiries-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, company, message…"
            className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-white/10 text-sm outline-none focus:border-[#F55036]"
          />
        </div>
        <div className="flex gap-2">
          <button data-testid="export-inquiries-csv" onClick={() => exp("csv")} className="h-10 px-4 inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-sm transition-colors">
            <Download size={13} /> CSV
          </button>
          <button data-testid="export-inquiries-xlsx" onClick={() => exp("xlsx")} className="h-10 px-4 inline-flex items-center gap-2 bg-[#F55036] hover:bg-[#E04830] text-black text-sm font-medium transition-colors">
            <FileSpreadsheet size={13} /> Excel
          </button>
        </div>
      </div>

      <div className="border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0c0c0c] border-b border-white/10">
                {["Name", "Email", "Company", "Service", "Date", ""].map((h) => (
                  <th key={h} className="text-left font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="text-center text-zinc-500 py-10">Loading…</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center text-zinc-500 py-10">No inquiries yet.</td></tr>
              )}
              {filtered.map((it) => (
                <tr key={it.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium">{it.name}</td>
                  <td className="px-4 py-3 text-zinc-300">{it.email}</td>
                  <td className="px-4 py-3 text-zinc-400">{it.company || "—"}</td>
                  <td className="px-4 py-3">
                    {it.service ? <span className="font-mono text-[10px] uppercase tracking-[0.18em] border border-white/10 px-2 py-1">{it.service}</span> : "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">{fmtDate(it.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setSelected(it)} className="text-zinc-400 hover:text-[#F55036] inline-flex items-center gap-1.5 text-xs">
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div onClick={() => setSelected(null)} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-6">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl border border-white/10 bg-[#0a0a0a] p-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-3">Inquiry</div>
            <h3 className="font-display text-2xl tracking-tight">{selected.name}</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <Field label="Email" value={selected.email} />
              <Field label="Company" value={selected.company || "—"} />
              <Field label="Service" value={selected.service || "—"} />
              <Field label="Date" value={fmtDate(selected.created_at)} />
            </div>
            <div className="mt-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Message</div>
              <div className="border border-white/10 bg-black/40 p-4 text-sm text-zinc-200 whitespace-pre-wrap">
                {selected.message}
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button onClick={() => setSelected(null)} className="border border-white/15 px-4 py-2 text-sm hover:border-white/40">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">{label}</div>
      <div className="text-sm text-zinc-200 mt-1 break-all">{value}</div>
    </div>
  );
}
