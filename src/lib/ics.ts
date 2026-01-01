export interface WasteCollection {
  date: string;
  timeRange: string;
  description?: string;
  kind?: string;
}

const KEY_PATTERN = /([{,]\s*)([a-zA-Z0-9_]+)\s*:/g;

function parseDate(dateStr: string): Date {
  const parts = dateStr.split(".");
  if (parts.length !== 3) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }

  const [day, month, year] = parts;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date value: ${dateStr}`);
  }

  return parsed;
}

function parseTimeRange(range: string): [string, string] {
  const [start, end] = range.split("-").map((value) => value?.trim());
  if (!start || !end) {
    throw new Error(`Invalid time range format: ${range}`);
  }

  return [start, end];
}

function formatICSDateTime(date: Date, time: string): string {
  const [hours, minutes] = time.split(":");
  if (!hours || !minutes) {
    throw new Error(`Invalid time format: ${time}`);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
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

export function generateICS(collections: WasteCollection[]): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  let ics = `BEGIN:VCALENDAR\n`
    + `VERSION:2.0\n`
    + `X-WR-CALNAME:Harmonogram Odbioru Odpadów - Boguty-Pianki\n`
    + `X-WR-CALDESC:Harmonogram odbioru odpadów komunalnych w Bogutach-Piankach\n`
    + `X-WR-TIMEZONE:Europe/Warsaw\n`
    + `PRODID:-//Odpady BP//Harmonogram 1.0//PL\n`
    + `CALSCALE:GREGORIAN\n`
    + `METHOD:PUBLISH\n`;

  collections.forEach((collection, index) => {
    const collectionDate = parseDate(collection.date);
    const [startTime, endTime] = parseTimeRange(collection.timeRange);

    const uid = generateUID(collection.date, index);
    const dtstart = formatICSDateTime(collectionDate, startTime);
    const dtend = formatICSDateTime(collectionDate, endTime);
    const summary = collection.kind ?? "Odbiór odpadów";
    const descriptionSource = collection.description ?? collection.kind ?? "Odbiór odpadów";
    const description = escapeICSText(
      `🗑️ Harmonogram odbioru odpadów\\n\\nRodzaje odpadów: ${descriptionSource}\\n\\nGodziny odbioru: ${collection.timeRange}`,
    );

    ics += `BEGIN:VEVENT\n`
      + `BEGIN:VALARM\n`
      + `ACTION:DISPLAY\n`
      + `DESCRIPTION:Przypomnienie o odbiorze odpadów\n`
      + `TRIGGER:-PT12H\n`
      + `END:VALARM\n`
      + `UID:${uid}\n`
      + `DTSTAMP:${timestamp}\n`
      + `DTSTART:${dtstart}\n`
      + `DTEND:${dtend}\n`
      + `SUMMARY:${summary}\n`
      + `DESCRIPTION:${description}\n`
      + `LOCATION:Boguty-Pianki\n`
      + `STATUS:CONFIRMED\n`
      + `CATEGORIES:Odpady,Harmonogram\n`
      + `END:VEVENT\n`;
  });

  ics += "END:VCALENDAR\n";
  return ics;
}

function normalizeLine(line: string): string {
  return line.replace(KEY_PATTERN, "$1\"$2\":");
}

export function parseWasteCollections(jsonl: string): WasteCollection[] {
  return jsonl
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const normalized = normalizeLine(line);
      return JSON.parse(normalized) as WasteCollection;
    });
}

