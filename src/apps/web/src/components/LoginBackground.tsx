import { useMemo } from "react";
import { motion } from "framer-motion";

/* ─── Moon ───────────────────────────────────────────────────────────────── */
function MoonGlow() {
  return (
    <div className="absolute" style={{ top: "9%", right: "18%", zIndex: 1 }}>
      {/* Wide atmospheric corona */}
      <motion.div
        animate={{ opacity: [0.12, 0.24, 0.12], scale: [1, 1.07, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 340,
          height: 340,
          top: -130,
          left: -130,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, oklch(0.88 0.02 225 / 0.42) 0%, transparent 68%)",
          filter: "blur(28px)",
        }}
      />
      {/* Inner halo */}
      <motion.div
        animate={{ opacity: [0.26, 0.46, 0.26] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        style={{
          position: "absolute",
          width: 140,
          height: 140,
          top: -30,
          left: -30,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, oklch(0.92 0.02 215 / 0.38) 0%, transparent 68%)",
          filter: "blur(14px)",
        }}
      />
      {/* Moon disc */}
      <motion.div
        animate={{ opacity: [0.78, 0.94, 0.78] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "relative",
          width: 78,
          height: 78,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, oklch(0.97 0.012 75) 0%, oklch(0.86 0.025 215) 100%)",
          boxShadow: [
            "0 0 28px 8px oklch(0.86 0.02 218 / 0.5)",
            "0 0 55px 18px oklch(0.76 0.04 220 / 0.25)",
            "inset -5px -5px 14px oklch(0.7 0.04 220 / 0.3)",
          ].join(", "),
        }}
      />
    </div>
  );
}

/* ─── Mountains ──────────────────────────────────────────────────────────── */
function MountainHorizon() {
  return (
    <svg
      className="absolute bottom-0 left-0 w-full"
      viewBox="0 0 1440 360"
      preserveAspectRatio="none"
      style={{ zIndex: 2, height: "46%" }}
    >
      {/* Distant peaks */}
      <path
        d="M0,255 L95,190 L205,240 L315,162 L435,215 L555,143 L678,196 L800,155 L918,206 L1048,166 L1165,208 L1292,172 L1408,218 L1440,205 L1440,360 L0,360 Z"
        fill="oklch(0.125 0.025 242 / 0.8)"
      />
      {/* Mid range */}
      <path
        d="M0,298 L155,232 L285,274 L408,208 L525,257 L645,190 L762,248 L882,212 L1002,258 L1135,222 L1258,265 L1385,235 L1440,256 L1440,360 L0,360 Z"
        fill="oklch(0.095 0.02 240 / 0.92)"
      />
      {/* Foreground hills */}
      <path
        d="M0,332 L178,278 L332,316 L485,265 L622,308 L772,260 L922,296 L1082,270 L1245,300 L1440,280 L1440,360 L0,360 Z"
        fill="oklch(0.068 0.015 240)"
      />
    </svg>
  );
}

