import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { adminAuth } from "../middlewares/adminAuth.middleware";
import { authLimiter } from "../middlewares/rateLimiter.middleware";
import {
  login, logout,
  getQuotes, createQuote, updateQuote, deleteQuote,
  createMood, updateMood, deleteMood,
} from "../controllers/admin.controller";

const router = Router();

// Public
router.post("/login", authLimiter, asyncHandler(login));

// Protected
router.use(adminAuth);
router.post("/logout", asyncHandler(logout));
router.get("/quotes", asyncHandler(getQuotes));
router.post("/quotes", asyncHandler(createQuote));
router.put("/quotes/:id", asyncHandler(updateQuote));
router.delete("/quotes/:id", asyncHandler(deleteQuote));
router.post("/moods", asyncHandler(createMood));
router.put("/moods/:id", asyncHandler(updateMood));
router.delete("/moods/:id", asyncHandler(deleteMood));

export default router;
