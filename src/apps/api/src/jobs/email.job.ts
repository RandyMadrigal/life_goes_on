import { SubscriberModel } from "../models/subscriber.model";
import { EmailService } from "../services/email.service";
import { QuoteRepository } from "../repositories/quote.repository";
import { SubscriberRepository } from "../repositories/subscriber.repository";
import { EmailDeliveryRepository } from "../repositories/emailDelivery.repository";
import { startOfUtcDay } from "../utils/date.utils";
import { env } from "../config/env";

const quoteRepo = new QuoteRepository();
const subscriberRepo = new SubscriberRepository();
const deliveryRepo = new EmailDeliveryRepository();
const emailService = new EmailService();

const buildUnsubscribeUrl = (token: string): string =>
  `${env.API_BASE_URL}/api/v1/subscribe/unsubscribe?token=${token}`;

export interface SendDailyEmailsResult {
  total: number;
  sent: number;
  failed: number;
  skipped: number;
}

/**
 * Sends today's motivational email to every active subscriber who hasn't
 * already received one today. Safe to call more than once for the same day
 * — subscribers with an existing EmailDelivery record for today are skipped,
 * so a retried/duplicated trigger never double-sends.
 */
export const sendDailyEmails = async (): Promise<SendDailyEmailsResult> => {
  const today = startOfUtcDay();
  const subscribers = await SubscriberModel.find({ active: true }).exec();

  if (subscribers.length === 0) {
    return { total: 0, sent: 0, failed: 0, skipped: 0 };
  }

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  // One query for "who already got today's email" instead of one per
  // subscriber inside the loop below.
  const alreadyDelivered = await deliveryRepo.findDeliveredSubscriberIds(today);

  await Promise.allSettled(
    subscribers.map(async (sub) => {
      if (alreadyDelivered.has(sub._id.toString())) {
        skipped += 1;
        return;
      }

      const [quote] = await quoteRepo.findMany(undefined, 1, sub.language);
      if (!quote) throw new Error("No quotes in database");

      // Fresh token per send: the same subscriber gets a new unsubscribe
      // link in every email, so a leaked/stale token from an old email
      // can't be replayed — see the design note in subscriber.repository.ts.
      const unsubscribeToken = await subscriberRepo.rotateUnsubscribeToken(sub._id);

      const result = await emailService.sendMotivationalMessage(
        sub.email,
        sub.name,
        quote.text,
        buildUnsubscribeUrl(unsubscribeToken),
      );

      if (result.success) {
        await deliveryRepo.record(sub._id, quote._id, today, "sent");
        sent += 1;
      } else {
        await deliveryRepo.record(sub._id, quote._id, today, "failed", result.error);
        failed += 1;
      }
    }),
  );

  console.log(
    `📬  Daily email run: ${sent} sent, ${failed} failed, ${skipped} already sent today (of ${subscribers.length} active)`,
  );

  return { total: subscribers.length, sent, failed, skipped };
};
