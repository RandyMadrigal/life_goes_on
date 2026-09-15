import { Router, type Request, type Response } from "express";
import { QuoteRepository } from "../repositories/quote.repository";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { toQuoteDTO } from "../utils/dto.mappers";

const router = Router();
const quoteRepo = new QuoteRepository();

router.get(
  "/random",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mood = req.query.mood as string | undefined;
    const limit = Math.min(Math.max(Number(req.query.limit) || 1, 1), 12);
    const language = req.query.language === "es" ? "es" : "en";

    const quotes = await quoteRepo.findMany(mood, limit, language);
    res.status(200).json(ApiResponse.ok("ok", { quotes: quotes.map(toQuoteDTO) }));
  }),
);

export default router;
