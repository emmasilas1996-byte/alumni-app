import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { encryptBuffer, decryptBuffer } from "@/lib/crypto";

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
        data: { groupName: groupName || "Alumni Association", logoData, logoContentType },
      });

  return NextResponse.json({ settingId: settings.settingId });
}
