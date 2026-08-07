import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decryptBuffer } from "@/lib/crypto";

// Never statically cache this route — it reads/writes live data via
// Prisma on every request. Without this, Next.js can silently
// pre-render a GET handler with no request-derived params ONCE at
// build time and serve that frozen snapshot forever after (this is
// exactly what broke newly-assigned executives from ever showing up).
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const releaseId = Number(params.id);
  const release = await prisma.contributionRelease.findUnique({
    where: { releaseId },
    select: { receiptData: true, receiptContentType: true },
  });

  if (!release?.receiptData) {
    return NextResponse.json({ error: "No receipt on file for this release." }, { status: 404 });
  }

  const decrypted = decryptBuffer(Buffer.from(release.receiptData));
  return new NextResponse(new Uint8Array(decrypted), {
    headers: {
      "Content-Type": release.receiptContentType || "image/jpeg",
      "Cache-Control": "private, max-age=300",
    },
  });
}
