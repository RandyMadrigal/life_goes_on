import { Schema, model } from "mongoose";
import { MOODS } from "../interfaces/IUser";
import type { ILetter } from "../interfaces/ILetter";

const LetterSchema = new Schema<ILetter>(
  {
    mood: { type: String, required: true, enum: MOODS },
    index: { type: Number, required: true, min: 0, max: 2 },
    body: { type: String, required: true, trim: true },
  },
  { collection: "letters", timestamps: false },
);

// Unique combination: one letter per (mood, index) slot
LetterSchema.index({ mood: 1, index: 1 }, { unique: true });

export const LetterModel = model<ILetter>("Letter", LetterSchema);
