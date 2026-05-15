import { motion } from "framer-motion";
import { Brain, Code2, Cloud, ShieldCheck, BarChart3, Palette, ArrowUpRight } from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "AI Development",
    desc: "Intelligent applications, chatbots, recommendation systems, and generative AI solutions.",
    features: ["Generative AI", "AI Chatbots", "ML Models", "NLP Solutions"],
    span: "md:col-span-2 md:row-span-2",
    featured: true,
  },
  {
    icon: Code2,
    title: "Web & Mobile",
    desc: "Scalable, high-performance digital experiences built on modern frameworks.",
    features: ["React / Next.js", "Mobile Apps", "SaaS Platforms"],
  },
  {
    icon: Cloud,
    title: "DevOps & Cloud",
    desc: "Modern cloud infrastructure and automation pipelines for accelerated delivery.",
    features: ["AWS / Azure", "Kubernetes", "CI/CD"],
  },
  {
    icon: ShieldCheck,
    title: "QA Automation",
    desc: "Test automation frameworks ensuring reliability across every release cycle.",
    features: ["E2E Testing", "Performance", "Coverage"],
  },
  {
    icon: BarChart3,
    title: "Data Science",
    desc: "Turn raw data into actionable insights using AI and advanced analytics.",
    features: ["Predictive Analytics", "BI Dashboards", "ML Pipelines"],
  },
  {
    icon: Palette,
    title: "UI/UX & Product",
    desc: "Intuitive digital experiences engineered for engagement and growth.",
    features: ["Product Design", "Design Systems", "UX Research"],
  },
];

export default function Services() {
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
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                data-testid={`service-card-${s.title.toLowerCase().replace(/\s|\/|&/g, "-")}`}
                className={`group relative bg-[#0a0a0a] hover:bg-[#0f0f0f] p-8 md:p-10 transition-colors ${
                  s.span || ""
                }`}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className={`h-11 w-11 grid place-items-center border ${s.featured ? "border-[#F55036] bg-[#F55036]/10" : "border-white/15"}`}>
                    <Icon size={20} className={s.featured ? "text-[#F55036]" : "text-white"} strokeWidth={1.5} />
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="text-zinc-600 group-hover:text-[#F55036] group-hover:-translate-y-1 group-hover:translate-x-1 transition-all"
                  />
                </div>
                <h3 className="font-display text-xl md:text-2xl tracking-tight">{s.title}</h3>
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
    </section>
  );
}
