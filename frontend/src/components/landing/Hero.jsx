import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

const HERO_IMG =
  "https://static.prod-images.emergentagent.com/jobs/3db90e78-36cd-4f39-8bf5-0f18091d5b8b/images/6c38721ca6ebd01e612e876426b44ed5f83bc06119341bac15455966554d5344.png";

export default function Hero() {
  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden"
    >
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid radial-fade pointer-events-none" />
      <div className="absolute -top-40 -right-40 h-[420px] w-[420px] rounded-full bg-[#F55036]/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 border border-white/15 px-3 py-1.5 mb-8 bg-[#0c0c0c]"
              data-testid="hero-badge"
            >
              <Sparkles size={12} className="text-[#F55036]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-300">
                AI-First Engineering Studio
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              data-testid="hero-heading"
              className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-[0.95] font-medium"
            >
              Engineering
              <br />
              intelligent digital
              <br />
              solutions for the{" "}
              <span className="text-gradient-ember italic font-normal">future.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 max-w-xl text-base md:text-lg text-zinc-400 leading-relaxed"
              data-testid="hero-subheading"
            >
              Veritech.AI helps startups, enterprises, and growing businesses accelerate
              innovation through Artificial Intelligence, Cloud Engineering, DevOps, QA
              Automation, and scalable software solutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <a
                href="#contact"
                data-testid="hero-cta-primary"
                className="group inline-flex items-center gap-2 bg-[#F55036] hover:bg-[#E04830] text-black px-6 py-3.5 font-medium transition-colors"
              >
                Book Consultation
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#services"
                data-testid="hero-cta-secondary"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 text-white px-6 py-3.5 font-medium transition-colors"
              >
                Explore Services
              </a>
            </motion.div>

            {/* Quick metric strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-14 grid grid-cols-3 gap-4 max-w-lg"
            >
              {[
                { k: "9K+", v: "Community" },
                { k: "End-to-End", v: "Engineering" },
                { k: "Global", v: "Remote Teams" },
              ].map((m) => (
                <div key={m.v} className="border-l border-white/10 pl-4">
                  <div className="font-display text-2xl">{m.k}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-1">
                    {m.v}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-5 relative"
            data-testid="hero-visual"
          >
            <div className="relative border border-white/10 bg-[#0a0a0a] overflow-hidden aspect-square">
              <img
                src={HERO_IMG}
                alt="AI engineering"
                className="w-full h-full object-cover float-y"
              />
              {/* Floating tag */}
              <div className="absolute top-4 left-4 border border-white/15 bg-black/60 backdrop-blur-md px-3 py-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-300">
                  System Online
                </span>
                <span className="inline-block ml-2 h-1.5 w-1.5 bg-[#F55036] pulse-dot align-middle" />
              </div>
              <div className="absolute bottom-4 right-4 border border-white/15 bg-black/60 backdrop-blur-md px-3 py-2">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  uptime
                </div>
                <div className="font-display text-lg">99.99%</div>
              </div>
            </div>
            {/* Tracing line accents */}
            <div className="absolute -bottom-3 -left-3 h-24 w-px bg-gradient-to-b from-[#F55036] to-transparent" />
            <div className="absolute -top-3 -right-3 w-24 h-px bg-gradient-to-l from-[#F55036] to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
