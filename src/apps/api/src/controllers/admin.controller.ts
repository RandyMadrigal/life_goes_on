import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { QuoteModel } from "../models/quote.model";
import { MoodModel } from "../models/mood.model";
import { env } from "../config/env";
import { toQuoteDTO, toMoodDTO } from "../utils/dto.mappers";

const COOKIE_OPTS = {
  httpOnly: true,
  signed: true,
  sameSite: "lax" as const,
  secure: env.NODE_ENV === "production",
  maxAge: 8 * 60 * 60 * 1000, // 8h
};

// ── Auth ──────────────────────────────────────────────────────────────────────

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };

  const isValidEmail = typeof email === "string" && email === env.ADMIN_EMAIL;
  // Always run bcrypt.compare (even with a placeholder) so a wrong email doesn't
  // short-circuit before the password check, which would leak email validity via timing.
  const isValidPassword =
    typeof password === "string" && (await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH));

  if (!isValidEmail || !isValidPassword) {
    res.status(401).json({ success: false, message: "Credenciales inválidas" });
    return;
  }

  const token = jwt.sign({ role: "admin" }, env.JWT_ACCESS_SECRET, { expiresIn: "8h" });
  res.cookie("admin_token", token, COOKIE_OPTS);
  res.status(200).json({ success: true, message: "Sesión iniciada" });
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie("admin_token");
  res.status(200).json({ success: true, message: "Sesión cerrada" });
};

// ── Quotes CRUD ───────────────────────────────────────────────────────────────

export const getQuotes = async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const mood = req.query.mood as string | undefined;
  const search = req.query.search as string | undefined;

  const filter: Record<string, unknown> = {};
  if (mood) filter.moods = mood;
  if (search) filter.text = { $regex: search, $options: "i" };

  const [quotes, total] = await Promise.all([
    QuoteModel.find(filter)
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    QuoteModel.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: { quotes: quotes.map(toQuoteDTO), total, page, limit },
  });
};

export const createQuote = async (req: Request, res: Response): Promise<void> => {
  const { text, moods } = req.body as { text?: string; moods?: string[] };
  if (!text?.trim() || !moods?.length) {
    res.status(400).json({ success: false, message: "text y moods son requeridos" });
    return;
  }
  const quote = await QuoteModel.create({ text: text.trim(), moods });
  res.status(201).json({ success: true, data: { quote: toQuoteDTO(quote) } });
};

export const updateQuote = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { text, moods } = req.body as { text?: string; moods?: string[] };
  if (!text?.trim() || !moods?.length) {
    res.status(400).json({ success: false, message: "text y moods son requeridos" });
    return;
  }
  const quote = await QuoteModel.findByIdAndUpdate(
    id,
    { text: text.trim(), moods },
    { new: true, runValidators: true },
  ).lean();
  if (!quote) {
    res.status(404).json({ success: false, message: "Frase no encontrada" });
    return;
  }
  res.status(200).json({ success: true, data: { quote: toQuoteDTO(quote) } });
};

export const deleteQuote = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const quote = await QuoteModel.findByIdAndDelete(id).lean();
  if (!quote) {
    res.status(404).json({ success: false, message: "Frase no encontrada" });
    return;
  }
  res.status(200).json({ success: true, message: "Frase eliminada" });
};

// ── Moods CRUD ────────────────────────────────────────────────────────────────

const toLabelName = (label: string): string =>
  label
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

export const createMood = async (req: Request, res: Response): Promise<void> => {
  const { label, name: rawName } = req.body as { label?: string; name?: string };
  if (!label?.trim()) {
    res.status(400).json({ success: false, message: "label es requerido" });
    return;
  }
  const name = rawName?.trim() || toLabelName(label);
  const maxOrder = await MoodModel.findOne().sort({ order: -1 }).select("order").lean();
  const order = (maxOrder?.order ?? -1) + 1;
  const mood = await MoodModel.create({ name, label: label.trim(), order });
  res.status(201).json({ success: true, data: { mood: toMoodDTO(mood) } });
};

export const updateMood = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { label } = req.body as { label?: string };
  if (!label?.trim()) {
    res.status(400).json({ success: false, message: "label es requerido" });
    return;
  }
  const mood = await MoodModel.findByIdAndUpdate(
    id,
    { label: label.trim() },
    { new: true, runValidators: true },
  ).lean();
  if (!mood) {
    res.status(404).json({ success: false, message: "Estado no encontrado" });
    return;
  }
  res.status(200).json({ success: true, data: { mood: toMoodDTO(mood) } });
};

export const deleteMood = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const mood = await MoodModel.findByIdAndDelete(id).lean();
  if (!mood) {
    res.status(404).json({ success: false, message: "Estado no encontrado" });
    return;
  }
  res.status(200).json({ success: true, message: "Estado eliminado" });
};
