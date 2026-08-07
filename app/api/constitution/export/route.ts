import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildConstitutionPdf } from "@/lib/pdf";

// Never statically cache this route — it reads/writes live data via
// Prisma on every request. Without this, Next.js can silently
// pre-render a GET handler with no request-derived params ONCE at
// build time and serve that frozen snapshot forever after (this is
// exactly what broke newly-assigned executives from ever showing up).
export const dynamic = "force-dynamic";

// GET /api/constitution/export — the full constitution as one watermarked
// PDF, in table-of-contents order (Article -> its Sections).
export async function GET() {
  const sections = await prisma.constitutionSection.findMany({
    where: { parentSectionId: null },
    include: { children: { orderBy: { orderIndex: "asc" } } },
    orderBy: { orderIndex: "asc" },
  });

  if (sections.length === 0) {
    return NextResponse.json({ error: "No constitution content to export yet." }, { status: 404 });
  }

  const pdfBytes = await buildConstitutionPdf(
    sections.map((s) => ({
      title: s.title,
      content: s.content,
      children: s.children.map((c) => ({ title: c.title, content: c.content })),
    }))
  );

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Constitution.pdf"`,
    },
  });
}
