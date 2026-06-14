import type { Document, Types } from "mongoose";

export const MOODS = [
  // Original moods
  "Lost",
  "Motivated",
  "Broken",
  "Hopeful",
  "Tired",
  "Disciplined",
  "Healing",
  // Extended moods
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

export interface MoodHistoryEntry {
  mood: Mood;
  at: Date;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  mood: Mood;
  moodChangedAt: Date[];
  moodHistory: MoodHistoryEntry[];
  preferredEmailTime: string;
  emailsSent: number;
  streak: number;
  lastEmailSentAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
