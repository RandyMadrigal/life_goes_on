import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { AtmosphericBackdrop } from "@/components/AtmosphericBackdrop";
import { MoodChart } from "@/components/MoodChart";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { MOODS, moodLabel } from "@/data/moods";

interface Quote {
  text: string;
  moods: string[];
}

interface Letter {
  body: string;
}

interface UserStats {
  emailsSent: number;
  streak: number;
  joinedAt: string;
}

interface MoodEntry {
  mood: string;
  at: string;
}

export default function Dashboard() {
  const { user, updateMood } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "friend";

  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteVisible, setQuoteVisible] = useState(false);
  const [secondQuote, setSecondQuote] = useState<Quote | null>(null);
  const [secondQuoteVisible, setSecondQuoteVisible] = useState(false);
  const [letter, setLetter] = useState<Letter | null>(null);
  const [letterLoading, setLetterLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [changingMood, setChangingMood] = useState(false);
  const [moodError, setMoodError] = useState("");

  const changesRemainingToday = useMemo(() => {
    const timestamps = user?.moodChangedAt ?? [];
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const recent = timestamps.filter((ts) => new Date(ts).getTime() > cutoff);
    return Math.max(0, 2 - recent.length);
  }, [user?.moodChangedAt]);

  const fetchQuote = (mood?: string) => {
    const path = mood
      ? `/api/v1/quotes/random?mood=${encodeURIComponent(mood)}`
      : "/api/v1/quotes/random";
    setQuoteVisible(false);
    api.get<{ quote: Quote }>(path).then((result) => {
      if (result.ok) {
        setQuote(result.data.quote);
        setTimeout(() => setQuoteVisible(true), 150);
      }
    });
  };

  const fetchSecondQuote = () => {
    setSecondQuoteVisible(false);
    api.get<{ quote: Quote }>("/api/v1/quotes/random").then((result) => {
      if (result.ok) {
        setSecondQuote(result.data.quote);
        setTimeout(() => setSecondQuoteVisible(true), 150);
      }
    });
  };

  const fetchLetter = (mood: string) => {
    setLetterLoading(true);
    api
      .get<{ letter: Letter }>(`/api/v1/letters/today?mood=${encodeURIComponent(mood)}`)
      .then((result) => {
        if (result.ok) setLetter(result.data.letter);
      })
      .finally(() => setLetterLoading(false));
  };

  // Re-fetch quote + letter whenever mood changes
  useEffect(() => {
    fetchQuote(user?.mood);
    if (user?.mood) fetchLetter(user.mood);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.mood]);

  // Fetch once on mount: second quote, stats, mood history
  useEffect(() => {
    fetchSecondQuote();
    api.get<{ stats: UserStats }>("/api/v1/users/me/stats").then((r) => {
      if (r.ok) setStats(r.data.stats);
    });
    api.get<{ history: MoodEntry[] }>("/api/v1/users/me/mood-history").then((r) => {
      if (r.ok) setMoodHistory(r.data.history);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMoodChange = async (mood: string) => {
    if (mood === user?.mood || changingMood || changesRemainingToday === 0) return;
    setChangingMood(true);
    setMoodError("");
    try {
      await updateMood(mood);
    } catch (err) {
      setMoodError(err instanceof Error ? err.message : "Failed to update mood");
    } finally {
      setChangingMood(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4">
      <Navbar />
      <AtmosphericBackdrop petals={14} />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="text-xs tracking-[0.3em] uppercase text-crimson/80">命 · Today</p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">Hey, {firstName}.</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            You are still here. That matters. Keep moving forward — even slowly.
          </p>
        </motion.div>

        {/* Quote of the day */}
        <AnimatePresence>
          {quoteVisible && quote && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mt-8 glass rounded-2xl px-8 py-6 border-l-2 border-crimson/40"
            >
              <p className="text-[10px] tracking-[0.3em] uppercase text-crimson/70 mb-3">
                · Quote for today ·
              </p>
              <blockquote className="font-display text-xl md:text-2xl leading-relaxed text-foreground/90">
                "{quote.text}"
              </blockquote>
              <div className="mt-4 flex items-center gap-2">
                {quote.moods.map((m) => (
                  <span
                    key={m}
                    className="glass rounded-full px-3 py-1 text-[10px] tracking-[0.2em] uppercase text-muted-foreground"
                  >
                    {moodLabel(m)}
                  </span>
                ))}
                <button
                  onClick={() => fetchQuote(user?.mood)}
                  className="ml-auto text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition"
                >
                  another →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 grid lg:grid-cols-5 gap-6 items-start">
          {/* Today's letter — 3 of 5 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="glass-strong rounded-3xl lg:col-span-3 glow-crimson overflow-hidden"
          >
            {/* Card header */}
            <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-white/6">
              <div className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-crimson/70" />
                <p className="text-[10px] tracking-[0.3em] uppercase text-crimson/80">
                  Today's letter
                </p>
              </div>
              <span className="text-[11px] text-muted-foreground">
                {user?.preferredEmailTime ?? "07:00"} · arrived
              </span>
            </div>

            {/* Letter body */}
            <div className="px-8 py-6">
              {letterLoading ? (
                <div className="space-y-3 animate-pulse">
                  {[72, 88, 60, 82, 50].map((w, i) => (
                    <div
                      key={i}
                      className="h-2.5 rounded-full bg-white/10"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              ) : letter ? (
                <>
                  <p className="font-display text-xl text-foreground/90 mb-5">Hey, {firstName}.</p>
                  <p className="text-[15px] leading-[1.9] text-foreground/78 font-light">
                    {letter.body.replace(/\n\n—[^\n]*$/, "").trim()}
                  </p>
                </>
              ) : (
                <p className="text-[15px] leading-relaxed text-foreground/70">
                  Your letter for today is on its way.
                </p>
              )}
            </div>
          </motion.div>

          {/* Right column — Mood + Stats — 2 of 5 columns */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Mood */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="glass rounded-3xl p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                  Your mood
                </p>
                <span
                  className={`text-[10px] tracking-[0.2em] uppercase ${
                    changesRemainingToday > 0 ? "text-crimson/80" : "text-muted-foreground"
                  }`}
                >
                  {changesRemainingToday}/2 left today
                </span>
              </div>

              {moodError && <p className="mt-2 text-xs text-red-400">{moodError}</p>}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {MOODS.map((m) => (
                  <button
                    key={m}
                    onClick={() => handleMoodChange(m)}
                    disabled={changingMood || (changesRemainingToday === 0 && m !== user?.mood)}
                    className={`glass rounded-full px-2.5 py-1 text-[11px] transition ${
                      user?.mood === m
                        ? "bg-(--gradient-crimson) text-primary-foreground glow-crimson"
                        : changesRemainingToday === 0
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-white/10 cursor-pointer"
                    }`}
                  >
                    {moodLabel(m)}
                  </button>
                ))}
              </div>

              {changesRemainingToday === 0 && (
                <p className="mt-3 text-[11px] text-muted-foreground">Resets in 24 hours.</p>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.7 }}
              className="grid grid-cols-2 gap-3"
            >
              <div className="glass rounded-2xl p-4">
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                  Letters sent
                </p>
                <p className="mt-1.5 font-display text-3xl text-crimson/90 text-glow">
                  {stats?.emailsSent ?? "—"}
                </p>
              </div>
              <div className="glass rounded-2xl p-4">
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                  Day streak
                </p>
                <p className="mt-1.5 font-display text-3xl text-crimson/90 text-glow">
                  {stats?.streak ?? "—"}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mood Journey chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-6 glass rounded-3xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-crimson/80">Mood journey</p>
              <p className="mt-1 text-xs text-muted-foreground">
                How your emotional landscape has shifted
              </p>
            </div>
            {stats?.joinedAt && (
              <span className="text-[10px] tracking-[0.15em] text-muted-foreground">
                walking since{" "}
                {new Date(stats.joinedAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
          <MoodChart history={moodHistory} />
        </motion.div>

        <p className="mt-12 text-center text-xs tracking-[0.3em] uppercase text-muted-foreground">
          命 · Even slowly · You are moving forward
        </p>
      </div>
    </div>
  );
}
