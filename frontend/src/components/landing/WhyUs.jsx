import { motion } from "framer-motion";
import { Cpu, Workflow, Rocket, Layers, Zap, ShieldCheck, Sparkles, Award } from "lucide-react";

const reasons = [
  { icon: Cpu, title: "AI-First Engineering", desc: "Every system architected with intelligence at its core." },
  { icon: Workflow, title: "Agile Methodology", desc: "Two-week shipping cycles. Always production-ready." },
  { icon: Layers, title: "Scalable Cloud", desc: "Multi-region, auto-scaling architectures by default." },
  { icon: Sparkles, title: "Modern Stack", desc: "React, Next.js, Python, Kubernetes, AI/ML toolchains." },
  { icon: Rocket, title: "Fast Delivery", desc: "MVP to scale in weeks, not quarters." },
  { icon: ShieldCheck, title: "Quality-Driven", desc: "Automated testing, observability, and security baked in." },
  { icon: Zap, title: "Innovation Culture", desc: "Senior engineers who write production code, not slides." },
  { icon: Award, title: "Dedicated Expertise", desc: "Long-tenure teams owning outcomes end-to-end." },
];

export default function WhyUs() {
  return (
    <section id="why" data-testid="why-us-section" className="relative py-24 md:py-32 border-t border-white/10 bg-[#070707]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 lg:sticky lg:top-24 self-start">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-4">
              [ 05 — Why Veritech ]
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.05]">
              Eight reasons companies choose us over the incumbents.
            </h2>
            <p className="mt-6 text-zinc-400 leading-relaxed">
              We don't replace your engineering org — we accelerate it with senior practitioners
              who care about outcomes.
            </p>
          </div>

          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-px bg-white/10 border border-white/10">
            {reasons.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  data-testid={`why-${r.title.toLowerCase().replace(/\s/g, "-")}`}
                  className="bg-[#0a0a0a] p-7 hover:bg-[#0f0f0f] transition-colors"
                >
                  <Icon size={18} strokeWidth={1.5} className="text-[#F55036]" />
                  <h3 className="font-display text-base mt-4">{r.title}</h3>
                  <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{r.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
