export interface IEmailService {
  sendMotivationalMessage(to: string, name: string, message: string): Promise<void>;
}
