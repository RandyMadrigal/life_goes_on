import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import type { QuoteDTO as Quote, MoodDTO as Mood } from "life-goes-on-shared";
import { Navbar } from "@/components/Navbar";
import { AtmosphericBackdrop } from "@/components/AtmosphericBackdrop";
import { api } from "@/lib/api";

const PAGE_SIZE = 2;

export default function Quotes() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [moodsLoading, setMoodsLoading] = useState(true);

  useEffect(() => {
    api.get<{ moods: Mood[] }>("/api/v1/moods").then((result) => {
      if (result.ok) setMoods(result.data.moods);
      setMoodsLoading(false);
    });
  }, []);

  const totalPages = Math.ceil(quotes.length / PAGE_SIZE);
  const visible = quotes.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const fetchQuotes = async (mood: Mood) => {
    setLoading(true);
    setPage(0);
    const result = await api.get<{ quotes: Quote[] }>(
      `/api/v1/quotes/random?mood=${encodeURIComponent(mood.name)}&limit=12`,
    );
    if (result.ok) setQuotes(result.data.quotes);
    setLoading(false);
  };

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    fetchQuotes(mood);
  };

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4">
      <Navbar />
      <AtmosphericBackdrop petals={14} />

      <div className="relative z-10 mx-auto max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="text-[10px] tracking-[0.35em] uppercase text-crimson/70">
            命 · Words for your moment
          </p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">How are you feeling?</h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-md">
            Choose what matches your state. The right words will find you.
          </p>
        </motion.div>

        {/* Mood selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-8 flex flex-wrap gap-2"
        >
          {moodsLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="glass rounded-full px-4 py-2 w-24 h-9 animate-pulse bg-white/5"
                />
              ))
            : moods.map((mood) => (
                <button
                  key={mood.name}
                  onClick={() => handleMoodSelect(mood)}
                  className={`glass rounded-full px-4 py-2 text-sm transition ${
                    selectedMood?.name === mood.name
                      ? "bg-(--gradient-crimson) text-primary-foreground glow-crimson"
                      : "hover:bg-white/10 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mood.label}
                </button>
              ))}
        </motion.div>

        {/* Quotes + pagination */}
        <div className="mt-12 min-h-[260px]">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="glass rounded-2xl p-8 animate-pulse">
                    <div className="h-3 bg-white/10 rounded-full w-4/5 mb-3" />
                    <div className="h-3 bg-white/10 rounded-full w-3/5 mb-2" />
                    <div className="h-3 bg-white/10 rounded-full w-2/4" />
                  </div>
                ))}
              </motion.div>
            )}

            {!loading && visible.length > 0 && (
              <motion.div
                key={`${selectedMood?.name}-${page}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {visible.map((q, i) => (
                  <div key={i} className="glass rounded-2xl p-8 border-l-2 border-crimson/30">
                    <blockquote className="font-display text-xl leading-relaxed text-foreground/90">
                      "{q.text}"
                    </blockquote>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination controls */}
        {!loading && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex items-center justify-center gap-6"
          >
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="glass rounded-full px-5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              ← Prev
            </button>

            <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
              {page + 1} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="glass rounded-full px-5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </motion.div>
        )}

        {!selectedMood && !moodsLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-16 text-center"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              命 · Words that meet you where you are
            </p>
            <Link
              to="/#subscribe"
              className="text-sm text-muted-foreground hover:text-foreground transition underline underline-offset-4"
            >
              Want them in your inbox every morning? Subscribe →
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
