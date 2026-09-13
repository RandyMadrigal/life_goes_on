import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const adminAuth = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.signedCookies?.admin_token as string | undefined;
  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  try {
    jwt.verify(token, env.JWT_ACCESS_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
