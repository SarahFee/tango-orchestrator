import type { Orchestra, StyleCategory, TypeModifier, PlacementGuideline } from "@shared/schema";

export const styleCategories: StyleCategory = {
  harder_rhythmic: "Prominent double-time accents. High physical energy.",
  softer_rhythmic: "Rhythmic but gentler. Moderate-high energy.",
  smooth: "Flowing, elegant, no dramatic pauses. Moderate energy.",
  lyrical: "Singer-forward, romantic. Lower physical, higher emotional energy.",
  dramatic: "Big crescendos, dramatic pauses, heavy beat. Intense.",
  old_guard: "Pre-golden-age. Simple rhythms. Good for warm-up.",
  transitional: "Post-golden-age concert-influenced sound. Challenging.",
  modern_dance: "Contemporary orchestras in golden-age style.",
  neo_tango: "Electronic elements mixed with tango.",
  alternative: "Non-tango music adapted for tango dancing.",
};

export const typeModifiers: Record<string, TypeModifier> = {
  tango: { energy_modifier: 0, notes: "Baseline. 4/4 time." },
  vals: { energy_modifier: -1.0, notes: "3/4 waltz. Lighter, romantic." },
  milonga: { energy_modifier: 1.5, notes: "2/4 time. Fastest, most playful." },
};

export const placementGuidelines: Record<string, PlacementGuideline> = {
  warm_up: {
    position: "First 2-3 tandas",
    recommended: ["francisco_canaro", "carlos_di_sarli", "osvaldo_fresedo", "edgardo_donato"],
    energy_range: [3, 5],
    notes: "Clear, simple rhythms. Help dancers find the beat.",
  },
  building: {
    position: "Tandas 3-6",
    recommended: ["juan_d_arienzo", "ricardo_tanturi", "angel_d_agostino", "pedro_laurenz", "miguel_calo"],
    energy_range: [5, 7],
  },
  peak: {
    position: "Mid-evening",
    recommended: ["juan_d_arienzo", "rodolfo_biagi", "osvaldo_pugliese", "anibal_troilo"],
    energy_range: [7, 9],
  },
  cool_down: {
    position: "After peak",
    recommended: ["carlos_di_sarli", "miguel_calo", "angel_d_agostino", "lucio_demare", "osvaldo_fresedo"],
    energy_range: [4, 6],
  },
  wind_down: {
    position: "Last 2-3 tandas",
    recommended: ["carlos_di_sarli", "francisco_canaro", "osvaldo_fresedo"],
    energy_range: [3, 5],
  },
};

