import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { LoginBackground } from "@/components/LoginBackground";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import type { AuthUser } from "@/contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await api.post<{ user: AuthUser }>("/api/v1/auth/login", { email, password });
    setLoading(false);

    if (result.ok) {
      login(result.data.user);
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <LoginBackground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-strong rounded-3xl p-10 glow-crimson">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-[var(--gradient-crimson)] grid place-items-center glow-crimson">
              <span className="font-display text-xl">命</span>
            </div>
            <h1 className="mt-5 font-display text-3xl">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">The path was waiting for you.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Field label="Email">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="you@quiet.place"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              />
            </Field>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-[var(--gradient-crimson)] py-3 text-sm font-medium text-primary-foreground glow-crimson hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? "Entering…" : "Enter Life Goes On"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            <Link to="/forgot-password" className="hover:text-foreground transition">
              Forgot your password?
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/register" className="text-foreground hover:text-crimson transition">
              Begin your journey →
            </Link>
          </p>

          <div className="mt-6 border-t border-white/10 pt-5 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition"
            >
              ← Back to home
            </Link>
          </div>
        </div>
        <p className="mt-6 text-center text-xs tracking-[0.3em] uppercase text-muted-foreground">
          Breathe · You are safe here
        </p>
      </motion.div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block glass rounded-xl px-4 py-3">
      <span className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
