import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const MONTH_MAP: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      fields.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  fields.push(current);
  return fields.map((f) => f.trim());
}

function parseMonth(value: string): number | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (MONTH_MAP[normalized]) return MONTH_MAP[normalized];
  const numeric = Number(normalized);
  return Number.isInteger(numeric) && numeric >= 1 && numeric <= 12 ? numeric : null;
}

function parseAmount(value: string): number | null {
  if (!value) return null;
  const cleaned = value.replace(/[^0-9.-]/g, "");
  const amount = Number(cleaned);
  return Number.isFinite(amount) ? amount : null;
}

async function main() {
  // Safety guard: this script deletes EVERY MonthlyDue record before
  // optionally reimporting from a CSV. Require an explicit --confirm
  // flag so it can never run by accident (e.g. wrong CSV path, or run
  // with no path at all leaves the table permanently empty).
  const args = process.argv.slice(2);
  if (!args.includes("--confirm")) {
    console.log(
      "This script deletes ALL MonthlyDues records before reimporting.\n" +
      "Re-run with --confirm to proceed, e.g.:\n" +
      "  npx tsx prisma/reset-monthly-dues.ts path/to/file.csv --confirm\n" +
      "Nothing was deleted."
    );
    return;
  }

  const csvPath = args.find((a) => !a.startsWith("--"))
    ? path.resolve(process.cwd(), args.find((a) => !a.startsWith("--"))!)
    : null;
  console.log("Cleaning MonthlyDues table...");
  await prisma.monthlyDue.deleteMany({});
  console.log("Deleted all MonthlyDues records.");

  if (!csvPath) {
    console.log("No CSV path provided. Table cleaned and no data reloaded.");
    return;
  }

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found: ${csvPath}`);
  }

  const text = await fs.promises.readFile(csvPath, "utf8");
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) {
    throw new Error("CSV must contain a header row and at least one data row.");
  }

  const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const requiredColumns = ["firstname", "lastname", "year", "month", "amount"];
  const missing = requiredColumns.filter((col) => !header.includes(col));
  if (missing.length > 0) {
    throw new Error(`CSV is missing required columns: ${missing.join(", ")}`);
  }

  const colIndex = (name: string) => header.indexOf(name);

  const members = await prisma.member.findMany({ select: { memberId: true, firstName: true, lastName: true } });
  const memberLookup = new Map<string, number>();
  for (const member of members) {
    const key = `${member.firstName.trim().toLowerCase()}|${member.lastName.trim().toLowerCase()}`;
    memberLookup.set(key, member.memberId);
  }

  const results = {
    imported: 0,
    skipped: 0,
    warnings: [] as string[],
  };
  const records: Array<{
    memberId: number;
    dueYear: number;
    dueMonth: number;
    amount: number;
    paymentDate?: Date;
    paymentMethod: string;
  }> = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCsvLine(lines[i]);
    const rowNum = i + 1;
    const firstName = row[colIndex("firstname")] || "";
    const lastName = row[colIndex("lastname")] || "";
    const year = Number(row[colIndex("year")]);
    const month = parseMonth(row[colIndex("month")] || "");
    const amount = parseAmount(row[colIndex("amount")] || "");
    const paymentDateRaw = header.includes("paymentdate") ? row[colIndex("paymentdate")] : "";
    const paymentDate = paymentDateRaw ? new Date(paymentDateRaw) : undefined;

    if (!firstName || !lastName || !year || !month || !amount) {
      results.skipped++;
      results.warnings.push(`Row ${rowNum}: invalid or missing required data.`);
      continue;
    }

    if (month < 1 || month > 12) {
      results.skipped++;
      results.warnings.push(`Row ${rowNum}: invalid month '${row[colIndex("month")]}'`);
      continue;
    }

    const memberKey = `${firstName.trim().toLowerCase()}|${lastName.trim().toLowerCase()}`;
    const memberId = memberLookup.get(memberKey);
    if (!memberId) {
      results.skipped++;
      results.warnings.push(`Row ${rowNum}: no member found for '${firstName} ${lastName}'.`);
      continue;
    }

    records.push({
      memberId,
      dueYear: year,
      dueMonth: month,
      amount,
      paymentDate,
      paymentMethod: "Manual",
    });
  }

  if (records.length === 0) {
    console.log("No valid rows found to import.");
    if (results.warnings.length) {
      console.log("Warnings:");
      results.warnings.forEach((w) => console.log(`  - ${w}`));
    }
    return;
  }

  const uniqueRecords = Array.from(
    new Map(
      records.map((record) => [
        `${record.memberId}-${record.dueYear}-${record.dueMonth}`,
        record,
      ])
    ).values()
  );

  await prisma.monthlyDue.createMany({
    data: uniqueRecords.map((record) => ({
      memberId: record.memberId,
      dueYear: record.dueYear,
      dueMonth: record.dueMonth,
      amount: record.amount,
      paymentMethod: record.paymentMethod,
      paymentDate: record.paymentDate,
    })),
  });

  results.imported = uniqueRecords.length;
  console.log(`Imported ${results.imported} monthly dues.`);
  if (results.warnings.length > 0) {
    console.log(`Skipped ${results.skipped} rows with warnings:`);
    results.warnings.forEach((w) => console.log(`  - ${w}`));
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
