import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface WasteCollection {
  date: string; // DD.MM.YYYY
  description: string;
  timeRange: string; // HH:MM-HH:MM
}

function parseDate(dateStr: string): Date {
  const parts = dateStr.split(".");
  if (parts.length !== 3) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }
  const [day, month, year] = parts;
  if (!day || !month || !year) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

function formatICSDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function formatICSDateTime(date: Date, time: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const timeParts = time.split(":");
  if (timeParts.length !== 2) {
    throw new Error(`Invalid time format: ${time}`);
  }
  const [hours, minutes] = timeParts;
  if (!hours || !minutes) {
    throw new Error(`Invalid time format: ${time}`);
  }
  return `${year}${month}${day}T${hours.padStart(2, "0")}${minutes.padStart(2, "0")}00`;
}

function generateUID(date: string, index: number): string {
  return `waste-collection-${date.replace(/\./g, "")}-${index}@odpady-bp.local`;
}

function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function generateICS(collections: WasteCollection[]): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  let ics = `BEGIN:VCALENDAR
VERSION:2.0
X-WR-CALNAME:Harmonogram Odbioru Odpadów - Boguty-Pianki
X-WR-CALDESC:Harmonogram odbioru odpadów komunalnych w Bogutach-Piankach
X-WR-TIMEZONE:Europe/Warsaw
PRODID:-//Odpady BP//Harmonogram 1.0//PL
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;

  collections.forEach((collection, index) => {
    const collectionDate = parseDate(collection.date);
    const timeRangeParts = collection.timeRange.split("-");
    if (timeRangeParts.length !== 2) {
      throw new Error(`Invalid time range format: ${collection.timeRange}`);
    }
    const startTime = timeRangeParts[0];
    const endTime = timeRangeParts[1];
    if (!startTime || !endTime) {
      throw new Error(`Invalid time range format: ${collection.timeRange}`);
    }

    const uid = generateUID(collection.date, index);
    const dtstart = formatICSDateTime(collectionDate, startTime.trim());
    const dtend = formatICSDateTime(collectionDate, endTime.trim());
    const summary = "Odbiór odpadów";
    const description = escapeICSText(
      `🗑️ Harmonogram odbioru odpadów\\n\\nRodzaje odpadów:\\n${collection.description}\\n\\nGodziny odbioru: ${collection.timeRange}`,
    );

    ics += `BEGIN:VEVENT
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Przypomnienie o odbiorze odpadów
TRIGGER:-PT12H
END:VALARM
UID:${uid}
DTSTAMP:${timestamp}
DTSTART:${dtstart}
DTEND:${dtend}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:Boguty-Pianki
STATUS:CONFIRMED
CATEGORIES:Odpady,Harmonogram
END:VEVENT
`;
  });

  ics += "END:VCALENDAR\n";

  return ics;
}

// Main execution
try {
  const inputPath = join(process.cwd(), "odbior.jsonl");
  const outputPath = join(process.cwd(), "public", "schedule.ics");

  // Read JSONL file
  const fileContent = readFileSync(inputPath, "utf-8");
  const lines = fileContent.split("\n").filter((line) => line.trim() !== "");

  const collections: WasteCollection[] = lines.map((line) => {
    // Parse JSONL with relaxed syntax (using eval for object literals)
    const cleanLine = line.trim();
    // eslint-disable-next-line no-eval
    return eval(`(${cleanLine})`);
  });

  // Generate ICS content
  const icsContent = generateICS(collections);

  // Write to public directory
  writeFileSync(outputPath, icsContent, "utf-8");

  console.log(`✅ Successfully generated ICS file at: ${outputPath}`);
  console.log(`📅 Total events: ${collections.length}`);
} catch (error) {
  console.error("❌ Error generating ICS file:", error);
  process.exit(1);
}
