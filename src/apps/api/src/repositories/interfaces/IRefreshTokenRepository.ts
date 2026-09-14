import type { Types } from "mongoose";
import type { IRefreshToken } from "../../interfaces/IRefreshToken";

export interface IRefreshTokenRepository {
  create(
    adminId: Types.ObjectId,
    tokenHash: string,
    familyId: string,
    expiresAt: Date,
  ): Promise<IRefreshToken>;
  /** Any status — used to tell "unknown token" apart from "already used" (reuse detection). */
  findByHash(tokenHash: string): Promise<IRefreshToken | null>;
  revoke(id: Types.ObjectId): Promise<void>;
  /** Revokes every token in a rotation chain — used when reuse is detected, or on password reset. */
  revokeFamily(familyId: string): Promise<void>;
  revokeAllForAdmin(adminId: Types.ObjectId): Promise<void>;
}
