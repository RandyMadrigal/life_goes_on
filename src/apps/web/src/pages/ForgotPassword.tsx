import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AtmosphericBackdrop } from "@/components/AtmosphericBackdrop";
import { api } from "@/lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await api.post("/api/v1/auth/forgot-password", { email });
    setLoading(false);

    if (result.ok) {
      setSent(true);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <AtmosphericBackdrop petals={14} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6 }}
              className="glass-strong rounded-3xl p-10 glow-crimson text-center"
            >
              <div className="mx-auto h-16 w-16 rounded-full bg-[var(--gradient-crimson)] grid place-items-center glow-crimson">
                <span className="font-display text-2xl">封</span>
              </div>
              <h1 className="mt-6 font-display text-3xl">Letter sent.</h1>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                If that email is registered, you will receive reset instructions shortly.
                <br />
                <span className="text-foreground/70">Check your inbox — and your spam folder.</span>
              </p>
              <p className="mt-8 text-xs text-muted-foreground">
                The link expires in{" "}
                <span className="text-foreground/70">10 minutes</span>.
              </p>
              <Link
                to="/login"
                className="mt-8 inline-block rounded-full bg-[var(--gradient-crimson)] px-7 py-3 text-sm font-medium text-primary-foreground glow-crimson hover:brightness-110 transition"
              >
                Back to sign in
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6 }}
              className="glass-strong rounded-3xl p-10 glow-crimson"
            >
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-[var(--gradient-crimson)] grid place-items-center glow-crimson">
                  <span className="font-display text-xl">命</span>
                </div>
                <h1 className="mt-5 font-display text-3xl">Forgot your path?</h1>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Enter your email and we will send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <label className="block glass rounded-xl px-4 py-3">
                  <span className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                    Email
                  </span>
                  <div className="mt-1">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="you@quiet.place"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                      autoFocus
                    />
                  </div>
                </label>

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
                  {loading ? "Sending…" : "Send reset link"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Remembered?{" "}
                <Link to="/login" className="text-foreground hover:text-crimson transition">
                  Sign in →
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-6 text-center text-xs tracking-[0.3em] uppercase text-muted-foreground">
          Breathe · You are safe here
        </p>
      </motion.div>
    </div>
  );
}
