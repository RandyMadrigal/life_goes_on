import type { IUserService, MoodChangeResult, UserStats } from "./interfaces/IUserService";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository";
import type { SafeUser } from "./interfaces/IAuthService";
import type { IUser, Mood, MoodHistoryEntry } from "../interfaces/IUser";
import { ApiError } from "../utils/ApiError";

const DAILY_MOOD_CHANGE_LIMIT = 2;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  private toSafeUser(user: IUser): SafeUser {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      mood: user.mood,
      moodChangedAt: user.moodChangedAt ?? [],
      preferredEmailTime: user.preferredEmailTime,
      createdAt: user.createdAt,
    };
  }

  async changeMood(userId: string, mood: Mood): Promise<MoodChangeResult> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw ApiError.notFound("User not found");

    const now = new Date();
    const cutoff = new Date(now.getTime() - ONE_DAY_MS);
    const recentChanges = (user.moodChangedAt ?? []).filter((d) => d > cutoff);

    if (recentChanges.length >= DAILY_MOOD_CHANGE_LIMIT) {
      throw ApiError.tooManyRequests(
        `You can only change your mood ${DAILY_MOOD_CHANGE_LIMIT} times per 24 hours`,
      );
    }

    const updatedChanges = [...recentChanges, now];
    const updated = await this.userRepository.updateMood(userId, mood, updatedChanges);
    if (!updated) throw ApiError.internal("Failed to update mood");

    await this.userRepository.pushMoodHistory(userId, { mood, at: now });

    return {
      user: this.toSafeUser(updated),
      changesRemainingToday: DAILY_MOOD_CHANGE_LIMIT - updatedChanges.length,
    };
  }

  async getStats(userId: string): Promise<UserStats> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw ApiError.notFound("User not found");
    return {
      emailsSent: user.emailsSent ?? 0,
      streak: user.streak ?? 0,
      joinedAt: user.createdAt,
    };
  }

  async getMoodHistory(userId: string): Promise<MoodHistoryEntry[]> {
    return this.userRepository.getMoodHistory(userId);
  }
}