/* ─── Fog ────────────────────────────────────────────────────────────────── */
function CinematicFog() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 3 }}>
      {/* Ground fog */}
      <div
        className="absolute bottom-0 left-0 right-0 blur-3xl"
        style={{
          height: "55%",
          background:
            "radial-gradient(ellipse at 38% 100%, oklch(0.23 0.052 242 / 0.6) 0%, transparent 65%)",
          animation: "lgFog1 50s ease-in-out infinite alternate",
        }}
      />
      {/* Left mid */}
      <div
        className="absolute blur-2xl"
        style={{
          bottom: "14%",
          left: "-14%",
          width: "74%",
          height: "34%",
          background:
            "radial-gradient(ellipse, oklch(0.19 0.068 232 / 0.48) 0%, transparent 65%)",
          animation: "lgFog2 70s ease-in-out infinite alternate",
        }}
      />
      {/* Right mid */}
      <div
        className="absolute blur-2xl"
        style={{
          bottom: "7%",
          right: "-10%",
          width: "62%",
          height: "30%",
          background:
            "radial-gradient(ellipse, oklch(0.16 0.055 255 / 0.42) 0%, transparent 65%)",
          animation: "lgFog3 84s ease-in-out infinite alternate",
        }}
      />
      {/* Crimson ember glow (samurai side) */}
      <div
        className="absolute blur-3xl"
        style={{
          bottom: 0,
          right: "3%",
          width: "42%",
          height: "30%",
          background:
            "radial-gradient(ellipse at 65% 100%, oklch(0.56 0.2 16 / 0.22) 0%, transparent 60%)",
          animation: "lgFog1 34s ease-in-out infinite alternate",
        }}
      />
      <style>{`
        @keyframes lgFog1 {
          0%   { transform: translateX(-4%) scale(1); }
          100% { transform: translateX(4%) scale(1.08); }
        }
        @keyframes lgFog2 {
          0%   { transform: translateX(0) translateY(0); }
          100% { transform: translateX(9%) translateY(-4%); }
        }
        @keyframes lgFog3 {
          0%   { transform: translateX(0) translateY(4%); }
          100% { transform: translateX(-7%) translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Katana ─────────────────────────────────────────────────────────────── */
function KatanaSilhouette() {
  return (
    <div
      className="absolute hidden md:block"
      style={{ bottom: 0, right: "7%", zIndex: 4, width: 88 }}
    >
      {/* Crimson glow radiating from the blade */}
      <motion.div
        animate={{ opacity: [0.18, 0.36, 0.18], scale: [1, 1.07, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "-10%",
          left: "-120%",
          right: "-120%",
          bottom: "-5%",
          background:
            "radial-gradient(ellipse at 50% 60%, oklch(0.62 0.2 15 / 0.34) 0%, oklch(0.28 0.1 242 / 0.14) 55%, transparent 75%)",
          filter: "blur(28px)",
        }}
      />

      {/*
       * Katana — blade pointing upward, leaning 6° (handle-right).
       * ViewBox 90 × 500.
       *   Kashira (pommel)   : y 488–500
       *   Tsuka (handle)     : y 365–488
       *   Tsuba (guard disc) : y 348–365
       *   Habaki (collar)    : y 318–348
       *   Blade              : y   6–318
       *   Kissaki (tip)      : y   6
       *
       * Ha (edge)  — left side, curves outward toward viewer
       * Mune (spine) — right side, nearly straight
       */}
      <motion.svg
        viewBox="0 0 90 500"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "100%",
          transform: "rotate(6deg)",
          transformOrigin: "bottom center",
          filter: "drop-shadow(0 0 16px oklch(0.58 0.18 15 / 0.55))",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.93 }}
        transition={{ duration: 4, delay: 0.8, ease: "easeIn" }}
      >
        <g fill="#020309">
          {/* Kashira (pommel cap) */}
          <ellipse cx="45" cy="493" rx="10" ry="6" />

          {/* Tsuka (handle) */}
          <path d="M 37 480 L 53 480 L 51 368 L 39 368 Z" />

          {/* Tsuba (guard) — wide flat disc */}
          <ellipse cx="45" cy="358" rx="28" ry="10" />

          {/* Habaki (blade collar) */}
          <path d="M 40 348 L 50 348 L 49 316 L 41 316 Z" />

          {/* Blade — ha (edge) curves left, mune (spine) near-straight right */}
          <path d="M 41 316 C 36 230 30 130 37 6 L 41 5 C 52 130 54 230 49 316 Z" />
        </g>
      </motion.svg>
    </div>
  );
}

/* ─── Sakura Petals (absolute, not fixed, so z-index is respected) ────────── */
function LoginPetals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 14,
        duration: 14 + Math.random() * 18,
        size: 7 + Math.random() * 11,
        drift: (Math.random() - 0.5) * 220,
        rotate: Math.random() * 360,
        opacity: 0.4 + Math.random() * 0.5,
      })),
    [],
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 5 }}
    >
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute -top-10 block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `lgPetal ${p.duration}s linear ${p.delay}s infinite`,
            ["--lgd" as never]: `${p.drift}px`,
            ["--lgr" as never]: `${p.rotate}deg`,
          }}
        >
          <svg
            viewBox="0 0 20 20"
            className="h-full w-full drop-shadow-[0_0_5px_rgba(255,170,195,0.5)]"
          >
            <path
              d="M10 1 C 13 5, 18 8, 10 19 C 2 8, 7 5, 10 1 Z"
              fill="oklch(0.88 0.1 5)"
              opacity="0.88"
            />
          </svg>
        </span>
      ))}
      <style>{`
        @keyframes lgPetal {
          0%   { transform: translate3d(0, -5vh, 0) rotate(0deg); }
          100% { transform: translate3d(var(--lgd), 112vh, 0) rotate(calc(var(--lgr) + 540deg)); }
        }
      `}</style>
    </div>
  );
}

/* ─── Floating light particles ────────────────────────────────────────────── */
function FloatingParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 42 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 28,
        duration: 18 + Math.random() * 26,
        size: 1 + Math.random() * 2.5,
        opacity: 0.22 + Math.random() * 0.55,
        drift: (Math.random() - 0.5) * 95,
        pink: i % 5 === 0,
      })),
    [],
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 6 }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            background: p.pink
              ? `oklch(0.88 0.09 5 / ${p.opacity})`
              : `oklch(0.92 0.01 230 / ${p.opacity * 0.6})`,
            boxShadow: p.pink
              ? `0 0 ${p.size * 3}px oklch(0.88 0.08 5 / 0.52)`
              : `0 0 ${p.size * 2}px oklch(0.9 0.01 230 / 0.28)`,
            animation: `lgParticle ${p.duration}s linear ${p.delay}s infinite`,
            ["--lgpd" as never]: `${p.drift}px`,
          }}
        />
      ))}
      <style>{`
        @keyframes lgParticle {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          8%   { opacity: 1; }
          88%  { opacity: 0.25; }
          100% { transform: translateY(-110vh) translateX(var(--lgpd)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────────────────────── */
export function LoginBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Deep cinematic night sky — always dark regardless of theme */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.055 0.03 254) 0%, oklch(0.072 0.038 244) 38%, oklch(0.092 0.028 236) 68%, oklch(0.062 0.02 240) 100%)",
        }}
      />

      <MoonGlow />
      <MountainHorizon />
      <CinematicFog />
      <KatanaSilhouette />
      <LoginPetals />
      <FloatingParticles />

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 7,
          background:
            "radial-gradient(ellipse at 50% 46%, transparent 18%, rgba(0,0,0,0.56) 100%)",
        }}
      />
    </div>
  );
}
