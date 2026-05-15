import Marquee from "react-fast-marquee";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Veritech rebuilt our AI inference pipeline and cut latency by 67%. They write production code, not slides.",
    name: "Priya Nair",
    role: "CTO, NeuroLogix",
  },
  {
    quote: "They embedded with our team for a quarter and shipped what our incumbent vendor couldn't in a year.",
    name: "Marcus Bennet",
    role: "VP Engineering, Helio Health",
  },
  {
    quote: "Genuine senior engineers across AI, cloud, and product. A rare combination at this price point.",
    name: "Sofia Reyes",
    role: "Founder, Linea Commerce",
  },
  {
    quote: "From discovery to deployment, the discipline was on par with what we expect internally at scale.",
    name: "Daniel Okafor",
    role: "Head of Platform, Vento SaaS",
  },
  {
    quote: "Our LangChain agent went from prototype to 40k MAU on Veritech's architecture. Zero downtime.",
    name: "Aria Tanaka",
    role: "Product Lead, Cortex AI",
  },
];

function Card({ t, i }) {
  return (
    <div
      data-testid={`testimonial-${i}`}
      className="w-[380px] md:w-[440px] mx-3 p-8 border border-white/10 bg-white/[0.03] backdrop-blur-md flex flex-col"
    >
      <Quote size={20} className="text-[#F55036] mb-5" />
      <p className="text-zinc-200 leading-relaxed text-[15px] flex-1">"{t.quote}"</p>
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="font-display text-sm">{t.name}</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-1">{t.role}</div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" data-testid="testimonials-section" className="relative py-24 md:py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-4">
          [ 08 — Testimonials ]
        </div>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight max-w-3xl leading-[1.05]">
          The teams we build with don't go back to the alternatives.
        </h2>
      </div>

      <div className="marquee-fade">
        <Marquee speed={30} gradient={false} pauseOnHover>
          {testimonials.map((t, i) => (
            <Card key={i} t={t} i={i} />
          ))}
        </Marquee>
      </div>
      <div className="marquee-fade mt-6">
        <Marquee speed={28} gradient={false} pauseOnHover direction="right">
          {testimonials.slice().reverse().map((t, i) => (
            <Card key={`r-${i}`} t={t} i={`r-${i}`} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
