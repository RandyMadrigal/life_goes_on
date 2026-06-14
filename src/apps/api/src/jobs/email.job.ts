import cron from "node-cron";
import { UserModel } from "../models/user.model";
import { EmailService } from "../services/email.service";
import { UserRepository } from "../repositories/user.repository";
import { quotes } from "../data/quotes";
import type { Mood } from "../interfaces/IUser";

function pickQuote(mood: Mood): string {
  const pool = quotes.filter((q) => q.moods.includes(mood));
  const source = pool.length > 0 ? pool : quotes;
  return source[Math.floor(Math.random() * source.length)].text;
}

export const scheduleMotivationalEmails = (): void => {
  const emailService = new EmailService();
  const userRepository = new UserRepository();

  // Every hour: send to users whose preferredEmailTime matches the current UTC hour
  cron.schedule("0 * * * *", async () => {
    const now = new Date();
    const currentTime = `${String(now.getUTCHours()).padStart(2, "0")}:00`;

    try {
      const users = await UserModel.find({ preferredEmailTime: currentTime });
      if (users.length === 0) return;

      const results = await Promise.allSettled(
        users.map((user) =>
          emailService.sendMotivationalMessage(
            user.email,
            user.name,
            pickQuote(user.mood),
          ),
        ),
      );

      // Increment emailsSent + streak only for users whose email succeeded
      await Promise.allSettled(
        results.map((result, i) => {
          if (result.status === "fulfilled") {
            return userRepository.incrementEmailStats(users[i]!._id.toString());
          }
        }),
      );

      const sent = results.filter((r) => r.status === "fulfilled").length;
      console.log(`📬  Sent motivational emails to ${sent}/${users.length} user(s) at ${currentTime} UTC`);
    } catch (err) {
      console.error("📬  Email job error:", err);
    }
  });

  console.log("📬  Email scheduler initialized — runs every hour on the hour");
};
