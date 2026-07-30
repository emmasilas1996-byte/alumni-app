import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
