import type { Document, Types } from "mongoose";

export interface ISubscriber extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  active: boolean;
  subscribedAt: Date;
}