export const DEFAULT_ORCHESTRAS: Orchestra[] = [
  {
    id: "juan_d_arienzo",
    name: "Juan D'Arienzo",
    nickname: "El Rey del Compas",
    profiles: [
      { singer: "(instrumental)", era: "1935-1945", style: "harder_rhythmic", energy: 9, mood: "driving", danceability: 10, complexity: 3, types: ["T", "V", "M"], dj_notes: "Pure rhythm. The ultimate floor-filler. Peak energy injector." },
      { singer: "Alberto Echagüe", era: "1938-1950s", style: "harder_rhythmic", energy: 9, mood: "driving", danceability: 10, complexity: 3, types: ["T", "M"], dj_notes: "Best fit singer. Tough, macho voice matches the beat perfectly." },
      { singer: "Héctor Mauré", era: "1940-1944", style: "softer_rhythmic", energy: 7, mood: "romantic-rhythmic", danceability: 9, complexity: 4, types: ["T", "V"], dj_notes: "More lyrical/romantic than Echagüe. Different energy — use for variety." },
    ],
  },
  {
    id: "carlos_di_sarli",
    name: "Carlos Di Sarli",
    nickname: "El Señor del Tango",
    profiles: [
      { singer: "(instrumental late)", era: "1950-1958", style: "smooth", energy: 5, mood: "elegant", danceability: 10, complexity: 3, types: ["T", "V", "M"], dj_notes: "Quintessential walking tango. Perfect warm-up or wind-down." },
      { singer: "Roberto Rufino", era: "1939-1943", style: "lyrical", energy: 6, mood: "romantic", danceability: 9, complexity: 4, types: ["T"], dj_notes: "Beautiful voice. Golden age romantic." },
      { singer: "Jorge Durán", era: "1945-1948", style: "lyrical", energy: 6, mood: "romantic", danceability: 9, complexity: 4, types: ["T"], dj_notes: "Emotional, romantic. Mid-evening mood builder." },
      { singer: "Alberto Podestá", era: "1940s", style: "lyrical", energy: 6, mood: "romantic", danceability: 9, complexity: 4, types: ["T"], dj_notes: "Gentle, romantic. Great for seductive tandas." },
    ],
  },
  {
    id: "anibal_troilo",
    name: "Aníbal Troilo",
    nickname: "Pichuco",
    profiles: [
      { singer: "Francisco Fiorentino", era: "1941-1944", style: "softer_rhythmic", energy: 6, mood: "playful", danceability: 8, complexity: 6, types: ["T", "M"], dj_notes: "Classic pairing. Complex syncopation. Mid-evening." },
      { singer: "(instrumental)", era: "1941-1955", style: "softer_rhythmic", energy: 7, mood: "bandoneón-forward", danceability: 8, complexity: 6, types: ["T", "M"], dj_notes: "Bandoneón-driven. Complex but danceable. Mid-evening." },
      { singer: "Alberto Marino", era: "1943-1947", style: "lyrical", energy: 5, mood: "lyrical", danceability: 7, complexity: 6, types: ["T"], dj_notes: "More lyrical than Fiorentino. Deeper emotional feel." },
    ],
  },
  {
    id: "osvaldo_pugliese",
    name: "Osvaldo Pugliese",
    nickname: "San Pugliese",
    profiles: [
      { singer: "(instrumental early)", era: "1943-1950", style: "dramatic", energy: 7, mood: "dramatic", danceability: 7, complexity: 7, types: ["T"], dj_notes: "Yumba beat developing. Dramatic but still danceable." },
      { singer: "(instrumental peak)", era: "1950-1960", style: "dramatic", energy: 8, mood: "dramatic", danceability: 7, complexity: 8, types: ["T", "V", "M"], dj_notes: "Peak dramatic period. Advanced dancers. Strategic placement." },
      { singer: "Roberto Chanel", era: "1940s-1950s", style: "dramatic", energy: 8, mood: "dramatic", danceability: 7, complexity: 8, types: ["T"], dj_notes: "Powerful, dramatic vocals on dramatic orchestra." },
    ],
  },
  {
    id: "rodolfo_biagi",
    name: "Rodolfo Biagi",
    nickname: "Manos Brujas",
    profiles: [
      { singer: "(instrumental)", era: "1938-1950", style: "harder_rhythmic", energy: 8, mood: "driving-syncopated", danceability: 8, complexity: 6, types: ["T", "V", "M"], dj_notes: "Striking piano syncopation. Milonguero favorite." },
      { singer: "Jorge Ortiz", era: "1938-1942", style: "harder_rhythmic", energy: 8, mood: "driving-syncopated", danceability: 8, complexity: 6, types: ["T"], dj_notes: "Piano syncopation + clear vocals. Crowd-pleaser." },
      { singer: "Alberto Amor", era: "1940s", style: "softer_rhythmic", energy: 6, mood: "romantic-syncopated", danceability: 7, complexity: 5, types: ["T"], dj_notes: "More romantic than Ortiz. Different energy — same orchestra!" },
    ],
  },
  {
    id: "ricardo_tanturi",
    name: "Ricardo Tanturi",
    nickname: "El Caballero del Tango",
    profiles: [
      { singer: "Alberto Castillo", era: "1940-1943", style: "softer_rhythmic", energy: 7, mood: "energetic-fun", danceability: 9, complexity: 4, types: ["T", "V"], dj_notes: "Theatrical, energetic. Fun floor-filler." },
      { singer: "Enrique Campos", era: "1943-1945", style: "softer_rhythmic", energy: 5, mood: "romantic", danceability: 8, complexity: 4, types: ["T"], dj_notes: "Gentle, romantic. Totally different from Castillo." },
    ],
  },
  {
    id: "miguel_calo",
    name: "Miguel Caló",
    nickname: null,
    profiles: [
      { singer: "Raúl Berón", era: "1942-1945", style: "lyrical", energy: 5, mood: "romantic", danceability: 8, complexity: 5, types: ["T"], dj_notes: "Beautiful romantic pairing. Energy DOWN, emotion UP." },
      { singer: "Raúl Iriarte", era: "1942-1945", style: "lyrical", energy: 5, mood: "emotional", danceability: 8, complexity: 5, types: ["T", "V"], dj_notes: "Emotional edge. Also great for vals tandas." },
    ],
  },
  {
    id: "angel_d_agostino",
    name: "Ángel D'Agostino",
    nickname: "Los Dos Ángeles",
    profiles: [
      { singer: "Ángel Vargas", era: "1940-1945", style: "softer_rhythmic", energy: 5, mood: "ethereal", danceability: 8, complexity: 3, types: ["T", "V"], dj_notes: "Los Dos Ángeles. Dreamy, spacious. Post-peak cool-down." },
    ],
  },
  {
    id: "francisco_canaro",
    name: "Francisco Canaro",
    nickname: "Pirincho",
    profiles: [
      { singer: "(instrumental)", era: "1927-1950", style: "old_guard", energy: 4, mood: "simple-rhythmic", danceability: 7, complexity: 2, types: ["T", "V", "M"], dj_notes: "Simple rhythms. Most-played milongas in the world. Good warm-up." },
      { singer: "Roberto Maida", era: "1935-1940", style: "lyrical", energy: 4, mood: "romantic", danceability: 7, complexity: 3, types: ["T"], dj_notes: "Clear, accessible. Good warm-up." },
    ],
  },
  {
    id: "osvaldo_fresedo",
    name: "Osvaldo Fresedo",
    nickname: "El Pibe de La Paternal",
    profiles: [
      { singer: "(instrumental)", era: "1925-1955", style: "smooth", energy: 4, mood: "elegant", danceability: 7, complexity: 3, types: ["T", "V"], dj_notes: "Elegant, delicate. Early evening." },
      { singer: "Roberto Ray", era: "1935-1950", style: "smooth", energy: 4, mood: "pink-champagne", danceability: 7, complexity: 3, types: ["T"], dj_notes: "'Pink Champagne' tango. Sweet, light." },
    ],
  },
];

export function getStyleLabel(style: string): string {
  return style.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function getEraBracket(era: string): string {
  if (!era) return "unknown";
  const match = era.match(/(\d{4})/);
  if (!match) return "unknown";
  const startYear = parseInt(match[1]);
  if (startYear < 1935) return "pre_golden";
  if (startYear < 1945) return "golden_early";
  if (startYear < 1960) return "golden_late";
  if (startYear < 1990) return "post_golden";
  return "modern";
}

export function sameEraBracket(era1: string, era2: string): boolean {
  return getEraBracket(era1) === getEraBracket(era2);
}

export function sameStyleCategory(style1: string, style2: string): boolean {
  return style1 === style2;
}

export const TTVTTM_PATTERN = ["T", "T", "V", "T", "T", "M"];

export function getTTVTTMLabel(position: number): string {
  return TTVTTM_PATTERN[position % TTVTTM_PATTERN.length];
}

export function getExpectedType(position: number): string {
  const label = getTTVTTMLabel(position);
  if (label === "T") return "tango";
  if (label === "V") return "vals";
  return "milonga";
}
