import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { Eye, Trash2, Search, ExternalLink, X, ArrowLeft, Mail, Phone, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { DeleteConfirm } from "./InquiriesTab";

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export default function ApplicationsTab({ refreshKey, filterJob, onClearFilter }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [picks, setPicks] = useState(new Set());
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [internalKey, setInternalKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    setPicks(new Set());
    const url = filterJob ? `/admin/jobs/${filterJob.id}/applications` : "/admin/applications";
    api.get(url).then((r) => setItems(r.data.items || [])).catch(() => toast.error("Failed to load applications")).finally(() => setLoading(false));
  }, [refreshKey, internalKey, filterJob]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) => [it.name, it.email, it.phone, it.job_title, it.cover_letter].some((v) => (v || "").toLowerCase().includes(s)));
  }, [items, q]);

  const allChecked = filtered.length > 0 && filtered.every((it) => picks.has(it.id));
  const someChecked = picks.size > 0 && !allChecked;
  const toggle = (id) => setPicks((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => { if (allChecked) setPicks(new Set()); else setPicks(new Set(filtered.map((it) => it.id))); };

  const doDelete = async () => {
    if (!confirm) return;
    try {
      const body = confirm.all ? { all: true } : { ids: Array.from(confirm.ids) };
      const { data } = await api.post("/admin/applications/delete", body);
      toast.success(`Deleted ${data.deleted} application${data.deleted === 1 ? "" : "s"}.`);
      setConfirm(null);
      setPicks(new Set());
      setInternalKey((k) => k + 1);
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <div data-testid="applications-tab" className="space-y-6">
      {filterJob && (
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={onClearFilter} className="text-sm text-zinc-400 hover:text-white inline-flex items-center gap-2">
            <ArrowLeft size={13} /> All applications
          </button>
          <span className="text-zinc-700">/</span>
          <span className="font-display text-base">{filterJob.title}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">{items.length} applicant{items.length === 1 ? "" : "s"}</span>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, role, cover letter…"
            className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-white/10 text-sm outline-none focus:border-[#F55036]"
          />
        </div>
      </div>

      {picks.size > 0 && (
        <div className="flex items-center justify-between border border-[#F55036]/40 bg-[#F55036]/[0.06] px-4 py-3">
          <div className="text-sm"><span className="font-medium">{picks.size}</span> selected</div>
          <div className="flex gap-2">
            <button onClick={() => setPicks(new Set())} className="px-3 py-2 inline-flex items-center gap-2 border border-white/15 text-xs hover:border-white/40 transition-colors">
              <X size={12} /> Clear
            </button>
            <button onClick={() => setConfirm({ ids: new Set(picks), count: picks.size })} className="px-3 py-2 inline-flex items-center gap-2 bg-red-500/90 hover:bg-red-500 text-white text-xs font-medium transition-colors">
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
                  <input type="checkbox" checked={allChecked} ref={(el) => el && (el.indeterminate = someChecked)} onChange={toggleAll} className="accent-[#F55036] cursor-pointer" />
                </th>
                {["Applicant", "Email", "Role", "Phone", "Date", ""].map((h) => (
                  <th key={h} className="text-left font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} className="text-center text-zinc-500 py-10">Loading…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={7} className="text-center text-zinc-500 py-10">No applications yet.</td></tr>}
              {filtered.map((it) => (
                <tr key={it.id} className={`border-b border-white/5 hover:bg-white/[0.02] ${picks.has(it.id) ? "bg-[#F55036]/[0.04]" : ""}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={picks.has(it.id)} onChange={() => toggle(it.id)} className="accent-[#F55036] cursor-pointer" />
                  </td>
                  <td className="px-4 py-3 font-medium">{it.name}</td>
                  <td className="px-4 py-3 text-zinc-300">{it.email}</td>
                  <td className="px-4 py-3 text-zinc-400">{it.job_title || "—"}</td>
                  <td className="px-4 py-3 text-zinc-400">{it.phone || "—"}</td>
                  <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">{fmtDate(it.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-3">
                      <button onClick={() => setSelected(it)} className="text-zinc-400 hover:text-[#F55036] inline-flex items-center gap-1.5 text-xs">
                        <Eye size={12} /> View
                      </button>
                      <button onClick={() => setConfirm({ ids: new Set([it.id]), count: 1, name: it.name })} className="text-zinc-400 hover:text-red-400 inline-flex items-center gap-1.5 text-xs">
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

      {selected && (
        <div onClick={() => setSelected(null)} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-6 overflow-y-auto">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl border border-white/10 bg-[#0a0a0a] p-8 md:p-10 my-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-3">Application</div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="font-display text-2xl tracking-tight">{selected.name}</h3>
                <div className="text-sm text-zinc-400 mt-1">for <span className="text-white">{selected.job_title || "—"}</span></div>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">{fmtDate(selected.created_at)}</span>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ContactRow Icon={Mail} label="Email" value={<a className="text-[#F55036] hover:underline break-all" href={`mailto:${selected.email}`}>{selected.email}</a>} />
              <ContactRow Icon={Phone} label="Phone" value={selected.phone || "—"} />
              <ContactRow Icon={Linkedin} label="LinkedIn" value={selected.linkedin ? <a className="text-[#F55036] hover:underline break-all" href={selected.linkedin} target="_blank" rel="noopener noreferrer">{selected.linkedin} <ExternalLink size={10} className="inline" /></a> : "—"} />
              <ContactRow Icon={ExternalLink} label="Resume / Portfolio" value={selected.resume_url ? <a className="text-[#F55036] hover:underline break-all" href={selected.resume_url} target="_blank" rel="noopener noreferrer">Open link <ExternalLink size={10} className="inline" /></a> : "—"} />
            </div>

            <div className="mt-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Cover letter</div>
              <div className="border border-white/10 bg-black/40 p-4 text-sm text-zinc-200 whitespace-pre-wrap min-h-[80px]">
                {selected.cover_letter || <span className="text-zinc-600">No cover letter provided.</span>}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <a href={`mailto:${selected.email}`} className="border border-white/15 px-4 py-2 text-sm hover:border-white/40 inline-flex items-center gap-2">
                <Mail size={12} /> Email applicant
              </a>
              <button onClick={() => setSelected(null)} className="border border-white/15 px-4 py-2 text-sm hover:border-white/40">Close</button>
            </div>
          </div>
        </div>
      )}

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

function ContactRow({ Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 grid place-items-center border border-white/10 bg-[#0c0c0c] shrink-0">
        <Icon size={12} strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">{label}</div>
        <div className="text-sm text-zinc-200 mt-1 break-all">{value}</div>
      </div>
    </div>
  );
}
