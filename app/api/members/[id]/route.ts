import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { encryptBuffer, encryptText } from "@/lib/crypto";

// Never statically cache this route — it reads/writes live data via
// Prisma on every request. Without this, Next.js can silently
// pre-render a GET handler with no request-derived params ONCE at
// build time and serve that frozen snapshot forever after (this is
// exactly what broke newly-assigned executives from ever showing up).
export const dynamic = "force-dynamic";

// DELETE /api/members/:id — removes a member entirely. Login required —
// only reachable from the Edit modal now, which is itself login-gated,
// but this checks independently too (defense in depth).
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireSession();
  } catch {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const memberId = Number(params.id);
  if (!Number.isInteger(memberId)) {
    return NextResponse.json({ error: "Invalid member id." }, { status: 400 });
  }

  await prisma.member.delete({ where: { memberId } });
  const response = NextResponse.json({ ok: true });
  return response;
}

function isMultipartRequest(req: NextRequest) {
  return req.headers.get("content-type")?.startsWith("multipart/form-data") ?? false;
}

// PATCH /api/members/:id
// - multipart/form-data body -> full profile edit (name, contact,
//   occupation, location, DOB, thoughts, and optionally a new photo).
//   Login required — this is the "Edit" flow on the Members page.
// - JSON body -> executive title toggle only, used by the Executive
//   page. Left ungated, matching the original spec (Executive
//   assign/remove was never login-gated).
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const memberId = Number(params.id);
  if (!Number.isInteger(memberId)) {
    return NextResponse.json({ error: "Invalid member id." }, { status: 400 });
  }

  if (isMultipartRequest(req)) {
    try {
      requireSession();
    } catch {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const form = await req.formData();
    const photo = form.get("photo") as File | null;

    const firstName = form.get("firstName") as string | null;
    const lastName = form.get("lastName") as string | null;
    const email = form.get("email") as string | null;
    const phone = form.get("phone") as string | null;
    const occupation = form.get("occupation") as string | null;
    const location = form.get("location") as string | null;
    const dateOfBirth = form.get("dateOfBirth") as string | null;
    const thoughts = form.get("thoughts") as string | null;
    const dateJoined = form.get("dateJoined") as string | null;

    const updateData: Record<string, any> = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.emailEncrypted = encryptText(email);
    if (phone) updateData.phoneEncrypted = encryptText(phone);
    if (occupation !== null) updateData.occupation = occupation || null;
    if (location !== null) updateData.location = location || null;
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    if (thoughts !== null) updateData.thoughts = thoughts || null;
    if (dateJoined !== null) updateData.dateJoined = dateJoined ? new Date(dateJoined) : null;

    if (photo && photo.size > 0) {
      const photoBuffer = Buffer.from(await photo.arrayBuffer());
      updateData.photoData = encryptBuffer(photoBuffer);
      updateData.photoContentType = photo.type || "image/jpeg";
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No update data provided." }, { status: 400 });
    }

    try {
      const updated = await prisma.member.update({
        where: { memberId },
        data: updateData,
        select: {
          memberId: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          occupation: true,
          location: true,
          isExecutive: true,
          executiveTitle: true,
          dateJoined: true,
          thoughts: true,
        },
      });
      return NextResponse.json(updated);
    } catch (err: any) {
      console.error("Failed to update member:", err);
      return NextResponse.json({ error: err.message || "Failed to update member." }, { status: 500 });
    }
  }

  const body = await req.json();
  try {
    const updated = await prisma.member.update({
      where: { memberId },
      data: {
        isExecutive: body.isExecutive ?? undefined,
        executiveTitle: body.executiveTitle ?? undefined,
      },
      select: { memberId: true, isExecutive: true, executiveTitle: true },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("Failed to update executive member details:", err);
    return NextResponse.json({ error: err.message || "Failed to update executive member." }, { status: 500 });
  }
}
