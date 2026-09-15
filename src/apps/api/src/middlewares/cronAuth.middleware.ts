import type { Request, Response, NextFunction } from "express";
import { timingSafeEqual } from "crypto";
import { env } from "../config/env";
import { hashToken } from "../utils/hashToken";

// Hashing both sides first normalizes them to a fixed 32-byte digest, so
// timingSafeEqual never throws on a length mismatch and the comparison
// itself stays constant-time regardless of what the caller sent.
const expectedHash = Buffer.from(hashToken(env.CRON_SECRET), "hex");

export const cronAuth = (req: Request, res: Response, next: NextFunction): void => {
  const provided = req.headers["x-cron-secret"];

  if (typeof provided !== "string" || !provided) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  const providedHash = Buffer.from(hashToken(provided), "hex");
  if (!timingSafeEqual(providedHash, expectedHash)) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  next();
};
