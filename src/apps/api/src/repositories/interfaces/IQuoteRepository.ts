import type { IQuote } from "../../interfaces/IQuote";
import type { Mood } from "../../interfaces/IUser";

export interface IQuoteRepository {
  findRandom(mood?: Mood): Promise<IQuote | null>;
}
