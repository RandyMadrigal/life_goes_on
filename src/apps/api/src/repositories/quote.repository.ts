import type { Types } from "mongoose";
import type { IQuoteRepository } from "./interfaces/IQuoteRepository";
import type { IQuote } from "../interfaces/IQuote";
import { QuoteModel } from "../models/quote.model";

export class QuoteRepository implements IQuoteRepository {
  async findMany(mood?: string, limit = 1, language?: "es" | "en"): Promise<IQuote[]> {
    const match: Record<string, unknown> = {};
    if (mood) match.moods = mood;
    if (language) match.language = language;
    return QuoteModel.aggregate<IQuote>([{ $match: match }, { $sample: { size: limit } }]);
  }

  async findRandomByMoods(
    moods: readonly string[],
    language: "es" | "en",
    excludeIds: readonly Types.ObjectId[] = [],
  ): Promise<IQuote | null> {
    const [quote] = await QuoteModel.aggregate<IQuote>([
      { $match: { moods: { $in: [...moods] }, language, _id: { $nin: [...excludeIds] } } },
      { $sample: { size: 1 } },
    ]);
    return quote ?? null;
  }
}
