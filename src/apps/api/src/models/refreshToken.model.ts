import { Schema, model } from "mongoose";
import type { IRefreshToken } from "../interfaces/IRefreshToken";

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    adminId: { type: Schema.Types.ObjectId, required: true, ref: "Admin" },
    tokenHash: { type: String, required: true, unique: true },
    familyId: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

refreshTokenSchema.index({ familyId: 1 });
// MongoDB removes the document once expiresAt is in the past — no manual cleanup job needed.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel = model<IRefreshToken>("RefreshToken", refreshTokenSchema);
