import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AtmosphericBackdrop } from "@/components/AtmosphericBackdrop";
import { api } from "@/lib/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <AtmosphericBackdrop petals={10} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 glass-strong rounded-3xl p-10 max-w-md w-full text-center glow-crimson"
        >
          <p className="font-display text-2xl">Invalid link.</p>
          <p className="mt-3 text-sm text-muted-foreground">
            This reset link is missing or has expired.
          </p>
          <Link
            to="/forgot-password"
            className="mt-6 inline-block rounded-full bg-[var(--gradient-crimson)] px-7 py-3 text-sm font-medium text-primary-foreground glow-crimson hover:brightness-110 transition"
          >
            Request a new link
          </Link>
        </motion.div>
      </div>
    );
  }

  const validate = (): string => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain a number";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError("");
    setLoading(true);

    const result = await api.post("/api/v1/auth/reset-password", { token, password });
    setLoading(false);

    if (result.ok) {
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
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
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6 }}
              className="glass-strong rounded-3xl p-10 glow-crimson text-center"
            >
              <div className="mx-auto h-16 w-16 rounded-full bg-[var(--gradient-crimson)] grid place-items-center glow-crimson">
                <span className="font-display text-2xl">望</span>
              </div>
              <h1 className="mt-6 font-display text-3xl">Password reset.</h1>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Your password has been changed successfully.
                <br />
                <span className="text-foreground/70">Redirecting you to sign in…</span>
              </p>
              <Link
                to="/login"
                className="mt-8 inline-block rounded-full bg-[var(--gradient-crimson)] px-7 py-3 text-sm font-medium text-primary-foreground glow-crimson hover:brightness-110 transition"
              >
                Sign in now
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
                <h1 className="mt-5 font-display text-3xl">New password</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose something you will remember.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div className="relative">
                  <label className="block glass rounded-xl px-4 py-3">
                    <span className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                      New password
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(""); }}
                        placeholder="Min 8 chars, uppercase, lowercase, number"
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xs text-muted-foreground hover:text-foreground transition shrink-0"
                      >
                        {showPassword ? "hide" : "show"}
                      </button>
                    </div>
                  </label>
                </div>

                <label className="block glass rounded-xl px-4 py-3">
                  <span className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                    Confirm password
                  </span>
                  <div className="mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                      placeholder="Repeat your password"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                    />
                  </div>
                </label>

                <div className="glass rounded-xl px-4 py-3 text-xs text-muted-foreground space-y-1">
                  <RequirementRow met={password.length >= 8} text="At least 8 characters" />
                  <RequirementRow met={/[A-Z]/.test(password)} text="One uppercase letter" />
                  <RequirementRow met={/[a-z]/.test(password)} text="One lowercase letter" />
                  <RequirementRow met={/[0-9]/.test(password)} text="One number" />
                </div>

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
                  {loading ? "Saving…" : "Reset password"}
                </button>
              </form>
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

function RequirementRow({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`transition-colors ${met ? "text-crimson" : "text-muted-foreground/40"}`}>
        {met ? "✓" : "○"}
      </span>
      <span className={`transition-colors ${met ? "text-foreground/70" : ""}`}>{text}</span>
    </div>
  );
}
