import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Play, X, Check, ArrowUpRight } from "lucide-react";

const IMG_SAAS = "https://static.prod-images.emergentagent.com/jobs/3db90e78-36cd-4f39-8bf5-0f18091d5b8b/images/f129196f47ce3a76d1d17eb9e9221d254f4ca42945c861926988f6532ff96d0d.png";
const IMG_AI = "https://static.prod-images.emergentagent.com/jobs/3db90e78-36cd-4f39-8bf5-0f18091d5b8b/images/f9dd96a626a5a1f4317f4e980f9dca53e11dca009cb3768a9062991faa606576.png";

const projects = [
  {
    id: "realestate-ai",
    tag: "Real Estate AI",
    title: "AI-Powered Property Intelligence Platform",
    desc: "End-to-end platform combining lead scoring, valuation models, and conversational AI for high-volume property markets.",
    image: IMG_AI,
    stack: ["Next.js", "Python", "OpenAI", "Postgres"],
    client: "Confidential — Top 10 PropTech firm, India",
    duration: "8 months",
    team: "6 engineers · 1 ML lead · 1 PM",
    challenge: "The client managed 50,000+ property listings across 4 cities with manual lead qualification that consumed 70% of agent time. They needed an AI layer to automate scoring, predict valuations, and converse with prospects in 3 languages — without rebuilding their core CRM.",
    solution: [
      "Built a property valuation model on 8 years of transaction data (R² of 0.91 on holdout set).",
      "LLM-powered conversational assistant handling 4 vernacular languages with sub-2s response latency.",
      "Lead scoring engine ranking prospects by conversion probability — surfaced top 5% to human agents.",
      "Embedded into the existing CRM via webhook + side-panel SDK; zero migration required.",
    ],
    results: [
      { k: "67%", v: "Agent time saved" },
      { k: "3.2x", v: "Lead-to-deal conversion" },
      { k: "₹14Cr", v: "Annual operational savings" },
      { k: "92%", v: "AI valuation accuracy" },
    ],
    features: ["Lead Scoring", "Property Valuation", "Conversational AI", "Multi-lingual Support", "CRM Integration"],
  },
  {
    id: "payroll-saas",
    tag: "Enterprise SaaS",
    title: "Multi-Tenant Payroll Management Suite",
    desc: "Compliance-ready payroll engine serving 40k+ employees across 12 jurisdictions with automated tax reconciliation.",
    image: IMG_SAAS,
    stack: ["React", "Node.js", "Kubernetes", "AWS"],
    client: "Mid-market HR-tech platform",
    duration: "11 months",
    team: "9 engineers · 2 compliance SMEs",
    challenge: "The client's incumbent payroll engine couldn't scale beyond 5k employees per tenant and required manual reconciliation for every jurisdiction. End-of-month payroll runs were taking 6+ hours with frequent tax-rule violations costing avg ₹40L/yr in penalties.",
    solution: [
      "Rebuilt payroll engine on Kubernetes with horizontal sharding by tenant; throughput now 100x baseline.",
      "Pluggable jurisdiction-rule engine supporting 12 tax regimes with declarative YAML configs.",
      "Automated tax reconciliation that reconciles against statutory portals nightly.",
      "Audit-grade ledger with cryptographic chaining — every change is provably immutable.",
    ],
    results: [
      { k: "40k+", v: "Employees processed" },
      { k: "12", v: "Jurisdictions live" },
      { k: "6h → 9min", v: "Payroll run time" },
      { k: "Zero", v: "Tax penalties in 2 years" },
    ],
    features: ["Multi-tenancy", "Tax Automation", "Compliance Engine", "Audit Ledger", "SSO + RBAC"],
  },
  {
    id: "ai-chatbot",
    tag: "Generative AI",
    title: "AI Chatbot Assistant for Business Automation",
    desc: "Customer-facing assistant resolving 78% of tier-1 tickets across web, WhatsApp, and Slack — trained on internal knowledge.",
    image: IMG_AI,
    stack: ["LangChain", "OpenAI", "Vector DB"],
    client: "B2B fintech (Series B)",
    duration: "4 months",
    team: "3 engineers · 1 AI researcher",
    challenge: "Support volume was growing 18% MoM. Each tier-1 ticket cost $12 to resolve via a human agent. Internal knowledge was scattered across Notion, Slack, Zendesk, and engineering wikis — agents spent 40% of their time just searching.",
    solution: [
      "Indexed 12,000+ internal docs into a hybrid (semantic + keyword) vector store with hourly refresh.",
      "RAG pipeline with grounded citations — every answer links to the source doc.",
      "Deployed across web widget, WhatsApp Business API, and Slack with consistent answer parity.",
      "Human-in-the-loop fallback: confidence < 0.7 auto-escalates to a senior agent with full context.",
    ],
    results: [
      { k: "78%", v: "Tier-1 deflection rate" },
      { k: "$0.04", v: "Cost per resolved ticket" },
      { k: "11s", v: "Avg time to first answer" },
      { k: "94%", v: "CSAT on AI replies" },
    ],
    features: ["RAG Pipeline", "Multi-channel", "Citations", "HITL Escalation", "Real-time Indexing"],
  },
  {
    id: "analytics-dash",
    tag: "Analytics",
    title: "Real-time Business Intelligence Dashboard",
    desc: "Streaming analytics layer surfacing operational KPIs and AI-generated insights for executive teams.",
    image: IMG_SAAS,
    stack: ["TypeScript", "ClickHouse", "Recharts"],
    client: "D2C retail group · ₹500Cr ARR",
    duration: "5 months",
    team: "4 engineers · 1 data scientist",
    challenge: "Executives received KPI reports 24-48 hours late, built manually across 6 sources. Decisions on inventory, pricing, and campaign spend were lagging the market by a full day, leading to ~₹2Cr/month in suboptimal allocation.",
    solution: [
      "Built a streaming ingestion layer on ClickHouse processing 30M events/day with sub-second freshness.",
      "Pre-computed KPI rollups updated every 60 seconds via materialized views.",
      "GPT-powered insight engine that explains anomalies and surfaces what changed, in plain English.",
      "Mobile-first dashboard with anomaly alerts pushed to executive WhatsApp/Email instantly.",
    ],
    results: [
      { k: "<60s", v: "KPI freshness" },
      { k: "30M", v: "Events/day ingested" },
      { k: "₹2.1Cr", v: "Monthly allocation upside" },
      { k: "14", v: "Executive seats" },
    ],
    features: ["Real-time Streaming", "AI Insights", "Anomaly Alerts", "Mobile-first", "Custom KPIs"],
  },
];

