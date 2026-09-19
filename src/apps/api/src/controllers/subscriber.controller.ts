import type { Request, Response } from "express";
import { z } from "zod";
import { SubscriberRepository } from "../repositories/subscriber.repository";
import { EmailDeliveryRepository } from "../repositories/emailDelivery.repository";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { toAdminSubscriberDTO } from "../utils/dto.mappers";
import { escapeHtml } from "../utils/escapeHtml";

const subscriberRepo = new SubscriberRepository();
const deliveryRepo = new EmailDeliveryRepository();

const subscribeSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(80, "Name is too long"),
    email: z.string().trim().min(1, "Email is required").email("Invalid email address").max(254),
    language: z.enum(["es", "en"]).optional().default("en"),
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
  const { name, email, language } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await subscriberRepo.findByEmail(normalizedEmail);
  if (existing) {
    res.status(409).json({ success: false, message: "This email is already subscribed." });
    return;
  }

  const subscriber = await subscriberRepo.create(name, normalizedEmail, language);
  res.status(201).json(
    ApiResponse.ok("Subscribed successfully.", {
      name: subscriber.name,
      email: subscriber.email,
    }),
  );
});

// ── Admin ─────────────────────────────────────────────────────────────────────
// Protected by adminAuth at the route level (see admin.routes.ts).

export const getSubscribers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const search = typeof req.query.search === "string" ? req.query.search : undefined;

  const { subscribers, total } = await subscriberRepo.findPaginated(page, limit, search);

  res.status(200).json(
    ApiResponse.ok("ok", {
      subscribers: subscribers.map(toAdminSubscriberDTO),
      total,
      page,
      limit,
    }),
  );
});

type Lang = "es" | "en";

const COPY = {
  en: {
    invalidTitle: "Invalid link",
    invalid: "This unsubscribe link is invalid.",
    notFoundTitle: "Link not found",
    notFound: "This unsubscribe link is invalid or has already been used.",
    confirmTitle: "Unsubscribe",
    confirmQuestion: "Unsubscribe from the daily messages?",
    confirmNote: "Your data will be permanently deleted from our records.",
    confirmButton: "Yes, unsubscribe me",
    doneTitle: "Unsubscribed",
    done: (name: string) => `You've been unsubscribed, ${name}.`,
    doneNote:
      "Your data has been deleted from our records. You won't receive any more daily messages from us.",
  },
  es: {
    invalidTitle: "Enlace inválido",
    invalid: "Este enlace para darte de baja no es válido.",
    notFoundTitle: "Enlace no encontrado",
    notFound: "Este enlace para darte de baja no es válido o ya fue utilizado.",
    confirmTitle: "Darme de baja",
    confirmQuestion: "¿Quieres dejar de recibir los mensajes diarios?",
    confirmNote: "Tus datos se eliminarán permanentemente de nuestros registros.",
    confirmButton: "Sí, darme de baja",
    doneTitle: "Baja confirmada",
    done: (name: string) => `Te has dado de baja, ${name}.`,
    doneNote:
      "Tus datos han sido eliminados de nuestros registros. No recibirás más mensajes diarios.",
  },
} as const;

const htmlPage = (lang: Lang, title: string, body: string): string => `
<!DOCTYPE html>
<html lang="${lang}">
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

const readToken = (req: Request): string =>
  typeof req.query.token === "string" ? req.query.token : "";

const invalidLinkPage = (res: Response): void => {
  const c = COPY.en;
  res.status(400).type("html").send(htmlPage("en", c.invalidTitle, `<p>${c.invalid}</p>`));
};

const notFoundPage = (res: Response, lang: Lang): void => {
  const c = COPY[lang];
  res.status(404).type("html").send(htmlPage(lang, c.notFoundTitle, `<p>${c.notFound}</p>`));
};

// GET only renders a confirmation page — it never deletes anything. Mail
// scanners and link-preview bots follow every link in an email with GET, so
// a destructive GET would silently delete subscribers who never asked to
// leave. The actual deletion requires the POST below (the button's form, or
// a mail provider's one-click List-Unsubscribe-Post request).
//
// No CSRF token: the POST is authorized by the unguessable, per-email
// unsubscribe token in the URL itself, which a third-party site can't know.
export const unsubscribeConfirm = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const token = readToken(req);
    if (!token) return invalidLinkPage(res);

    const subscriber = await subscriberRepo.findByToken(token);
    if (!subscriber) return notFoundPage(res, "en");

    const lang = subscriber.language;
    const c = COPY[lang];
    res
      .status(200)
      .type("html")
      .send(
        htmlPage(
          lang,
          c.confirmTitle,
          `<p style="font-size:20px;">${c.confirmQuestion}</p>
    <p style="color:#8a8a9a;font-size:14px;">${c.confirmNote}</p>
    <form method="POST" action="/api/v1/subscribe/unsubscribe?token=${encodeURIComponent(token)}">
      <button type="submit" style="margin-top:24px;background:#ef4b67;color:#fff;border:0;border-radius:8px;padding:12px 28px;font-size:15px;cursor:pointer;">${c.confirmButton}</button>
    </form>`,
        ),
      );
  },
);

export const unsubscribe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const token = readToken(req);
  if (!token) return invalidLinkPage(res);

  const subscriber = await subscriberRepo.deleteByToken(token);
  if (!subscriber) return notFoundPage(res, "en");

  // The privacy policy promises real deletion — that includes the delivery
  // history keyed to this subscriber, not just the subscriber record.
  await deliveryRepo.deleteBySubscriber(subscriber._id);

  const lang = subscriber.language;
  const c = COPY[lang];
  res
    .status(200)
    .type("html")
    .send(
      htmlPage(
        lang,
        c.doneTitle,
        `<p style="font-size:20px;">${c.done(escapeHtml(subscriber.name))}</p><p style="color:#8a8a9a;font-size:14px;">${c.doneNote}</p>`,
      ),
    );
});
