import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, Clock, ArrowUpRight, ArrowLeft, X, Check, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [q, setQ] = useState("");
  const [openJob, setOpenJob] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/jobs`)
      .then((r) => setJobs(r.data.items || []))
      .catch(() => toast.error("Failed to load openings"))
      .finally(() => setLoading(false));
  }, []);

  const types = ["all", ...Array.from(new Set(jobs.map((j) => j.type)))];
  const filtered = jobs.filter((j) => {
    if (filterType !== "all" && j.type !== filterType) return false;
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return [j.title, j.department, j.location, ...(j.tags || [])]
      .join(" ").toLowerCase().includes(s);
  });

  return (
    <div data-testid="careers-page" className="min-h-screen bg-[#050505] text-[#F4F4F5]">
      {/* Hero */}
      <header className="relative pt-24 pb-12 md:pt-32 md:pb-16 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-grid radial-fade pointer-events-none" />
        <div className="absolute -top-40 -right-40 h-[420px] w-[420px] rounded-full bg-[#F55036]/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white font-mono text-[10px] uppercase tracking-[0.2em] mb-8 transition-colors">
            <ArrowLeft size={12} /> Back to site
          </Link>

          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-4">
            [ Careers ]
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-[0.95]">
            Build the future of
            <br />
            <span className="text-gradient-ember italic font-normal">intelligent software</span>.
          </h1>
          <p className="mt-6 text-base md:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Remote-first. Outcome-driven. Engineering-led. We hire senior practitioners and
            ambitious early-career engineers who want to ship real production systems — not write
            slides.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl">{jobs.length}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Open Roles</span>
            </div>
            <span className="text-zinc-700">/</span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl">120+</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Engineers</span>
            </div>
            <span className="text-zinc-700">/</span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl">100%</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Remote</span>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="border-b border-white/10 bg-[#070707]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-wrap gap-1.5">
            {types.map((t) => (
              <button
                key={t}
                data-testid={`filter-${t.toLowerCase()}`}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-[0.16em] border transition-colors ${
                  filterType === t ? "border-[#F55036] bg-[#F55036] text-black" : "border-white/15 hover:border-white/40 text-zinc-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-auto sm:min-w-[280px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              data-testid="job-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search roles, skills, location…"
              className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-white/10 text-sm outline-none focus:border-[#F55036]"
            />
          </div>
        </div>
      </section>

      {/* Job list */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {loading ? (
            <div className="text-center text-zinc-500 py-16 font-mono text-xs uppercase tracking-[0.2em]">Loading openings…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-zinc-500 py-16">
              <div className="font-display text-2xl mb-2">No matching roles right now.</div>
              <p className="text-sm">Try a different filter — or drop us a line at <a href="mailto:hr@veritech-ai.com" className="text-[#F55036] hover:underline">hr@veritech-ai.com</a>.</p>
            </div>
          ) : (
            <div className="border border-white/10 divide-y divide-white/10">
              {filtered.map((job, i) => (
                <motion.button
                  key={job.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  onClick={() => setOpenJob(job)}
                  data-testid={`job-card-${job.id}`}
                  className="w-full text-left bg-[#0a0a0a] hover:bg-[#0f0f0f] p-6 md:p-8 group flex items-center justify-between gap-6 flex-wrap transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036]">{job.department}</span>
                      <span className="text-zinc-700">·</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] border border-white/15 px-2 py-0.5 text-zinc-300">{job.type}</span>
                    </div>
                    <h3 className="font-display text-xl md:text-2xl tracking-tight group-hover:text-[#F55036] transition-colors">{job.title}</h3>
                    <div className="mt-3 flex items-center gap-4 flex-wrap text-xs text-zinc-500">
                      <span className="inline-flex items-center gap-1.5"><MapPin size={12} /> {job.location}</span>
                      <span className="inline-flex items-center gap-1.5"><Briefcase size={12} /> {job.department}</span>
                      <span className="inline-flex items-center gap-1.5"><Clock size={12} /> {new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                    {job.tags?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.tags.slice(0, 5).map((t) => (
                          <span key={t} className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400 border border-white/10 px-2 py-1">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-2 bg-[#F55036] group-hover:bg-[#E04830] text-black px-5 py-2.5 text-sm font-medium transition-colors">
                      View role <ArrowUpRight size={14} />
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          <div className="mt-16 border border-white/10 bg-[#0a0a0a] p-8 md:p-12 text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-3">Don't see the right role?</div>
            <h3 className="font-display text-2xl md:text-3xl tracking-tight">We're always hiring great engineers.</h3>
            <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
              Drop us a line at <a href="mailto:hr@veritech-ai.com" className="text-[#F55036] hover:underline">hr@veritech-ai.com</a> with your portfolio. If your work resonates, we'll create a role for you.
            </p>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {openJob && <JobModal job={openJob} onClose={() => setOpenJob(null)} />}
      </AnimatePresence>
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}

function JobModal({ job, onClose }) {
  const [applying, setApplying] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", linkedin: "", resume_url: "", cover_letter: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return toast.error("Name and email are required.");
    setLoading(true);
    try {
      await axios.post(`${API}/applications`, { ...form, job_id: job.id });
      toast.success("Application submitted. We'll review and get back to you soon.");
      setSubmitted(true);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      data-testid="job-modal"
      className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="min-h-screen flex items-start justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 280, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-[#0a0a0a] border border-white/10 my-8"
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 h-10 w-10 grid place-items-center border border-white/20 bg-black/60 backdrop-blur-md hover:bg-[#F55036] hover:text-black hover:border-[#F55036] transition-colors z-10"
          >
            <X size={16} />
          </button>

          {!applying && !submitted && (
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 flex-wrap mb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036]">{job.department}</span>
                <span className="text-zinc-700">·</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] border border-white/15 px-2 py-0.5 text-zinc-300">{job.type}</span>
                <span className="text-zinc-700">·</span>
                <span className="font-mono text-[10px] text-zinc-400 inline-flex items-center gap-1.5"><MapPin size={11} /> {job.location}</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl tracking-tight leading-tight">{job.title}</h2>

              <div className="mt-8">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-3">About the role</div>
                <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>

              {job.requirements?.length > 0 && (
                <div className="mt-10">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-4">What we're looking for</div>
                  <ul className="space-y-3">
                    {job.requirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 text-zinc-300">
                        <Check size={14} className="text-[#F55036] mt-1 shrink-0" />
                        <span className="text-sm leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.tags?.length > 0 && (
                <div className="mt-10">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-3">Stack & focus</div>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((t) => (
                      <span key={t} className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-300 border border-white/15 px-3 py-1.5 bg-black/40">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 pt-8 border-t border-white/10 flex justify-end">
                <button
                  data-testid="apply-for-job-btn"
                  onClick={() => setApplying(true)}
                  className="group inline-flex items-center gap-2 bg-[#F55036] hover:bg-[#E04830] text-black px-6 py-3.5 font-medium transition-colors"
                >
                  Apply for this role
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          )}

          {applying && !submitted && (
            <form onSubmit={submit} data-testid="application-form" className="p-8 md:p-12">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-3">Application</div>
              <h2 className="font-display text-2xl md:text-3xl tracking-tight leading-tight">{job.title}</h2>

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
                <Field label="LinkedIn URL">
                  <input data-testid="app-linkedin" type="url" value={form.linkedin} onChange={set("linkedin")} className="input-line" placeholder="https://linkedin.com/in/…" />
                </Field>
              </div>

              <div className="mt-5">
                <Field label="Resume / Portfolio URL">
                  <input data-testid="app-resume" type="url" value={form.resume_url} onChange={set("resume_url")} className="input-line" placeholder="https://drive.google.com/… or https://yoursite.com" />
                </Field>
              </div>
              <div className="mt-5">
                <Field label="Cover letter / Why this role">
                  <textarea data-testid="app-cover" rows={5} value={form.cover_letter} onChange={set("cover_letter")} className="input-line resize-none" placeholder="Tell us what excites you about this role and what you've built recently…" />
                </Field>
              </div>

              <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
                <button type="button" onClick={() => setApplying(false)} className="text-sm text-zinc-400 hover:text-white inline-flex items-center gap-2">
                  <ArrowLeft size={13} /> Back to role
                </button>
                <button type="submit" disabled={loading} data-testid="app-submit" className="group inline-flex items-center gap-2 bg-[#F55036] hover:bg-[#E04830] disabled:opacity-60 text-black px-6 py-3.5 font-medium transition-colors">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : <>Submit application <ArrowUpRight size={16} /></>}
                </button>
              </div>

              <style>{`
                .input-line { width:100%; background:transparent; border:none; border-bottom:1px solid #27272a; padding:12px 0; color:#f4f4f5; font-family:inherit; font-size:14px; outline:none; transition:border-color 200ms ease; }
                .input-line::placeholder { color:#52525b; }
                .input-line:focus { border-bottom-color:#F55036; }
              `}</style>
            </form>
          )}

          {submitted && (
            <div className="p-8 md:p-12 text-center">
              <div className="mx-auto h-16 w-16 grid place-items-center border border-[#F55036]/40 bg-[#F55036]/10 mb-6">
                <Check size={28} className="text-[#F55036]" />
              </div>
              <h2 className="font-display text-3xl tracking-tight">Application submitted.</h2>
              <p className="text-zinc-400 mt-4 max-w-md mx-auto">
                Thanks for applying to <span className="text-white">{job.title}</span>. Our team will review and reach out within 7 working days.
              </p>
              <div className="mt-10">
                <button onClick={onClose} className="border border-white/15 px-6 py-3 text-sm hover:border-white/40">Close</button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
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
