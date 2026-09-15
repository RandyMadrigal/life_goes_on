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
}
