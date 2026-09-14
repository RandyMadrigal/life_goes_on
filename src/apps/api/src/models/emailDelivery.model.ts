import { Schema, model } from "mongoose";
import type { IEmailDelivery } from "../interfaces/IEmailDelivery";

const emailDeliverySchema = new Schema<IEmailDelivery>(
  {
    subscriberId: { type: Schema.Types.ObjectId, required: true, ref: "Subscriber" },
    quoteId: { type: Schema.Types.ObjectId, required: true, ref: "Quote" },
    date: { type: Date, required: true },
    status: { type: String, enum: ["sent", "failed"], required: true },
    sentAt: { type: Date, required: true },
    error: { type: String },
  },
  { timestamps: false },
);

// One delivery per subscriber per day — also what makes the job idempotent
// if it's ever triggered twice for the same day (e.g. a retried cron call).
emailDeliverySchema.index({ subscriberId: 1, date: 1 }, { unique: true });
emailDeliverySchema.index({ date: 1 });

export const EmailDeliveryModel = model<IEmailDelivery>("EmailDelivery", emailDeliverySchema);
