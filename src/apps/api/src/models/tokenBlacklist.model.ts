import mongoose, { Schema } from "mongoose";
import type { ITokenBlacklist } from "../interfaces/ITokenBlacklist";

const tokenBlacklistSchema = new Schema<ITokenBlacklist>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // TTL index: MongoDB auto-deletes expired blacklist entries
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

export const TokenBlacklistModel = mongoose.model<ITokenBlacklist>(
  "TokenBlacklist",
  tokenBlacklistSchema,
);
