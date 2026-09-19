import type { Types } from "mongoose";
import type { IQuote } from "../../interfaces/IQuote";

export interface IQuoteRepository {
  findMany(mood?: string, limit?: number, language?: "es" | "en"): Promise<IQuote[]>;
  /** One random quote in `language` tagged with any of `moods`, skipping `excludeIds`. */
  findRandomByMoods(
    moods: readonly string[],
    language: "es" | "en",
    excludeIds?: readonly Types.ObjectId[],
  ): Promise<IQuote | null>;
}
