import crypto from "crypto";
import type {
  IAuthService,
  RegisterDto,
  LoginDto,
  AuthTokens,
  SafeUser,
} from "./interfaces/IAuthService";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository";
import type { IRefreshTokenRepository } from "../repositories/interfaces/IRefreshTokenRepository";
import type { ITokenBlacklistRepository } from "../repositories/interfaces/ITokenBlacklistRepository";
import type { IEmailService } from "./interfaces/IEmailService";
import type { IUser } from "../interfaces/IUser";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getTokenExpiry,
} from "../utils/jwt.utils";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly tokenBlacklistRepository: ITokenBlacklistRepository,
    private readonly emailService: IEmailService,
  ) {}

  // ── Private helpers ──────────────────────────────────────────────────────

  private toSafeUser(user: IUser): SafeUser {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      mood: user.mood,
      moodChangedAt: user.moodChangedAt ?? [],
      preferredEmailTime: user.preferredEmailTime,
      createdAt: user.createdAt,
    };
  }

  private generateTokens(userId: string, email: string): AuthTokens {
    return {
      accessToken: generateAccessToken({ userId, email }),
      refreshToken: generateRefreshToken({ userId, email }),
    };
  }

  // ── Auth flows ───────────────────────────────────────────────────────────

  async register(dto: RegisterDto): Promise<{ user: SafeUser; tokens: AuthTokens }> {
    const exists = await this.userRepository.existsByEmail(dto.email);
    if (exists) throw ApiError.conflict("An account with this email already exists");

    const user = await this.userRepository.create(dto);
    const tokens = this.generateTokens(user._id.toString(), user.email);
    const expiresAt = getTokenExpiry(tokens.refreshToken);

    await this.refreshTokenRepository.create(
      user._id.toString(),
      tokens.refreshToken,
      expiresAt,
    );

    // Fire-and-forget — don't block registration on email delivery
    this.emailService.sendWelcome(user.email, user.name).catch(console.error);

    return { user: this.toSafeUser(user), tokens };
  }

  async login(dto: LoginDto): Promise<{ user: SafeUser; tokens: AuthTokens }> {
    const user = await this.userRepository.findByEmailWithPassword(dto.email);

    // Constant-time comparison path — same error for unknown email and wrong password
    if (!user) throw ApiError.unauthorized("Invalid email or password");

    const isValid = await user.comparePassword(dto.password);
    if (!isValid) throw ApiError.unauthorized("Invalid email or password");

    const tokens = this.generateTokens(user._id.toString(), user.email);
    const expiresAt = getTokenExpiry(tokens.refreshToken);

    // Rotate: delete all previous refresh tokens before issuing a new one
    await this.refreshTokenRepository.deleteByUserId(user._id.toString());
    await this.refreshTokenRepository.create(
      user._id.toString(),
      tokens.refreshToken,
      expiresAt,
    );

    return { user: this.toSafeUser(user), tokens };
  }

  async logout(refreshToken: string, accessToken: string): Promise<void> {
    await this.refreshTokenRepository.deleteByToken(refreshToken);

    // Blacklist the access token so it can't be reused until it naturally expires
    try {
      const accessExpiry = getTokenExpiry(accessToken);
      await this.tokenBlacklistRepository.add(accessToken, accessExpiry);
    } catch {
      // Token already expired or malformed — no need to blacklist
    }
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const stored = await this.refreshTokenRepository.findByToken(refreshToken);
    if (!stored) throw ApiError.unauthorized("Invalid refresh token");

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      // Token expired — clean it up
      await this.refreshTokenRepository.deleteByToken(refreshToken);
      throw ApiError.unauthorized("Refresh token has expired. Please log in again.");
    }

    // Rotation: invalidate old token and issue a new pair
    await this.refreshTokenRepository.deleteByToken(refreshToken);

    const tokens = this.generateTokens(payload.userId, payload.email);
    const expiresAt = getTokenExpiry(tokens.refreshToken);
    await this.refreshTokenRepository.create(payload.userId, tokens.refreshToken, expiresAt);

    return tokens;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    // Silent: never reveal whether the email is registered
    if (!user) return;

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    await this.userRepository.updateById(user._id.toString(), {
      passwordResetToken: hashedToken,
      passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    } as Partial<IUser>);

    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${rawToken}`;
    await this.emailService.sendPasswordReset(user.email, user.name, resetUrl);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await this.userRepository.findByPasswordResetToken(hashedToken);

    if (!user) throw ApiError.badRequest("Reset token is invalid or has expired");

    // Pre-save hook will hash newPassword automatically
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await this.userRepository.save(user);

    // Invalidate all sessions after password change
    await this.refreshTokenRepository.deleteByUserId(user._id.toString());
  }
}
