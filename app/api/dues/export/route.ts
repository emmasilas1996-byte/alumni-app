import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildRecordPdf } from "@/lib/pdf";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// GET /api/dues/export?year=2026&month=3 — PDF scoped to just that month,
// per the requirement that export lives on each individual monthly-due page.
export async function GET(req: NextRequest) {
  const year = Number(req.nextUrl.searchParams.get("year"));
  const month = Number(req.nextUrl.searchParams.get("month"));

  if (!year || !month) {
    return NextResponse.json({ error: "year and month query params are required." }, { status: 400 });
  }

  const dues = await prisma.monthlyDue.findMany({
    where: { dueYear: year, dueMonth: month },
    include: { member: true },
    orderBy: { paymentDate: "desc" },
  });

  const rows = dues.map((d) => ({
    name: `${d.member.firstName} ${d.member.lastName}`,
    amount: Number(d.amount),
    date: d.paymentDate.toISOString().slice(0, 10),
  }));
  const total = rows.reduce((sum, r) => sum + r.amount, 0);

  const pdfBytes = await buildRecordPdf({
    title: `Monthly Dues — ${MONTH_NAMES[month - 1]} ${year}`,
    rows,
    total,
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="dues-${year}-${month}.pdf"`,
    },
  });
}
