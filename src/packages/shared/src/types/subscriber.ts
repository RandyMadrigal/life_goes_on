/** Wire shape of a subscriber as returned by the API (never includes unsubscribeToken). */
export interface SubscriberDTO {
  name: string;
  email: string;
}

/** Fuller shape used in the admin subscriber list. */
export interface AdminSubscriberDTO extends SubscriberDTO {
  _id: string;
  active: boolean;
  subscribedAt: string;
  unsubscribedAt: string | null;
}
