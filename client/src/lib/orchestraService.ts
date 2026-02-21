import type { Orchestra, OrchestraProfile } from "@shared/schema";
import { orchestras as DEFAULT_ORCHESTRAS } from "./orchestraData";

export const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQExample/pub?gid=0&single=true&output=csv";

export const SUGGEST_ORCHESTRA_URL =
  "https://docs.google.com/spreadsheets/d/1Example/edit#gid=0";

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

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCSVRow(lines[0]).map((h) => h.toLowerCase().trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVRow(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || "";
    });
    rows.push(row);
  }
  return rows;
}

function csvRowsToOrchestras(rows: Record<string, string>[]): Orchestra[] {
  const map = new Map<string, Orchestra>();

  for (const row of rows) {
    const id = row["id"];
    if (!id) continue;

    if (!map.has(id)) {
      map.set(id, {
        id,
        name: row["name"] || id,
        nickname: row["nickname"] || null,
        instrument: row["instrument"] || undefined,
        active_years: row["active_years"] || undefined,
        profiles: [],
      });
    }

    const orchestra = map.get(id)!;

    const profile: OrchestraProfile = {
      era: row["era"] || "Unknown",
      era_label: row["era_label"] || undefined,
      style: row["style"] || "smooth",
      energy: parseInt(row["energy"]) || 5,
      mood: row["mood"] || "neutral",
      danceability: parseInt(row["danceability"]) || 5,
      complexity: parseInt(row["complexity"]) || 5,
      dj_notes: row["dj_notes"] || "",
      key_singers: row["key_singers"]
        ? row["key_singers"].split(";").map((s) => s.trim()).filter(Boolean)
        : undefined,
      tags: row["tags"]
        ? row["tags"].split(";").map((s) => s.trim()).filter(Boolean)
        : undefined,
      confidence: row["confidence"] || undefined,
    };

    orchestra.profiles.push(profile);
  }

  return Array.from(map.values());
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
    const rows = parseCSV(text);

    if (rows.length === 0) {
      throw new Error("CSV returned no data rows");
    }

    const parsed = csvRowsToOrchestras(rows);

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
