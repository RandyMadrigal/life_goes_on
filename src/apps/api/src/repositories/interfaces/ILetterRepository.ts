import type { ILetter } from "../../interfaces/ILetter";
import type { Mood } from "../../interfaces/IUser";

export interface ILetterRepository {
  findToday(mood: Mood): Promise<ILetter | null>;
}
