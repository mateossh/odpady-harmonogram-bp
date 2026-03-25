import type { APIRoute } from "astro";

import { generateICS, parseWasteCollections } from "../lib/ics";

import dataJsonl from "../../data.jsonl?raw";

async function buildIcs(): Promise<string> {
  const collections = parseWasteCollections(dataJsonl);
  return generateICS(collections);
}

export const GET: APIRoute = async () => {
  try {
    const ics = await buildIcs();
    return new Response(ics, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="schedule.ics"',
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
