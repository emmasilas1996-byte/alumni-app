import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

  return NextResponse.json(section, { status: 201 });
}
