import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { clearSessionCookie, requireSession } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireSession();
  } catch {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

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

  const response = NextResponse.json(updated);
  clearSessionCookie();
  return response;
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireSession();
  } catch {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const sectionId = Number(params.id);
  if (!Number.isInteger(sectionId)) {
    return NextResponse.json({ error: "Invalid section ID." }, { status: 400 });
  }

  await prisma.constitutionSection.delete({
    where: { sectionId },
  });

  const response = NextResponse.json({ success: true });
  clearSessionCookie();
  return response;
}
