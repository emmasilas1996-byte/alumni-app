import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildRecordPdf } from "@/lib/pdf";

// GET /api/contributions/:id/export — PDF scoped to just this contribution,
// per the requirement that export lives on each individual contribution page.
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const contributionId = Number(params.id);

  const contribution = await prisma.contributionType.findUnique({
    where: { contributionId },
    include: { payments: { include: { member: true } } },
  });

  if (!contribution) {
    return NextResponse.json({ error: "Contribution not found." }, { status: 404 });
  }

  const rows = contribution.payments.map((p: (typeof contribution.payments)[number]) => ({
    name: `${p.member.firstName} ${p.member.lastName}`,
    amount: Number(p.amount),
    date: p.paymentDate.toISOString().slice(0, 10),
  }));
  const total = rows.reduce((sum: number, r: { amount: number }) => sum + r.amount, 0);

  const pdfBytes = await buildRecordPdf({
    title: contribution.title,
    subtitle: contribution.description || undefined,
    rows,
    total,
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${contribution.title.replace(/\s+/g, "-")}.pdf"`,
    },
  });
}
