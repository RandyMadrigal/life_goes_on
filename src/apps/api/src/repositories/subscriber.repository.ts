import { randomBytes } from "crypto";
import type { ISubscriberRepository } from "./interfaces/ISubscriberRepository";
import type { ISubscriber } from "../interfaces/ISubscriber";
import { SubscriberModel } from "../models/subscriber.model";

export class SubscriberRepository implements ISubscriberRepository {
  async findByEmail(email: string): Promise<ISubscriber | null> {
    return SubscriberModel.findOne({ email }).exec();
  }

  async create(name: string, email: string): Promise<ISubscriber> {
    const unsubscribeToken = randomBytes(32).toString("hex");
    return SubscriberModel.create({ name, email, unsubscribeToken });
  }

  async findAllActive(): Promise<ISubscriber[]> {
    return SubscriberModel.find({ active: true }).exec();
  }

  async deactivateByToken(token: string): Promise<ISubscriber | null> {
    return SubscriberModel.findOneAndUpdate(
      { unsubscribeToken: token },
      { active: false },
      { new: true },
    ).exec();
  }
}
