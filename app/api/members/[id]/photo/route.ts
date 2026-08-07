import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decryptBuffer } from "@/lib/crypto";

// Never statically cache this route — it reads/writes live data via
// Prisma on every request. Without this, Next.js can silently
// pre-render a GET handler with no request-derived params ONCE at
// build time and serve that frozen snapshot forever after (this is
// exactly what broke newly-assigned executives from ever showing up).
export const dynamic = "force-dynamic";

// GET /api/members/:id/photo — decrypts the stored photo bytes on the
// fly and streams them back. Nothing decrypted is ever persisted to disk.
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const memberId = Number(params.id);
  const member = await prisma.member.findUnique({
    where: { memberId },
    select: { photoData: true, photoContentType: true },
  });

  if (!member?.photoData) {
    return NextResponse.json({ error: "No photo on file." }, { status: 404 });
  }

  const decrypted = decryptBuffer(Buffer.from(member.photoData));
  return new NextResponse(new Uint8Array(decrypted), {
    headers: {
      "Content-Type": member.photoContentType || "image/jpeg",
      // Cached for 5 minutes. Freshness after an edit is handled by the
      // ?v=<version> query param the app appends after a photo update —
      // that makes it a different URL, which is a cache miss regardless
      // of this header, so we don't need to disable caching globally
      // (doing so made every photo re-fetch + re-decrypt from the DB on
      // every single page view, which was a real performance cost across
      // Members, Gallery, and Executive).
      "Cache-Control": "private, max-age=300",
    },
  });
}
