import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decryptBuffer } from "@/lib/crypto";

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
      "Cache-Control": "private, max-age=300",
    },
  });
}
