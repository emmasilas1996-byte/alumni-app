import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Never statically cache this route — it reads/writes live data via
// Prisma on every request. Without this, Next.js can silently
// pre-render a GET handler with no request-derived params ONCE at
// build time and serve that frozen snapshot forever after (this is
// exactly what broke newly-assigned executives from ever showing up).
export const dynamic = "force-dynamic";

// GET /api/gallery — no separate Gallery table; this reads directly off
// Members (photoData + thoughts), as specified.
export async function GET() {
  const members = await prisma.member.findMany({
    where: { photoData: { not: null } },
    select: { memberId: true, firstName: true, lastName: true, thoughts: true },
    orderBy: { firstName: "asc" },
  });
  return NextResponse.json(members);
}
