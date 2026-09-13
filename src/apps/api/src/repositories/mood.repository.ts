import type { IMoodRepository } from "./interfaces/IMoodRepository";
import type { IMood } from "../interfaces/IMood";
import { MoodModel } from "../models/mood.model";

export class MoodRepository implements IMoodRepository {
  async findAll(): Promise<IMood[]> {
    return MoodModel.find().sort({ order: 1 }).exec();
  }
}
