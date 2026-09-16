import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { adminAuth } from "../middlewares/adminAuth.middleware";
import { authLimiter, forgotPasswordLimiter } from "../middlewares/rateLimiter.middleware";
import {
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/adminAuth.controller";
import {
  getQuotes,
  createQuote,
  updateQuote,
  deleteQuote,
} from "../controllers/adminQuote.controller";
import { createMood, updateMood, deleteMood } from "../controllers/adminMood.controller";
import { getSubscribers } from "../controllers/subscriber.controller";
import { getTodaysDeliverySummary } from "../controllers/delivery.controller";

const router = Router();

// Public — these authenticate via the refresh cookie itself (or nothing at
// all), so they must not sit behind adminAuth's Bearer check. In particular,
// logout has to work even when the access token has already expired.
router.post("/login", authLimiter, asyncHandler(login));
router.post("/refresh", authLimiter, asyncHandler(refresh));
router.post("/logout", asyncHandler(logout));
router.post("/forgot-password", forgotPasswordLimiter, asyncHandler(forgotPassword));
router.post("/reset-password", forgotPasswordLimiter, asyncHandler(resetPassword));

// Protected
router.use(adminAuth);
router.get("/quotes", asyncHandler(getQuotes));
router.post("/quotes", asyncHandler(createQuote));
router.put("/quotes/:id", asyncHandler(updateQuote));
router.delete("/quotes/:id", asyncHandler(deleteQuote));
router.post("/moods", asyncHandler(createMood));
router.put("/moods/:id", asyncHandler(updateMood));
router.delete("/moods/:id", asyncHandler(deleteMood));
router.get("/subscribers", getSubscribers);
router.get("/deliveries/today", asyncHandler(getTodaysDeliverySummary));

export default router;
