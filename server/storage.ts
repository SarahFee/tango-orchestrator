import {
  type MilongaSet,
  type InsertMilongaSet,
  type Tanda,
  type InsertTanda,
  milongaSets,
  tandas,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getAllSets(): Promise<MilongaSet[]>;
  getSet(id: string): Promise<MilongaSet | undefined>;
  createSet(data: InsertMilongaSet): Promise<MilongaSet>;
  updateSet(id: string, data: Partial<InsertMilongaSet>): Promise<MilongaSet | undefined>;
  deleteSet(id: string): Promise<void>;
  getTandasForSet(setId: string): Promise<Tanda[]>;
  createTanda(data: InsertTanda): Promise<Tanda>;
  updateTanda(id: string, data: Partial<InsertTanda>): Promise<Tanda | undefined>;
  deleteTanda(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getAllSets(): Promise<MilongaSet[]> {
    return db.select().from(milongaSets).orderBy(milongaSets.createdAt);
  }

  async getSet(id: string): Promise<MilongaSet | undefined> {
    const [set] = await db.select().from(milongaSets).where(eq(milongaSets.id, id));
    return set;
  }

  async createSet(data: InsertMilongaSet): Promise<MilongaSet> {
    const [set] = await db.insert(milongaSets).values(data).returning();
    return set;
  }

  async updateSet(id: string, data: Partial<InsertMilongaSet>): Promise<MilongaSet | undefined> {
    const [set] = await db
      .update(milongaSets)
      .set(data)
      .where(eq(milongaSets.id, id))
      .returning();
    return set;
  }

  async deleteSet(id: string): Promise<void> {
    await db.delete(tandas).where(eq(tandas.setId, id));
    await db.delete(milongaSets).where(eq(milongaSets.id, id));
  }

  async getTandasForSet(setId: string): Promise<Tanda[]> {
    return db.select().from(tandas).where(eq(tandas.setId, setId));
  }

  async createTanda(data: InsertTanda): Promise<Tanda> {
    const [tanda] = await db.insert(tandas).values(data).returning();
    return tanda;
  }

  async updateTanda(id: string, data: Partial<InsertTanda>): Promise<Tanda | undefined> {
    const [tanda] = await db
      .update(tandas)
      .set(data)
      .where(eq(tandas.id, id))
      .returning();
    return tanda;
  }

  async deleteTanda(id: string): Promise<void> {
    await db.delete(tandas).where(eq(tandas.id, id));
  }
}

export const storage = new DatabaseStorage();
