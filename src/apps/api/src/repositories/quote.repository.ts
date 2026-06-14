import type { IQuoteRepository } from "./interfaces/IQuoteRepository";
import type { IQuote } from "../interfaces/IQuote";
import type { Mood } from "../interfaces/IUser";
import { QuoteModel } from "../models/quote.model";

export class QuoteRepository implements IQuoteRepository {
  async findRandom(mood?: Mood): Promise<IQuote | null> {
    const match = mood ? { moods: mood } : {};
    const results = await QuoteModel.aggregate<IQuote>([
      { $match: match },
      { $sample: { size: 1 } },
    ]);
    return results[0] ?? null;
  }
}
