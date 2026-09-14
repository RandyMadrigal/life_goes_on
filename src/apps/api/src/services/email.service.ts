import nodemailer, { type Transporter } from "nodemailer";
import { env } from "../config/env";
import type { IEmailService } from "./interfaces/IEmailService";
import { motivationalTemplate } from "./templates/motivational.template";
import { resetPasswordTemplate } from "./templates/resetPassword.template";

const TIMEOUT_MS = 10_000;

export class EmailService implements IEmailService {
  private readonly configured: boolean;
  private readonly transporter: Transporter;

  constructor() {
    this.configured = Boolean(env.SMTP_USER && env.SMTP_PASS);
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      connectionTimeout: TIMEOUT_MS,
      greetingTimeout: TIMEOUT_MS,
      socketTimeout: TIMEOUT_MS,
    });
  }

  /**
   * Verifies the SMTP connection/credentials without sending any mail.
   * Safe to call at startup — logs the result, never throws.
   */
  async verifyConnection(): Promise<void> {
    if (!this.configured) {
      console.log("[EmailService] SMTP_USER/SMTP_PASS not set — email sending is disabled.");
      return;
    }
    try {
      await this.transporter.verify();
      console.log(`[EmailService] ✅  SMTP connection OK (${env.SMTP_HOST}:${env.SMTP_PORT})`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[EmailService] ❌  SMTP verification failed: ${message}`);
    }
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    if (!this.configured) {
      console.log(`[EmailService] SMTP not configured — skipped. To: ${to} | Subject: ${subject}`);
      return;
    }
    try {
      await this.transporter.sendMail({
        to,
        from: `"Life Goes On" <${env.FROM_EMAIL}>`,
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

  async sendPasswordReset(to: string, resetUrl: string): Promise<void> {
    await this.send(
      to,
      "Reset your admin password — Life Goes On",
      resetPasswordTemplate(resetUrl),
    );
  }
}
