import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { randomBytes, randomUUID } from "crypto";
import { env } from "../config/env";
import { parseDurationMs } from "../utils/duration";
import { hashPassword, comparePassword } from "../utils/password.utils";
import { hashToken } from "../utils/hashToken";
import { AdminRepository } from "../repositories/admin.repository";
import { RefreshTokenRepository } from "../repositories/refreshToken.repository";
import { EmailService } from "../services/email.service";
import type { IAdmin } from "../interfaces/IAdmin";

const adminRepo = new AdminRepository();
const refreshTokenRepo = new RefreshTokenRepository();
const emailService = new EmailService();

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1h

const loginSchema = z
  .object({ email: z.string().trim().email(), password: z.string().min(1) })
  .strict();
const forgotPasswordSchema = z.object({ email: z.string().trim().email() }).strict();
const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, "Token and password (min. 8 characters) are required"),
  })
  .strict();

// ── Auth ──────────────────────────────────────────────────────────────────────
//
// Access token: short-lived JWT (JWT_ACCESS_EXPIRES_IN), returned in the JSON
// body and kept in memory on the frontend — never in a cookie or localStorage.
// Refresh token: opaque random value, long-lived (JWT_REFRESH_EXPIRES_IN),
// stored httpOnly-cookie-side and hashed DB-side, rotated on every use, with
// reuse detection: presenting an already-rotated-out token kills the whole
// token family instead of just refusing that one request.

const REFRESH_COOKIE_NAME = "admin_refresh_token";
const REFRESH_COOKIE_PATH = "/api/v1/admin";
const REFRESH_TOKEN_TTL_MS = parseDurationMs(env.JWT_REFRESH_EXPIRES_IN);

const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  signed: true,
  path: REFRESH_COOKIE_PATH,
  // Cross-site (e.g. Vercel + Railway) needs SameSite=None, which browsers
  // only accept alongside Secure — both flip together based on environment.
  sameSite: (env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
  secure: env.NODE_ENV === "production",
  maxAge: REFRESH_TOKEN_TTL_MS,
};

const signAccessToken = (admin: IAdmin): string =>
  jwt.sign({ role: "admin", sub: admin._id.toString() }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

/** Issues a new refresh token within the given rotation family and sets its cookie. */
const issueRefreshToken = async (
  res: Response,
  adminId: IAdmin["_id"],
  familyId: string,
): Promise<void> => {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  await refreshTokenRepo.create(adminId, hashToken(token), familyId, expiresAt);
  res.cookie(REFRESH_COOKIE_NAME, token, REFRESH_COOKIE_OPTS);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  // A malformed body is treated the same as wrong credentials (generic 401
  // below) rather than a distinct 400 — folding validation failures into
  // the same response keeps the login endpoint from leaking anything about
  // *why* a request failed.
  const parsed = loginSchema.safeParse(req.body);
  const email = parsed.success ? parsed.data.email : undefined;
  const password = parsed.success ? parsed.data.password : undefined;

  const admin = email ? await adminRepo.findByEmail(email.toLowerCase()) : null;
  const isValidPassword =
    typeof password === "string" && (await comparePassword(password, admin?.passwordHash));

  if (!admin || !isValidPassword) {
    res.status(401).json({ success: false, message: "Invalid credentials" });
    return;
  }

  await issueRefreshToken(res, admin._id, randomUUID());
  const accessToken = signAccessToken(admin);

  res.status(200).json({ success: true, message: "Logged in", data: { accessToken } });
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const unauthorized = (): void => {
    res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
    res.status(401).json({ success: false, message: "Unauthorized" });
  };

  const refreshToken = req.signedCookies?.[REFRESH_COOKIE_NAME] as string | undefined;
  if (!refreshToken) {
    unauthorized();
    return;
  }

  const stored = await refreshTokenRepo.findByHash(hashToken(refreshToken));
  if (!stored) {
    unauthorized();
    return;
  }

  if (stored.revokedAt || stored.expiresAt < new Date()) {
    // Someone presented a token that was already rotated out (or is expired).
    // That's either a stale retry or a stolen copy — either way, kill the
    // whole chain rather than just rejecting this one request.
    await refreshTokenRepo.revokeFamily(stored.familyId);
    console.warn(`[auth] Refresh token reuse detected for admin ${stored.adminId.toString()}`);
    unauthorized();
    return;
  }

  const admin = await adminRepo.findById(stored.adminId.toString());
  if (!admin) {
    unauthorized();
    return;
  }

  await refreshTokenRepo.revoke(stored._id);
  await issueRefreshToken(res, admin._id, stored.familyId);
  const accessToken = signAccessToken(admin);

  res.status(200).json({ success: true, message: "ok", data: { accessToken } });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.signedCookies?.[REFRESH_COOKIE_NAME] as string | undefined;
  if (refreshToken) {
    const stored = await refreshTokenRepo.findByHash(hashToken(refreshToken));
    if (stored) await refreshTokenRepo.revoke(stored._id);
  }
  res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
  res.status(200).json({ success: true, message: "Logged out" });
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const GENERIC_MESSAGE = "If that email is valid, you'll receive a password reset link.";
  const parsed = forgotPasswordSchema.safeParse(req.body);

  if (parsed.success) {
    const normalizedEmail = parsed.data.email.toLowerCase();
    const admin = await adminRepo.findByEmail(normalizedEmail);

    if (admin) {
      const token = randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
      await adminRepo.setResetToken(normalizedEmail, hashToken(token), expires);

      const resetUrl = `${env.FRONTEND_URL}/admin/reset-password?token=${token}`;
      await emailService.sendPasswordReset(admin.email, resetUrl);
    }
  }

  // Always the same response, whether or not the email matched — otherwise
  // the endpoint becomes a way to confirm the admin's email address.
  res.status(200).json({ success: true, message: GENERIC_MESSAGE });
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message:
        parsed.error.errors[0]?.message ?? "Token and password (min. 8 characters) are required",
    });
    return;
  }
  const { token, password } = parsed.data;

  const admin = await adminRepo.findByValidResetToken(hashToken(token));
  if (!admin) {
    res.status(400).json({ success: false, message: "The link is invalid or has expired" });
    return;
  }

  const passwordHash = await hashPassword(password);
  await adminRepo.updatePasswordAndClearToken(admin._id.toString(), passwordHash);
  // Kill every existing session — old refresh tokens can no longer mint new
  // access tokens once the password that guarded them has changed.
  await refreshTokenRepo.revokeAllForAdmin(admin._id);

  res.status(200).json({ success: true, message: "Password updated. You can now log in." });
};
