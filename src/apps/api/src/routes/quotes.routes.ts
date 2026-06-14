import { Router, type Request, type Response } from "express";
import { MOODS, type Mood } from "../interfaces/IUser";
import { QuoteRepository } from "../repositories/quote.repository";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

const router = Router();
const quoteRepo = new QuoteRepository();

router.get(
  "/random",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mood = req.query.mood as string | undefined;
    const validMood =
      mood && (MOODS as readonly string[]).includes(mood)
        ? (mood as Mood)
        : undefined;

    const quote = await quoteRepo.findRandom(validMood);
    res.status(200).json(ApiResponse.ok("ok", { quote }));
  }),
);

export default router;
