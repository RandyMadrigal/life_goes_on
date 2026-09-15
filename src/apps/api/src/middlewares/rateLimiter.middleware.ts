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
      ApiError.tooManyRequests("Too many password reset requests. Please try again in one hour."),
    );
  },
});

export const subscribeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests("Too many subscription attempts. Please try again in one hour."));
  },
});

export const cronLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // the real trigger fires once/day — this just blunts secret-guessing floods
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests("Too many requests. Please try again later."));
  },
});
