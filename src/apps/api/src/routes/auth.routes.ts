import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { EmailService } from "../services/email.service";
import { UserRepository } from "../repositories/user.repository";
import { RefreshTokenRepository } from "../repositories/refreshToken.repository";
import { TokenBlacklistRepository } from "../repositories/tokenBlacklist.repository";
import { validate } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { authLimiter, forgotPasswordLimiter } from "../middlewares/rateLimiter.middleware";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/auth.validator";

// ── Composition root (dependency injection) ──────────────────────────────────
const userRepository = new UserRepository();
const refreshTokenRepository = new RefreshTokenRepository();
const tokenBlacklistRepository = new TokenBlacklistRepository();
const emailService = new EmailService();

const authService = new AuthService(
  userRepository,
  refreshTokenRepository,
  tokenBlacklistRepository,
  emailService,
);

const authController = new AuthController(authService);

// ── Routes ────────────────────────────────────────────────────────────────────
const router = Router();

router.post("/register", authLimiter, validate(registerSchema), authController.register);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/logout", authenticate, authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

export default router;
