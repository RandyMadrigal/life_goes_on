import type { Types } from "mongoose";
import type { EmailDeliveryStatus } from "../../interfaces/IEmailDelivery";

export interface DeliverySummary {
  date: Date;
  sent: number;
  failed: number;
  total: number;
}

export interface IEmailDeliveryRepository {
  /** True if this subscriber already has a delivery record (sent or failed) for that day. */
  existsForDate(subscriberId: Types.ObjectId, date: Date): Promise<boolean>;
  record(
    subscriberId: Types.ObjectId,
    quoteId: Types.ObjectId,
    date: Date,
    status: EmailDeliveryStatus,
    error?: string,
  ): Promise<void>;
  getSummaryForDate(date: Date): Promise<DeliverySummary>;
}
