import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin, Globe, ArrowUpRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const services = ["AI Development", "Web & Mobile", "DevOps & Cloud", "QA Automation", "Data Science", "UI/UX & Product", "Other"];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "", message: "" });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in name, email, and message.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, form);
      // Build WhatsApp message and open wa.me link for the user to send
      const waText =
        `New Inquiry — Veritech.AI\n\n` +
        `Name: ${form.name}\n` +
        `Email: ${form.email}\n` +
        (form.company ? `Company: ${form.company}\n` : "") +
        (form.service ? `Service: ${form.service}\n` : "") +
        `\nMessage:\n${form.message}`;
      const phone = "919371838418";
      const encoded = encodeURIComponent(waText);
      const isMobile = /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent || "");
      const waUrl = isMobile
        ? `whatsapp://send?phone=${phone}&text=${encoded}`
        : `https://web.whatsapp.com/send?phone=${phone}&text=${encoded}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
      toast.success("Saved. WhatsApp opened — tap Send to deliver your message.");
      setForm({ name: "", email: "", company: "", service: "", message: "" });
    } catch (err) {
      const detail = err?.response?.data?.detail || "Something went wrong. Please try again.";
      toast.error(typeof detail === "string" ? detail : "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" data-testid="contact-section" className="relative py-24 md:py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F55036] mb-4">
              [ 10 — Get in Touch ]
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.05]">
              Let's build something
              <br />
              <span className="text-gradient-ember italic font-normal">amazing</span> together.
            </h2>
            <p className="mt-6 text-zinc-400 leading-relaxed max-w-md">
              Tell us about your project. We typically respond within 24 hours with a clear next step.
            </p>

            <div className="mt-10 space-y-5">
              {[
                { Icon: Mail, label: "Email", value: "hello@veritech.ai" },
                { Icon: Phone, label: "Phone", value: "+1 (415) 555-0142" },
                { Icon: MapPin, label: "HQ", value: "Bengaluru · San Francisco" },
                { Icon: Linkedin, label: "LinkedIn", value: "/company/veritech-ai" },
                { Icon: Globe, label: "Web", value: "veritech.ai" },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-4">
                  <div className="h-9 w-9 grid place-items-center border border-white/15 bg-[#0c0c0c]">
                    <c.Icon size={14} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">{c.label}</div>
                    <div className="text-sm text-zinc-200">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.form
            onSubmit={submit}
            data-testid="contact-form"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 border border-white/10 bg-[#0a0a0a] p-8 md:p-10"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Name" required>
                <input
                  data-testid="contact-input-name"
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  className="input-line"
                  placeholder="Jane Doe"
                  required
                />
              </Field>
              <Field label="Email" required>
                <input
                  data-testid="contact-input-email"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  className="input-line"
                  placeholder="jane@company.com"
                  required
                />
              </Field>
              <Field label="Company">
                <input
                  data-testid="contact-input-company"
                  type="text"
                  value={form.company}
                  onChange={set("company")}
                  className="input-line"
                  placeholder="Acme Corp"
                />
              </Field>
              <Field label="Service Needed">
                <select
                  data-testid="contact-input-service"
                  value={form.service}
                  onChange={set("service")}
                  className="input-line"
                >
                  <option value="">Select a service…</option>
                  {services.map((s) => (
                    <option key={s} value={s} className="bg-[#0a0a0a]">
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="mt-5">
              <Field label="Message" required>
                <textarea
                  data-testid="contact-input-message"
                  rows={5}
                  value={form.message}
                  onChange={set("message")}
                  className="input-line resize-none"
                  placeholder="Tell us about your project, timeline, and goals…"
                  required
                />
              </Field>
            </div>

            <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 max-w-xs">
                Your data is encrypted in transit and never shared.
              </p>
              <button
                type="submit"
                disabled={loading}
                data-testid="contact-submit-btn"
                className="group inline-flex items-center gap-2 bg-[#F55036] hover:bg-[#E04830] disabled:opacity-60 disabled:cursor-not-allowed text-black px-6 py-3.5 font-medium transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    Submit
                    <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </div>

      <style>{`
        .input-line {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #27272a;
          padding: 12px 0;
          color: #f4f4f5;
          font-family: inherit;
          font-size: 14px;
          outline: none;
          transition: border-color 200ms ease;
        }
        .input-line::placeholder { color: #52525b; }
        .input-line:focus { border-bottom-color: #F55036; }
        select.input-line { appearance: none; cursor: pointer; }
      `}</style>
    </section>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1">
        {label} {required && <span className="text-[#F55036]">*</span>}
      </div>
      {children}
    </label>
  );
}
