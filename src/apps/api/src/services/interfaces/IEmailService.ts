export interface IEmailService {
  sendWelcome(to: string, name: string): Promise<void>;
  sendPasswordReset(to: string, name: string, resetUrl: string): Promise<void>;
  sendMotivationalMessage(to: string, name: string, message: string): Promise<void>;
}
