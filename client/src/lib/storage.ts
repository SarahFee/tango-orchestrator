import type { MilongaSet, Tanda, InsertMilongaSet, InsertTanda } from "@shared/schema";

const SETS_KEY = "tangoflow_sets";
const TANDAS_KEY = "tangoflow_tandas";

function generateId(): string {
  return crypto.randomUUID();
}

function loadSets(): MilongaSet[] {
  try {
    const raw = localStorage.getItem(SETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSets(sets: MilongaSet[]): void {
  localStorage.setItem(SETS_KEY, JSON.stringify(sets));
}

function loadTandas(): Tanda[] {
  try {
    const raw = localStorage.getItem(TANDAS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTandas(tandas: Tanda[]): void {
  localStorage.setItem(TANDAS_KEY, JSON.stringify(tandas));
}

export const storage = {
  getAllSets(): MilongaSet[] {
    return loadSets().sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  },

  getSet(id: string): MilongaSet | undefined {
    return loadSets().find((s) => s.id === id);
  },

  createSet(data: InsertMilongaSet): MilongaSet {
    const sets = loadSets();
    const newSet: MilongaSet = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    sets.push(newSet);
    saveSets(sets);
    return newSet;
  },

  updateSet(id: string, data: Partial<InsertMilongaSet>): MilongaSet | undefined {
    const sets = loadSets();
    const index = sets.findIndex((s) => s.id === id);
    if (index === -1) return undefined;
    sets[index] = { ...sets[index], ...data };
    saveSets(sets);
    return sets[index];
  },

  deleteSet(id: string): void {
    saveSets(loadSets().filter((s) => s.id !== id));
    saveTandas(loadTandas().filter((t) => t.setId !== id));
  },

  getTandasForSet(setId: string): Tanda[] {
    return loadTandas().filter((t) => t.setId === setId);
  },

  createTanda(data: InsertTanda): Tanda {
    const tandas = loadTandas();
    const newTanda: Tanda = { ...data, id: generateId() };
    tandas.push(newTanda);
    saveTandas(tandas);
    return newTanda;
  },

  updateTanda(id: string, data: Partial<InsertTanda>): Tanda | undefined {
    const tandas = loadTandas();
    const index = tandas.findIndex((t) => t.id === id);
    if (index === -1) return undefined;
    tandas[index] = { ...tandas[index], ...data };
    saveTandas(tandas);
    return tandas[index];
  },

  deleteTanda(id: string): void {
    saveTandas(loadTandas().filter((t) => t.id !== id));
  },

  exportAllData(): { sets: MilongaSet[]; tandas: Tanda[] } {
    return { sets: loadSets(), tandas: loadTandas() };
  },

  importAllData(data: { sets: MilongaSet[]; tandas: Tanda[] }): void {
    if (!Array.isArray(data.sets) || !Array.isArray(data.tandas)) {
      throw new Error("Invalid import data format");
    }
    saveSets(data.sets);
    saveTandas(data.tandas);
  },

  exportSet(setId: string): { set: MilongaSet; tandas: Tanda[] } | null {
    const set = loadSets().find((s) => s.id === setId);
    if (!set) return null;
    const tandas = loadTandas().filter((t) => t.setId === setId);
    return { set, tandas };
  },

  importSet(data: { set: MilongaSet; tandas: Tanda[] }): MilongaSet {
    const newSetId = generateId();
    const sets = loadSets();
    const newSet: MilongaSet = {
      ...data.set,
      id: newSetId,
      name: data.set.name + " (imported)",
      createdAt: new Date().toISOString(),
    };
    sets.push(newSet);
    saveSets(sets);

    const tandas = loadTandas();
    for (const t of data.tandas) {
      tandas.push({ ...t, id: generateId(), setId: newSetId });
    }
    saveTandas(tandas);
    return newSet;
  },

  seedIfEmpty(): void {
    if (loadSets().length > 0) return;

    const classicSet = storage.createSet({
      name: "Classic Saturday Milonga",
      venue: "Salon Canning",
      date: "2026-03-07",
      startTime: "21:00",
    });

    const classicTandas = [
      { orchestraId: "di_sarli", singer: null, type: "tango", trackCount: 4, energy: 5, position: 0, style: "smooth", era: "1950-1958" },
      { orchestraId: "canaro", singer: null, type: "tango", trackCount: 4, energy: 4, position: 1, style: "old_guard", era: "1927-1938" },
      { orchestraId: "fresedo", singer: "Roberto Ray", type: "vals", trackCount: 3, energy: 3.5, position: 2, style: "smooth", era: "1935-1955" },
      { orchestraId: "darienzo", singer: "Alberto Echague", type: "tango", trackCount: 4, energy: 9, position: 3, style: "harder_rhythmic", era: "1935-1945" },
      { orchestraId: "tanturi", singer: "Alberto Castillo", type: "tango", trackCount: 4, energy: 7, position: 4, style: "softer_rhythmic", era: "1940-1944" },
      { orchestraId: "canaro", singer: null, type: "milonga", trackCount: 3, energy: 5.5, position: 5, style: "old_guard", era: "1927-1938" },
      { orchestraId: "troilo", singer: "Francisco Fiorentino", type: "tango", trackCount: 4, energy: 6, position: 6, style: "softer_rhythmic", era: "1941-1945" },
      { orchestraId: "calo", singer: "Raul Beron", type: "tango", trackCount: 4, energy: 5, position: 7, style: "lyrical", era: "1942-1945" },
      { orchestraId: "di_sarli", singer: "Roberto Rufino", type: "vals", trackCount: 3, energy: 5, position: 8, style: "lyrical", era: "1939-1945" },
      { orchestraId: "biagi", singer: "Jorge Ortiz", type: "tango", trackCount: 4, energy: 8, position: 9, style: "harder_rhythmic", era: "1938-1950" },
      { orchestraId: "pugliese", singer: null, type: "tango", trackCount: 4, energy: 7, position: 10, style: "dramatic", era: "1943-1950" },
      { orchestraId: "donato", singer: null, type: "milonga", trackCount: 3, energy: 7.5, position: 11, style: "softer_rhythmic", era: "1932-1942" },
      { orchestraId: "dagostino", singer: "Angel Vargas", type: "tango", trackCount: 4, energy: 5, position: 12, style: "softer_rhythmic", era: "1940-1945" },
      { orchestraId: "di_sarli", singer: null, type: "tango", trackCount: 4, energy: 5, position: 13, style: "smooth", era: "1950-1958" },
    ];

    for (const t of classicTandas) {
      storage.createTanda({ ...t, setId: classicSet.id });
    }

    const practicaSet = storage.createSet({
      name: "Short Practica",
      venue: "Studio Milonguero",
      date: "2026-03-10",
      startTime: "19:30",
    });

    const practicaTandas = [
      { orchestraId: "rodriguez", singer: null, type: "tango", trackCount: 4, energy: 7, position: 0, style: "harder_rhythmic", era: "1938-1950" },
      { orchestraId: "demare", singer: "Raul Beron", type: "tango", trackCount: 4, energy: 4, position: 1, style: "lyrical", era: "1942-1948" },
      { orchestraId: "tanturi", singer: "Enrique Campos", type: "vals", trackCount: 3, energy: 4, position: 2, style: "softer_rhythmic", era: "1943-1945" },
      { orchestraId: "darienzo", singer: null, type: "tango", trackCount: 4, energy: 9, position: 3, style: "harder_rhythmic", era: "1935-1945" },
      { orchestraId: "sexteto_milonguero", singer: null, type: "tango", trackCount: 4, energy: 8, position: 4, style: "modern_dance", era: "2006-2020" },
      { orchestraId: "de_angelis", singer: null, type: "milonga", trackCount: 3, energy: 7.5, position: 5, style: "dramatic", era: "1943-1958" },
      { orchestraId: "otros_aires", singer: null, type: "tango", trackCount: 4, energy: 6, position: 6, style: "neo_tango", era: "2003-present" },
      { orchestraId: "di_sarli", singer: null, type: "tango", trackCount: 4, energy: 5, position: 7, style: "smooth", era: "1950-1958" },
    ];

    for (const t of practicaTandas) {
      storage.createTanda({ ...t, setId: practicaSet.id });
    }
  },
};
