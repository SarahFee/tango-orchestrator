import type { Tanda } from "@shared/schema";
import { getOrchestra, placementGuidelines } from "./orchestraData";

export interface Warning {
  id: string;
  type: "warning" | "suggestion";
  message: string;
  slots?: number[];
}

export function generateWarnings(tandas: (Tanda | null)[]): Warning[] {
  const warnings: Warning[] = [];
  const filledTandas = tandas.filter((t): t is Tanda => t !== null);

  for (let i = 0; i < tandas.length - 1; i++) {
    const current = tandas[i];
    const next = tandas[i + 1];
    if (current && next && current.orchestraId === next.orchestraId) {
      const name = getOrchestra(current.orchestraId)?.name || current.orchestraId;
      warnings.push({
        id: `back-to-back-${i}`,
        type: "warning",
        message: `Same orchestra back-to-back: ${name} (slots ${i + 1}-${i + 2})`,
        slots: [i, i + 1],
      });
    }
  }

  for (let i = 0; i < tandas.length - 2; i++) {
    const a = tandas[i];
    const b = tandas[i + 1];
    const c = tandas[i + 2];
    if (a && b && c && a.type === b.type && b.type === c.type) {
      warnings.push({
        id: `consecutive-type-${i}`,
        type: "warning",
        message: `3 consecutive ${a.type}s (slots ${i + 1}-${i + 3}) — add variety`,
        slots: [i, i + 1, i + 2],
      });
    }
  }

  const first8 = tandas.slice(0, 8);
  if (first8.filter(Boolean).length >= 4 && !first8.some((t) => t?.type === "vals")) {
    warnings.push({
      id: "no-vals-early",
      type: "warning",
      message: "No vals in first 8 slots — dancers need variety",
    });
  }

  const first10 = tandas.slice(0, 10);
  if (first10.filter(Boolean).length >= 6 && !first10.some((t) => t?.type === "milonga")) {
    warnings.push({
      id: "no-milonga-early",
      type: "warning",
      message: "No milonga in first 10 slots",
    });
  }

  for (let i = 0; i < tandas.length - 1; i++) {
    const current = tandas[i];
    const next = tandas[i + 1];
    if (current && next) {
      const diff = Math.abs(current.energy - next.energy);
      if (diff > 4) {
        warnings.push({
          id: `energy-jump-${i}`,
          type: "warning",
          message: `Energy jumps from ${current.energy.toFixed(1)} to ${next.energy.toFixed(1)} (slots ${i + 1}-${i + 2}) — consider a transition`,
          slots: [i, i + 1],
        });
      }
    }
  }

  const first3 = tandas.slice(0, 3);
  first3.forEach((t, i) => {
    if (t && (t.orchestraId === "pugliese" || t.orchestraId === "biagi")) {
      const name = getOrchestra(t.orchestraId)?.name || t.orchestraId;
      warnings.push({
        id: `complex-early-${i}`,
        type: "warning",
        message: `${name} too early (slot ${i + 1}) — save for mid-evening when floor is warm`,
        slots: [i],
      });
    }
  });

  if (tandas.length >= 2) {
    const firstTwo = tandas.slice(0, 2);
    if (firstTwo.every((t) => t === null)) {
      const recommended = placementGuidelines.warm_up.recommended
        .map((id) => getOrchestra(id)?.name)
        .filter(Boolean)
        .slice(0, 3)
        .join(", ");
      warnings.push({
        id: "suggest-warmup",
        type: "suggestion",
        message: `Consider ${recommended} for warm-up (first 2 slots)`,
      });
    }
  }

  if (tandas.length > 0) {
    const lastTanda = tandas[tandas.length - 1];
    if (!lastTanda) {
      warnings.push({
        id: "suggest-cumparsita",
        type: "suggestion",
        message: "Tradition: end with La Cumparsita in the last slot",
      });
    }
  }

  if (filledTandas.length >= 4) {
    const tangoCount = filledTandas.filter((t) => t.type === "tango").length;
    const tangoPercent = (tangoCount / filledTandas.length) * 100;
    if (tangoPercent < 50) {
      warnings.push({
        id: "low-tango-percent",
        type: "warning",
        message: `Tango is only ${tangoPercent.toFixed(0)}% — should be 50-75%`,
      });
    }
    if (tangoPercent > 75) {
      warnings.push({
        id: "high-tango-percent",
        type: "warning",
        message: `Tango is ${tangoPercent.toFixed(0)}% — consider more vals/milonga variety`,
      });
    }
  }

  const orchestraCounts: Record<string, number> = {};
  filledTandas.forEach((t) => {
    orchestraCounts[t.orchestraId] = (orchestraCounts[t.orchestraId] || 0) + 1;
  });
  Object.entries(orchestraCounts).forEach(([id, count]) => {
    if (count > 3) {
      const name = getOrchestra(id)?.name || id;
      warnings.push({
        id: `overused-${id}`,
        type: "warning",
        message: `${name} appears ${count} times — consider more variety`,
      });
    }
  });

  return warnings;
}
