import type { Mood, MoodHistoryEntry } from "../../interfaces/IUser";
import type { SafeUser } from "./IAuthService";

export interface MoodChangeResult {
  user: SafeUser;
  changesRemainingToday: number;
}

export interface UserStats {
  emailsSent: number;
  streak: number;
  joinedAt: Date;
}

export interface IUserService {
  changeMood(userId: string, mood: Mood): Promise<MoodChangeResult>;
  getStats(userId: string): Promise<UserStats>;
  getMoodHistory(userId: string): Promise<MoodHistoryEntry[]>;
}
