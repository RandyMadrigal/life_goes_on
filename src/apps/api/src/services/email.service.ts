import { Resend } from "resend";
import { env } from "../config/env";
import type { IEmailService, SendResult } from "./interfaces/IEmailService";
import { motivationalTemplate } from "./templates/motivational.template";
import { resetPasswordTemplate } from "./templates/resetPassword.template";
import { maskEmail } from "../utils/maskEmail";

// Sends mail via the Resend API (HTTPS) instead of raw SMTP — several hosts
// (Railway included) block outbound SMTP ports at the network level. Resend
// requires a verified sending domain to mail arbitrary recipients (not just
// the account owner), which is why FROM_EMAIL now lives on a dedicated
// domain instead of a personal Gmail address.
export class EmailService implements IEmailService {
  private readonly configured: boolean;
  private readonly resend: Resend | null;

  constructor() {
    this.configured = Boolean(env.RESEND_API_KEY);
    this.resend = this.configured ? new Resend(env.RESEND_API_KEY) : null;
  }

  /**
   * Confirms the API key works and the FROM_EMAIL domain is verified in
   * Resend, without sending any mail. Safe to call at startup — logs the
   * result, never throws.
   */
  async verifyConnection(): Promise<void> {
    if (!this.configured || !this.resend) {
      console.log("[EmailService] RESEND_API_KEY not set — email sending is disabled.");
      return;
    }
    try {
      const { data, error } = await this.resend.domains.list();
      if (error) throw new Error(error.message);

      const fromDomain = env.FROM_EMAIL.split("@")[1];
      const domain = data.data.find((d) => d.name === fromDomain);

      if (!domain) {
        console.warn(
          `[EmailService] ⚠️  No Resend domain matches FROM_EMAIL's domain (${fromDomain})`,
        );
      } else if (domain.status !== "verified") {
        console.warn(
          `[EmailService] ⚠️  Resend domain "${domain.name}" is not verified yet (status: ${domain.status})`,
        );
      } else {
        console.log(`[EmailService] ✅  Resend OK — domain "${domain.name}" verified`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[EmailService] ❌  Resend verification failed: ${message}`);
    }
  }

  private async send(
    to: string,
    subject: string,
    html: string,
    headers?: Record<string, string>,
  ): Promise<SendResult> {
    if (!this.configured || !this.resend) {
      const error = "Resend not configured (RESEND_API_KEY unset)";
      console.log(`[EmailService] ${error} — skipped. To: ${maskEmail(to)} | Subject: ${subject}`);
      return { success: false, error };
    }
    try {
      const { error } = await this.resend.emails.send({
        from: `Life Goes On <${env.FROM_EMAIL}>`,
        to,
        subject,
        html,
        headers,
      });
      if (error) throw new Error(error.message);
      console.log(`[EmailService] Sent → ${maskEmail(to)}`);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[EmailService] Failed → ${maskEmail(to)} | ${message}`);
      return { success: false, error: message };
    }
  }

  async sendMotivationalMessage(
    to: string,
    name: string,
    message: string,
    unsubscribeUrl: string,
  ): Promise<SendResult> {
    return this.send(
      to,
      "A message for you — Life Goes On 命",
      motivationalTemplate(name, message, unsubscribeUrl),
      // RFC 8058 one-click unsubscribe — Gmail/Yahoo require it for bulk senders
      // and show a native "Unsubscribe" button. The provider POSTs to this URL.
      {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    );
  }

  async sendPasswordReset(to: string, resetUrl: string): Promise<SendResult> {
    return this.send(
      to,
      "Reset your admin password — Life Goes On",
      resetPasswordTemplate(resetUrl),
    );
  }
}
