import type { Request, Response } from "express";
import { z } from "zod";
import { MoodModel } from "../models/mood.model";
import { toMoodDTO } from "../utils/dto.mappers";

const createMoodSchema = z
  .object({
    label: z.string().trim().min(1).max(100),
    name: z.string().trim().min(1).max(100).optional(),
  })
  .strict();
const updateMoodSchema = z.object({ label: z.string().trim().min(1).max(100) }).strict();

const toLabelName = (label: string): string =>
  label
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

export const createMood = async (req: Request, res: Response): Promise<void> => {
  const parsed = createMoodSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "label is required" });
    return;
  }
  const { label, name: rawName } = parsed.data;
  const name = rawName || toLabelName(label);
  const maxOrder = await MoodModel.findOne().sort({ order: -1 }).select("order").lean();
  const order = (maxOrder?.order ?? -1) + 1;
  const mood = await MoodModel.create({ name, label, order });
  res.status(201).json({ success: true, data: { mood: toMoodDTO(mood) } });
};

export const updateMood = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const parsed = updateMoodSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "label is required" });
    return;
  }
  const mood = await MoodModel.findByIdAndUpdate(id, parsed.data, {
    new: true,
    runValidators: true,
  }).lean();
  if (!mood) {
    res.status(404).json({ success: false, message: "Mood not found" });
    return;
  }
  res.status(200).json({ success: true, data: { mood: toMoodDTO(mood) } });
};

export const deleteMood = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const mood = await MoodModel.findByIdAndDelete(id).lean();
  if (!mood) {
    res.status(404).json({ success: false, message: "Mood not found" });
    return;
  }
  res.status(200).json({ success: true, message: "Mood deleted" });
};
