import type { Request, Response } from "express";
import type { DeliverySummaryDTO } from "life-goes-on-shared";
import { EmailDeliveryRepository } from "../repositories/emailDelivery.repository";
import { startOfUtcDay } from "../utils/date.utils";
import { ApiResponse } from "../utils/ApiResponse";

const deliveryRepo = new EmailDeliveryRepository();

// Protected by adminAuth at the route level (see admin.routes.ts).
export const getTodaysDeliverySummary = async (_req: Request, res: Response): Promise<void> => {
  const today = startOfUtcDay();
  const summary = await deliveryRepo.getSummaryForDate(today);

  const dto: DeliverySummaryDTO = {
    date: summary.date.toISOString(),
    sent: summary.sent,
    failed: summary.failed,
    total: summary.total,
  };

  res.status(200).json(ApiResponse.ok("ok", dto));
};
