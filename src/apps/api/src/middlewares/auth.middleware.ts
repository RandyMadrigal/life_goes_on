import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.utils";
import { TokenBlacklistRepository } from "../repositories/tokenBlacklist.repository";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { ACCESS_TOKEN_COOKIE } from "../utils/cookie.utils";

const blacklistRepository = new TokenBlacklistRepository();

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    // Accept token from cookie (primary) or Authorization header (fallback)
    const token =
      (req.cookies[ACCESS_TOKEN_COOKIE] as string | undefined) ??
      req.headers.authorization?.replace(/^Bearer\s+/i, "");

    if (!token) throw ApiError.unauthorized("Authentication required");

    const isRevoked = await blacklistRepository.isBlacklisted(token);
    if (isRevoked) throw ApiError.unauthorized("Token has been revoked");

    try {
      const payload = verifyAccessToken(token);
      req.user = { userId: payload.userId, email: payload.email };
      req.accessToken = token;
      next();
    } catch {
      throw ApiError.unauthorized("Invalid or expired access token");
    }
  },
);
