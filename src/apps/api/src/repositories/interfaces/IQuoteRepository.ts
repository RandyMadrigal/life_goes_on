import type { IQuote } from "../../interfaces/IQuote";

export interface IQuoteRepository {
  findMany(mood?: string, limit?: number): Promise<IQuote[]>;
}
