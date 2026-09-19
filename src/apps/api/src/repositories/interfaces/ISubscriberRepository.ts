import type { ISubscriber } from "../../interfaces/ISubscriber";

export interface ISubscriberRepository {
  findByEmail(email: string): Promise<ISubscriber | null>;
  create(name: string, email: string, language: "es" | "en"): Promise<ISubscriber>;
  findAllActive(): Promise<ISubscriber[]>;
  /** Looks up a subscriber by unsubscribe token without modifying anything. */
  findByToken(token: string): Promise<ISubscriber | null>;
  /** Deletes the subscriber outright — unsubscribing removes the record, not a soft-deactivate. */
  deleteByToken(token: string): Promise<ISubscriber | null>;
  /** Rotates this subscriber's unsubscribe token — called before each send, so every email gets a fresh link. */
  rotateUnsubscribeToken(subscriberId: ISubscriber["_id"]): Promise<string>;
  findPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ subscribers: ISubscriber[]; total: number }>;
}
