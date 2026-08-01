import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { clearSessionCookie, requireSession } from "@/lib/auth";

// POST /api/dues/bulk-import
// Login required — same gate as the regular "Add Payment" flow.
//
// Expects a CSV file (multipart/form-data, field name "file") with
// these columns, header row required:
//   FirstName,LastName,Year,Month,Amount,PaymentDate
// PaymentDate is optional (YYYY-MM-DD) — defaults to today if omitted.
// Month is 1-12.
//
// This exists specifically for backlog data entry: dues that were
// collected in past years before this app existed, being recorded now.
export async function POST(req: NextRequest) {
  let session;
  try {
    session = requireSession();
  } catch {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No CSV file provided." }, { status: 400 });
  }

  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return NextResponse.json({ error: "CSV file has no data rows." }, { status: 400 });
  }

  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const requiredCols = ["firstname", "lastname", "year", "month", "amount"];
  const missing = requiredCols.filter((c) => !header.includes(c));
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `CSV is missing required column(s): ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const colIndex = (name: string) => header.indexOf(name);

  // Cache all members once instead of querying per row.
  const members = await prisma.member.findMany({
    select: { memberId: true, firstName: true, lastName: true },
  });
  const memberKey = (first: string, last: string) => `${first.trim().toLowerCase()}|${last.trim().toLowerCase()}`;
  const memberLookup = new Map(members.map((m) => [memberKey(m.firstName, m.lastName), m.memberId]));

  const results = { imported: 0, skipped: 0, errors: [] as string[] };

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",").map((c) => c.trim());
    const rowNum = i + 1; // 1-indexed + header row

    const firstName = row[colIndex("firstname")];
    const lastName = row[colIndex("lastname")];
    const year = Number(row[colIndex("year")]);
    const month = Number(row[colIndex("month")]);
    const amount = Number(row[colIndex("amount")]);
    const dateColIdx = colIndex("paymentdate");
    const paymentDateStr = dateColIdx >= 0 ? row[dateColIdx] : null;

    if (!firstName || !lastName || !year || !month || !amount) {
      results.errors.push(`Row ${rowNum}: missing or invalid required field(s).`);
      results.skipped++;
      continue;
    }
    if (month < 1 || month > 12) {
      results.errors.push(`Row ${rowNum}: month must be 1-12, got ${month}.`);
      results.skipped++;
      continue;
    }

    const memberId = memberLookup.get(memberKey(firstName, lastName));
    if (!memberId) {
      results.errors.push(`Row ${rowNum}: no member found named "${firstName} ${lastName}".`);
      results.skipped++;
      continue;
    }

    try {
      await prisma.monthlyDue.create({
        data: {
          memberId,
          dueYear: year,
          dueMonth: month,
          amount,
          paymentMethod: "Manual",
          paymentDate: paymentDateStr ? new Date(paymentDateStr) : new Date(),
          createdByUserId: session.userId,
        },
      });
      results.imported++;
    } catch (e: any) {
      if (e.code === "P2002") {
        results.errors.push(`Row ${rowNum}: ${firstName} ${lastName} already has a due recorded for ${month}/${year} — skipped.`);
      } else {
        results.errors.push(`Row ${rowNum}: could not save — ${e.message || "unknown error"}.`);
      }
      results.skipped++;
    }
  }

  const response = NextResponse.json(results);
  clearSessionCookie();
  return response;
}
