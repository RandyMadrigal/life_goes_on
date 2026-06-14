import type { Document } from "mongoose";
import type { Mood } from "./IUser";

export interface ILetter extends Document {
  mood: Mood;
  index: number; // 0 | 1 | 2 — which of the 3 letters for this mood
  body: string;
}
