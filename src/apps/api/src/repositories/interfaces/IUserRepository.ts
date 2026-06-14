import type { IUser, MoodHistoryEntry } from "../../interfaces/IUser";
import type { Mood } from "../../interfaces/IUser";

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  mood: string;
  preferredEmailTime: string;
}

export interface IUserRepository {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByEmailWithPassword(email: string): Promise<IUser | null>;
  findByPasswordResetToken(hashedToken: string): Promise<IUser | null>;
  create(data: CreateUserDto): Promise<IUser>;
  updateById(id: string, data: Partial<IUser>): Promise<IUser | null>;
  updateMood(id: string, mood: Mood, changedAt: Date[]): Promise<IUser | null>;
  pushMoodHistory(id: string, entry: MoodHistoryEntry): Promise<void>;
  getMoodHistory(id: string): Promise<MoodHistoryEntry[]>;
  incrementEmailStats(id: string): Promise<void>;
  save(user: IUser): Promise<IUser>;
  existsByEmail(email: string): Promise<boolean>;
}
