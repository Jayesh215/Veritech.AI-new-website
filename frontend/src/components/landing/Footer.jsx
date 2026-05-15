import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Linkedin, Twitter, Github, ArrowUpRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const cols = [
  {
    label: "Services",
    items: ["AI Development", "Web & Mobile", "DevOps & Cloud", "QA Automation", "Data Science", "UI/UX"],
  },
  {
    label: "Company",
    items: ["About", "Projects", "Careers", "Process", "Contact"],
  },
  {
    label: "Resources",
    items: ["Case Studies", "Insights", "Tech Stack", "Industries", "Press"],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter an email.");
    setLoading(true);
    try {
      await axios.post(`${API}/newsletter`, { email });
      toast.success("Subscribed. Welcome to the loop.");
      setEmail("");
    } catch (err) {
      toast.error(err?.response?.data?.detail?.[0]?.msg || "Invalid email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer data-testid="footer-section" className="relative border-t border-white/10 bg-[#070707]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-7 w-7 border border-white/20 grid place-items-center bg-[#0c0c0c]">
                <div className="h-2 w-2 bg-[#F55036]" />
              </div>
              <span className="font-display text-lg tracking-tight">
                Veritech<span className="text-[#F55036]">.AI</span>
              </span>
            </div>
            <p className="text-zinc-400 leading-relaxed max-w-md">
              An AI-driven digital engineering studio building intelligent software systems and
              scalable products for ambitious teams.
            </p>

            <form onSubmit={subscribe} data-testid="newsletter-form" className="mt-8 max-w-md">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-3">
                Newsletter — engineering notes, monthly
              </div>
              <div className="flex border border-white/15 bg-[#0a0a0a]">
                <input
                  data-testid="newsletter-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-zinc-600"
                />
                <button
                  type="submit"
                  data-testid="newsletter-submit"
                  disabled={loading}
                  className="px-4 bg-[#F55036] hover:bg-[#E04830] text-black transition-colors disabled:opacity-60"
                  aria-label="Subscribe"
                >
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </form>
          </div>

          {cols.map((c) => (
            <div key={c.label} className="lg:col-span-2">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-5">
                {c.label}
              </div>
              <ul className="space-y-3">
                {c.items.map((it) => (
                  <li key={it}>
                    <a
                      href={`#${c.label === "Company" ? it.toLowerCase() : "contact"}`}
                      className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      {it}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-1">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-5">
              Social
            </div>
            <div className="flex lg:flex-col gap-3">
              {[
                { Icon: Linkedin, label: "LinkedIn", href: "#" },
                { Icon: Twitter, label: "Twitter", href: "#" },
                { Icon: Github, label: "Github", href: "#" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  data-testid={`social-${label.toLowerCase()}`}
                  className="h-9 w-9 grid place-items-center border border-white/15 hover:border-[#F55036] hover:text-[#F55036] transition-colors"
                >
                  <Icon size={14} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
            © {new Date().getFullYear()} Veritech.AI Software IT Services · All rights reserved
          </div>
          <div className="flex gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
