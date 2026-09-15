import type { IMood } from "../../interfaces/IMood";

export interface IMoodRepository {
  findAll(language?: "es" | "en"): Promise<IMood[]>;
}
