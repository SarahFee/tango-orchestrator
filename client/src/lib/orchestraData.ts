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
    recommended: ["canaro", "di_sarli", "rodriguez", "donato", "demare", "fresedo"],
    energy_range: [3, 5],
    notes: "Clear, simple rhythms. Help dancers find the beat.",
  },
  building: {
    position: "Tandas 3-6",
    recommended: ["darienzo", "tanturi", "dagostino", "laurenz", "calo"],
    energy_range: [5, 7],
  },
  peak: {
    position: "Mid-evening",
    recommended: ["darienzo", "biagi", "pugliese", "troilo"],
    energy_range: [7, 9],
  },
  cool_down: {
    position: "After peak",
    recommended: ["di_sarli", "calo", "dagostino", "demare", "fresedo"],
    energy_range: [4, 6],
  },
  wind_down: {
    position: "Last 2-3 tandas",
    recommended: ["di_sarli", "canaro", "fresedo"],
    energy_range: [3, 5],
  },
};

export const orchestras: Orchestra[] = [
  {
    id: "darienzo",
    name: "Juan D'Arienzo",
    nickname: "El Rey del Compas",
    instrument: "violin",
    active_years: "1935-1975",
    profiles: [
      {
        era: "1935-1945",
        era_label: "Classic / Peak Golden Age",
        style: "harder_rhythmic",
        energy: 9,
        mood: "driving",
        danceability: 10,
        complexity: 3,
        tags: ["rhythmic", "milonguero", "high-energy", "crowd-pleaser"],
        dj_notes: "The ultimate energy injector. Use to lift energy or fill the floor.",
        key_singers: ["Alberto Echague", "Hector Maure"],
        confidence: "high",
      },
      {
        era: "1945-1955",
        era_label: "Later Golden Age",
        style: "harder_rhythmic",
        energy: 8,
        mood: "driving",
        danceability: 9,
        complexity: 4,
        tags: ["rhythmic", "slightly-more-complex"],
        dj_notes: "Still very rhythmic but slightly more nuanced.",
        confidence: "high",
      },
    ],
  },
  {
    id: "di_sarli",
    name: "Carlos Di Sarli",
    nickname: "El Senor del Tango",
    instrument: "piano",
    active_years: "1928-1958",
    profiles: [
      {
        era: "1939-1945",
        era_label: "Golden Age with Singers",
        style: "lyrical",
        energy: 6,
        mood: "romantic",
        danceability: 9,
        complexity: 4,
        key_singers: ["Roberto Rufino", "Jorge Duran", "Alberto Podesta"],
        dj_notes: "Beautiful walking music. Romantic, seductive. Great for mood-building.",
        confidence: "high",
      },
      {
        era: "1950-1958",
        era_label: "Instrumental / Late Period",
        style: "smooth",
        energy: 5,
        mood: "elegant",
        danceability: 10,
        complexity: 3,
        dj_notes: "Quintessential walking tango. Perfect for warm-up or wind-down.",
        confidence: "high",
      },
    ],
  },
  {
    id: "troilo",
    name: "Anibal Troilo",
    nickname: "Pichuco",
    instrument: "bandoneon",
    active_years: "1937-1971",
    profiles: [
      {
        era: "1941-1945",
        era_label: "Golden Age with Fiorentino",
        style: "softer_rhythmic",
        energy: 6,
        mood: "playful",
        danceability: 8,
        complexity: 6,
        key_singers: ["Francisco Fiorentino"],
        dj_notes: "Complex syncopations. Reserve for mid-evening when dancers are warmed up.",
        confidence: "high",
      },
      {
        era: "1945-1950",
        era_label: "Mid Period Instrumentals",
        style: "smooth",
        energy: 5,
        mood: "elegant",
        danceability: 8,
        complexity: 6,
        key_singers: ["Alberto Marino", "Floreal Ruiz"],
        dj_notes: "Refined, elaborate arrangements. Beautiful smooth sound.",
        confidence: "high",
      },
    ],
  },
  {
    id: "pugliese",
    name: "Osvaldo Pugliese",
    nickname: "San Pugliese",
    instrument: "piano",
    active_years: "1943-1995",
    profiles: [
      {
        era: "1943-1950",
        era_label: "Early Period",
        style: "dramatic",
        energy: 7,
        mood: "dramatic",
        danceability: 7,
        complexity: 7,
        dj_notes: "Dramatic pauses, yumba beat. Divides the floor. Place strategically mid-to-late evening.",
        confidence: "high",
      },
      {
        era: "1950-1960",
        era_label: "Peak Dramatic Period",
        style: "dramatic",
        energy: 8,
        mood: "dramatic",
        danceability: 7,
        complexity: 8,
        dj_notes: "Most intense Pugliese. Strong contrasts between free and rhythmic sections.",
        confidence: "high",
      },
    ],
  },
  {
    id: "biagi",
    name: "Rodolfo Biagi",
    nickname: "Manos Brujas",
    instrument: "piano",
    active_years: "1938-1969",
    profiles: [
      {
        era: "1938-1950",
        era_label: "Golden Age",
        style: "harder_rhythmic",
        energy: 8,
        mood: "driving-syncopated",
        danceability: 8,
        complexity: 6,
        key_singers: ["Jorge Ortiz", "Alberto Amor"],
        dj_notes: "Striking syncopation with gaps. Hugely popular with milonguero-style dancers.",
        confidence: "high",
      },
    ],
  },
  {
    id: "tanturi",
    name: "Ricardo Tanturi",
    nickname: "El Caballero del Tango",
    instrument: "piano",
    active_years: "1937-1956",
    profiles: [
      {
        era: "1940-1944",
        era_label: "With Castillo",
        style: "softer_rhythmic",
        energy: 7,
        mood: "energetic-fun",
        danceability: 9,
        complexity: 4,
        key_singers: ["Alberto Castillo"],
        dj_notes: "Fun, accessible. Castillo is theatrical, energetic. Good mid-evening builder.",
        confidence: "high",
      },
      {
        era: "1943-1945",
        era_label: "With Campos",
        style: "softer_rhythmic",
        energy: 5,
        mood: "romantic",
        danceability: 8,
        complexity: 4,
        key_singers: ["Enrique Campos"],
        dj_notes: "Gentle, romantic. Very different from Castillo tandas.",
        confidence: "high",
      },
    ],
  },
  {
    id: "calo",
    name: "Miguel Calo",
    nickname: null,
    instrument: "bandoneon",
    active_years: "1934-1960",
    profiles: [
      {
        era: "1942-1945",
        era_label: "Golden Age",
        style: "lyrical",
        energy: 5,
        mood: "romantic",
        danceability: 8,
        complexity: 5,
        key_singers: ["Raul Beron", "Alberto Podesta", "Raul Iriarte"],
        dj_notes: "Romantic with great singers. Bring energy DOWN while keeping emotion UP.",
        confidence: "high",
      },
    ],
  },
  {
    id: "dagostino",
    name: "Angel D'Agostino",
    nickname: "El Angel",
    instrument: "piano",
    active_years: "1934-1958",
    profiles: [
      {
        era: "1940-1945",
        era_label: "Golden Age with Vargas",
        style: "softer_rhythmic",
        energy: 5,
        mood: "ethereal",
        danceability: 8,
        complexity: 3,
        key_singers: ["Angel Vargas"],
        dj_notes: "Ethereal, spacious, dreamy. Good after a high-energy block.",
        confidence: "high",
      },
    ],
  },
  {
    id: "laurenz",
    name: "Pedro Laurenz",
    nickname: null,
    instrument: "bandoneon",
    active_years: "1934-1960",
    profiles: [
      {
        era: "1937-1945",
        era_label: "Golden Age",
        style: "softer_rhythmic",
        energy: 6,
        mood: "intense-rhythmic",
        danceability: 8,
        complexity: 5,
        key_singers: ["Alberto Podesta"],
        dj_notes: "Bandoneon-driven softer rhythm. Milonguero favorite.",
        confidence: "medium",
      },
    ],
  },
  {
    id: "canaro",
    name: "Francisco Canaro",
    nickname: "Pirincho",
    instrument: "violin",
    active_years: "1906-1964",
    profiles: [
      {
        era: "1927-1938",
        era_label: "Early / Transition Period",
        style: "old_guard",
        energy: 4,
        mood: "simple-rhythmic",
        danceability: 7,
        complexity: 2,
        dj_notes: "Simple, clear rhythms. Slowest milongas. Good warm-up.",
        confidence: "high",
      },
      {
        era: "1935-1950",
        era_label: "Golden Age Lyrical",
        style: "lyrical",
        energy: 4,
        mood: "romantic",
        danceability: 7,
        complexity: 3,
        key_singers: ["Roberto Maida"],
        dj_notes: "Later recordings have a more lyrical sensibility. Beautiful waltzes.",
        confidence: "high",
      },
    ],
  },
  {
    id: "de_angelis",
    name: "Alfredo De Angelis",
    nickname: null,
    instrument: "piano",
    active_years: "1941-1977",
    profiles: [
      {
        era: "1943-1958",
        era_label: "Golden Age / Peak",
        style: "dramatic",
        energy: 6,
        mood: "smooth-dramatic",
        danceability: 8,
        complexity: 5,
        key_singers: ["Carlos Dante", "Julio Martel"],
        dj_notes: "Between Di Sarli smoothness and Pugliese drama. Good for bridging energy levels.",
        confidence: "high",
      },
    ],
  },
  {
    id: "donato",
    name: "Edgardo Donato",
    nickname: null,
    instrument: "violin",
    active_years: "1930-1945",
    profiles: [
      {
        era: "1932-1942",
        era_label: "Golden Age",
        style: "softer_rhythmic",
        energy: 6,
        mood: "punchy-fun",
        danceability: 8,
        complexity: 3,
        dj_notes: "More punch than Canaro. Fun, accessible. Good warm-up or maintenance.",
        confidence: "medium",
      },
    ],
  },
  {
    id: "demare",
    name: "Lucio Demare",
    nickname: null,
    instrument: "piano",
    active_years: "1938-1970",
    profiles: [
      {
        era: "1942-1948",
        era_label: "Golden Age",
        style: "lyrical",
        energy: 4,
        mood: "romantic-gentle",
        danceability: 8,
        complexity: 4,
        key_singers: ["Raul Beron"],
        dj_notes: "Gentle, romantic, clear rhythms. Good for warm-up or cool-down.",
        confidence: "medium",
      },
    ],
  },
  {
    id: "fresedo",
    name: "Osvaldo Fresedo",
    nickname: "El Pibe de La Paternal",
    instrument: "bandoneon",
    active_years: "1920-1980",
    profiles: [
      {
        era: "1935-1955",
        era_label: "Golden Age Smooth",
        style: "smooth",
        energy: 4,
        mood: "pink-champagne",
        danceability: 7,
        complexity: 3,
        key_singers: ["Roberto Ray"],
        dj_notes: "'Pink Champagne' tango. Sweet, light, romantic. Good for early evening.",
        confidence: "high",
      },
    ],
  },
  {
    id: "rodriguez",
    name: "Enrique Rodriguez",
    nickname: null,
    instrument: "piano",
    active_years: "1936-1971",
    profiles: [
      {
        era: "1938-1950",
        era_label: "Golden Age",
        style: "harder_rhythmic",
        energy: 7,
        mood: "rhythmic-accessible",
        danceability: 9,
        complexity: 3,
        key_singers: ["Roberto Flores", "Armando Moreno"],
        dj_notes: "Accessible harder rhythm. Clear, simple. Good warm-up, reliable floor-filler.",
        confidence: "medium",
      },
    ],
  },
  {
    id: "color_tango",
    name: "Orquesta Color Tango",
    nickname: null,
    instrument: "full orchestra",
    active_years: "1989-present",
    profiles: [
      {
        era: "1989-present",
        era_label: "Modern Dance Orchestra",
        style: "modern_dance",
        energy: 7,
        mood: "neo-pugliese",
        danceability: 8,
        complexity: 6,
        dj_notes: "Modern Pugliese-inspired sound with better audio quality.",
        confidence: "medium",
      },
    ],
  },
  {
    id: "sexteto_milonguero",
    name: "Sexteto Milonguero",
    nickname: null,
    instrument: "sextet",
    active_years: "2006-2020",
    profiles: [
      {
        era: "2006-2020",
        era_label: "Modern Dance Orchestra",
        style: "modern_dance",
        energy: 8,
        mood: "energetic-fresh",
        danceability: 9,
        complexity: 4,
        dj_notes: "Hottest modern tango orchestra. Fresh energy, crowd-pleaser.",
        confidence: "medium",
      },
    ],
  },
  {
    id: "otros_aires",
    name: "Otros Aires",
    nickname: null,
    instrument: "electronic/acoustic hybrid",
    active_years: "2003-present",
    profiles: [
      {
        era: "2003-present",
        era_label: "Neo-Tango / Fusion",
        style: "neo_tango",
        energy: 6,
        mood: "electronic-tango",
        danceability: 7,
        complexity: 4,
        dj_notes: "Electro-tango fusion. Max 1 tanda per evening at traditional milongas.",
        confidence: "medium",
      },
    ],
  },
  {
    id: "gotan_project",
    name: "Gotan Project",
    nickname: null,
    instrument: "electronic/acoustic hybrid",
    active_years: "1999-2014",
    profiles: [
      {
        era: "1999-2014",
        era_label: "Neo-Tango / Electro",
        style: "neo_tango",
        energy: 6,
        mood: "lounge-tango",
        danceability: 7,
        complexity: 4,
        dj_notes: "The gateway drug to tango for many. Lounge-like electro-tango.",
        confidence: "medium",
      },
    ],
  },
  {
    id: "gobbi",
    name: "Alfredo Gobbi",
    nickname: null,
    instrument: "violin",
    active_years: "1942-1965",
    profiles: [
      {
        era: "1947-1958",
        era_label: "Golden Age / Transitional",
        style: "softer_rhythmic",
        energy: 5,
        mood: "varied",
        danceability: 7,
        complexity: 6,
        dj_notes: "Not as commonly played but has some classic instrumentals.",
        confidence: "low",
      },
    ],
  },
  {
    id: "sassone",
    name: "Florindo Sassone",
    nickname: null,
    instrument: "violin",
    active_years: "1948-1982",
    profiles: [
      {
        era: "1950-1970",
        era_label: "Post-Golden / Transitional",
        style: "transitional",
        energy: 6,
        mood: "milonguero-friendly",
        danceability: 7,
        complexity: 5,
        dj_notes: "Retained a dance beat while developing dramatic tension. Solid choice for variety.",
        confidence: "medium",
      },
    ],
  },
];

export function getOrchestra(id: string): Orchestra | undefined {
  return orchestras.find((o) => o.id === id);
}

export function getOrchestraProfile(id: string, era?: string) {
  const orchestra = getOrchestra(id);
  if (!orchestra) return undefined;
  if (era) {
    return orchestra.profiles.find((p) => p.era === era);
  }
  return orchestra.profiles[0];
}

export function calculateEnergy(orchestraId: string, type: string, era?: string): number {
  const profile = getOrchestraProfile(orchestraId, era);
  if (!profile) return 5;
  const modifier = typeModifiers[type]?.energy_modifier || 0;
  return Math.max(1, Math.min(10, profile.energy + modifier));
}

export function getAllSingers(orchestraId: string): string[] {
  const orchestra = getOrchestra(orchestraId);
  if (!orchestra) return [];
  const singers = new Set<string>();
  orchestra.profiles.forEach((p) => {
    p.key_singers?.forEach((s) => singers.add(s));
  });
  return Array.from(singers);
}

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
