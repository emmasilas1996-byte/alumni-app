import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decryptBuffer } from "@/lib/crypto";

export async function GET() {
  const settings = await prisma.organizationSettings.findFirst();
  if (!settings?.logoData) {
    const defaultLogo = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#10213f" />
      <stop offset="100%" stop-color="#0a1730" />
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="36" fill="url(#g)" />
  <text x="50%" y="46%" fill="#c8992e" font-family="Inter, sans-serif" font-size="98" font-weight="700" text-anchor="middle" dominant-baseline="middle">N</text>
  <text x="50%" y="70%" fill="#f7f4ec" font-family="Inter, sans-serif" font-size="24" text-anchor="middle" dominant-baseline="middle">Alumni</text>
</svg>`;
    return new NextResponse(defaultLogo, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=300",
      },
    });
  }

  const decrypted = decryptBuffer(Buffer.from(settings.logoData));
  return new NextResponse(new Uint8Array(decrypted), {
    headers: {
      "Content-Type": settings.logoContentType || "image/png",
      "Cache-Control": "private, max-age=300",
    },
  });
}
