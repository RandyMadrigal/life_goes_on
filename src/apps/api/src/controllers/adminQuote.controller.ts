import type { Request, Response } from "express";
import { z } from "zod";
import { QuoteModel } from "../models/quote.model";
import { toQuoteDTO } from "../utils/dto.mappers";
import { escapeRegex } from "../utils/regex";

const quoteSchema = z
  .object({
    text: z.string().trim().min(1).max(1000),
    moods: z.array(z.string().trim().min(1)).min(1),
  })
  .strict();

export const getQuotes = async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const mood = req.query.mood as string | undefined;
  const search = req.query.search as string | undefined;

  const filter: Record<string, unknown> = {};
  if (mood) filter.moods = mood;
  if (search) filter.text = { $regex: escapeRegex(search), $options: "i" };

  const [quotes, total] = await Promise.all([
    QuoteModel.find(filter)
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    QuoteModel.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: { quotes: quotes.map(toQuoteDTO), total, page, limit },
  });
};

export const createQuote = async (req: Request, res: Response): Promise<void> => {
  const parsed = quoteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "text and moods are required" });
    return;
  }
  const quote = await QuoteModel.create(parsed.data);
  res.status(201).json({ success: true, data: { quote: toQuoteDTO(quote) } });
};

export const updateQuote = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const parsed = quoteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "text and moods are required" });
    return;
  }
  const quote = await QuoteModel.findByIdAndUpdate(id, parsed.data, {
    new: true,
    runValidators: true,
  }).lean();
  if (!quote) {
    res.status(404).json({ success: false, message: "Quote not found" });
    return;
  }
  res.status(200).json({ success: true, data: { quote: toQuoteDTO(quote) } });
};

export const deleteQuote = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const quote = await QuoteModel.findByIdAndDelete(id).lean();
  if (!quote) {
    res.status(404).json({ success: false, message: "Quote not found" });
    return;
  }
  res.status(200).json({ success: true, message: "Quote deleted" });
};
