import type { Tanda } from "@shared/schema";
import { getOrchestra, placementGuidelines } from "./orchestraData";

export interface Warning {
  id: string;
  type: "warning" | "suggestion";
  messageKey: string;
  messageParams: Record<string, string | number>;
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
        messageKey: "warning_back_to_back",
        messageParams: { name, from: i + 1, to: i + 2 },
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
        messageKey: "warning_consecutive_type",
        messageParams: { type: a.type, from: i + 1, to: i + 3 },
        slots: [i, i + 1, i + 2],
      });
    }
  }

  const first8 = tandas.slice(0, 8);
  if (first8.filter(Boolean).length >= 4 && !first8.some((t) => t?.type === "vals")) {
    warnings.push({
      id: "no-vals-early",
      type: "warning",
      messageKey: "warning_no_vals_early",
      messageParams: {},
    });
  }

  const first10 = tandas.slice(0, 10);
  if (first10.filter(Boolean).length >= 6 && !first10.some((t) => t?.type === "milonga")) {
    warnings.push({
      id: "no-milonga-early",
      type: "warning",
      messageKey: "warning_no_milonga_early",
      messageParams: {},
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
          messageKey: "warning_energy_jump",
          messageParams: {
            from: current.energy.toFixed(1),
            to: next.energy.toFixed(1),
            slotFrom: i + 1,
            slotTo: i + 2,
          },
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
        messageKey: "warning_complex_early",
        messageParams: { name, slot: i + 1 },
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
        messageKey: "warning_suggest_warmup",
        messageParams: { names: recommended },
      });
    }
  }

  if (tandas.length > 0) {
    const lastTanda = tandas[tandas.length - 1];
    if (!lastTanda) {
      warnings.push({
        id: "suggest-cumparsita",
        type: "suggestion",
        messageKey: "warning_suggest_cumparsita",
        messageParams: {},
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
        messageKey: "warning_low_tango",
        messageParams: { percent: tangoPercent.toFixed(0) },
      });
    }
    if (tangoPercent > 75) {
      warnings.push({
        id: "high-tango-percent",
        type: "warning",
        messageKey: "warning_high_tango",
        messageParams: { percent: tangoPercent.toFixed(0) },
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
        messageKey: "warning_overused",
        messageParams: { name, count },
      });
    }
  });

  return warnings;
}
