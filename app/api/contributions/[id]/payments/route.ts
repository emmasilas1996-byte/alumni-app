import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { encryptBuffer } from "@/lib/crypto";

// Never statically cache this route — it reads/writes live data via
// Prisma on every request. Without this, Next.js can silently
// pre-render a GET handler with no request-derived params ONCE at
// build time and serve that frozen snapshot forever after (this is
// exactly what broke newly-assigned executives from ever showing up).
export const dynamic = "force-dynamic";

// POST /api/contributions/:id/payments — add a member as a payer.
// Login required (this is the "Add Contribution" action gated by auth).
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  let session;
  try {
    session = requireSession();
  } catch {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const contributionId = Number(params.id);
  const form = await req.formData();
  const memberId = Number(form.get("memberId"));
  const amount = Number(form.get("amount"));
  const receipt = form.get("receipt") as File | null;

  if (!memberId || !amount) {
    return NextResponse.json({ error: "memberId and amount are required." }, { status: 400 });
  }

  let receiptData: Buffer | null = null;
  let receiptContentType: string | null = null;
  if (receipt && receipt.size > 0) {
    receiptData = encryptBuffer(Buffer.from(await receipt.arrayBuffer()));
    receiptContentType = receipt.type || "image/jpeg";
  }

  const payment = await prisma.contributionPayment.create({
    data: {
      contributionId,
      memberId,
      amount,
      receiptData,
      receiptContentType,
      createdByUserId: session.userId,
    },
  });

  const response = NextResponse.json(payment, { status: 201 });
  return response;
}
