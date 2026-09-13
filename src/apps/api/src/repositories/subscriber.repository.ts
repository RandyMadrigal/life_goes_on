import type { ISubscriberRepository } from "./interfaces/ISubscriberRepository";
import type { ISubscriber } from "../interfaces/ISubscriber";
import { SubscriberModel } from "../models/subscriber.model";

export class SubscriberRepository implements ISubscriberRepository {
  async findByEmail(email: string): Promise<ISubscriber | null> {
    return SubscriberModel.findOne({ email }).exec();
  }

  async create(name: string, email: string): Promise<ISubscriber> {
    return SubscriberModel.create({ name, email });
  }

  async findAllActive(): Promise<ISubscriber[]> {
    return SubscriberModel.find({ active: true }).exec();
  }
}
