import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready) {
    return (
      <div className="min-h-screen bg-[#050505] text-zinc-500 grid place-items-center font-mono text-xs uppercase tracking-[0.2em]">
        Loading…
      </div>
    );
  }
  if (!user) return <Navigate to="/admindata" replace />;
  return children;
}
