import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Code2, Cloud, ShieldCheck, BarChart3, Palette, ArrowUpRight, X, Check } from "lucide-react";

const services = [
  {
    id: "ai-development",
    icon: Brain,
    title: "AI Development",
    desc: "Intelligent applications, chatbots, recommendation systems, and generative AI solutions.",
    features: ["Generative AI", "AI Chatbots", "ML Models", "NLP Solutions"],
    span: "md:col-span-2 md:row-span-2",
    featured: true,
    tagline: "Production-grade intelligence, not demos.",
    overview: "We build AI products that ship — not slides. From RAG-grounded assistants to custom ML models trained on your data, our AI practice is led by senior researchers who've shipped production systems at scale.",
    offerings: [
      {
        name: "Generative AI Products",
        detail: "RAG pipelines, agentic workflows, multi-modal assistants — built with evaluation harnesses and guardrails from day one.",
      },
      {
        name: "Custom ML Models",
        detail: "Forecasting, recommendation, classification, anomaly detection. Trained on your data, evaluated against your KPIs.",
      },
      {
        name: "AI Chatbots & Voice Agents",
        detail: "Customer-facing assistants across web, WhatsApp, Slack, and voice — with human-in-the-loop fallback.",
      },
      {
        name: "MLOps & Inference Infrastructure",
        detail: "Model serving, observability, A/B routing and cost-optimized inference on GPU/CPU fleets.",
      },
    ],
    stack: ["OpenAI", "Anthropic", "LangChain", "Hugging Face", "TensorFlow", "PyTorch", "Pinecone"],
    deliverables: ["Production-ready model + API", "Evaluation harness", "Observability stack", "Cost/latency dashboard"],
    timeline: "4 – 16 weeks",
  },
  {
    id: "web-mobile",
    icon: Code2,
    title: "Web & Mobile",
    desc: "Scalable, high-performance digital experiences built on modern frameworks.",
    features: ["React / Next.js", "Mobile Apps", "SaaS Platforms"],
    tagline: "Products users want to come back to.",
    overview: "Senior product engineers shipping web and mobile experiences that scale from MVP to millions. We don't just code — we architect for the next three years.",
    offerings: [
      { name: "Web Apps & SaaS Platforms", detail: "Multi-tenant SaaS, marketplaces, dashboards. React, Next.js, TypeScript, with proper testing and CI." },
      { name: "Native & Cross-Platform Mobile", detail: "iOS, Android, React Native, Flutter. Production releases with crashlytics, A/B testing, and OTA updates." },
      { name: "Enterprise Applications", detail: "Internal tools, admin consoles, B2B portals. SSO, RBAC, audit logs, integrations — all included." },
      { name: "Headless Commerce", detail: "Shopify Hydrogen, Medusa, custom commerce engines integrated with your ERP and payment stack." },
    ],
    stack: ["React", "Next.js", "TypeScript", "Angular", "Vue", "React Native", "Flutter"],
    deliverables: ["Web/mobile app", "CI/CD pipeline", "Component library", "Performance budget enforced"],
    timeline: "6 – 20 weeks",
  },
  {
    id: "devops-cloud",
    icon: Cloud,
    title: "DevOps & Cloud",
    desc: "Modern cloud infrastructure and automation pipelines for accelerated delivery.",
    features: ["AWS / Azure", "Kubernetes", "CI/CD"],
    tagline: "Ship 10x faster. Sleep through the night.",
    overview: "Cloud-native infrastructure built for scale, observability, and zero-touch operations. We don't just configure clusters — we engineer the deployment culture around them.",
    offerings: [
      { name: "Cloud Architecture", detail: "Multi-region, fault-tolerant architectures on AWS, Azure, GCP — designed for your scale and budget." },
      { name: "Kubernetes Platforms", detail: "Production-grade K8s with GitOps, service mesh, autoscaling, and cost optimization." },
      { name: "CI/CD Automation", detail: "Trunk-based development, automated tests, canary releases, instant rollbacks via GitOps." },
      { name: "Observability Stack", detail: "Distributed tracing, structured logging, SLO-based alerting. Prometheus, Grafana, OpenTelemetry." },
    ],
    stack: ["AWS", "Azure", "GCP", "Kubernetes", "Docker", "Terraform", "ArgoCD", "Prometheus"],
    deliverables: ["IaC repo", "K8s cluster + GitOps", "CI/CD pipelines", "Runbook + on-call setup"],
    timeline: "4 – 12 weeks",
  },
  {
    id: "qa-automation",
    icon: ShieldCheck,
    title: "QA Automation",
    desc: "Test automation frameworks ensuring reliability across every release cycle.",
    features: ["E2E Testing", "Performance", "Coverage"],
    tagline: "Confidence to deploy at 4 PM on a Friday.",
    overview: "We embed QA engineering into your delivery pipeline so quality becomes a property of your system — not a stage at the end. Automated tests, performance budgets, and observability baked in.",
    offerings: [
      { name: "E2E Test Automation", detail: "Playwright, Cypress, Selenium suites running on every PR. Parallel execution, flake detection, trend dashboards." },
      { name: "API & Contract Testing", detail: "Postman, Pact, REST/gRPC contracts validated automatically against service boundaries." },
      { name: "Performance & Load Testing", detail: "k6, JMeter, Locust. Baseline performance budgets enforced in CI; capacity planning included." },
      { name: "Security & Penetration Testing", detail: "OWASP Top-10 scanning, dependency vulnerability monitoring, periodic pen tests." },
    ],
    stack: ["Playwright", "Cypress", "Pytest", "k6", "Postman", "Selenium", "Pact"],
    deliverables: ["Test suite + CI integration", "Coverage dashboards", "Performance baseline", "QA runbook"],
    timeline: "3 – 10 weeks",
  },
  {
    id: "data-science",
    icon: BarChart3,
    title: "Data Science",
    desc: "Turn raw data into actionable insights using AI and advanced analytics.",
    features: ["Predictive Analytics", "BI Dashboards", "ML Pipelines"],
    tagline: "From dashboards to decisions.",
    overview: "We turn your raw data into a competitive advantage — predictive models, executive dashboards, and AI-generated insights that drive real business decisions, not vanity metrics.",
    offerings: [
      { name: "Predictive Analytics", detail: "Demand forecasting, churn prediction, LTV modeling, anomaly detection — trained on your data, deployed to production." },
      { name: "Business Intelligence Dashboards", detail: "Real-time KPIs, executive dashboards, self-serve analytics. Metabase, Looker, or custom React dashboards." },
      { name: "Data Engineering Pipelines", detail: "ETL/ELT, dbt models, streaming ingestion, warehouse design on Snowflake, BigQuery, ClickHouse." },
      { name: "AI-Generated Insights", detail: "LLM-powered insight engines that explain anomalies, surface trends, and write executive summaries automatically." },
    ],
    stack: ["Python", "dbt", "Snowflake", "BigQuery", "ClickHouse", "Airbyte", "Metabase", "Recharts"],
    deliverables: ["Data warehouse", "BI dashboards", "ML model in production", "Insight reports"],
    timeline: "5 – 14 weeks",
  },
  {
    id: "uiux-product",
    icon: Palette,
    title: "UI/UX & Product",
    desc: "Intuitive digital experiences engineered for engagement and growth.",
    features: ["Product Design", "Design Systems", "UX Research"],
    tagline: "Design as a multiplier, not decoration.",
    overview: "Product designers who collaborate with engineers from day one — shipping design systems, user flows, and interaction details that move conversion metrics, not just look pretty in Figma.",
    offerings: [
      { name: "Product Design", detail: "End-to-end product flows, wireframes, hi-fidelity UI. Iterated against real users and conversion goals." },
      { name: "Design Systems", detail: "Tokenized, component-driven design systems in Figma + code (Shadcn, Radix, custom). One source of truth across web and mobile." },
      { name: "UX Research", detail: "User interviews, usability testing, journey mapping. Quant + qual research driving prioritization." },
      { name: "Brand & Identity", detail: "Brand strategy, visual identity, marketing site design. Founders' vision translated into a coherent system." },
    ],
    stack: ["Figma", "Framer", "Shadcn", "Radix", "Storybook", "Maze", "Hotjar"],
    deliverables: ["Design system", "High-fidelity prototypes", "User research report", "Engineering handoff specs"],
    timeline: "3 – 12 weeks",
  },
];

