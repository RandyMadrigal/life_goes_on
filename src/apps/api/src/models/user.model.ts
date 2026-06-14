import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { env } from "../config/env";
import { MOODS, type IUser } from "../interfaces/IUser";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    mood: {
      type: String,
      enum: MOODS,
      required: [true, "Mood is required"],
    },
    preferredEmailTime: {
      type: String,
      required: [true, "Preferred email time is required"],
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    moodChangedAt: {
      type: [Date],
      default: [],
    },
    moodHistory: {
      type: [{ mood: { type: String, enum: MOODS }, at: { type: Date } }],
      default: [],
    },
    emailsSent: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastEmailSentAt: {
      type: Date,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ── Hash password only when modified ──────────────────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, env.BCRYPT_ROUNDS);
  next();
});

// ── Instance method: compare plaintext vs stored hash ─────────────────────────
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password as string);
};

export const UserModel = mongoose.model<IUser>("User", userSchema);
