import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { encryptBuffer } from "@/lib/crypto";

// DELETE /api/members/:id — removes a member entirely (from both
// Members and, implicitly, Executive since Executive is just a filtered view).
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const memberId = Number(params.id);
  if (!Number.isInteger(memberId)) {
    return NextResponse.json({ error: "Invalid member id." }, { status: 400 });
  }

  await prisma.member.delete({ where: { memberId } });
  return NextResponse.json({ ok: true });
}

function isMultipartRequest(req: NextRequest) {
  return req.headers.get("content-type")?.startsWith("multipart/form-data") ?? false;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const memberId = Number(params.id);
  if (!Number.isInteger(memberId)) {
    return NextResponse.json({ error: "Invalid member id." }, { status: 400 });
  }

  if (isMultipartRequest(req)) {
    const form = await req.formData();
    const photo = form.get("photo") as File | null;

    const updateData: Record<string, any> = {};
    if (photo && photo.size > 0) {
      const photoBuffer = Buffer.from(await photo.arrayBuffer());
      updateData.photoData = encryptBuffer(photoBuffer);
      updateData.photoContentType = photo.type || "image/jpeg";
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No update data provided." }, { status: 400 });
    }

    const updated = await prisma.member.update({
      where: { memberId },
      data: updateData,
      select: { memberId: true, firstName: true, lastName: true },
    });
    return NextResponse.json(updated);
  }

  const body = await req.json();
  const updated = await prisma.member.update({
    where: { memberId },
    data: {
      isExecutive: body.isExecutive ?? undefined,
      executiveTitle: body.executiveTitle ?? undefined,
    },
    select: { memberId: true, isExecutive: true, executiveTitle: true },
  });

  return NextResponse.json(updated);
}
