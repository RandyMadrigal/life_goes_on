import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { MoodDTO as Mood } from "life-goes-on-shared";
import samuraiHero from "@/assets/samurai-hero.jpg";
import { Navbar } from "@/components/Navbar";
import { AtmosphericBackdrop } from "@/components/AtmosphericBackdrop";
import { Splash, hasSeenSplash } from "@/components/Splash";
import { api } from "@/lib/api";

const KANJI_CHARS: Record<string, string> = {
  healing: "癒",
  resilience: "忍",
  hope: "望",
  life: "生",
  path: "道",
  soul: "魂",
};

const KANJI_KEYS = ["healing", "resilience", "hope", "life", "path", "soul"] as const;

function QuoteCarousel({ quotes }: { quotes: string[] }) {
  const doubled = [...quotes, ...quotes];
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
  const { t, i18n } = useTranslation();
  const language = i18n.language?.startsWith("es") ? "es" : "en";

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
      language,
    });
    // Clear the form either way — on success it's hidden behind the
    // confirmation message anyway; on failure the fields still reset.
    setName("");
    setEmail("");
    if (result.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg(result.message ?? t("home.subscribe.form.genericError"));
    }
  };

  return (
    <section id="subscribe" className="relative py-28 px-4">
      <div className="relative z-10 mx-auto max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <p className="text-[10px] tracking-[0.35em] uppercase text-crimson/70 mb-4">
            {t("home.subscribe.eyebrow")}
          </p>
          <h2 className="font-display text-4xl mb-4">{t("home.subscribe.title")}</h2>
          <p className="text-sm text-muted-foreground mb-10 max-w-sm mx-auto leading-relaxed">
            {t("home.subscribe.subtitle")}
          </p>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-10"
            >
              <p className="font-display text-3xl text-crimson mb-3">命</p>
              <p className="font-display text-xl mb-2">{t("home.subscribe.success.title")}</p>
              <p className="text-sm text-muted-foreground">
                {t("home.subscribe.success.subtitle")}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-left">
              <label className="block glass rounded-xl px-4 py-3">
                <span className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                  {t("home.subscribe.form.nameLabel")}
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder={t("home.subscribe.form.namePlaceholder")}
                  className="mt-1 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                />
              </label>
              <label className="block glass rounded-xl px-4 py-3">
                <span className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                  {t("home.subscribe.form.emailLabel")}
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder={t("home.subscribe.form.emailPlaceholder")}
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
                {status === "loading"
                  ? t("home.subscribe.form.submitLoading")
                  : t("home.subscribe.form.submitIdle")}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(() => !hasSeenSplash());

  const kanjis = KANJI_KEYS.map((key) => ({
    key,
    kanji: KANJI_CHARS[key],
    title: t(`home.kanjis.${key}.title`),
    body: t(`home.kanjis.${key}.body`),
  }));

  const carouselQuotes = t("home.carousel.quotes", { returnObjects: true }) as string[];

  if (showSplash) {
    return (
      <Splash
        onFinish={(mood?: Mood) => {
          setShowSplash(false);
          if (mood) navigate("/quotes", { state: { moodName: mood.name } });
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <Navbar />
      {/* Fixed full-viewport backdrop — one instance covers the whole
          scrollable page, no need to repeat it per section (each repeat
          was a duplicate blurred/animated layer, costly to repaint on scroll). */}
      <AtmosphericBackdrop petals={22} />

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

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="font-display text-sm tracking-[0.4em] uppercase text-white"
          >
            {t("home.hero.eyebrow")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.2 }}
            className="mt-6 font-display text-6xl md:text-8xl leading-[1.05] tracking-tight"
          >
            {t("home.hero.titleStart")}{" "}
            <span className="text-glow text-crimson">{t("home.hero.titleAccent")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.5 }}
            className="mx-auto mt-8 max-w-xl text-balance text-white md:text-lg leading-relaxed"
          >
            {t("home.hero.subtitleLine1")}
            <br />
            {t("home.hero.subtitleLine2")}
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
              {t("home.hero.ctaPrimary")}
              <span className="transition group-hover:translate-x-1">→</span>
            </Link>
            <a
              href="#subscribe"
              className="glass rounded-full px-7 py-3.5 text-sm font-medium hover:bg-white/10 transition"
            >
              {t("home.hero.ctaSecondary")}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] text-muted-foreground"
        >
          {t("home.hero.scrollHint")}
        </motion.div>
      </section>

      {/* Philosophy */}
      <section className="relative py-32 px-4">
        <div className="relative z-10 mx-auto max-w-5xl grid md:grid-cols-3 gap-6">
          {kanjis.map((c, i) => (
            <motion.div
              key={c.key}
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
            {t("home.carousel.eyebrow")}
          </p>
          <QuoteCarousel quotes={carouselQuotes} />
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
            {t("home.signature.line1")}
            <br />
            {t("home.signature.line2")}
            <br />
            <span className="text-crimson text-glow">{t("home.signature.line3Accent")}</span>
          </motion.blockquote>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.9 }}
            className="mt-8 text-[11px] tracking-[0.4em] uppercase text-muted-foreground/60"
          >
            {t("home.signature.caption")}
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

      <footer className="relative z-10 border-t border-white/5 py-10 flex flex-col items-center gap-2 text-center text-xs text-muted-foreground">
        <p>{t("home.footer")}</p>
        <Link
          to="/privacy"
          className="hover:text-foreground transition underline underline-offset-4"
        >
          {t("home.footerPrivacyLink")}
        </Link>
      </footer>
    </div>
  );
}
