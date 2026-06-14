import { motion } from "framer-motion";
import { moodLabel } from "@/data/moods";

interface MoodEntry {
  mood: string;
  at: string;
}

interface Props {
  history: MoodEntry[];
}

export function MoodChart({ history }: Props) {
  if (history.length === 0) {
    return (
      <p className="text-xs text-muted-foreground text-center py-6">
        Your mood journey will appear here as you walk your path.
      </p>
    );
  }

  // Count frequency per mood
  const counts = history.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] ?? 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const max = sorted[0]![1];

  return (
    <div className="space-y-3">
      {sorted.map(([mood, count], i) => {
        const pct = Math.round((count / max) * 100);
        const isTop = i === 0;
        return (
          <div key={mood} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-[11px] tracking-wide text-muted-foreground truncate text-right">
              {moodLabel(mood)}
            </span>
            <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${isTop ? "bg-crimson/80" : "bg-white/25"}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: "easeOut" }}
              />
            </div>
            <span className="w-5 shrink-0 text-[11px] text-muted-foreground text-right">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
