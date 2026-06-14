import type { Request, Response } from "express";
import type { IAuthService } from "../services/interfaces/IAuthService";
import { ApiResponse } from "../utils/ApiResponse";
import {
  setAuthCookies,
  clearAuthCookies,
  REFRESH_TOKEN_COOKIE,
} from "../utils/cookie.utils";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  readonly register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { user, tokens } = await this.authService.register(req.body);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    res.status(201).json(ApiResponse.created("Account created successfully", { user }));
  });

  readonly login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { user, tokens } = await this.authService.login(req.body);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    res.status(200).json(ApiResponse.ok("Logged in successfully", { user }));
  });

  readonly logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE] as string | undefined;
    const accessToken = req.accessToken;

    if (refreshToken && accessToken) {
      await this.authService.logout(refreshToken, accessToken);
    }

    clearAuthCookies(res);
    res.status(200).json(ApiResponse.ok("Logged out successfully", null));
  });

  readonly refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE] as string | undefined;
    if (!refreshToken) throw ApiError.unauthorized("No refresh token provided");

    const tokens = await this.authService.refreshTokens(refreshToken);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    res.status(200).json(ApiResponse.ok("Tokens refreshed successfully", null));
  });

  readonly forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.authService.forgotPassword(req.body.email as string);
    // Always return the same message to prevent email enumeration
    res
      .status(200)
      .json(
        ApiResponse.ok(
          "If that email is registered, you will receive reset instructions shortly",
          null,
        ),
      );
  });

  readonly resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { token, password } = req.body as { token: string; password: string };
    await this.authService.resetPassword(token, password);
    clearAuthCookies(res);
    res.status(200).json(ApiResponse.ok("Password reset successfully. Please log in again.", null));
  });
}