export default function Projects() {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section id="projects" data-testid="projects-section" className="relative py-24 md:py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-4">
              [ 04 — Featured Work ]
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight max-w-3xl leading-[1.05]">
              Production systems for category-defining teams.
            </h2>
          </div>
          <button
            onClick={() => setOpen(projects[0])}
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-[#F55036] transition-colors"
          >
            View full case studies →
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-px bg-white/10 border border-white/10">
          {projects.map((p, i) => (
            <motion.article
              key={p.id}
              layoutId={`project-${p.id}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
              data-testid={`project-card-${i}`}
              onClick={() => setOpen(p)}
              className="group bg-[#0a0a0a] hover:bg-[#0f0f0f] transition-colors flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F55036] focus:ring-offset-2 focus:ring-offset-[#050505]"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen(p)}
            >
              <motion.div layoutId={`project-img-${p.id}`} className="relative overflow-hidden aspect-[16/10]">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.2em] border border-white/20 bg-black/60 backdrop-blur-md px-2 py-1">
                  {p.tag}
                </span>
                <span className="absolute top-4 right-4 h-8 w-8 grid place-items-center border border-white/20 bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={14} className="text-white" />
                </span>
              </motion.div>
              <div className="p-8 md:p-10 flex-1 flex flex-col">
                <motion.h3 layoutId={`project-title-${p.id}`} className="font-display text-xl md:text-2xl tracking-tight">
                  {p.title}
                </motion.h3>
                <p className="text-sm text-zinc-400 mt-3 leading-relaxed flex-1">{p.desc}</p>
                <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <span key={s} className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400 border border-white/10 px-2 py-1">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      data-testid={`project-demo-${i}`}
                      aria-label="Live demo"
                      onClick={(e) => { e.stopPropagation(); setOpen(p); }}
                      className="h-9 w-9 grid place-items-center border border-white/15 hover:border-[#F55036] hover:text-[#F55036] transition-colors"
                    >
                      <Play size={14} />
                    </button>
                    <button
                      data-testid={`project-link-${i}`}
                      aria-label="Open case study"
                      onClick={(e) => { e.stopPropagation(); setOpen(p); }}
                      className="h-9 w-9 grid place-items-center border border-white/15 hover:border-[#F55036] hover:text-[#F55036] transition-colors"
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Animated case-study modal */}
      <AnimatePresence>
        {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ProjectModal({ project, onClose }) {
  return (
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      data-testid={`project-modal-${project.id}`}
      className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="min-h-screen flex items-start justify-center p-4 md:p-8">
        <motion.div
          layoutId={`project-${project.id}`}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 my-8"
          transition={{ type: "spring", stiffness: 280, damping: 32 }}
        >
          {/* Hero image */}
          <motion.div layoutId={`project-img-${project.id}`} className="relative aspect-[21/9] overflow-hidden">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
            <button
              data-testid="project-modal-close"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 h-10 w-10 grid place-items-center border border-white/20 bg-black/60 backdrop-blur-md hover:bg-[#F55036] hover:text-black hover:border-[#F55036] transition-colors"
            >
              <X size={16} />
            </button>
            <div className="absolute bottom-6 left-6 right-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] border border-white/20 bg-black/60 backdrop-blur-md px-2 py-1">
                {project.tag}
              </span>
              <motion.h2
                layoutId={`project-title-${project.id}`}
                className="font-display text-2xl md:text-4xl tracking-tight leading-tight mt-4 max-w-3xl"
              >
                {project.title}
              </motion.h2>
            </div>
          </motion.div>

          {/* Body */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="p-6 md:p-10 lg:p-12"
          >
            {/* Meta strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 mb-10">
              {[
                { k: "Client", v: project.client },
                { k: "Duration", v: project.duration },
                { k: "Team", v: project.team },
                { k: "Stack", v: project.stack.join(" · ") },
              ].map((m) => (
                <div key={m.k} className="bg-[#0a0a0a] p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036]">{m.k}</div>
                  <div className="text-sm text-zinc-200 mt-2 leading-snug">{m.v}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-10 md:gap-16">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-3">The Challenge</div>
                <p className="text-zinc-300 leading-relaxed">{project.challenge}</p>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-3">Our Solution</div>
                <ul className="space-y-3">
                  {project.solution.map((s, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.05 }}
                      className="flex items-start gap-3 text-zinc-300"
                    >
                      <Check size={14} className="text-[#F55036] mt-1 shrink-0" />
                      <span className="text-sm leading-relaxed">{s}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Results */}
            <div className="mt-12">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-5">Results that mattered</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
                {project.results.map((r, i) => (
                  <motion.div
                    key={r.v}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className="bg-[#0a0a0a] p-6"
                  >
                    <div className="font-display text-2xl md:text-3xl tracking-tight text-[#F55036]">{r.k}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-2">{r.v}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mt-12">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-4">Key Capabilities</div>
              <div className="flex flex-wrap gap-2">
                {project.features.map((f) => (
                  <span key={f} className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-300 border border-white/15 px-3 py-1.5 bg-black/40">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 pt-10 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="font-display text-xl tracking-tight">Want a similar outcome?</div>
                <div className="text-sm text-zinc-400 mt-1">Book a 30-minute scoping call with our engineering leads.</div>
              </div>
              <a
                href="#contact"
                onClick={onClose}
                className="group inline-flex items-center gap-2 bg-[#F55036] hover:bg-[#E04830] text-black px-6 py-3.5 font-medium transition-colors"
              >
                Start a project
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
