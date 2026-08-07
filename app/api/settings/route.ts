import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { encryptBuffer, decryptBuffer } from "@/lib/crypto";

// Never statically cache this route — it reads/writes live data via
// Prisma on every request. Without this, Next.js can silently
// pre-render a GET handler with no request-derived params ONCE at
// build time and serve that frozen snapshot forever after (this is
// exactly what broke newly-assigned executives from ever showing up).
export const dynamic = "force-dynamic";

// GET /api/settings — returns group name only (photo fetched via /api/settings/logo).
export async function GET() {
  const settings = await prisma.organizationSettings.findFirst({
    select: { settingId: true, groupName: true },
  });
  return NextResponse.json(settings);
}

// POST /api/settings — upload/replace the group logo. Login required.
export async function POST(req: NextRequest) {
  try {
    requireSession();
  } catch {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const form = await req.formData();
  const groupName = form.get("groupName") as string | null;
  const logo = form.get("logo") as File | null;

  const existing = await prisma.organizationSettings.findFirst();

  let logoData: Buffer | undefined;
  let logoContentType: string | undefined;
  if (logo && logo.size > 0) {
    logoData = encryptBuffer(Buffer.from(await logo.arrayBuffer()));
    logoContentType = logo.type || "image/png";
  }

  const settings = existing
    ? await prisma.organizationSettings.update({
        where: { settingId: existing.settingId },
        data: { groupName: groupName || existing.groupName, logoData, logoContentType },
      })
    : await prisma.organizationSettings.create({
        data: { groupName: groupName || "NEMSS 2014 SET", logoData, logoContentType },
      });

  const response = NextResponse.json({ settingId: settings.settingId });
  return response;
}
