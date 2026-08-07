import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decryptText, encryptBuffer, encryptText } from "@/lib/crypto";

// Never statically cache this route — it reads/writes live data via
// Prisma on every request. Without this, Next.js can silently
// pre-render a GET handler with no request-derived params ONCE at
// build time and serve that frozen snapshot forever after (this is
// exactly what broke newly-assigned executives from ever showing up).
export const dynamic = "force-dynamic";

// GET /api/members — list every member (execs + regular). No photo bytes
// in the list response — those are fetched separately via /api/members/[id]/photo
// so the list stays light.
export async function GET() {
  const members = await prisma.member.findMany({
    select: {
      memberId: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      isExecutive: true,
      executiveTitle: true,
      occupation: true,
      location: true,
      dateJoined: true,
      thoughts: true,
      emailEncrypted: true,
      phoneEncrypted: true,
    },
    orderBy: { lastName: "asc" },
  });

  const decrypted = members.map((member) => ({
    ...member,
    email: member.emailEncrypted ? decryptText(Buffer.from(member.emailEncrypted)) : null,
    phone: member.phoneEncrypted ? decryptText(Buffer.from(member.phoneEncrypted)) : null,
  }));

  return NextResponse.json(decrypted);
}

// POST /api/members — add a new member. Expects multipart/form-data so a
// photo file can be included directly in the same request.
export async function POST(req: NextRequest) {
  const form = await req.formData();

  const firstName = form.get("firstName") as string | null;
  const lastName = form.get("lastName") as string | null;
  const email = form.get("email") as string | null;
  const phone = form.get("phone") as string | null;
  const occupation = form.get("occupation") as string | null;
  const location = form.get("location") as string | null;
  const dateOfBirth = form.get("dateOfBirth") as string | null;
  const thoughts = form.get("thoughts") as string | null;
  const dateJoined = form.get("dateJoined") as string | null;
  const photo = form.get("photo") as File | null;

  if (!firstName || !lastName || !dateOfBirth) {
    return NextResponse.json(
      { error: "firstName, lastName, and dateOfBirth are required." },
      { status: 400 }
    );
  }

  let photoData: Buffer | null = null;
  let photoContentType: string | null = null;
  if (photo && photo.size > 0) {
    const bytes = Buffer.from(await photo.arrayBuffer());
    photoData = encryptBuffer(bytes); // encrypted BEFORE it ever touches the DB
    photoContentType = photo.type || "image/jpeg";
  }

  const member = await prisma.member.create({
    data: {
      firstName,
      lastName,
      emailEncrypted: email ? encryptText(email) : null,
      phoneEncrypted: phone ? encryptText(phone) : null,
      dateOfBirth: new Date(dateOfBirth),
      occupation: occupation || null,
      location: location || null,
      dateJoined: dateJoined ? new Date(dateJoined) : null,
      thoughts: thoughts || null,
      photoData,
      photoContentType,
    },
    select: { memberId: true, firstName: true, lastName: true },
  });

  return NextResponse.json(member, { status: 201 });
}
