import { Schema, model } from "mongoose";
import type { ISubscriber } from "../interfaces/ISubscriber";

const subscriberSchema = new Schema<ISubscriber>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    active: { type: Boolean, default: true },
    subscribedAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

export const SubscriberModel = model<ISubscriber>("Subscriber", subscriberSchema);
