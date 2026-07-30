import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
