import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { clearSessionCookie, requireSession } from "@/lib/auth";

// POST /api/contributions/:id/bulk-import
// Login required.
//
// Expects a CSV file (multipart/form-data, field name "file") with
// these columns, header row required:
//   FirstName,LastName,Amount,PaymentDate
// PaymentDate is optional (YYYY-MM-DD) — defaults to today if omitted.
//
// This lets admins record historical contribution payments for a specific
// contribution category from a spreadsheet export.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  let session;
  try {
    session = requireSession();
  } catch {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const contributionId = Number(params.id);
  if (!Number.isFinite(contributionId)) {
    return NextResponse.json({ error: "Invalid contribution id." }, { status: 400 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No CSV file provided." }, { status: 400 });
  }

  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) {
    return NextResponse.json({ error: "CSV file has no data rows." }, { status: 400 });
  }

  const header = lines[0].split(",").map((column) => column.trim().toLowerCase());
  const requiredCols = ["firstname", "lastname", "amount"];
  const missing = requiredCols.filter((column) => !header.includes(column));
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `CSV is missing required column(s): ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const colIndex = (name: string) => header.indexOf(name);

  const members = await prisma.member.findMany({
    select: { memberId: true, firstName: true, lastName: true },
  });
  const memberKey = (first: string, last: string) => `${first.trim().toLowerCase()}|${last.trim().toLowerCase()}`;
  const memberLookup = new Map(members.map((member) => [memberKey(member.firstName, member.lastName), member.memberId]));

  const results = { imported: 0, skipped: 0, errors: [] as string[] };

  for (let index = 1; index < lines.length; index++) {
    const row = lines[index].split(",").map((value) => value.trim());
    const rowNum = index + 1;

    const firstName = row[colIndex("firstname")];
    const lastName = row[colIndex("lastname")];
    const amount = Number(row[colIndex("amount")]);
    const dateColIdx = colIndex("paymentdate");
    const paymentDateStr = dateColIdx >= 0 ? row[dateColIdx] : null;

    if (!firstName || !lastName || !amount) {
      results.errors.push(`Row ${rowNum}: missing or invalid required field(s).`);
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
      await prisma.contributionPayment.create({
        data: {
          contributionId,
          memberId,
          amount,
          paymentMethod: "Manual",
          paymentDate: paymentDateStr ? new Date(paymentDateStr) : new Date(),
          createdByUserId: session.userId,
        },
      });
      results.imported++;
    } catch (error: any) {
      results.errors.push(`Row ${rowNum}: could not save — ${error.message || "unknown error"}.`);
      results.skipped++;
    }
  }

  const response = NextResponse.json(results);
  clearSessionCookie();
  return response;
}