export default function Services() {
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
    <section id="services" data-testid="services-section" className="relative py-24 md:py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-4">
              [ 02 — Our Expertise ]
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight max-w-2xl leading-[1.05]">
              A full-spectrum studio for AI, cloud, and product engineering.
            </h2>
          </div>
          <p className="text-zinc-400 max-w-sm">
            Six interlocking practices. One coherent engineering org built around your business
            outcomes.
          </p>
        </div>

        <div className="grid md:grid-cols-4 grid-rows-3 gap-px bg-white/10 border border-white/10">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.id}
                layoutId={`service-${s.id}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                data-testid={`service-card-${s.title.toLowerCase().replace(/\s|\/|&/g, "-")}`}
                onClick={() => setOpen(s)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen(s)}
                role="button"
                tabIndex={0}
                className={`group relative bg-[#0a0a0a] hover:bg-[#0f0f0f] p-8 md:p-10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F55036] focus:ring-offset-2 focus:ring-offset-[#050505] ${
                  s.span || ""
                }`}
              >
                <div className="flex items-start justify-between mb-8">
                  <motion.div
                    layoutId={`service-icon-${s.id}`}
                    className={`h-11 w-11 grid place-items-center border ${s.featured ? "border-[#F55036] bg-[#F55036]/10" : "border-white/15"}`}
                  >
                    <Icon size={20} className={s.featured ? "text-[#F55036]" : "text-white"} strokeWidth={1.5} />
                  </motion.div>
                  <ArrowUpRight
                    size={18}
                    className="text-zinc-600 group-hover:text-[#F55036] group-hover:-translate-y-1 group-hover:translate-x-1 transition-all"
                  />
                </div>
                <motion.h3 layoutId={`service-title-${s.id}`} className="font-display text-xl md:text-2xl tracking-tight">
                  {s.title}
                </motion.h3>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed max-w-md">{s.desc}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {s.features.map((f) => (
                    <span
                      key={f}
                      className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400 border border-white/10 px-2 py-1"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                {s.featured && (
                  <div className="absolute bottom-0 left-0 right-0 h-px shimmer-border opacity-60" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {open && <ServiceModal service={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ServiceModal({ service, onClose }) {
  const Icon = service.icon;
  return (
    <motion.div
      key="service-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      data-testid={`service-modal-${service.id}`}
      className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="min-h-screen flex items-start justify-center p-4 md:p-8">
        <motion.div
          layoutId={`service-${service.id}`}
          onClick={(e) => e.stopPropagation()}
          transition={{ type: "spring", stiffness: 280, damping: 32 }}
          className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 my-8"
        >
          {/* Header */}
          <div className="relative p-8 md:p-12 border-b border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-grid radial-fade opacity-40 pointer-events-none" />
            <div className="absolute -top-24 -right-24 h-[280px] w-[280px] rounded-full bg-[#F55036]/15 blur-3xl pointer-events-none" />

            <button
              data-testid="service-modal-close"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 h-10 w-10 grid place-items-center border border-white/20 bg-black/60 backdrop-blur-md hover:bg-[#F55036] hover:text-black hover:border-[#F55036] transition-colors z-10"
            >
              <X size={16} />
            </button>

            <div className="relative flex items-start gap-6">
              <motion.div
                layoutId={`service-icon-${service.id}`}
                className="h-14 w-14 grid place-items-center border border-[#F55036] bg-[#F55036]/10 shrink-0"
              >
                <Icon size={24} className="text-[#F55036]" strokeWidth={1.5} />
              </motion.div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-3">Service</div>
                <motion.h2
                  layoutId={`service-title-${service.id}`}
                  className="font-display text-3xl md:text-4xl tracking-tight leading-[1.05]"
                >
                  {service.title}
                </motion.h2>
                <p className="mt-3 text-zinc-400 italic">{service.tagline}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="p-6 md:p-10 lg:p-12"
          >
            {/* Overview */}
            <div className="mb-12">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-3">Overview</div>
              <p className="text-base md:text-lg text-zinc-300 leading-relaxed max-w-3xl">{service.overview}</p>
            </div>

            {/* Meta strip */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/10 border border-white/10 mb-10">
              <div className="bg-[#0a0a0a] p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036]">Typical Timeline</div>
                <div className="font-display text-xl tracking-tight mt-2">{service.timeline}</div>
              </div>
              <div className="bg-[#0a0a0a] p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036]">Engagement Model</div>
                <div className="text-sm text-zinc-200 mt-2 leading-snug">Embedded pod · Fixed scope · Retainer</div>
              </div>
              <div className="bg-[#0a0a0a] p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036]">Lead Engineer</div>
                <div className="text-sm text-zinc-200 mt-2 leading-snug">7+ yrs · production-grade ownership</div>
              </div>
            </div>

            {/* Offerings */}
            <div className="mb-12">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-5">What we deliver</div>
              <div className="grid md:grid-cols-2 gap-px bg-white/10 border border-white/10">
                {service.offerings.map((o, i) => (
                  <motion.div
                    key={o.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.06 }}
                    className="bg-[#0a0a0a] p-6 hover:bg-[#0f0f0f] transition-colors"
                  >
                    <h4 className="font-display text-lg tracking-tight">{o.name}</h4>
                    <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{o.detail}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stack + Deliverables */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 mb-12">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-4">Tools we work with</div>
                <div className="flex flex-wrap gap-2">
                  {service.stack.map((s) => (
                    <span key={s} className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-300 border border-white/15 px-3 py-1.5 bg-black/40">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-4">You'll walk away with</div>
                <ul className="space-y-2.5">
                  {service.deliverables.map((d, i) => (
                    <motion.li
                      key={d}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="flex items-start gap-3 text-zinc-300"
                    >
                      <Check size={14} className="text-[#F55036] mt-1 shrink-0" />
                      <span className="text-sm leading-relaxed">{d}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-10 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="font-display text-xl tracking-tight">Ready to scope a {service.title.toLowerCase()} engagement?</div>
                <div className="text-sm text-zinc-400 mt-1">Book a 30-minute call. We'll walk through your goals and propose next steps.</div>
              </div>
              <a
                href="#contact"
                onClick={onClose}
                className="group inline-flex items-center gap-2 bg-[#F55036] hover:bg-[#E04830] text-black px-6 py-3.5 font-medium transition-colors"
              >
                Book a consultation
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
