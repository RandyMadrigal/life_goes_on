import type { IMood } from "../../interfaces/IMood";

export interface IMoodRepository {
  findAll(): Promise<IMood[]>;
}
