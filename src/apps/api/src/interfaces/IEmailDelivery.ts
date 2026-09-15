import type { Document, Types } from "mongoose";

export type EmailDeliveryStatus = "sent" | "failed";

export interface IEmailDelivery extends Document {
  _id: Types.ObjectId;
  subscriberId: Types.ObjectId;
  quoteId: Types.ObjectId;
  /** UTC midnight of the day this delivery belongs to — used to group "today's" summary. */
  date: Date;
  status: EmailDeliveryStatus;
  sentAt: Date;
  error?: string;
}
