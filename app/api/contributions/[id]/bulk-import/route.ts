import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { parseUploadedFile, parseAmount } from "@/lib/bulk-import";

// Never statically cache this route — it reads/writes live data via
// Prisma on every request. Without this, Next.js can silently
// pre-render a GET handler with no request-derived params ONCE at
// build time and serve that frozen snapshot forever after (this is
// exactly what broke newly-assigned executives from ever showing up).
export const dynamic = "force-dynamic";

// POST /api/contributions/:id/bulk-import
// Login required.
//
// Accepts EITHER a CSV or an Excel (.xlsx/.xls) file, field name "file".
// Required columns (header row, case-insensitive): FirstName, LastName,
// Amount. Optional: PaymentDate.
//
// Amount accepts plain numbers OR currency-formatted strings like
// "₦500.00" or "500,000".
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
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  let rows: Record<string, unknown>[];
  try {
    rows = await parseUploadedFile(file);
  } catch (e: any) {
    return NextResponse.json(
      { error: `Could not read the file — ${e.message || "unknown parsing error"}.` },
      { status: 400 }
    );
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: "File has no data rows." }, { status: 400 });
  }

  const requiredCols = ["firstname", "lastname", "amount"];
  const foundCols = Object.keys(rows[0]);
  const missing = requiredCols.filter((c) => !foundCols.includes(c));
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `File is missing required column(s): ${missing.join(", ")}. Found columns: ${foundCols.join(", ")}` },
      { status: 400 }
    );
  }

  const members = await prisma.member.findMany({
    select: { memberId: true, firstName: true, lastName: true },
  });
  const memberKey = (first: string, last: string) => `${first.trim().toLowerCase()}|${last.trim().toLowerCase()}`;
  const memberLookup = new Map(members.map((m) => [memberKey(m.firstName, m.lastName), m.memberId]));

  const results = { imported: 0, skipped: 0, errors: [] as string[] };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2;

    const firstName = String(row.firstname ?? "").trim();
    const lastName = String(row.lastname ?? "").trim();
    const amount = parseAmount(row.amount);
    const paymentDateRaw = row.paymentdate;

    if (!firstName || !lastName || !amount) {
      results.errors.push(
        `Row ${rowNum}: missing or invalid field(s) — check FirstName, LastName, Amount ("${row.amount}").`
      );
      results.skipped++;
      continue;
    }

    const memberId = memberLookup.get(memberKey(firstName, lastName));
    if (!memberId) {
      results.errors.push(`Row ${rowNum}: no member found named "${firstName} ${lastName}".`);
      results.skipped++;
      continue;
    }

    let paymentDate: Date;
    if (paymentDateRaw) {
      const parsed = new Date(String(paymentDateRaw));
      paymentDate = isNaN(parsed.getTime()) ? new Date() : parsed;
    } else {
      paymentDate = new Date();
    }

    try {
      await prisma.contributionPayment.create({
        data: {
          contributionId,
          memberId,
          amount,
          paymentMethod: "Manual",
          paymentDate,
          createdByUserId: session.userId,
        },
      });
      results.imported++;
    } catch (error: any) {
      results.errors.push(`Row ${rowNum}: could not save — ${error.message || "unknown error"}.`);
      results.skipped++;
    }
  }

  return NextResponse.json(results);
}
