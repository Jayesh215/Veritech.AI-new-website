import { motion } from "framer-motion";
import { ExternalLink, Play } from "lucide-react";

const IMG_SAAS = "https://static.prod-images.emergentagent.com/jobs/3db90e78-36cd-4f39-8bf5-0f18091d5b8b/images/f129196f47ce3a76d1d17eb9e9221d254f4ca42945c861926988f6532ff96d0d.png";
const IMG_AI = "https://static.prod-images.emergentagent.com/jobs/3db90e78-36cd-4f39-8bf5-0f18091d5b8b/images/f9dd96a626a5a1f4317f4e980f9dca53e11dca009cb3768a9062991faa606576.png";

const projects = [
  {
    tag: "Real Estate AI",
    title: "AI-Powered Property Intelligence Platform",
    desc: "End-to-end platform combining lead scoring, valuation models, and conversational AI for high-volume property markets.",
    image: IMG_AI,
    stack: ["Next.js", "Python", "OpenAI", "Postgres"],
  },
  {
    tag: "Enterprise SaaS",
    title: "Multi-Tenant Payroll Management Suite",
    desc: "Compliance-ready payroll engine serving 40k+ employees across 12 jurisdictions with automated tax reconciliation.",
    image: IMG_SAAS,
    stack: ["React", "Node.js", "Kubernetes", "AWS"],
  },
  {
    tag: "Generative AI",
    title: "AI Chatbot Assistant for Business Automation",
    desc: "Customer-facing assistant resolving 78% of tier-1 tickets across web, WhatsApp, and Slack — trained on internal knowledge.",
    image: IMG_AI,
    stack: ["LangChain", "OpenAI", "Vector DB"],
  },
  {
    tag: "Analytics",
    title: "Real-time Business Intelligence Dashboard",
    desc: "Streaming analytics layer surfacing operational KPIs and AI-generated insights for executive teams.",
    image: IMG_SAAS,
    stack: ["TypeScript", "ClickHouse", "Recharts"],
  },
];

export default function Projects() {
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
          <a href="#contact" className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-[#F55036] transition-colors">
            View full case studies →
          </a>
        </div>

        <div className="grid lg:grid-cols-2 gap-px bg-white/10 border border-white/10">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
              data-testid={`project-card-${i}`}
              className="group bg-[#0a0a0a] hover:bg-[#0f0f0f] transition-colors flex flex-col"
            >
              <div className="relative overflow-hidden aspect-[16/10]">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.2em] border border-white/20 bg-black/60 backdrop-blur-md px-2 py-1">
                  {p.tag}
                </span>
              </div>
              <div className="p-8 md:p-10 flex-1 flex flex-col">
                <h3 className="font-display text-xl md:text-2xl tracking-tight">{p.title}</h3>
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
                    <button data-testid={`project-demo-${i}`} aria-label="Live demo" className="h-9 w-9 grid place-items-center border border-white/15 hover:border-[#F55036] hover:text-[#F55036] transition-colors">
                      <Play size={14} />
                    </button>
                    <button data-testid={`project-link-${i}`} aria-label="Open case study" className="h-9 w-9 grid place-items-center border border-white/15 hover:border-[#F55036] hover:text-[#F55036] transition-colors">
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
