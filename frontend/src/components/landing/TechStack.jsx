import Marquee from "react-fast-marquee";
import { Cloud } from "lucide-react";
import {
  SiReact, SiNextdotjs, SiAngular, SiVuedotjs,
  SiNodedotjs, SiPython, SiOpenjdk, SiDotnet,
  SiTensorflow, SiOpenai, SiHuggingface, SiLangchain,
  SiGooglecloud, SiDocker, SiKubernetes,
  SiPostgresql, SiMongodb, SiFirebase,
} from "react-icons/si";

const SiAmazon = Cloud;
const SiMicrosoftazure = Cloud;

const groups = [
  {
    label: "Frontend",
    items: [
      { Icon: SiReact, name: "React" },
      { Icon: SiNextdotjs, name: "Next.js" },
      { Icon: SiAngular, name: "Angular" },
      { Icon: SiVuedotjs, name: "Vue" },
    ],
  },
  {
    label: "Backend",
    items: [
      { Icon: SiNodedotjs, name: "Node.js" },
      { Icon: SiPython, name: "Python" },
      { Icon: SiOpenjdk, name: "Java" },
      { Icon: SiDotnet, name: ".NET" },
    ],
  },
  {
    label: "AI / ML",
    items: [
      { Icon: SiTensorflow, name: "TensorFlow" },
      { Icon: SiOpenai, name: "OpenAI" },
      { Icon: SiLangchain, name: "LangChain" },
      { Icon: SiHuggingface, name: "Hugging Face" },
    ],
  },
  {
    label: "Cloud / DevOps",
    items: [
      { Icon: SiAmazon, name: "AWS" },
      { Icon: SiMicrosoftazure, name: "Azure" },
      { Icon: SiGooglecloud, name: "GCP" },
      { Icon: SiDocker, name: "Docker" },
      { Icon: SiKubernetes, name: "Kubernetes" },
    ],
  },
  {
    label: "Databases",
    items: [
      { Icon: SiPostgresql, name: "PostgreSQL" },
      { Icon: SiMongodb, name: "MongoDB" },
      { Icon: SiFirebase, name: "Firebase" },
    ],
  },
];

export default function TechStack() {
  const flat = groups.flatMap((g) => g.items);
  return (
    <section id="tech" data-testid="tech-stack-section" className="relative py-24 md:py-32 border-t border-white/10 bg-[#070707]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-4">
              [ 07 — Tech Stack ]
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.05]">
              Battle-tested technologies. Pragmatically selected, expertly composed.
            </h2>
          </div>
          <p className="lg:col-span-5 text-zinc-400 leading-relaxed lg:pt-2">
            We pick the right tool for the job — not the trendiest one. Every architecture
            decision is grounded in long-term maintainability and your team's capacity.
          </p>
        </div>

        <div className="marquee-fade mb-12">
          <Marquee speed={30} gradient={false}>
            {flat.concat(flat).map(({ Icon, name }, i) => (
              <div key={i} className="flex items-center gap-3 mx-8 text-zinc-500 hover:text-white transition-colors">
                <Icon size={32} />
                <span className="font-mono text-xs uppercase tracking-[0.18em]">{name}</span>
              </div>
            ))}
          </Marquee>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/10 border border-white/10">
          {groups.map((g) => (
            <div key={g.label} data-testid={`tech-group-${g.label.toLowerCase().replace(/\s|\//g, "-")}`} className="bg-[#0a0a0a] p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-4">
                {g.label}
              </div>
              <ul className="space-y-2.5">
                {g.items.map((it) => (
                  <li key={it.name} className="flex items-center gap-2.5 text-sm text-zinc-300">
                    <it.Icon size={14} className="text-zinc-500 shrink-0" />
                    {it.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
