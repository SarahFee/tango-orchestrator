export const TANGO_COLORS = {
  tango: { bg: "#c94c4c", text: "#fff", label: "Tango" },
  vals: { bg: "#4c8ec9", text: "#fff", label: "Vals" },
  milonga: { bg: "#4cc96a", text: "#fff", label: "Milonga" },
} as const;

export const STYLE_COLORS: Record<string, string> = {
  harder_rhythmic: "#e85d5d",
  softer_rhythmic: "#e8a05d",
  smooth: "#5db8e8",
  lyrical: "#b05de8",
  dramatic: "#e85d8a",
  old_guard: "#8a8a6e",
  transitional: "#6e8a8a",
  modern_dance: "#5de8a0",
  neo_tango: "#5d6ee8",
  alternative: "#8a6e8a",
};

export function getEnergyColor(energy: number): string {
  if (energy <= 3) return "#4cc96a";
  if (energy <= 5) return "#c9a84c";
  if (energy <= 7) return "#e8a05d";
  return "#c94c4c";
}

export function getEnergyGradient(energy: number): string {
  if (energy <= 3) return "from-green-600 to-green-500";
  if (energy <= 5) return "from-yellow-600 to-yellow-500";
  if (energy <= 7) return "from-orange-600 to-orange-500";
  return "from-red-600 to-red-500";
}
