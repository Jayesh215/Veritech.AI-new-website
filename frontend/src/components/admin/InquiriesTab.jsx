import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { Download, FileSpreadsheet, Search, Eye, Trash2, X, AlertTriangle } from "lucide-react";
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
  const [picks, setPicks] = useState(new Set());
  const [confirm, setConfirm] = useState(null); // { ids, all }
  const [internalKey, setInternalKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    setPicks(new Set());
    api
      .get("/admin/inquiries")
      .then((r) => setItems(r.data.items || []))
      .catch(() => toast.error("Failed to load inquiries"))
      .finally(() => setLoading(false));
  }, [refreshKey, internalKey]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) =>
      [it.name, it.email, it.company, it.service, it.message].some((v) => (v || "").toLowerCase().includes(s))
    );
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
      await downloadAuth(`/api/admin/export/inquiries.${kind}`, `veritech_inquiries.${kind}`);
      toast.success(`Exported ${kind.toUpperCase()}.`);
    } catch {
      toast.error("Export failed.");
    }
  };

  const doDelete = async () => {
    if (!confirm) return;
    try {
      const body = confirm.all ? { all: true } : { ids: Array.from(confirm.ids) };
      const { data } = await api.post("/admin/inquiries/delete", body);
      toast.success(`Deleted ${data.deleted} inquir${data.deleted === 1 ? "y" : "ies"}.`);
      setPicks(new Set());
      setConfirm(null);
      setInternalKey((k) => k + 1);
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <div data-testid="inquiries-tab" className="space-y-6">
      {/* Toolbar */}
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
        <div className="flex gap-2 flex-wrap">
          <button
            data-testid="delete-all-inquiries"
            onClick={() => setConfirm({ all: true, count: items.length })}
            disabled={items.length === 0}
            className="h-10 px-4 inline-flex items-center gap-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Delete ALL inquiries"
          >
            <Trash2 size={13} /> Clear All
          </button>
          <button data-testid="export-inquiries-csv" onClick={() => exp("csv")} className="h-10 px-4 inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-sm transition-colors">
            <Download size={13} /> CSV
          </button>
          <button data-testid="export-inquiries-xlsx" onClick={() => exp("xlsx")} className="h-10 px-4 inline-flex items-center gap-2 bg-[#F55036] hover:bg-[#E04830] text-black text-sm font-medium transition-colors">
            <FileSpreadsheet size={13} /> Excel
          </button>
        </div>
      </div>

      {/* Bulk action bar */}
      {picks.size > 0 && (
        <div className="flex items-center justify-between border border-[#F55036]/40 bg-[#F55036]/[0.06] px-4 py-3">
          <div className="text-sm">
            <span className="font-medium">{picks.size}</span> selected
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPicks(new Set())}
              className="px-3 py-2 inline-flex items-center gap-2 border border-white/15 text-xs hover:border-white/40 transition-colors"
            >
              <X size={12} /> Clear
            </button>
            <button
              data-testid="bulk-delete-inquiries"
              onClick={() => setConfirm({ ids: new Set(picks), count: picks.size })}
              className="px-3 py-2 inline-flex items-center gap-2 bg-red-500/90 hover:bg-red-500 text-white text-xs font-medium transition-colors"
            >
              <Trash2 size={12} /> Delete selected
            </button>
          </div>
        </div>
      )}

      {/* Table */}
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
                {["Name", "Email", "Company", "Service", "Date", ""].map((h) => (
                  <th key={h} className="text-left font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="text-center text-zinc-500 py-10">Loading…</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center text-zinc-500 py-10">No inquiries yet.</td></tr>
              )}
              {filtered.map((it) => (
                <tr key={it.id} className={`border-b border-white/5 hover:bg-white/[0.02] ${picks.has(it.id) ? "bg-[#F55036]/[0.04]" : ""}`}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={picks.has(it.id)}
                      onChange={() => toggle(it.id)}
                      aria-label={`Select ${it.name}`}
                      className="accent-[#F55036] cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{it.name}</td>
                  <td className="px-4 py-3 text-zinc-300">{it.email}</td>
                  <td className="px-4 py-3 text-zinc-400">{it.company || "—"}</td>
                  <td className="px-4 py-3">
                    {it.service ? <span className="font-mono text-[10px] uppercase tracking-[0.18em] border border-white/10 px-2 py-1">{it.service}</span> : "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">{fmtDate(it.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-3">
                      <button onClick={() => setSelected(it)} className="text-zinc-400 hover:text-[#F55036] inline-flex items-center gap-1.5 text-xs">
                        <Eye size={12} /> View
                      </button>
                      <button
                        onClick={() => setConfirm({ ids: new Set([it.id]), count: 1, name: it.name })}
                        className="text-zinc-400 hover:text-red-400 inline-flex items-center gap-1.5 text-xs"
                        aria-label="Delete inquiry"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View modal */}
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

      {/* Confirm delete modal */}
      {confirm && (
        <DeleteConfirm
          confirm={confirm}
          label="inquir"
          onCancel={() => setConfirm(null)}
          onConfirm={doDelete}
        />
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

export function DeleteConfirm({ confirm, label, onCancel, onConfirm }) {
  const isAll = !!confirm.all;
  const noun = label === "inquir" ? (confirm.count === 1 ? "inquiry" : "inquiries") : (confirm.count === 1 ? "subscriber" : "subscribers");
  return (
    <div onClick={onCancel} data-testid="delete-confirm" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-6">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md border border-red-500/30 bg-[#0a0a0a] p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 grid place-items-center border border-red-500/40 bg-red-500/10">
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-400">
            {isAll ? "Destructive action" : "Confirm delete"}
          </div>
        </div>
        <h3 className="font-display text-xl tracking-tight">
          {isAll ? `Delete all ${noun}?` : `Delete ${confirm.count} ${noun}?`}
        </h3>
        <p className="text-sm text-zinc-400 mt-3">
          {isAll
            ? `This will permanently remove all ${confirm.count} ${noun} from the database. This action cannot be undone.`
            : confirm.name
              ? `"${confirm.name}" will be permanently deleted. This cannot be undone.`
              : `${confirm.count} ${noun} will be permanently deleted. This cannot be undone.`}
        </p>
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onCancel}
            data-testid="delete-cancel"
            className="px-4 py-2 border border-white/15 text-sm hover:border-white/40 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            data-testid="delete-confirm-btn"
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors"
          >
            <Trash2 size={13} /> {isAll ? "Delete everything" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
