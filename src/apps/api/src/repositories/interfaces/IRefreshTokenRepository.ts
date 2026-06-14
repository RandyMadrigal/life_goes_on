import type { IRefreshToken } from "../../interfaces/IRefreshToken";

export interface IRefreshTokenRepository {
  create(userId: string, token: string, expiresAt: Date): Promise<IRefreshToken>;
  findByToken(token: string): Promise<IRefreshToken | null>;
  deleteByToken(token: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}
