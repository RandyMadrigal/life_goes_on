import type { ILetterRepository } from "./interfaces/ILetterRepository";
import type { ILetter } from "../interfaces/ILetter";
import type { Mood } from "../interfaces/IUser";
import { LetterModel } from "../models/letter.model";

function todayIndex(): number {
  const now = new Date();
  const startOfYear = new Date(now.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86_400_000);
  return dayOfYear % 3;
}

export class LetterRepository implements ILetterRepository {
  async findToday(mood: Mood): Promise<ILetter | null> {
    return LetterModel.findOne({ mood, index: todayIndex() }).exec();
  }
}
