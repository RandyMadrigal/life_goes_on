import type { Types } from "mongoose";
import type { IRefreshTokenRepository } from "./interfaces/IRefreshTokenRepository";
import type { IRefreshToken } from "../interfaces/IRefreshToken";
import { RefreshTokenModel } from "../models/refreshToken.model";

export class RefreshTokenRepository implements IRefreshTokenRepository {
  async create(
    adminId: Types.ObjectId,
    tokenHash: string,
    familyId: string,
    expiresAt: Date,
  ): Promise<IRefreshToken> {
    return RefreshTokenModel.create({ adminId, tokenHash, familyId, expiresAt });
  }

  async findByHash(tokenHash: string): Promise<IRefreshToken | null> {
    return RefreshTokenModel.findOne({ tokenHash }).exec();
  }

  async revoke(id: Types.ObjectId): Promise<void> {
    await RefreshTokenModel.updateOne({ _id: id }, { revokedAt: new Date() }).exec();
  }

  async revokeFamily(familyId: string): Promise<void> {
    await RefreshTokenModel.updateMany(
      { familyId, revokedAt: null },
      { revokedAt: new Date() },
    ).exec();
  }

  async revokeAllForAdmin(adminId: Types.ObjectId): Promise<void> {
    await RefreshTokenModel.updateMany(
      { adminId, revokedAt: null },
      { revokedAt: new Date() },
    ).exec();
  }
}
