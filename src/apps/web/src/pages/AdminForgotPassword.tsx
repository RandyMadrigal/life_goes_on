import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await api.post<{ message: string }>("/api/v1/admin/forgot-password", { email });
    setLoading(false);
    setEmail("");
    setSubmitted(true);
    setMessage(result.ok ? result.data.message : result.message);
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
          <div className="space-y-1 text-center">
            <h1 className="text-sm font-medium text-foreground">Recuperar contraseña</h1>
            <p className="text-xs text-muted-foreground">
              Ingresa tu correo y te enviaremos un enlace para restablecerla.
            </p>
          </div>

          {submitted ? (
            <p className="text-sm text-center text-foreground/90 py-2">{message}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground uppercase tracking-widest">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-crimson/60 transition"
                  placeholder="admin@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-(--gradient-crimson) py-2.5 text-sm font-medium text-primary-foreground glow-crimson hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Enviando..." : "Enviar enlace"}
              </button>
            </form>
          )}

          <p className="text-center">
            <Link
              to="/admin/login"
              className="text-xs text-muted-foreground hover:text-foreground transition underline underline-offset-4"
            >
              Volver a iniciar sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
