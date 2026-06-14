import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { AtmosphericBackdrop } from "@/components/AtmosphericBackdrop";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import type { AuthUser } from "@/contexts/AuthContext";
import { MOODS, moodLabel } from "@/data/moods";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    time: "08:00",
    mood: "" as (typeof MOODS)[number] | "",
    password: "",
    confirmPassword: "",
  });

  const steps = [
    { label: "Your name", key: "name" },
    { label: "How we reach you", key: "email" },
    { label: "When should we whisper?", key: "time" },
    { label: "How do you feel today?", key: "mood" },
    { label: "Create your password", key: "password" },
  ] as const;

  const validateCurrentStep = (): string => {
    switch (step) {
      case 0:
        if (form.name.trim().length < 2) return "Name must be at least 2 characters";
        break;
      case 1:
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email";
        break;
      case 3:
        if (!form.mood) return "Please select a mood";
        break;
      case 4:
        if (form.password.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(form.password)) return "Password must contain an uppercase letter";
        if (!/[a-z]/.test(form.password)) return "Password must contain a lowercase letter";
        if (!/[0-9]/.test(form.password)) return "Password must contain a number";
        if (form.password !== form.confirmPassword) return "Passwords do not match";
        break;
    }
    return "";
  };

  const next = async () => {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");

    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    const result = await api.post<{ user: AuthUser }>("/api/v1/auth/register", {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      mood: form.mood,
      preferredEmailTime: form.time,
    });
    setLoading(false);

    if (result.ok) {
      login(result.data.user);
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  const back = () => {
    if (step > 0) {
      setStep(step - 1);
      setError("");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <AtmosphericBackdrop petals={18} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="glass-strong rounded-3xl p-10 glow-crimson">
          <div className="flex items-center justify-between text-xs tracking-[0.25em] uppercase text-muted-foreground">
            <span>命 Begin</span>
            <span>
              {step + 1} / {steps.length}
            </span>
          </div>

          <div className="mt-3 h-px w-full bg-white/10 overflow-hidden rounded">
            <motion.div
              className="h-full bg-[var(--gradient-crimson)]"
              animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8 min-h-[220px]"
          >
            <h2 className="font-display text-3xl">{steps[step].label}</h2>

            <div className="mt-6">
              {step === 0 && (
                <StepInput
                  value={form.name}
                  onChange={(v) => {
                    setForm({ ...form, name: v });
                    setError("");
                  }}
                  placeholder="What should we call you?"
                  autoFocus
                />
              )}
              {step === 1 && (
                <StepInput
                  type="email"
                  value={form.email}
                  onChange={(v) => {
                    setForm({ ...form, email: v });
                    setError("");
                  }}
                  placeholder="you@quiet.place"
                  autoFocus
                />
              )}
              {step === 2 && (
                <StepInput
                  type="time"
                  value={form.time}
                  onChange={(v) => setForm({ ...form, time: v })}
                />
              )}
              {step === 3 && (
                <div className="flex flex-wrap gap-2">
                  {MOODS.map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => {
                        setForm({ ...form, mood: m });
                        setError("");
                      }}
                      className={`glass rounded-full px-4 py-2 text-sm transition ${
                        form.mood === m
                          ? "bg-(--gradient-crimson) text-primary-foreground glow-crimson"
                          : "hover:bg-white/10"
                      }`}
                    >
                      {moodLabel(m)}
                    </button>
                  ))}
                </div>
              )}
              {step === 4 && (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => {
                        setForm({ ...form, password: e.target.value });
                        setError("");
                      }}
                      placeholder="Min 8 chars, uppercase, lowercase, number"
                      className="glass w-full rounded-xl px-4 py-3 pr-12 text-base outline-none placeholder:text-muted-foreground/60"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition"
                    >
                      {showPassword ? "hide" : "show"}
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => {
                      setForm({ ...form, confirmPassword: e.target.value });
                      setError("");
                    }}
                    placeholder="Confirm password"
                    className="glass w-full rounded-xl px-4 py-3 text-base outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
              )}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}
          </motion.div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={back}
              disabled={step === 0 || loading}
              className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition"
            >
              ← Back
            </button>
            <button
              onClick={next}
              disabled={loading}
              className="rounded-full bg-[var(--gradient-crimson)] px-6 py-2.5 text-sm font-medium text-primary-foreground glow-crimson hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? "…" : step === steps.length - 1 ? "Enter" : "Continue"} {!loading && "→"}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already walking?{" "}
          <Link to="/login" className="text-foreground hover:text-crimson transition">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

type StepInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  value: string;
  onChange: (v: string) => void;
};

function StepInput({ value, onChange, ...props }: StepInputProps) {
  return (
    <input
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="glass w-full rounded-xl px-4 py-3 text-base outline-none placeholder:text-muted-foreground/60"
    />
  );
}
