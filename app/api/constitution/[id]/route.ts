import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const sectionId = Number(params.id);
  if (!Number.isInteger(sectionId)) {
    return NextResponse.json({ error: "Invalid section ID." }, { status: 400 });
  }

  const payload = await req.json();
  const title = String(payload.title || "").trim();
  const content = String(payload.content || "").trim();
  const orderIndex = Number(payload.orderIndex) || 1;
  const parentSectionId = payload.parentSectionId ? Number(payload.parentSectionId) : null;

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
  }

  const updated = await prisma.constitutionSection.update({
    where: { sectionId },
    data: {
      title,
      content,
      orderIndex,
      parentSectionId,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const sectionId = Number(params.id);
  if (!Number.isInteger(sectionId)) {
    return NextResponse.json({ error: "Invalid section ID." }, { status: 400 });
  }

  await prisma.constitutionSection.delete({
    where: { sectionId },
  });

  return NextResponse.json({ success: true });
}
