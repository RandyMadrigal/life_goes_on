import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import samuraiHero from "@/assets/samurai-hero.jpg";
import { Navbar } from "@/components/Navbar";
import { AtmosphericBackdrop } from "@/components/AtmosphericBackdrop";
import { api } from "@/lib/api";

const KANJIS = [
  {
    kanji: "癒",
    title: "Healing",
    body: "Soft daily messages that meet you where you are — no fixing, no rushing.",
  },
  {
    kanji: "忍",
    title: "Resilience",
    body: "Small reflections to remind you of every impossible thing you've already survived.",
  },
  {
    kanji: "望",
    title: "Hope",
    body: "A letter to your future self, waiting quietly for the morning you need it most.",
  },
  {
    kanji: "生",
    title: "Life",
    body: "You are alive. That alone is already a reason to keep going.",
  },
  {
    kanji: "道",
    title: "Path",
    body: "Every path has its shadows. Keep walking — the light always returns.",
  },
  {
    kanji: "魂",
    title: "Soul",
    body: "Nothing breaks your soul completely. It bends, it learns, and it rises.",
  },
];

const CAROUSEL_QUOTES = [
  "Even slowly, you are still moving forward.",
  "The storm will pass. It always does.",
  "You survived every hard day so far.",
  "Rest if you must — but do not give up.",
  "Healing is not linear. It never was.",
  "Your story is not over yet.",
  "Small steps still count as progress.",
  "The pain you feel today will not weigh this much forever.",
  "You are allowed to take your time.",
  "Something in you chose to keep going. Honor that.",
  "You have gotten through 100% of your worst days.",
  "This is not the end. It is a turning point.",
  "The version of you that survives this will be extraordinary.",
  "Breathe. You have made it this far.",
  "Not all tears are a sign of weakness. Some are proof you still feel.",
];

function QuoteCarousel() {
  const doubled = [...CAROUSEL_QUOTES, ...CAROUSEL_QUOTES];
  return (
    <>
      <style>{`
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .carousel-track {
          animation: scroll-left 70s linear infinite;
          will-change: transform;
        }
      `}</style>
      <div
        className="overflow-hidden w-full"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="carousel-track flex gap-6 w-max py-2">
          {doubled.map((q, i) => (
            <div key={i} className="shrink-0 glass rounded-2xl px-7 py-5 w-72">
              <p className="font-display text-base leading-relaxed text-foreground/85">"{q}"</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function SubscribeSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const result = await api.post<{ name: string; email: string }>("/api/v1/subscribe", {
      name,
      email,
    });
    // Clear the form either way — on success it's hidden behind the
    // confirmation message anyway; on failure the fields still reset.
    setName("");
    setEmail("");
    if (result.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg(result.message ?? "Something went wrong.");
    }
  };

  return (
    <section id="subscribe" className="relative py-28 px-4">
      <AtmosphericBackdrop petals={12} />
      <div className="relative z-10 mx-auto max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <p className="text-[10px] tracking-[0.35em] uppercase text-crimson/70 mb-4">
            · Daily letter ·
          </p>
          <h2 className="font-display text-4xl mb-4">Receive a daily word.</h2>
          <p className="text-sm text-muted-foreground mb-10 max-w-sm mx-auto leading-relaxed">
            Every morning, a motivational phrase delivered to your inbox. Just your name and email —
            nothing else.
          </p>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-10"
            >
              <p className="font-display text-3xl text-crimson mb-3">命</p>
              <p className="font-display text-xl mb-2">You're in.</p>
              <p className="text-sm text-muted-foreground">
                A letter will reach you every morning.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-left">
              <label className="block glass rounded-xl px-4 py-3">
                <span className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                  Name
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="Your name"
                  className="mt-1 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                />
              </label>
              <label className="block glass rounded-xl px-4 py-3">
                <span className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                  Email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="you@quiet.place"
                  className="mt-1 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                />
              </label>

              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-400"
                >
                  {errorMsg}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-xl bg-(--gradient-crimson) py-3 text-sm font-medium text-primary-foreground glow-crimson hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {status === "loading" ? "Subscribing…" : "Receive daily motivation →"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 -z-10">
          <img
            src={samuraiHero}
            alt="Lone samurai silhouette beneath a glowing full moon"
            width={1920}
            height={1280}
            className="h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-linear-to-b from-background/30 via-background/40 to-background" />
        </div>

        <AtmosphericBackdrop petals={22} />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="font-display text-sm tracking-[0.4em] uppercase text-white"
          >
            命 — Inochi · A quiet companion
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.2 }}
            className="mt-6 font-display text-6xl md:text-8xl leading-[1.05] tracking-tight"
          >
            Life Goes <span className="text-glow text-crimson">On.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.5 }}
            className="mx-auto mt-8 max-w-xl text-balance text-white md:text-lg leading-relaxed"
          >
            Even after pain, confusion, heartbreak, or failure…
            <br />
            your story is still moving forward.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.9 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              to="/quotes"
              className="group inline-flex items-center gap-2 rounded-full bg-(--gradient-crimson) px-7 py-3.5 text-sm font-medium text-primary-foreground glow-crimson hover:brightness-110 transition"
            >
              Find your words
              <span className="transition group-hover:translate-x-1">→</span>
            </Link>
            <a
              href="#subscribe"
              className="glass rounded-full px-7 py-3.5 text-sm font-medium hover:bg-white/10 transition"
            >
              Daily letter
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] text-muted-foreground"
        >
          ↓ BREATHE
        </motion.div>
      </section>

      {/* Philosophy */}
      <section className="relative py-32 px-4">
        <AtmosphericBackdrop petals={10} />
        <div className="relative z-10 mx-auto max-w-5xl grid md:grid-cols-3 gap-6">
          {KANJIS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.12 }}
              className="glass rounded-2xl p-8 hover:bg-white/10 transition group"
            >
              <div className="font-display text-5xl text-crimson/80 group-hover:text-glow transition">
                {c.kanji}
              </div>
              <h3 className="mt-4 font-display text-2xl">{c.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Infinite quote carousel */}
      <section className="relative py-16 px-0">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className="text-center text-[10px] tracking-[0.35em] uppercase text-crimson/70 mb-8">
            · Words that stay ·
          </p>
          <QuoteCarousel />
        </motion.div>
      </section>

      {/* Subscription form */}
      <SubscribeSection />

      {/* Signature quote */}
      <section className="relative py-48 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={samuraiHero}
            alt="Samurai at rest beneath the moonlight"
            className="h-full w-full object-cover"
            style={{
              filter: "grayscale(1) brightness(0.18) contrast(1.3) sepia(0.4) hue-rotate(200deg)",
            }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
          <div className="absolute inset-0 bg-indigo-950/30 mix-blend-multiply" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mx-auto mb-10 h-px w-24 bg-crimson/40 origin-center"
          />

          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: 0.3 }}
            className="font-display text-3xl md:text-4xl leading-relaxed text-balance"
          >
            "You do not need to fix your entire life this week.
            <br />
            You only need to keep moving forward a little.
            <br />
            <span className="text-crimson text-glow">Even slowly.</span>"
          </motion.blockquote>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.9 }}
            className="mt-8 text-[11px] tracking-[0.4em] uppercase text-muted-foreground/60"
          >
            命 · Life Goes On
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="mx-auto mt-10 h-px w-24 bg-crimson/40 origin-center"
          />
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-10 text-center text-xs text-muted-foreground">
        Made quietly, for anyone still walking forward. · 命
      </footer>
    </div>
  );
}
