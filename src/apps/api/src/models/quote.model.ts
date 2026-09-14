import { Schema, model } from "mongoose";
import type { IQuote } from "../interfaces/IQuote";

const QuoteSchema = new Schema<IQuote>(
  {
    text: { type: String, required: true, unique: true, trim: true },
    moods: { type: [String], required: true },
    language: { type: String, enum: ["es", "en"], required: true, default: "en" },
    pairId: { type: Schema.Types.ObjectId, required: false, index: true },
  },
  { collection: "quotes", timestamps: false },
);

export const QuoteModel = model<IQuote>("Quote", QuoteSchema);
