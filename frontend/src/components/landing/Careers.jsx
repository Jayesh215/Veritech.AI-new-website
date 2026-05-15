import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const opps = [
  "Internships",
  "Full-time Roles",
  "Remote Opportunities",
  "AI Projects",
  "Development Projects",
];

export default function Careers() {
  return (
    <section id="careers" data-testid="careers-section" className="relative py-24 md:py-32 border-t border-white/10 bg-[#070707]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="border border-white/10 bg-[#0a0a0a] relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-dense opacity-40 pointer-events-none" />
          <div className="absolute -top-32 -right-32 h-[400px] w-[400px] rounded-full bg-[#F55036]/10 blur-3xl pointer-events-none" />

          <div className="relative p-10 md:p-16 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-4">
                [ 09 — Join the Team ]
              </div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.05]">
                Join our innovation journey.
              </h2>
              <p className="mt-6 text-zinc-400 leading-relaxed max-w-2xl">
                At Veritech.AI we empower emerging talent and seasoned professionals to work on
                real-world technology solutions while building future-ready skills. Remote-first.
                Outcome-driven. Engineering-led.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {opps.map((o, i) => (
                  <motion.span
                    key={o}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-300 border border-white/15 px-3 py-1.5 bg-black/40"
                  >
                    {o}
                  </motion.span>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#contact"
                  data-testid="careers-apply-btn"
                  className="group inline-flex items-center gap-2 bg-[#F55036] hover:bg-[#E04830] text-black px-6 py-3.5 font-medium transition-colors"
                >
                  Apply Now
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 text-white px-6 py-3.5 font-medium transition-colors"
                >
                  Talk to recruiting
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-px bg-white/10 border border-white/10">
              {[
                { k: "120+", v: "Engineers" },
                { k: "30+", v: "Open Roles" },
                { k: "100%", v: "Remote" },
                { k: "4.8 / 5", v: "Glassdoor" },
              ].map((m) => (
                <div key={m.v} className="bg-[#0c0c0c] p-6">
                  <div className="font-display text-3xl tracking-tight">{m.k}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-2">{m.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
