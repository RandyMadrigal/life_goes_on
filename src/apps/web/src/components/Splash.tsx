import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { QuoteDTO as Quote, MoodDTO as Mood } from "life-goes-on-shared";
import { AtmosphericBackdrop } from "@/components/AtmosphericBackdrop";
import { api } from "@/lib/api";

const SPLASH_SEEN_KEY = "introSplashSeen";

export const hasSeenSplash = (): boolean => {
  try {
    return localStorage.getItem(SPLASH_SEEN_KEY) === "1";
  } catch {
    return false;
  }
};

const markSplashSeen = (): void => {
  try {
    localStorage.setItem(SPLASH_SEEN_KEY, "1");
  } catch {
    // Private browsing / storage disabled — fine, it just shows again next time.
  }
};

interface Props {
  /** Called once the user is ready to leave the splash. `mood` is set only
   * if they tasted a mood on screen 2 and want to see more like it. `moods`
   * is the list already fetched here, passed along so /quotes doesn't have
   * to re-fetch the exact same thing seconds later. */
  onFinish: (mood?: Mood, moods?: Mood[]) => void;
}

export function Splash({ onFinish }: Props) {
  const { t, i18n } = useTranslation();
  const language = i18n.language?.startsWith("es") ? "es" : "en";

  const [screen, setScreen] = useState<1 | 2>(1);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [moodsLoading, setMoodsLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  useEffect(() => {
    if (screen !== 2) return;
    api
      .get<{ moods: Mood[] }>(`/api/v1/moods?language=${encodeURIComponent(language)}`)
      .then((result) => {
        if (result.ok) setMoods(result.data.moods);
        setMoodsLoading(false);
      });
  }, [screen, language]);

  // Guards against out-of-order responses if the user taps a second mood
  // pill before the first request resolves.
  const requestId = useRef(0);

  const handlePickMood = async (mood: Mood) => {
    const id = ++requestId.current;
    setSelectedMood(mood);
    setQuoteLoading(true);
    const result = await api.get<{ quotes: Quote[] }>(
      `/api/v1/quotes/random?mood=${encodeURIComponent(mood.name)}&limit=1&language=${encodeURIComponent(language)}`,
    );
    if (id !== requestId.current) return;
    if (result.ok && result.data.quotes[0]) setQuote(result.data.quotes[0]);
    setQuoteLoading(false);
  };

  const finish = (withMood: boolean): void => {
    markSplashSeen();
    onFinish(withMood && selectedMood ? selectedMood : undefined, moods);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <AtmosphericBackdrop petals={18} />

      <AnimatePresence mode="wait">
        {screen === 1 ? (
          <motion.div
            key="screen-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 mx-auto max-w-lg text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-(--gradient-crimson) glow-crimson"
            >
              <span className="font-display text-4xl">命</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="font-display text-2xl md:text-3xl leading-relaxed"
            >
              {t("splash.screen1.title")}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 1 }}
              className="mt-5 text-sm text-muted-foreground leading-relaxed"
            >
              {t("splash.screen1.body")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.8 }}
              className="mt-10"
            >
              <button
                onClick={() => setScreen(2)}
                className="inline-flex items-center gap-2 rounded-full bg-(--gradient-crimson) px-7 py-3.5 text-sm font-medium text-primary-foreground glow-crimson hover:brightness-110 transition"
              >
                {t("splash.screen1.cta")}
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="screen-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 mx-auto max-w-lg text-center"
          >
            <p className="text-[10px] tracking-[0.35em] uppercase text-crimson/70">
              {t("splash.screen2.eyebrow")}
            </p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">{t("splash.screen2.title")}</h2>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {moodsLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="glass rounded-full px-4 py-2 w-24 h-9 animate-pulse bg-white/5"
                    />
                  ))
                : moods.map((mood) => (
                    <button
                      key={mood.name}
                      onClick={() => handlePickMood(mood)}
                      className={`glass rounded-full px-4 py-2 text-sm transition ${
                        selectedMood?.name === mood.name
                          ? "bg-(--gradient-crimson) text-primary-foreground glow-crimson"
                          : "hover:bg-white/10 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {mood.label}
                    </button>
                  ))}
            </div>

            <div className="mt-8 min-h-[110px]">
              <AnimatePresence mode="wait">
                {quoteLoading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="glass rounded-2xl p-6 animate-pulse"
                  >
                    <div className="h-3 bg-white/10 rounded-full w-4/5 mx-auto mb-2" />
                    <div className="h-3 bg-white/10 rounded-full w-3/5 mx-auto" />
                  </motion.div>
                )}
                {!quoteLoading && quote && (
                  <motion.div
                    key={quote._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass rounded-2xl p-6 border-l-2 border-crimson/30"
                  >
                    <blockquote className="font-display text-lg leading-relaxed text-foreground/90">
                      "{quote.text}"
                    </blockquote>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              {quote && (
                <button
                  onClick={() => finish(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-(--gradient-crimson) px-7 py-3.5 text-sm font-medium text-primary-foreground glow-crimson hover:brightness-110 transition"
                >
                  {t("splash.screen2.ctaSeeMore")}
                </button>
              )}
              <button
                onClick={() => finish(false)}
                className="glass rounded-full px-7 py-3.5 text-sm font-medium hover:bg-white/10 transition"
              >
                {t("splash.screen2.ctaContinue")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
