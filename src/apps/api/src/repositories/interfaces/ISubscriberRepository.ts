import type { ISubscriber } from "../../interfaces/ISubscriber";

export interface ISubscriberRepository {
  findByEmail(email: string): Promise<ISubscriber | null>;
  create(name: string, email: string): Promise<ISubscriber>;
  findAllActive(): Promise<ISubscriber[]>;
}
