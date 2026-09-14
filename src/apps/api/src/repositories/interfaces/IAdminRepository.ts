import type { IAdmin } from "../../interfaces/IAdmin";

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
  /** Creates the single admin document from env vars if none exists yet. */
  ensureBootstrapped(email: string, passwordHash: string): Promise<void>;
  setResetToken(email: string, tokenHash: string, expires: Date): Promise<boolean>;
  findByValidResetToken(tokenHash: string): Promise<IAdmin | null>;
  updatePasswordAndClearToken(id: string, passwordHash: string): Promise<void>;
}
