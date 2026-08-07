import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

// Never statically cache this route — it reads/writes live data via
// Prisma on every request. Without this, Next.js can silently
// pre-render a GET handler with no request-derived params ONCE at
// build time and serve that frozen snapshot forever after (this is
// exactly what broke newly-assigned executives from ever showing up).
export const dynamic = "force-dynamic";

// GET /api/constitution — full table of contents with nested sub-sections.
export async function GET() {
  const sections = await prisma.constitutionSection.findMany({
    where: { parentSectionId: null },
    include: { children: { orderBy: { orderIndex: "asc" } } },
    orderBy: { orderIndex: "asc" },
  });
  return NextResponse.json(sections);
}

export async function POST(req: NextRequest) {
  try {
    requireSession();
  } catch {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const payload = await req.json();
  const title = String(payload.title || "").trim();
  const content = String(payload.content || "").trim();
  const orderIndex = Number(payload.orderIndex) || 1;
  const parentSectionId = payload.parentSectionId ? Number(payload.parentSectionId) : null;

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
  }

  const section = await prisma.constitutionSection.create({
    data: {
      title,
      content,
      orderIndex,
      parentSectionId,
    },
  });

  const response = NextResponse.json(section, { status: 201 });
  return response;
}
