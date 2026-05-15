import { motion } from "framer-motion";

const steps = [
  { n: "01", title: "Discovery & Planning", desc: "We immerse in your domain, map constraints, and align on measurable outcomes." },
  { n: "02", title: "Strategy & Architecture", desc: "Technical strategy, architecture, and roadmap calibrated to your business goals." },
  { n: "03", title: "Design & Development", desc: "Cross-functional pods ship production-grade software in two-week cycles." },
  { n: "04", title: "Deployment & Scaling", desc: "Cloud-native rollouts, observability, and automated scaling from day one." },
  { n: "05", title: "Continuous Support", desc: "Ongoing engineering partnership, optimization, and evolution at your pace." },
];

export default function Process() {
  return (
    <section id="process" data-testid="process-section" className="relative py-24 md:py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-4">
            [ 06 — Our Process ]
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight max-w-3xl leading-[1.05]">
            A disciplined five-stage process — from first conversation to continuous evolution.
          </h2>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-2 bottom-2 w-px bg-white/10" />

          <div className="space-y-12 md:space-y-20">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                data-testid={`process-step-${s.n}`}
                className={`relative grid md:grid-cols-2 gap-8 md:gap-16 items-start ${
                  i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-3 h-3 w-3 bg-[#F55036] pulse-dot ring-4 ring-[#050505]" />

                <div className={`pl-12 md:pl-0 ${i % 2 === 1 ? "md:text-left" : "md:text-right"}`}>
                  <div className="font-mono text-xs text-[#F55036] tracking-[0.2em]">STEP {s.n}</div>
                  <h3 className="font-display text-2xl md:text-3xl tracking-tight mt-3">{s.title}</h3>
                </div>
                <div className={`pl-12 md:pl-0`}>
                  <p className="text-zinc-400 leading-relaxed max-w-md">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
