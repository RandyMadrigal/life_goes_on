import type { Document } from "mongoose";
import type { Mood } from "./IUser";

export interface IQuote extends Document {
  text: string;
  moods: Mood[];
}
