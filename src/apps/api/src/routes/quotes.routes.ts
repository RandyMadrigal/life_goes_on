import { Router, type Request, type Response } from "express";
import { QuoteRepository } from "../repositories/quote.repository";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

const router = Router();
const quoteRepo = new QuoteRepository();

router.get(
  "/random",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mood = req.query.mood as string | undefined;
    const limit = Math.min(Math.max(Number(req.query.limit) || 1, 1), 12);

    const quotes = await quoteRepo.findMany(mood, limit);
    res.status(200).json(ApiResponse.ok("ok", { quotes }));
  }),
);

export default router;
