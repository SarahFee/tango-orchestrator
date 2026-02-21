import { db } from "./db";
import { milongaSets, tandas } from "@shared/schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  const existingSets = await db.select().from(milongaSets);
  if (existingSets.length > 0) return;

  console.log("Seeding database with sample sets...");

  const [classicSet] = await db
    .insert(milongaSets)
    .values({
      name: "Classic Saturday Milonga",
      venue: "Salon Canning",
      date: "2026-03-07",
      startTime: "21:00",
    })
    .returning();

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
    await db.insert(tandas).values({ ...t, setId: classicSet.id });
  }

  const [practicaSet] = await db
    .insert(milongaSets)
    .values({
      name: "Short Practica",
      venue: "Studio Milonguero",
      date: "2026-03-10",
      startTime: "19:30",
    })
    .returning();

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
    await db.insert(tandas).values({ ...t, setId: practicaSet.id });
  }

  console.log("Seed data created successfully.");
}
