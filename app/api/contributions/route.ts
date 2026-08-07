import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

// Never statically cache this route — it reads/writes live data via
// Prisma on every request. Without this, Next.js can silently
// pre-render a GET handler with no request-derived params ONCE at
// build time and serve that frozen snapshot forever after (this is
// exactly what broke newly-assigned executives from ever showing up).
export const dynamic = "force-dynamic";

// GET /api/contributions — static list of all contribution types
// (no year/month filter — only Monthly Dues is filtered that way).
export async function GET() {
  const contributions = await prisma.contributionType.findMany({
    include: { _count: { select: { payments: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(contributions);
}

// POST /api/contributions — create a new contribution type. Requires sign-in.
export async function POST(req: NextRequest) {
  let session;
  try {
    session = requireSession();
  } catch {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = await req.json();
  if (!body.title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const contribution = await prisma.contributionType.create({
    data: {
      title: body.title,
      description: body.description || null,
      createdByUserId: session.userId,
    },
  });

  return NextResponse.json(contribution, { status: 201 });
}
