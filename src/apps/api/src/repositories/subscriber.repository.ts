import { randomBytes } from "crypto";
import type { ISubscriberRepository } from "./interfaces/ISubscriberRepository";
import type { ISubscriber } from "../interfaces/ISubscriber";
import { SubscriberModel } from "../models/subscriber.model";
import { escapeRegex } from "../utils/regex";
import { hashToken } from "../utils/hashToken";

export class SubscriberRepository implements ISubscriberRepository {
  async findByEmail(email: string): Promise<ISubscriber | null> {
    return SubscriberModel.findOne({ email }).exec();
  }

  async create(name: string, email: string, language: "es" | "en"): Promise<ISubscriber> {
    const unsubscribeTokenHash = hashToken(randomBytes(32).toString("hex"));
    return SubscriberModel.create({ name, email, unsubscribeTokenHash, language });
  }

  async findAllActive(): Promise<ISubscriber[]> {
    return SubscriberModel.find({ active: true }).exec();
  }

  async deactivateByToken(token: string): Promise<ISubscriber | null> {
    return SubscriberModel.findOneAndUpdate(
      { unsubscribeTokenHash: hashToken(token) },
      { active: false, unsubscribedAt: new Date() },
      { new: true },
    ).exec();
  }

  async rotateUnsubscribeToken(subscriberId: ISubscriber["_id"]): Promise<string> {
    const token = randomBytes(32).toString("hex");
    await SubscriberModel.updateOne(
      { _id: subscriberId },
      { unsubscribeTokenHash: hashToken(token) },
    ).exec();
    return token;
  }

  async findPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ subscribers: ISubscriber[]; total: number }> {
    const filter: Record<string, unknown> = {};
    if (search) {
      const pattern = { $regex: escapeRegex(search), $options: "i" };
      filter.$or = [{ name: pattern }, { email: pattern }];
    }

    const [subscribers, total] = await Promise.all([
      SubscriberModel.find(filter)
        .sort({ subscribedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      SubscriberModel.countDocuments(filter),
    ]);

    return { subscribers, total };
  }
}
