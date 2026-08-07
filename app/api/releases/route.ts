import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Never statically cache this route — it reads/writes live data via
// Prisma on every request. Without this, Next.js can silently
// pre-render a GET handler with no request-derived params ONCE at
// build time and serve that frozen snapshot forever after (this is
// exactly what broke newly-assigned executives from ever showing up).
export const dynamic = "force-dynamic";

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
