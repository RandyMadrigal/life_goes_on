import type { ISubscriber } from "../../interfaces/ISubscriber";

export interface ISubscriberRepository {
  findByEmail(email: string): Promise<ISubscriber | null>;
  create(name: string, email: string, language: "es" | "en"): Promise<ISubscriber>;
  findAllActive(): Promise<ISubscriber[]>;
  deactivateByToken(token: string): Promise<ISubscriber | null>;
  /** Rotates this subscriber's unsubscribe token — called before each send, so every email gets a fresh link. */
  rotateUnsubscribeToken(subscriberId: ISubscriber["_id"]): Promise<string>;
  findPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ subscribers: ISubscriber[]; total: number }>;
}
