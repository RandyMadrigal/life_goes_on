import type { QuoteDTO, MoodDTO, AdminSubscriberDTO } from "life-goes-on-shared";
import type { IQuote } from "../interfaces/IQuote";
import type { IMood } from "../interfaces/IMood";
import type { ISubscriber } from "../interfaces/ISubscriber";

// Accepts both full Mongoose documents and `.lean()` results — only the
// plain data fields are read, so either shape satisfies this.
export const toQuoteDTO = (q: Pick<IQuote, "_id" | "text" | "moods">): QuoteDTO => ({
  _id: q._id.toString(),
  text: q.text,
  moods: q.moods,
});

export const toMoodDTO = (m: Pick<IMood, "_id" | "name" | "label" | "order">): MoodDTO => ({
  _id: m._id.toString(),
  name: m.name,
  label: m.label,
  order: m.order,
});

export const toAdminSubscriberDTO = (
  s: Pick<ISubscriber, "_id" | "name" | "email" | "active" | "subscribedAt">,
): AdminSubscriberDTO => ({
  _id: s._id.toString(),
  name: s.name,
  email: s.email,
  active: s.active,
  subscribedAt: s.subscribedAt.toISOString(),
});
