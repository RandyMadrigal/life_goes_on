import { Router } from "express";
import { z } from "zod";
import { MOODS } from "../interfaces/IUser";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";

// ── Composition root ──────────────────────────────────────────────────────────
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// ── Validators ────────────────────────────────────────────────────────────────
const changeMoodSchema = z.object({
  mood: z.enum(MOODS, { errorMap: () => ({ message: "Invalid mood" }) }),
});

// ── Routes ────────────────────────────────────────────────────────────────────
const router = Router();

router.patch("/me/mood", authenticate, validate(changeMoodSchema), userController.changeMood);
router.get("/me/stats", authenticate, userController.getStats);
router.get("/me/mood-history", authenticate, userController.getMoodHistory);

export default router;
