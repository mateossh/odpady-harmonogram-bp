import type { APIRoute } from "astro";
import { readFile } from "node:fs/promises";

import { generateICS, parseWasteCollections } from "../lib/ics";

const DATA_URL = new URL("../../data.jsonl", import.meta.url);

async function buildIcs(): Promise<string> {
  const fileContent = await readFile(DATA_URL, "utf-8");
  const collections = parseWasteCollections(fileContent);
  return generateICS(collections);
}

export const GET: APIRoute = async () => {
  try {
    const ics = await buildIcs();
    return new Response(ics, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="harmonogram-odpadow.ics"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Failed to generate ICS", error);
    return new Response("Nie udało się wygenerować harmonogramu.", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
};
