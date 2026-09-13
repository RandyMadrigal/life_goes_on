export interface IEmailService {
  sendMotivationalMessage(
    to: string,
    name: string,
    message: string,
    unsubscribeUrl: string,
  ): Promise<void>;
}
