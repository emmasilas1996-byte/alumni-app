import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

// Never statically cache this route — it reads/writes live data via
// Prisma on every request. Without this, Next.js can silently
// pre-render a GET handler with no request-derived params ONCE at
// build time and serve that frozen snapshot forever after (this is
// exactly what broke newly-assigned executives from ever showing up).
export const dynamic = "force-dynamic";

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
  return response;
}
