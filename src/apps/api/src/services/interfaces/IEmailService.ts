export interface SendResult {
  success: boolean;
  error?: string;
}

export interface IEmailService {
  /** Checks the mail transport's connection/credentials without sending anything. */
  verifyConnection(): Promise<void>;
  sendMotivationalMessage(
    to: string,
    name: string,
    message: string,
    unsubscribeUrl: string,
  ): Promise<SendResult>;
  sendPasswordReset(to: string, resetUrl: string): Promise<SendResult>;
}
