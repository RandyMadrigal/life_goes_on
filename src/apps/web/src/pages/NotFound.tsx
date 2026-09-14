import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { AtmosphericBackdrop } from "@/components/AtmosphericBackdrop";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <Navbar />
      <AtmosphericBackdrop petals={14} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-md"
      >
        <p className="text-[10px] tracking-[0.35em] uppercase text-crimson/70 mb-6">
          命 · Lost, but not forever
        </p>
        <h1 className="font-display text-7xl md:text-8xl mb-4">404</h1>
        <p className="text-lg text-foreground/90 mb-3">This page doesn't exist.</p>
        <p className="text-sm text-muted-foreground mb-10 leading-relaxed">
          Even the path you meant to take isn't always the one you find. Let's get you back.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-(--gradient-crimson) px-7 py-3.5 text-sm font-medium text-primary-foreground glow-crimson hover:brightness-110 transition"
        >
          ← Back home
        </Link>
      </motion.div>
    </div>
  );
}
