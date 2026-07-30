import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/releases — every contribution category with its total released,
// used by the Released Funds Overview page.
export async function GET() {
  const contributions = await prisma.contributionType.findMany({
    include: {
      releases: { orderBy: { releaseDate: "desc" } },
    },
    orderBy: { title: "asc" },
  });

  const categories = contributions
    .filter((c) => c.releases.length > 0)
    .map((c) => ({
      contributionId: c.contributionId,
      title: c.title,
      totalReleased: c.releases.reduce((sum, r) => sum + Number(r.amountReleased), 0),
      releases: c.releases.map((r) => ({
        releaseId: r.releaseId,
        amountReleased: Number(r.amountReleased),
        purpose: r.purpose,
        releaseDate: r.releaseDate,
        hasReceipt: !!r.receiptData,
      })),
    }));

  return NextResponse.json(categories);
}
