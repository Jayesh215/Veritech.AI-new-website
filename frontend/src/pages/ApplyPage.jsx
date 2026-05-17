import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Clock, Upload, FileText, X, ArrowLeft, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ApplyPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", cover_letter: "" });
  const [resume, setResume] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API}/jobs/${jobId}`)
      .then((r) => setJob(r.data))
      .catch(() => toast.error("Job not found or no longer published."))
      .finally(() => setLoadingJob(false));
  }, [jobId]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onPickFile = (file) => {
    if (!file) return;
    const ok = [".pdf", ".doc", ".docx"].some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!ok) return toast.error("Resume must be a PDF, DOC, or DOCX file.");
    if (file.size > 5 * 1024 * 1024) return toast.error("Resume must be under 5 MB.");
    setResume(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required.");
    if (!form.email.trim()) return toast.error("Email is required.");
    // Basic email shape check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return toast.error("Please enter a valid email address.");

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("job_id", jobId);
      fd.append("name", form.name.trim());
      fd.append("email", form.email.trim());
      if (form.phone) fd.append("phone", form.phone);
      if (form.cover_letter) fd.append("cover_letter", form.cover_letter);
      if (resume) fd.append("resume", resume);
      await axios.post(`${API}/applications`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSubmitted(true);
      toast.success("Application submitted.");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const msg = typeof detail === "string" ? detail :
        Array.isArray(detail) ? (detail[0]?.msg || "Please check the form and try again.") :
        "Submission failed. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingJob) {
    return (
      <div className="min-h-screen bg-[#050505] text-zinc-500 grid place-items-center font-mono text-xs uppercase tracking-[0.2em]">
        Loading role…
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#F4F4F5] grid place-items-center p-6">
        <div className="text-center max-w-md">
          <h1 className="font-display text-3xl tracking-tight">Role not available</h1>
          <p className="text-zinc-400 mt-3">This role isn't published or no longer exists.</p>
          <Link to="/careers" className="mt-6 inline-flex items-center gap-2 bg-[#F55036] hover:bg-[#E04830] text-black px-5 py-3 font-medium">
            <ArrowLeft size={14} /> Back to all openings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="apply-page" className="min-h-screen bg-[#050505] text-[#F4F4F5]">
      <header className="relative pt-24 pb-10 md:pt-32 md:pb-14 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-grid radial-fade pointer-events-none" />
        <div className="absolute -top-32 -right-32 h-[360px] w-[360px] rounded-full bg-[#F55036]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 md:px-10">
          <Link to="/careers" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white font-mono text-[10px] uppercase tracking-[0.2em] mb-6 transition-colors">
            <ArrowLeft size={12} /> All open roles
          </Link>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-3">Apply for</div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.05]">{job.title}</h1>
          <div className="mt-5 flex items-center gap-4 flex-wrap text-xs text-zinc-400">
            <span className="font-mono uppercase tracking-[0.16em] border border-white/15 px-2 py-1">{job.type}</span>
            <span className="inline-flex items-center gap-1.5"><Briefcase size={12} /> {job.department}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin size={12} /> {job.location}</span>
            <span className="inline-flex items-center gap-1.5"><Clock size={12} /> Posted {new Date(job.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </header>

      <main className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-white/10 bg-[#0a0a0a] p-10 md:p-14 text-center"
            >
              <div className="mx-auto h-16 w-16 grid place-items-center border border-[#F55036]/40 bg-[#F55036]/10 mb-6">
                <Check size={28} className="text-[#F55036]" />
              </div>
              <h2 className="font-display text-3xl tracking-tight">Application submitted</h2>
              <p className="text-zinc-400 mt-4 max-w-md mx-auto">
                Thanks for applying to <span className="text-white">{job.title}</span>. Our team will review and reach out within 7 working days.
              </p>
              <div className="mt-10 flex justify-center gap-3 flex-wrap">
                <Link to="/careers" className="border border-white/15 hover:border-white/40 px-5 py-3 text-sm">View other roles</Link>
                <button onClick={() => navigate("/")} className="bg-[#F55036] hover:bg-[#E04830] text-black px-5 py-3 text-sm font-medium">Back to site</button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={submit} data-testid="application-form" className="border border-white/10 bg-[#0a0a0a] p-8 md:p-12">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-3">Your application</div>
              <h2 className="font-display text-2xl tracking-tight">Tell us about you</h2>
              <p className="text-sm text-zinc-400 mt-2">Fields marked <span className="text-[#F55036]">*</span> are required.</p>

              <div className="mt-8 grid sm:grid-cols-2 gap-5">
                <Field label="Full Name" required>
                  <input data-testid="app-name" type="text" value={form.name} onChange={set("name")} className="input-line" placeholder="Jane Doe" required />
                </Field>
                <Field label="Email" required>
                  <input data-testid="app-email" type="email" value={form.email} onChange={set("email")} className="input-line" placeholder="jane@email.com" required />
                </Field>
                <Field label="Phone">
                  <input data-testid="app-phone" type="tel" value={form.phone} onChange={set("phone")} className="input-line" placeholder="+91 9XXXXXXXXX" />
                </Field>
              </div>

              {/* Resume upload */}
              <div className="mt-8">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-3">Resume <span className="text-zinc-600 normal-case">(PDF, DOC, DOCX · max 5 MB)</span></div>
                {!resume ? (
                  <FileDrop onFile={onPickFile} fileRef={fileRef} />
                ) : (
                  <div className="border border-white/15 bg-[#0c0c0c] px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText size={18} className="text-[#F55036] shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm text-zinc-200 truncate">{resume.name}</div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 mt-0.5">
                          {(resume.size / 1024).toFixed(0)} KB
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setResume(null); if (fileRef.current) fileRef.current.value = ""; }}
                      aria-label="Remove resume"
                      className="h-8 w-8 grid place-items-center border border-white/15 hover:border-red-400 hover:text-red-400 text-zinc-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Cover letter */}
              <div className="mt-8">
                <Field label="Cover letter / Why this role">
                  <textarea
                    data-testid="app-cover"
                    rows={6}
                    value={form.cover_letter}
                    onChange={set("cover_letter")}
                    className="input-line resize-none"
                    placeholder="Tell us what excites you about this role and what you've built recently…"
                  />
                </Field>
              </div>

              <div className="mt-10 pt-8 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
                <Link to="/careers" className="text-sm text-zinc-400 hover:text-white inline-flex items-center gap-2">
                  <ArrowLeft size={13} /> Back to role
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  data-testid="app-submit"
                  className="group inline-flex items-center gap-2 bg-[#F55036] hover:bg-[#E04830] disabled:opacity-60 disabled:cursor-not-allowed text-black px-6 py-3.5 font-medium transition-colors"
                >
                  {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : <>Submit application <ArrowUpRight size={16} /></>}
                </button>
              </div>

              <style>{`
                .input-line { width:100%; background:transparent; border:none; border-bottom:1px solid #27272a; padding:12px 0; color:#f4f4f5; font-family:inherit; font-size:14px; outline:none; transition:border-color 200ms ease; }
                .input-line::placeholder { color:#52525b; }
                .input-line:focus { border-bottom-color:#F55036; }
              `}</style>
            </form>
          )}
        </div>
      </main>

      <Toaster theme="dark" position="bottom-right" />
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

function FileDrop({ onFile, fileRef }) {
  const [drag, setDrag] = useState(false);
  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
      className={`block border-2 border-dashed cursor-pointer transition-colors p-8 text-center ${drag ? "border-[#F55036] bg-[#F55036]/5" : "border-white/15 hover:border-white/30 bg-[#0c0c0c]"}`}
    >
      <input
        data-testid="app-resume-input"
        ref={fileRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(e) => onFile(e.target.files?.[0])}
        className="sr-only"
      />
      <Upload size={20} className="mx-auto text-[#F55036] mb-3" />
      <div className="text-sm text-zinc-200">
        <span className="text-[#F55036] underline underline-offset-2">Click to upload</span> or drag &amp; drop
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-2">PDF · DOC · DOCX · max 5 MB</div>
    </label>
  );
}
