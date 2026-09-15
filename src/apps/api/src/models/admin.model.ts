import { Schema, model } from "mongoose";
import type { IAdmin } from "../interfaces/IAdmin";

const adminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    resetTokenHash: { type: String },
    resetTokenExpires: { type: Date },
  },
  { timestamps: false },
);

export const AdminModel = model<IAdmin>("Admin", adminSchema);
