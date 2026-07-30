import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decryptBuffer } from "@/lib/crypto";

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
