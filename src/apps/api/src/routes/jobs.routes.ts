import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { cronAuth } from "../middlewares/cronAuth.middleware";
import { cronLimiter } from "../middlewares/rateLimiter.middleware";
import { triggerDailyEmails } from "../controllers/jobs.controller";

const router = Router();

// Authenticated via the X-Cron-Secret header (see cronAuth.middleware.ts),
// not an admin session — this is meant to be called by an external
// scheduler (cron-job.org), which can't hold a login session.
router.post("/send-daily-emails", cronLimiter, cronAuth, asyncHandler(triggerDailyEmails));

export default router;
