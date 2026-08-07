import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Never statically cache this route — it reads/writes live data via
// Prisma on every request. Without this, Next.js can silently
// pre-render a GET handler with no request-derived params ONCE at
// build time and serve that frozen snapshot forever after (this is
// exactly what broke newly-assigned executives from ever showing up).
export const dynamic = "force-dynamic";

// GET /api/executives — Executive is NOT a separate table. This just
// filters Members where isExecutive = true.
export async function GET() {
  const execs = await prisma.member.findMany({
    where: { isExecutive: true },
    select: { memberId: true, firstName: true, lastName: true, executiveTitle: true },
    orderBy: { executiveTitle: "asc" },
  });
  return NextResponse.json(execs);
}
