import type { ITokenBlacklistRepository } from "./interfaces/ITokenBlacklistRepository";
import type { ITokenBlacklist } from "../interfaces/ITokenBlacklist";
import { TokenBlacklistModel } from "../models/tokenBlacklist.model";

export class TokenBlacklistRepository implements ITokenBlacklistRepository {
  async add(token: string, expiresAt: Date): Promise<ITokenBlacklist> {
    return TokenBlacklistModel.create({ token, expiresAt });
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const count = await TokenBlacklistModel.countDocuments({ token }).exec();
    return count > 0;
  }
}
