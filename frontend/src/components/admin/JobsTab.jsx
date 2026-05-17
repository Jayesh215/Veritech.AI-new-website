import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, ChevronRight, Inbox, Loader2 } from "lucide-react";
import { toast } from "sonner";

const TYPES = ["Full-time", "Part-time", "Internship", "Contract"];

export default function JobsTab({ refreshKey, onViewApplications }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // job object or null
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [internalKey, setInternalKey] = useState(0);

  const reload = () => setInternalKey((k) => k + 1);

  useEffect(() => {
    setLoading(true);
    api.get("/admin/jobs").then((r) => setJobs(r.data.items || [])).catch(() => toast.error("Failed to load jobs")).finally(() => setLoading(false));
  }, [refreshKey, internalKey]);

  const togglePublish = async (job) => {
    try {
      await api.patch(`/admin/jobs/${job.id}`, { is_published: !job.is_published });
      toast.success(job.is_published ? "Unpublished." : "Published.");
      reload();
    } catch {
      toast.error("Update failed.");
    }
  };

  const doDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/admin/jobs/${deletingId}`);
      toast.success("Role deleted.");
      setDeletingId(null);
      reload();
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <div data-testid="jobs-tab" className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">{jobs.length} roles</div>
        </div>
        <button
          data-testid="create-job-btn"
          onClick={() => setCreating(true)}
          className="h-10 px-4 inline-flex items-center gap-2 bg-[#F55036] hover:bg-[#E04830] text-black text-sm font-medium transition-colors"
        >
          <Plus size={14} /> New role
        </button>
      </div>

      <div className="border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0c0c0c] border-b border-white/10">
                {["Title", "Department", "Type", "Location", "Status", "Applications", "Created", ""].map((h) => (
                  <th key={h} className="text-left font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={8} className="text-center text-zinc-500 py-10">Loading…</td></tr>}
              {!loading && jobs.length === 0 && <tr><td colSpan={8} className="text-center text-zinc-500 py-10">No roles yet. Create your first one.</td></tr>}
              {jobs.map((j) => (
                <tr key={j.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium">{j.title}</td>
                  <td className="px-4 py-3 text-zinc-400">{j.department}</td>
                  <td className="px-4 py-3"><span className="font-mono text-[10px] uppercase tracking-[0.18em] border border-white/10 px-2 py-1">{j.type}</span></td>
                  <td className="px-4 py-3 text-zinc-400">{j.location}</td>
                  <td className="px-4 py-3">
                    {j.is_published ? (
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400">
                        <span className="h-1.5 w-1.5 bg-emerald-400 pulse-dot" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                        <span className="h-1.5 w-1.5 bg-zinc-500" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onViewApplications?.(j)}
                      className="inline-flex items-center gap-1.5 text-[#F55036] hover:underline text-sm"
                    >
                      <Inbox size={12} /> {j.application_count || 0}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">{new Date(j.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => togglePublish(j)}
                        title={j.is_published ? "Unpublish" : "Publish"}
                        className="h-8 w-8 grid place-items-center border border-white/10 hover:border-white/40 text-zinc-400 hover:text-white transition-colors"
                      >
                        {j.is_published ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                      <button
                        onClick={() => setEditing(j)}
                        title="Edit"
                        className="h-8 w-8 grid place-items-center border border-white/10 hover:border-white/40 text-zinc-400 hover:text-white transition-colors"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => setDeletingId(j.id)}
                        title="Delete"
                        className="h-8 w-8 grid place-items-center border border-white/10 hover:border-red-400 text-zinc-400 hover:text-red-400 transition-colors"
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

      {(creating || editing) && (
        <JobFormModal
          job={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); reload(); }}
        />
      )}

      {deletingId && (
        <div onClick={() => setDeletingId(null)} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-6">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md border border-red-500/30 bg-[#0a0a0a] p-8">
            <h3 className="font-display text-xl tracking-tight">Delete this role?</h3>
            <p className="text-sm text-zinc-400 mt-3">
              The role will be permanently removed. Existing applications for it are retained for your records.
            </p>
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setDeletingId(null)} className="px-4 py-2 border border-white/15 text-sm hover:border-white/40">Cancel</button>
              <button onClick={doDelete} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium inline-flex items-center gap-2">
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function JobFormModal({ job, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({
    title: job?.title || "",
    department: job?.department || "",
    type: job?.type || "Full-time",
    location: job?.location || "Remote",
    description: job?.description || "",
    requirements: (job?.requirements || []).join("\n"),
    tags: (job?.tags || []).join(", "),
    is_published: job?.is_published ?? true,
  }));
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.department || !form.description) {
      return toast.error("Title, department, and description are required.");
    }
    setLoading(true);
    const body = {
      title: form.title.trim(),
      department: form.department.trim(),
      type: form.type,
      location: form.location.trim(),
      description: form.description.trim(),
      requirements: form.requirements.split("\n").map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      is_published: form.is_published,
    };
    try {
      if (job) await api.patch(`/admin/jobs/${job.id}`, body);
      else await api.post(`/admin/jobs`, body);
      toast.success(job ? "Role updated." : "Role published.");
      onSaved?.();
    } catch (err) {
      toast.error("Save failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto p-6">
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="w-full max-w-2xl mx-auto bg-[#0a0a0a] border border-white/10 p-8 md:p-10 my-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036]">{job ? "Edit role" : "New role"}</div>
            <h3 className="font-display text-2xl tracking-tight mt-1">{job ? job.title : "Create a new opening"}</h3>
          </div>
          <button type="button" onClick={onClose} className="h-9 w-9 grid place-items-center border border-white/15 hover:border-white/40">
            <X size={14} />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Title" required>
            <input value={form.title} onChange={set("title")} className="input-line" placeholder="Senior Frontend Engineer" required />
          </Field>
          <Field label="Department" required>
            <input value={form.department} onChange={set("department")} className="input-line" placeholder="Product Engineering" required />
          </Field>
          <Field label="Type">
            <select value={form.type} onChange={set("type")} className="input-line">
              {TYPES.map((t) => <option key={t} value={t} className="bg-[#0a0a0a]">{t}</option>)}
            </select>
          </Field>
          <Field label="Location">
            <input value={form.location} onChange={set("location")} className="input-line" placeholder="Remote · India" />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Description" required>
            <textarea rows={5} value={form.description} onChange={set("description")} className="input-line resize-none" placeholder="What the role entails…" required />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Requirements (one per line)">
            <textarea rows={4} value={form.requirements} onChange={set("requirements")} className="input-line resize-none" placeholder="3+ years React&#10;Strong TypeScript&#10;…" />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Tags (comma-separated)">
            <input value={form.tags} onChange={set("tags")} className="input-line" placeholder="React, TypeScript, Remote" />
          </Field>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} className="accent-[#F55036]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
              {form.is_published ? "Publish immediately" : "Save as draft"}
            </span>
          </label>
        </div>

        <div className="mt-10 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-white/15 text-sm hover:border-white/40">Cancel</button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-[#F55036] hover:bg-[#E04830] text-black text-sm font-medium inline-flex items-center gap-2 disabled:opacity-60">
            {loading ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : <>{job ? "Save changes" : "Create role"}</>}
          </button>
        </div>

        <style>{`
          .input-line { width:100%; background:transparent; border:none; border-bottom:1px solid #27272a; padding:10px 0; color:#f4f4f5; font-family:inherit; font-size:14px; outline:none; transition:border-color 200ms ease; }
          .input-line::placeholder { color:#52525b; }
          .input-line:focus { border-bottom-color:#F55036; }
          select.input-line { appearance:none; cursor:pointer; }
        `}</style>
      </form>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1">
        {label} {required && <span className="text-[#F55036]">*</span>}
      </div>
      {children}
    </label>
  );
}
