import type { Orchestra, OrchestraProfile } from "@shared/schema";
import { DEFAULT_ORCHESTRAS, typeModifiers } from "./orchestraData";

export const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1yXR2Xayajkt8vuXE0zswcCzz4v95Jk2x2Xf16b1eLMM/export?format=csv&gid=1820784714";

export const SUGGEST_ORCHESTRA_URL =
  "https://docs.google.com/spreadsheets/d/1yXR2Xayajkt8vuXE0zswcCzz4v95Jk2x2Xf16b1eLMM/edit";

interface OrchestraCache {
  orchestras: Orchestra[];
  lastSynced: Date | null;
  source: "remote" | "fallback";
  loading: boolean;
  error: string | null;
}

let cache: OrchestraCache = {
  orchestras: DEFAULT_ORCHESTRAS,
  lastSynced: null,
  source: "fallback",
  loading: false,
  error: null,
};

type Listener = () => void;
const listeners = new Set<Listener>();

function setCache(update: Partial<OrchestraCache>) {
  cache = { ...cache, ...update };
  listeners.forEach((fn) => fn());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCache(): OrchestraCache {
  return cache;
}

export function getOrchestras(): Orchestra[] {
  return cache.orchestras;
}

export function nameToId(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function parseCSVRow(row: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < row.length && row[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        fields.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
  }
  fields.push(current.trim());
  return fields;
}

function parseTypes(typesStr: string): string[] {
  if (!typesStr) return ["T"];
  return typesStr
    .split(/[\s,]+/)
    .map((t) => t.trim().toUpperCase())
    .filter((t) => t === "T" || t === "V" || t === "M");
}

function parseCSVToOrchestras(text: string): Orchestra[] {
  const lines = text.split(/\r?\n/);
  if (lines.length < 4) return [];

  const headerLine = lines[2];
  const headers = parseCSVRow(headerLine).map((h) => h.toLowerCase().trim());

  const col = (name: string) => headers.indexOf(name);
  const iOrch = col("orchestra");
  const iSinger = col("singer/config");
  const iEra = col("era");
  const iStyle = col("style category");
  const iEnergy = col("energy (1-10)");
  const iMood = col("mood");
  const iDance = col("danceability");
  const iComplex = col("complexity");
  const iTypes = col("types (t/v/m)");
  const iNotes = col("dj notes");

  if (iOrch === -1) return [];

  const orchestraMap = new Map<string, Orchestra>();
  let currentOrchestraName = "";

  for (let i = 3; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values = parseCSVRow(line);
    const orchCell = (values[iOrch] || "").trim();

    if (orchCell.startsWith("▸") || orchCell.startsWith("▸")) {
      continue;
    }

    let orchestraName: string;
    let singerName: string;

    if (orchCell.startsWith("↳") || orchCell === "↳") {
      orchestraName = currentOrchestraName;
      singerName = (values[iSinger] || "").trim();
    } else if (orchCell === "" && (values[iSinger] || "").trim()) {
      orchestraName = currentOrchestraName;
      singerName = (values[iSinger] || "").trim();
    } else if (orchCell) {
      orchestraName = orchCell;
      currentOrchestraName = orchCell;
      singerName = (values[iSinger] || "").trim();
    } else {
      continue;
    }

    if (!orchestraName) continue;

    const id = nameToId(orchestraName);

    if (!orchestraMap.has(id)) {
      orchestraMap.set(id, {
        id,
        name: orchestraName,
        nickname: null,
        profiles: [],
      });
    }

    const era = iEra >= 0 ? (values[iEra] || "").trim() : "";
    const styleRaw = iStyle >= 0 ? (values[iStyle] || "").trim() : "";
    const style = styleRaw
      .toLowerCase()
      .replace(/[\s-]+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
    const energy = iEnergy >= 0 ? parseInt(values[iEnergy] || "5") || 5 : 5;
    const mood = iMood >= 0 ? (values[iMood] || "").trim() : "";
    const danceability = iDance >= 0 ? parseInt(values[iDance] || "5") || 5 : 5;
    const complexity = iComplex >= 0 ? parseInt(values[iComplex] || "5") || 5 : 5;
    const typesStr = iTypes >= 0 ? (values[iTypes] || "").trim() : "T";
    const djNotes = iNotes >= 0 ? (values[iNotes] || "").trim() : "";

    const profile: OrchestraProfile = {
      singer: singerName || "(instrumental)",
      era: era || "Unknown",
      style: style || "smooth",
      energy: Math.max(1, Math.min(10, energy)),
      mood: mood || "neutral",
      danceability: Math.max(1, Math.min(10, danceability)),
      complexity: Math.max(1, Math.min(10, complexity)),
      types: parseTypes(typesStr),
      dj_notes: djNotes,
    };

    orchestraMap.get(id)!.profiles.push(profile);
  }

  return Array.from(orchestraMap.values()).filter((o) => o.profiles.length > 0);
}

export async function fetchOrchestras(): Promise<void> {
  if (cache.loading) return;

  setCache({ loading: true, error: null });

  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();
    const parsed = parseCSVToOrchestras(text);

    if (parsed.length < 3) {
      throw new Error(`Only ${parsed.length} orchestras parsed — likely bad data`);
    }

    setCache({
      orchestras: parsed,
      lastSynced: new Date(),
      source: "remote",
      loading: false,
      error: null,
    });
  } catch (err) {
    setCache({
      orchestras: DEFAULT_ORCHESTRAS,
      lastSynced: null,
      source: "fallback",
      loading: false,
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}

export function getOrchestra(id: string): Orchestra | undefined {
  return cache.orchestras.find((o) => o.id === id);
}

export function getOrchestraProfile(id: string, singer?: string): OrchestraProfile | undefined {
  const orchestra = getOrchestra(id);
  if (!orchestra) return undefined;
  if (singer) {
    return orchestra.profiles.find((p) => p.singer === singer);
  }
  return orchestra.profiles[0];
}

export function calculateEnergy(orchestraId: string, type: string, singer?: string): number {
  const profile = getOrchestraProfile(orchestraId, singer);
  if (!profile) return 5;
  const modifier = typeModifiers[type]?.energy_modifier || 0;
  return Math.max(1, Math.min(10, profile.energy + modifier));
}

export function calculateEnergyFromProfile(baseEnergy: number, type: string): number {
  const modifier = typeModifiers[type]?.energy_modifier || 0;
  return Math.max(1, Math.min(10, baseEnergy + modifier));
}

export function getAllSingers(orchestraId: string): string[] {
  const orchestra = getOrchestra(orchestraId);
  if (!orchestra) return [];
  return orchestra.profiles
    .map((p) => p.singer)
    .filter((s) => !s.startsWith("("));
}

export function getAvailableTypes(orchestraId: string, singer?: string): string[] {
  const profile = getOrchestraProfile(orchestraId, singer);
  if (!profile) return ["T"];
  return profile.types;
}
