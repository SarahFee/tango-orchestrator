export interface MilongaSet {
  id: string;
  name: string;
  venue: string | null;
  date: string;
  startTime: string;
  createdAt: string;
}

export type TandaMode = "standard" | "mixed";

export interface Tanda {
  id: string;
  setId: string;
  orchestraId: string;
  orchestraIds?: string[];
  tandaMode?: TandaMode;
  singer: string | null;
  type: string;
  trackCount: number;
  energy: number;
  position: number | null;
  style: string | null;
  era: string | null;
}

export interface OrchestraProfile {
  singer: string;
  era: string;
  era_label?: string;
  style: string;
  energy: number;
  mood: string;
  danceability: number;
  complexity: number;
  types: string[];
  dj_notes: string;
  tags?: string[];
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

export type InsertMilongaSet = Omit<MilongaSet, "id" | "createdAt">;
export type InsertTanda = Omit<Tanda, "id">;
