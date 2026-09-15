import { Schema, model } from "mongoose";
import type { IMood } from "../interfaces/IMood";

const moodSchema = new Schema<IMood>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    label: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 0 },
    language: { type: String, enum: ["es", "en"], required: true, default: "en" },
    pairId: { type: Schema.Types.ObjectId, required: false, index: true },
  },
  { timestamps: false },
);

export const MoodModel = model<IMood>("Mood", moodSchema);
