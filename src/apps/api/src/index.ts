import "dotenv/config";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import createApp from "./config/app";
import { scheduleMotivationalEmails } from "./jobs/email.job";
import { EmailService } from "./services/email.service";

const start = async (): Promise<void> => {
  await connectDatabase();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`🚀  API running on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });

  // Fire-and-forget: confirms SMTP creds work without blocking startup or sending mail.
  void new EmailService().verifyConnection();

  scheduleMotivationalEmails();
};

start().catch((err: unknown) => {
  console.error("❌  Startup error:", err);
  process.exit(1);
});
