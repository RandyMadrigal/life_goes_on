import type { Request, Response } from "express";
import type { IUserService } from "../services/interfaces/IUserService";
import type { Mood } from "../interfaces/IUser";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export class UserController {
  constructor(private readonly userService: IUserService) {}

  readonly changeMood = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mood } = req.body as { mood: Mood };
    const result = await this.userService.changeMood(req.user!.userId, mood);
    res.status(200).json(
      ApiResponse.ok("Mood updated", {
        user: result.user,
        changesRemainingToday: result.changesRemainingToday,
      }),
    );
  });

  readonly getStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await this.userService.getStats(req.user!.userId);
    res.status(200).json(ApiResponse.ok("ok", { stats }));
  });

  readonly getMoodHistory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const history = await this.userService.getMoodHistory(req.user!.userId);
    res.status(200).json(ApiResponse.ok("ok", { history }));
  });
}
