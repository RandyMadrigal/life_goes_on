import mongoose, { Schema } from "mongoose";
import type { IRefreshToken } from "../interfaces/IRefreshToken";

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    // TTL index: MongoDB auto-deletes documents when expiresAt is reached
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

export const RefreshTokenModel = mongoose.model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema,
);
