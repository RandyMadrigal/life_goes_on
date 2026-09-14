import type { Document, Types } from "mongoose";

export interface IRefreshToken extends Document {
  _id: Types.ObjectId;
  adminId: Types.ObjectId;
  tokenHash: string;
  /** Groups every token produced by one rotation chain, starting at login. */
  familyId: string;
  expiresAt: Date;
  /** Set once this token is rotated out, explicitly revoked, or reuse is detected. */
  revokedAt?: Date | null;
  createdAt: Date;
}
