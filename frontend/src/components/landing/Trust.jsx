import Marquee from "react-fast-marquee";
import { Cloud } from "lucide-react";
import { SiReact, SiNodedotjs, SiDocker, SiPython, SiTensorflow, SiKubernetes, SiOpenai, SiVercel } from "react-icons/si";

const logos = [
  { Icon: Cloud, label: "AWS" },
  { Icon: Cloud, label: "Azure" },
  { Icon: SiReact, label: "React" },
  { Icon: SiNodedotjs, label: "Node.js" },
  { Icon: SiDocker, label: "Docker" },
  { Icon: SiPython, label: "Python" },
  { Icon: SiTensorflow, label: "TensorFlow" },
  { Icon: SiKubernetes, label: "Kubernetes" },
  { Icon: SiOpenai, label: "OpenAI" },
  { Icon: SiVercel, label: "Vercel" },
];

const stats = [
  { k: "9K+", v: "Community Members" },
  { k: "100%", v: "Agile Delivery" },
  { k: "24/7", v: "Global Coverage" },
  { k: "End-to-End", v: "Engineering" },
];

export default function Trust() {
  return (
    <section data-testid="trust-section" className="relative border-y border-white/10 bg-[#070707]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((s) => (
            <div key={s.v} data-testid={`stat-${s.v.toLowerCase().replace(/\s/g, "-")}`} className="border border-white/10 p-6 bg-[#0c0c0c]">
              <div className="font-display text-3xl md:text-4xl tracking-tight">{s.k}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-2">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Powered by industry-leading technologies
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="marquee-fade" data-testid="tech-marquee">
          <Marquee speed={40} gradient={false} pauseOnHover>
            {logos.map(({ Icon, label }, i) => (
              <div key={i} className="flex items-center gap-3 mx-10 text-zinc-500 hover:text-white transition-colors">
                <Icon size={26} />
                <span className="font-mono text-xs uppercase tracking-[0.18em]">{label}</span>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
