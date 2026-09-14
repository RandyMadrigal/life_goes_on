import type { IAdminRepository } from "./interfaces/IAdminRepository";
import type { IAdmin } from "../interfaces/IAdmin";
import { AdminModel } from "../models/admin.model";

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<IAdmin | null> {
    return AdminModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<IAdmin | null> {
    return AdminModel.findById(id).exec();
  }

  async ensureBootstrapped(email: string, passwordHash: string): Promise<void> {
    const existing = await AdminModel.countDocuments();
    if (existing === 0) {
      await AdminModel.create({ email, passwordHash });
      console.log("👤  Admin account bootstrapped from environment variables");
    }
  }

  async setResetToken(email: string, tokenHash: string, expires: Date): Promise<boolean> {
    const result = await AdminModel.updateOne(
      { email },
      { resetTokenHash: tokenHash, resetTokenExpires: expires },
    ).exec();
    return result.matchedCount > 0;
  }

  async findByValidResetToken(tokenHash: string): Promise<IAdmin | null> {
    return AdminModel.findOne({
      resetTokenHash: tokenHash,
      resetTokenExpires: { $gt: new Date() },
    }).exec();
  }

  async updatePasswordAndClearToken(id: string, passwordHash: string): Promise<void> {
    await AdminModel.findByIdAndUpdate(id, {
      passwordHash,
      $unset: { resetTokenHash: 1, resetTokenExpires: 1 },
    }).exec();
  }
}
