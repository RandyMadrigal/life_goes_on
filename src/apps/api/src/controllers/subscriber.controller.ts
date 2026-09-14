import type { Request, Response } from "express";
import { z } from "zod";
import { SubscriberRepository } from "../repositories/subscriber.repository";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

const subscriberRepo = new SubscriberRepository();

const subscribeSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(80, "Name is too long"),
    email: z.string().trim().min(1, "Email is required").email("Invalid email address").max(254),
  })
  .strict();

export const subscribe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.errors[0]?.message ?? "Invalid request body.",
    });
    return;
  }
  const { name, email } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await subscriberRepo.findByEmail(normalizedEmail);
  if (existing) {
    res.status(409).json({ success: false, message: "This email is already subscribed." });
    return;
  }

  const subscriber = await subscriberRepo.create(name, normalizedEmail);
  res.status(201).json(
    ApiResponse.ok("Subscribed successfully.", {
      name: subscriber.name,
      email: subscriber.email,
    }),
  );
});

const htmlPage = (title: string, body: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="background:#0f0f13;color:#f5f5f7;font-family:Georgia,serif;margin:0;padding:0;">
  <div style="max-width:480px;margin:0 auto;padding:64px 24px;text-align:center;">
    ${body}
  </div>
</body>
</html>`;

export const unsubscribe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const token = typeof req.query.token === "string" ? req.query.token : "";

  if (!token) {
    res
      .status(400)
      .type("html")
      .send(htmlPage("Invalid link", "<p>This unsubscribe link is invalid.</p>"));
    return;
  }

  const subscriber = await subscriberRepo.deactivateByToken(token);
  if (!subscriber) {
    res
      .status(404)
      .type("html")
      .send(
        htmlPage(
          "Link not found",
          "<p>This unsubscribe link is invalid or has already been used.</p>",
        ),
      );
    return;
  }

  res
    .status(200)
    .type("html")
    .send(
      htmlPage(
        "Unsubscribed",
        `<p style="font-size:20px;">You've been unsubscribed, ${subscriber.name}.</p><p style="color:#8a8a9a;font-size:14px;">You won't receive any more daily messages from us.</p>`,
      ),
    );
});
