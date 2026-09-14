import { Router, type Request, type Response } from "express";
import { MoodRepository } from "../repositories/mood.repository";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { toMoodDTO } from "../utils/dto.mappers";

const router = Router();
const moodRepo = new MoodRepository();

router.get(
  "/",
  asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const moods = await moodRepo.findAll();
    res.status(200).json(ApiResponse.ok("ok", { moods: moods.map(toMoodDTO) }));
  }),
);

export default router;
