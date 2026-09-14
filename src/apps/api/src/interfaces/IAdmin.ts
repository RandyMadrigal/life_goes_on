import type { Document, Types } from "mongoose";

export interface IAdmin extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  resetTokenHash?: string;
  resetTokenExpires?: Date;
}
