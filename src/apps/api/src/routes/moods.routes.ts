import { Router, type Request, type Response } from "express";
import { MoodRepository } from "../repositories/mood.repository";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { toMoodDTO } from "../utils/dto.mappers";

const router = Router();
const moodRepo = new MoodRepository();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // No `language` param → all moods (used by the admin panel, which
    // manages both languages). The public site always passes one explicitly.
    const language =
      req.query.language === "es" || req.query.language === "en" ? req.query.language : undefined;
    const moods = await moodRepo.findAll(language);
    res.status(200).json(ApiResponse.ok("ok", { moods: moods.map(toMoodDTO) }));
  }),
);

export default router;
