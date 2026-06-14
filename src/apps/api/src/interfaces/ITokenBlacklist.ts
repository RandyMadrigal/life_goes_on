import type { Document } from "mongoose";

export interface ITokenBlacklist extends Document {
  token: string;
  expiresAt: Date;
  createdAt: Date;
}
