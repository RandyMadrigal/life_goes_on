import "dotenv/config";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import createApp from "./config/app";
import { scheduleMotivationalEmails } from "./jobs/email.job";
import { EmailService } from "./services/email.service";
import { AdminRepository } from "./repositories/admin.repository";

const start = async (): Promise<void> => {
  await connectDatabase();
  await new AdminRepository().ensureBootstrapped(env.ADMIN_EMAIL, env.ADMIN_PASSWORD_HASH);

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
