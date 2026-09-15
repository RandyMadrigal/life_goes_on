import type { Document, Types } from "mongoose";

export interface IQuote extends Document {
  _id: Types.ObjectId;
  text: string;
  moods: string[];
  language: "es" | "en";
  pairId?: Types.ObjectId;
}
