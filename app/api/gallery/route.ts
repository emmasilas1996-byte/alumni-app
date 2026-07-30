import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
