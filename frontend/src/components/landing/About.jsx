import { motion } from "framer-motion";

const ABOUT_IMG =
  "https://static.prod-images.emergentagent.com/jobs/3db90e78-36cd-4f39-8bf5-0f18091d5b8b/images/74254e3109394e1786952cf1879eb71903af9c7d87d4bcd4e1d73dfa4ea72acc.png";

export default function About() {
  return (
    <section id="about" data-testid="about-section" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 order-2 lg:order-1"
          >
            <div className="relative border border-white/10 overflow-hidden">
              <img src={ABOUT_IMG} alt="Who we are" className="w-full aspect-[4/3] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="grid grid-cols-2 mt-4 border border-white/10">
              <div className="p-5 border-r border-white/10">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Founded</div>
                <div className="font-display text-2xl mt-1">2022</div>
              </div>
              <div className="p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Engineers</div>
                <div className="font-display text-2xl mt-1">120+</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6 order-1 lg:order-2"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-4">
              [ 01 — About Veritech ]
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.05]">
              We engineer intelligent systems for companies that refuse to settle for incremental.
            </h2>
            <p className="mt-6 text-zinc-400 leading-relaxed">
              Veritech.AI is an AI-driven digital engineering and technology solutions company
              helping startups, businesses, and enterprises accelerate innovation through
              intelligent software systems and scalable digital products.
            </p>
            <p className="mt-4 text-zinc-400 leading-relaxed">
              We combine deep technical expertise, agile engineering methodologies, and modern
              technologies to deliver future-ready solutions across AI Development, Cloud
              Engineering, DevOps, QA Automation, and Data Science.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { k: "Mission", v: "Empower organizations through transformative software." },
                { k: "Approach", v: "AI-first. Engineering-led. Outcome-driven." },
              ].map((c) => (
                <div key={c.k} className="border border-white/10 p-4 bg-[#0c0c0c]">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036]">{c.k}</div>
                  <div className="text-sm text-zinc-300 mt-2 leading-relaxed">{c.v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
