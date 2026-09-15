import type { IMoodRepository } from "./interfaces/IMoodRepository";
import type { IMood } from "../interfaces/IMood";
import { MoodModel } from "../models/mood.model";

export class MoodRepository implements IMoodRepository {
  async findAll(language?: "es" | "en"): Promise<IMood[]> {
    const filter = language ? { language } : {};
    return MoodModel.find(filter).sort({ order: 1 }).exec();
  }
}
