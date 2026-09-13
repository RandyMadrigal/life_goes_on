import cron from "node-cron";
import { SubscriberModel } from "../models/subscriber.model";
import { EmailService } from "../services/email.service";
import { QuoteRepository } from "../repositories/quote.repository";

const quoteRepo = new QuoteRepository();

export const scheduleMotivationalEmails = (): void => {
  const emailService = new EmailService();

  // Every day at 08:00 UTC
  cron.schedule("0 8 * * *", async () => {
    try {
      const subscribers = await SubscriberModel.find({ active: true }).exec();
      if (subscribers.length === 0) return;

      const results = await Promise.allSettled(
        subscribers.map(async (sub) => {
          const [quote] = await quoteRepo.findMany(undefined, 1);
          if (!quote) throw new Error("No quotes in database");
          return emailService.sendMotivationalMessage(sub.email, sub.name, quote.text);
        }),
      );

      const sent = results.filter((r) => r.status === "fulfilled").length;
      console.log(`📬  Sent daily motivation to ${sent}/${subscribers.length} subscriber(s)`);
    } catch (err) {
      console.error("📬  Email job error:", err);
    }
  });

  console.log("📬  Email scheduler initialized — runs daily at 08:00 UTC");
};
