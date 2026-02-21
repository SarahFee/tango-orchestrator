import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const milongaSets = pgTable("milonga_sets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  venue: text("venue"),
  date: text("date").notNull(),
  startTime: text("start_time").notNull().default("21:00"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tandas = pgTable("tandas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  setId: varchar("set_id").references(() => milongaSets.id, { onDelete: "cascade" }),
  orchestraId: text("orchestra_id").notNull(),
  singer: text("singer"),
  type: text("type").notNull(),
  trackCount: integer("track_count").notNull().default(4),
  energy: real("energy").notNull(),
  position: integer("position"),
  style: text("style"),
  era: text("era"),
});

export const insertMilongaSetSchema = createInsertSchema(milongaSets).omit({ id: true, createdAt: true });
export const insertTandaSchema = createInsertSchema(tandas).omit({ id: true });

export type InsertMilongaSet = z.infer<typeof insertMilongaSetSchema>;
export type MilongaSet = typeof milongaSets.$inferSelect;
export type InsertTanda = z.infer<typeof insertTandaSchema>;
export type Tanda = typeof tandas.$inferSelect;

export interface OrchestraProfile {
  era: string;
  era_label?: string;
  style: string;
  energy: number;
  mood: string;
  danceability: number;
  complexity: number;
  tags?: string[];
  dj_notes: string;
  key_singers?: string[];
  singer_effects?: Record<string, string>;
  confidence?: string;
}

export interface Orchestra {
  id: string;
  name: string;
  nickname?: string | null;
  instrument?: string;
  active_years?: string;
  profiles: OrchestraProfile[];
}

export interface StyleCategory {
  [key: string]: string;
}

export interface TypeModifier {
  energy_modifier: number;
  notes: string;
}

export interface PlacementGuideline {
  position: string;
  recommended: string[];
  energy_range: number[];
  notes?: string;
}

export type TandaType = "tango" | "vals" | "milonga";
