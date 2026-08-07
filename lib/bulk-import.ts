import * as XLSX from "xlsx";

// ============================================================
// Shared parsing helpers for the Dues and Contributions bulk-import
// endpoints. Handles both CSV and Excel (.xlsx/.xls) files, month
// names ("July", "Aug") alongside numeric months, and currency-
// formatted amounts ("₦500.00", "500,000") alongside plain numbers.
// ============================================================

const MONTH_NAMES: Record<string, number> = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};

export function parseMonth(raw: unknown): number | null {
  if (raw === null || raw === undefined || raw === "") return null;
  const asNumber = Number(raw);
  if (!isNaN(asNumber) && asNumber >= 1 && asNumber <= 12) return asNumber;
  const key = String(raw).trim().toLowerCase();
  return MONTH_NAMES[key] ?? null;
}

export function parseAmount(raw: unknown): number | null {
  if (raw === null || raw === undefined || raw === "") return null;
  if (typeof raw === "number") return raw;
  const cleaned = String(raw).replace(/[^\d.]/g, "");
  const value = Number(cleaned);
  return isNaN(value) ? null : value;
}

/** Parses a plain CSV file into an array of row objects keyed by lowercase header. */
export function parseCsv(text: string): Record<string, unknown>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    const row: Record<string, unknown> = {};
    header.forEach((h, i) => (row[h] = cells[i]));
    return row;
  });
}

/** Parses an Excel file's first sheet into an array of row objects keyed by lowercase header. */
export function parseExcel(buffer: Buffer): Record<string, unknown>[] {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  return rows.map((row) => {
    const normalized: Record<string, unknown> = {};
    for (const key of Object.keys(row)) {
      normalized[key.trim().toLowerCase().replace(/\s+/g, "")] = row[key];
    }
    return normalized;
  });
}

/** Reads an uploaded File as parsed rows, auto-detecting CSV vs Excel by filename. */
export async function parseUploadedFile(file: File): Promise<Record<string, unknown>[]> {
  const isExcel = /\.(xlsx|xls)$/i.test(file.name);
  if (isExcel) {
    const buffer = Buffer.from(await file.arrayBuffer());
    return parseExcel(buffer);
  }
  return parseCsv(await file.text());
}
