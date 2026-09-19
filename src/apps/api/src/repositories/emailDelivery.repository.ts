import type { Types } from "mongoose";
import type {
  IEmailDeliveryRepository,
  DeliverySummary,
} from "./interfaces/IEmailDeliveryRepository";
import type { EmailDeliveryStatus } from "../interfaces/IEmailDelivery";
import { EmailDeliveryModel } from "../models/emailDelivery.model";

export class EmailDeliveryRepository implements IEmailDeliveryRepository {
  async findDeliveredSubscriberIds(date: Date): Promise<Set<string>> {
    const rows = await EmailDeliveryModel.find({ date }).select("subscriberId").lean();
    return new Set(rows.map((r) => r.subscriberId.toString()));
  }

  async findSentQuoteIds(subscriberId: Types.ObjectId): Promise<Types.ObjectId[]> {
    const rows = await EmailDeliveryModel.find({ subscriberId, status: "sent" })
      .sort({ date: -1 })
      .select("quoteId")
      .lean();
    return rows.map((r) => r.quoteId);
  }

  async record(
    subscriberId: Types.ObjectId,
    quoteId: Types.ObjectId,
    date: Date,
    status: EmailDeliveryStatus,
    error?: string,
  ): Promise<void> {
    await EmailDeliveryModel.create({
      subscriberId,
      quoteId,
      date,
      status,
      sentAt: new Date(),
      error,
    });
  }

  async getSummaryForDate(date: Date): Promise<DeliverySummary> {
    const rows = await EmailDeliveryModel.aggregate<{ _id: EmailDeliveryStatus; count: number }>([
      { $match: { date } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const sent = rows.find((r) => r._id === "sent")?.count ?? 0;
    const failed = rows.find((r) => r._id === "failed")?.count ?? 0;

    return { date, sent, failed, total: sent + failed };
  }
}
