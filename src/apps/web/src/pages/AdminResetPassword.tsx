import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

export default function AdminResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const result = await api.post<{ message: string }>("/api/v1/admin/reset-password", {
      token,
      password,
    });
    setLoading(false);

    if (result.ok) {
      setSuccess(true);
      setTimeout(() => navigate("/admin/login"), 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-(--gradient-crimson) glow-crimson text-2xl font-display">
            命
          </span>
          <p className="mt-3 text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Admin · Life Goes On
          </p>
        </div>

        <div className="glass rounded-2xl p-8 space-y-5">
          <h1 className="text-sm font-medium text-foreground text-center">Nueva contraseña</h1>

          {!token ? (
            <p className="text-sm text-center text-red-400">
              Este enlace no es válido. Solicita uno nuevo desde{" "}
              <Link to="/admin/forgot-password" className="underline underline-offset-4">
                aquí
              </Link>
              .
            </p>
          ) : success ? (
            <p className="text-sm text-center text-foreground/90 py-2">
              Contraseña actualizada. Redirigiendo al inicio de sesión...
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground uppercase tracking-widest">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-crimson/60 transition"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground uppercase tracking-widest">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-crimson/60 transition"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-(--gradient-crimson) py-2.5 text-sm font-medium text-primary-foreground glow-crimson hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Guardando..." : "Restablecer contraseña"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
