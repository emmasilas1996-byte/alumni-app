import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Never statically cache this route — it reads/writes live data via
// Prisma on every request. Without this, Next.js can silently
// pre-render a GET handler with no request-derived params ONCE at
// build time and serve that frozen snapshot forever after (this is
// exactly what broke newly-assigned executives from ever showing up).
export const dynamic = "force-dynamic";

// GET /api/contributions/:id — the contribution + every member who paid.
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const contributionId = Number(params.id);

  const contribution = await prisma.contributionType.findUnique({
    where: { contributionId },
    include: {
      payments: {
        include: { member: { select: { firstName: true, lastName: true } } },
        orderBy: { paymentDate: "desc" },
      },
    },
  });

  if (!contribution) {
    return NextResponse.json({ error: "Contribution not found." }, { status: 404 });
  }

  return NextResponse.json(contribution);
}
