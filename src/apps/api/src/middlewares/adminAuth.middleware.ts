import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const adminAuth = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    if (typeof payload !== "object" || payload === null || payload.role !== "admin") {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    next();
  } catch {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
