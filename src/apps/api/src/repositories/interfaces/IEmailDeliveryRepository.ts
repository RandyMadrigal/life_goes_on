import type { Types } from "mongoose";
import type { EmailDeliveryStatus } from "../../interfaces/IEmailDelivery";

export interface DeliverySummary {
  date: Date;
  sent: number;
  failed: number;
  total: number;
}

export interface IEmailDeliveryRepository {
  /** All subscriber IDs that already have a delivery record (sent or failed) for that day. */
  findDeliveredSubscriberIds(date: Date): Promise<Set<string>>;
  record(
    subscriberId: Types.ObjectId,
    quoteId: Types.ObjectId,
    date: Date,
    status: EmailDeliveryStatus,
    error?: string,
  ): Promise<void>;
  getSummaryForDate(date: Date): Promise<DeliverySummary>;
}
