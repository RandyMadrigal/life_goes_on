import type { Request, Response } from "express";
import { sendDailyEmails } from "../jobs/email.job";

export const triggerDailyEmails = async (_req: Request, res: Response): Promise<void> => {
  const result = await sendDailyEmails();
  res.status(200).json({ success: true, message: "ok", data: result });
};
