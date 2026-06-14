import type { ITokenBlacklist } from "../../interfaces/ITokenBlacklist";

export interface ITokenBlacklistRepository {
  add(token: string, expiresAt: Date): Promise<ITokenBlacklist>;
  isBlacklisted(token: string): Promise<boolean>;
}
