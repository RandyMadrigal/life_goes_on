import type { IQuoteRepository } from "./interfaces/IQuoteRepository";
import type { IQuote } from "../interfaces/IQuote";
import { QuoteModel } from "../models/quote.model";

export class QuoteRepository implements IQuoteRepository {
  async findMany(mood?: string, limit = 1): Promise<IQuote[]> {
    const match = mood ? { moods: mood } : {};
    return QuoteModel.aggregate<IQuote>([
      { $match: match },
      { $sample: { size: limit } },
    ]);
  }
}
