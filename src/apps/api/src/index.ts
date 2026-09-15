import "dotenv/config";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import createApp from "./config/app";
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

  // The daily email send is triggered externally (cron-job.org) hitting
  // POST /api/v1/internal/jobs/send-daily-emails — not scheduled in-process,
  // so a Railway restart/redeploy can't silently skip a day. See jobs.controller.ts.
};

start().catch((err: unknown) => {
  console.error("❌  Startup error:", err);
  process.exit(1);
});
