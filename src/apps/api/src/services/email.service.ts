import sgMail from "@sendgrid/mail";
import { env } from "../config/env";
import type { IEmailService } from "./interfaces/IEmailService";
import { motivationalTemplate } from "./templates/motivational.template";

export class EmailService implements IEmailService {
  constructor() {
    if (env.SENDGRID_API_KEY) {
      sgMail.setApiKey(env.SENDGRID_API_KEY);
    }
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    if (!env.SENDGRID_API_KEY) {
      console.log(`[EmailService] No API key — skipped. To: ${to} | Subject: ${subject}`);
      return;
    }
    try {
      await sgMail.send({
        to,
        from: { email: env.FROM_EMAIL, name: "Life Goes On" },
        subject,
        html,
      });
      console.log(`[EmailService] Sent → ${to}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[EmailService] Failed → ${to} | ${message}`);
    }
  }

  async sendMotivationalMessage(
    to: string,
    name: string,
    message: string,
    unsubscribeUrl: string,
  ): Promise<void> {
    await this.send(
      to,
      "A message for you — Life Goes On 命",
      motivationalTemplate(name, message, unsubscribeUrl),
    );
  }
}
