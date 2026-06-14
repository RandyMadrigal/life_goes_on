import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/ApiError";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests("Too many requests from this IP. Please try again later."));
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed attempts
  handler: (_req, _res, next) => {
    next(
      ApiError.tooManyRequests(
        "Too many login attempts. Please wait 15 minutes before trying again.",
      ),
    );
  },
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(
      ApiError.tooManyRequests(
        "Too many password reset requests. Please try again in one hour.",
      ),
    );
  },
});
