export const MOODS = [
  "Lost",
  "Motivated",
  "Broken",
  "Hopeful",
  "Tired",
  "Disciplined",
  "Healing",
  "Heartbreak",
  "Loneliness",
  "Anxiety",
  "Discipline",
  "Consistency",
  "Hope",
  "EmotionalExhaustion",
  "SelfWorth",
  "RebuildingLife",
  "HealingSlowly",
  "FutureSelf",
  "PersonalGrowth",
  "QuietResilience",
] as const;

export type Mood = (typeof MOODS)[number];

const MOOD_LABELS: Record<Mood, string> = {
  Lost: "Lost",
  Motivated: "Motivated",
  Broken: "Broken",
  Hopeful: "Hopeful",
  Tired: "Tired",
  Disciplined: "Disciplined",
  Healing: "Healing",
  Heartbreak: "Heartbreak",
  Loneliness: "Loneliness",
  Anxiety: "Anxiety",
  Discipline: "Discipline",
  Consistency: "Consistency",
  Hope: "Hope",
  EmotionalExhaustion: "Emotional Exhaustion",
  SelfWorth: "Self Worth",
  RebuildingLife: "Rebuilding Life",
  HealingSlowly: "Healing Slowly",
  FutureSelf: "Future Self",
  PersonalGrowth: "Personal Growth",
  QuietResilience: "Quiet Resilience",
};

export function moodLabel(mood: string): string {
  return MOOD_LABELS[mood as Mood] ?? mood;
}
