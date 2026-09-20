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

// Only quotes tagged with at least one of these moods are ever emailed.
// Deliberately hardcoded (not admin-configurable). Quotes store their moods
// by name in their own language (the es mood names are translated, not the
// English slugs), so the list has to exist per language. Note both
// "Disciplined"/"Discipline" (Disciplinado/Disciplina) are separate moods.
const DAILY_EMAIL_MOODS: Record<"es" | "en", readonly string[]> = {
  en: [
    "Motivated",
    "Disciplined",
    "Discipline",
    "Consistency",
    "HealingSlowly",
    "FutureSelf",
    "PersonalGrowth",
  ],
  es: [
    "Motivado",
    "Disciplinado",
    "Disciplina",
    "Consistencia",
    "SanandoLentamente",
    "YoFuturo",
    "CrecimientoPersonal",
  ],
};

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

  const results = await Promise.allSettled(
    subscribers.map(async (sub) => {
      if (alreadyDelivered.has(sub._id.toString())) {
        skipped += 1;
        return;
      }

      // Legacy subscribers may lack a language — default to English, since
      // an undefined value would silently drop the language filter in the query.
      const lang = sub.language ?? "en";
      const moods = DAILY_EMAIL_MOODS[lang];

      // Never repeat a quote for the same subscriber. Once they've received
      // every eligible quote, the cycle restarts (fallback below) rather
      // than the subscriber silently getting nothing. The restart only
      // excludes the most recent quote (sentQuoteIds is newest-first), so
      // the same one is never sent two days in a row.
      const sentQuoteIds = await deliveryRepo.findSentQuoteIds(sub._id);
      const quote =
        (await quoteRepo.findRandomByMoods(moods, lang, sentQuoteIds)) ??
        (await quoteRepo.findRandomByMoods(moods, lang, sentQuoteIds.slice(0, 1))) ??
        (await quoteRepo.findRandomByMoods(moods, lang));
      if (!quote) {
        throw new Error(`No quotes for moods [${moods.join(", ")}] in "${lang}"`);
      }

      // Fresh token per send: the same subscriber gets a new unsubscribe
      // link in every email, so a leaked/stale token from an old email
      // can't be replayed — see the design note in subscriber.repository.ts.
      const unsubscribeToken = await subscriberRepo.rotateUnsubscribeToken(sub._id);

      // Bail before sending if they unsubscribed since the list was loaded.
      if (!(await SubscriberModel.exists({ _id: sub._id }))) {
        skipped += 1;
        return;
      }

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

      // If they unsubscribed while the send was in flight, the record we
      // just wrote is an orphan — remove it (real deletion, per the privacy
      // policy). Checking after the write closes the race the other way.
      if (!(await SubscriberModel.exists({ _id: sub._id }))) {
        await deliveryRepo.deleteBySubscriber(sub._id);
      }
    }),
  );

  // allSettled swallows exceptions — surface them so a subscriber that
  // silently got nothing (e.g. no quotes for their language) is visible.
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      failed += 1;
      const reason = r.reason instanceof Error ? r.reason.message : String(r.reason);
      console.error(
        `❌  Daily email error for subscriber ${subscribers[i]._id} (lang: ${subscribers[i].language ?? "missing"}): ${reason}`,
      );
    }
  });

  console.log(
    `📬  Daily email run: ${sent} sent, ${failed} failed, ${skipped} already sent today (of ${subscribers.length} active)`,
  );

  return { total: subscribers.length, sent, failed, skipped };
};
