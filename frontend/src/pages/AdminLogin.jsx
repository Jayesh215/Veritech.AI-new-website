import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatApiErrorDetail } from "../lib/api";
import { Lock, Mail, Loader2, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const { user, ready, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (ready && user) return <Navigate to="/admindata/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Enter email and password.");
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back.");
      navigate("/admindata/dashboard");
    } catch (err) {
      toast.error(formatApiErrorDetail(err?.response?.data?.detail) || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="admin-login" className="min-h-screen grid place-items-center bg-[#050505] text-[#F4F4F5] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid radial-fade pointer-events-none" />
      <div className="absolute -top-40 -right-40 h-[420px] w-[420px] rounded-full bg-[#F55036]/10 blur-3xl pointer-events-none" />

      <form onSubmit={submit} className="relative w-full max-w-md border border-white/10 bg-[#0a0a0a] p-10">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-7 w-7 border border-white/20 grid place-items-center bg-[#0c0c0c]">
            <div className="h-2 w-2 bg-[#F55036]" />
          </div>
          <span className="font-display text-lg tracking-tight">
            Veritech<span className="text-[#F55036]">.AI</span>
          </span>
          <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Admin</span>
        </div>

        <h1 className="font-display text-3xl tracking-tight mb-2">Sign in</h1>
        <p className="text-sm text-zinc-400 mb-8">Restricted access. Authorized personnel only.</p>

        <label className="block mb-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 flex items-center gap-2">
            <Mail size={11} /> Email
          </div>
          <input
            data-testid="admin-login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full bg-transparent border-b border-white/15 focus:border-[#F55036] outline-none py-2.5 text-sm"
            autoComplete="email"
            required
          />
        </label>

        <label className="block mb-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 flex items-center gap-2">
            <Lock size={11} /> Password
          </div>
          <input
            data-testid="admin-login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-transparent border-b border-white/15 focus:border-[#F55036] outline-none py-2.5 text-sm"
            autoComplete="current-password"
            required
          />
        </label>

        <button
          type="submit"
          data-testid="admin-login-submit"
          disabled={loading}
          className="group w-full inline-flex items-center justify-center gap-2 bg-[#F55036] hover:bg-[#E04830] disabled:opacity-60 text-black px-6 py-3.5 font-medium transition-colors"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : <>Sign in <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></>}
        </button>

        <a href="/" className="block text-center mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
          ← Back to website
        </a>
      </form>
    </div>
  );
}
