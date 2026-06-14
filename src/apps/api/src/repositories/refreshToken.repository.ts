import type { IRefreshTokenRepository } from "./interfaces/IRefreshTokenRepository";
import type { IRefreshToken } from "../interfaces/IRefreshToken";
import { RefreshTokenModel } from "../models/refreshToken.model";

export class RefreshTokenRepository implements IRefreshTokenRepository {
  async create(userId: string, token: string, expiresAt: Date): Promise<IRefreshToken> {
    return RefreshTokenModel.create({ userId, token, expiresAt });
  }

  async findByToken(token: string): Promise<IRefreshToken | null> {
    return RefreshTokenModel.findOne({ token }).exec();
  }

  async deleteByToken(token: string): Promise<void> {
    await RefreshTokenModel.deleteOne({ token }).exec();
  }

  async deleteByUserId(userId: string): Promise<void> {
    await RefreshTokenModel.deleteMany({ userId }).exec();
  }
}
