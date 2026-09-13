import type { Document, Types } from "mongoose";

export interface IMood extends Document {
  _id: Types.ObjectId;
  name: string;
  label: string;
  order: number;
}
