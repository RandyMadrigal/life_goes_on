import type { IUserRepository, CreateUserDto } from "./interfaces/IUserRepository";
import type { IUser, MoodHistoryEntry } from "../interfaces/IUser";
import type { Mood } from "../interfaces/IUser";
import { UserModel } from "../models/user.model";

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).exec();
  }

  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).select("+password").exec();
  }

  async findByPasswordResetToken(hashedToken: string): Promise<IUser | null> {
    return UserModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    })
      .select("+password +passwordResetToken +passwordResetExpires")
      .exec();
  }

  async create(data: CreateUserDto): Promise<IUser> {
    return UserModel.create(data);
  }

  async updateById(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async updateMood(id: string, mood: Mood, changedAt: Date[]): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(
      id,
      { mood, moodChangedAt: changedAt },
      { new: true, runValidators: true },
    ).exec();
  }

  async pushMoodHistory(id: string, entry: MoodHistoryEntry): Promise<void> {
    await UserModel.updateOne({ _id: id }, { $push: { moodHistory: entry } }).exec();
  }

  async getMoodHistory(id: string): Promise<MoodHistoryEntry[]> {
    const user = await UserModel.findById(id).select("moodHistory").lean().exec();
    return (user?.moodHistory as MoodHistoryEntry[] | undefined) ?? [];
  }

  async incrementEmailStats(id: string): Promise<void> {
    const user = await UserModel.findById(id)
      .select("streak lastEmailSentAt")
      .lean()
      .exec();
    if (!user) return;

    const now = new Date();
    const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const yesterdayUTC = todayUTC - 86_400_000;

    const last = user.lastEmailSentAt ? new Date(user.lastEmailSentAt).getTime() : null;
    const currentStreak = user.streak ?? 0;

    let newStreak: number;
    if (last === null || last < yesterdayUTC) {
      newStreak = 1;
    } else if (last >= todayUTC) {
      // already counted today — only increment emailsSent
      await UserModel.updateOne({ _id: id }, { $inc: { emailsSent: 1 } }).exec();
      return;
    } else {
      newStreak = currentStreak + 1;
    }

    await UserModel.updateOne(
      { _id: id },
      { $inc: { emailsSent: 1 }, $set: { streak: newStreak, lastEmailSentAt: now } },
    ).exec();
  }

  async save(user: IUser): Promise<IUser> {
    return user.save();
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ email }).exec();
    return count > 0;
  }
}
