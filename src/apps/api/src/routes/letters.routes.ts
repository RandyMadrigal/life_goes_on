import { Router, type Request, type Response } from "express";
import { MOODS, type Mood } from "../interfaces/IUser";
import { LetterRepository } from "../repositories/letter.repository";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

const router = Router();
const letterRepo = new LetterRepository();

router.get(
  "/today",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mood = req.query.mood as string | undefined;

    if (!mood || !(MOODS as readonly string[]).includes(mood)) {
      res.status(400).json({ success: false, message: "mood query param is required and must be valid" });
      return;
    }

    const letter = await letterRepo.findToday(mood as Mood);
    res.status(200).json(ApiResponse.ok("ok", { letter }));
  }),
);

export default router;
