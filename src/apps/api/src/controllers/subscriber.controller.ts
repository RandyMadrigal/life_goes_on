import type { Request, Response } from "express";
import { SubscriberRepository } from "../repositories/subscriber.repository";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

const subscriberRepo = new SubscriberRepository();

export const subscribe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email } = req.body as { name?: string; email?: string };

  if (!name?.trim() || !email?.trim()) {
    res.status(400).json({ success: false, message: "Name and email are required." });
    return;
  }

  const existing = await subscriberRepo.findByEmail(email.toLowerCase().trim());
  if (existing) {
    res.status(409).json({ success: false, message: "This email is already subscribed." });
    return;
  }

  const subscriber = await subscriberRepo.create(name.trim(), email.toLowerCase().trim());
  res
    .status(201)
    .json(ApiResponse.ok("Subscribed successfully.", { name: subscriber.name, email: subscriber.email }));
});
