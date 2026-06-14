import sgMail from "@sendgrid/mail";
import { env } from "../config/env";
import type { IEmailService } from "./interfaces/IEmailService";
import { welcomeTemplate } from "./templates/welcome.template";
import { resetPasswordTemplate } from "./templates/resetPassword.template";
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
      console.log(`[EmailService] Sent → ${to} | ${subject}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      // Log but don't throw — a failed email should never break the auth flow
      console.error(`[EmailService] Failed → ${to} | ${subject} | ${message}`);
    }
  }

  async sendWelcome(to: string, name: string): Promise<void> {
    await this.send(to, "Welcome to Life Goes On 命", welcomeTemplate(name));
  }

  async sendPasswordReset(to: string, name: string, resetUrl: string): Promise<void> {
    await this.send(
      to,
      "Reset your password — Life Goes On",
      resetPasswordTemplate(name, resetUrl),
    );
  }

  async sendMotivationalMessage(to: string, name: string, message: string): Promise<void> {
    await this.send(
      to,
      "A message for you — Life Goes On 命",
      motivationalTemplate(name, message),
    );
  }
}
