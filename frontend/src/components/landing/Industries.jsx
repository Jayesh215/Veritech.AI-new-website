import { motion } from "framer-motion";
import { Heart, GraduationCap, Wallet, ShoppingBag, Cloud, Users, Truck, Building2 } from "lucide-react";

const industries = [
  { icon: Heart, name: "Healthcare", desc: "Patient platforms, diagnostics, MedTech." },
  { icon: GraduationCap, name: "Education", desc: "Adaptive learning & ed-tech systems." },
  { icon: Wallet, name: "FinTech", desc: "Payments, lending, risk intelligence." },
  { icon: ShoppingBag, name: "E-commerce", desc: "Headless commerce & growth tooling." },
  { icon: Cloud, name: "SaaS", desc: "Multi-tenant platforms at scale." },
  { icon: Users, name: "HR Tech", desc: "Talent, payroll & workforce systems." },
  { icon: Truck, name: "Logistics", desc: "Supply chain visibility & automation." },
  { icon: Building2, name: "Enterprise", desc: "Legacy modernization & integration." },
];

export default function Industries() {
  return (
    <section id="industries" data-testid="industries-section" className="relative py-24 md:py-32 border-t border-white/10 bg-[#070707]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-4">
              [ 03 — Industries ]
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight max-w-2xl leading-[1.05]">
              Built for the industries shaping the next decade.
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {industries.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={ind.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                data-testid={`industry-${ind.name.toLowerCase().replace(/\s|-/g, "-")}`}
                className="group bg-[#0a0a0a] hover:bg-[#0f0f0f] p-8 transition-colors relative"
              >
                <Icon size={22} strokeWidth={1.5} className="text-zinc-400 group-hover:text-[#F55036] transition-colors" />
                <h3 className="font-display text-lg mt-6">{ind.name}</h3>
                <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{ind.desc}</p>
                <div className="absolute top-4 right-4 font-mono text-[10px] text-zinc-700">
                  0{i + 1}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
