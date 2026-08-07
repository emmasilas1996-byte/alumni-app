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

// GET /api/contributions/:id/releases — releases for this contribution + remaining balance.
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const contributionId = Number(params.id);

  const [payments, releases] = await Promise.all([
    prisma.contributionPayment.aggregate({
      where: { contributionId },
      _sum: { amount: true },
    }),
    prisma.contributionRelease.findMany({
      where: { contributionId },
      select: {
        releaseId: true,
        amountReleased: true,
        purpose: true,
        releaseDate: true,
        receiptContentType: true,
      },
      orderBy: { releaseDate: "desc" },
    }),
  ]);

  const totalPaid = Number(payments._sum.amount || 0);
  const totalReleased = releases.reduce((sum, r) => sum + Number(r.amountReleased), 0);

  return NextResponse.json({
    balanceAvailable: totalPaid - totalReleased,
    totalPaid,
    totalReleased,
    releases: releases.map((r) => ({
      releaseId: r.releaseId,
      amountReleased: r.amountReleased,
      purpose: r.purpose,
      releaseDate: r.releaseDate,
      hasReceipt: !!r.receiptContentType,
    })),
  });
}

// POST /api/contributions/:id/releases — release funds for their intended
// purpose. Login required. Blocks releasing more than what's available.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  let session;
  try {
    session = requireSession();
  } catch {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const contributionId = Number(params.id);
  const form = await req.formData();
  const amountReleased = Number(form.get("amount"));
  const purpose = form.get("purpose") as string | null;
  const receipt = form.get("receipt") as File | null;

  if (!amountReleased || !purpose) {
    return NextResponse.json({ error: "amount and purpose are required." }, { status: 400 });
  }

  // Recompute balance server-side — never trust a client-supplied balance.
  const [paidAgg, releasedAgg] = await Promise.all([
    prisma.contributionPayment.aggregate({ where: { contributionId }, _sum: { amount: true } }),
    prisma.contributionRelease.aggregate({ where: { contributionId }, _sum: { amountReleased: true } }),
  ]);
  const balance = Number(paidAgg._sum.amount || 0) - Number(releasedAgg._sum.amountReleased || 0);

  if (amountReleased > balance) {
    return NextResponse.json(
      { error: `Release exceeds available balance. Balance: NGN ${balance.toLocaleString()}.` },
      { status: 400 }
    );
  }

  let receiptData: Buffer | null = null;
  let receiptContentType: string | null = null;
  if (receipt && receipt.size > 0) {
    receiptData = encryptBuffer(Buffer.from(await receipt.arrayBuffer()));
    receiptContentType = receipt.type || "image/jpeg";
  }

  const release = await prisma.contributionRelease.create({
    data: {
      contributionId,
      amountReleased,
      purpose,
      receiptData,
      receiptContentType,
      createdByUserId: session.userId,
    },
  });

  const response = NextResponse.json(release, { status: 201 });
  return response;
}
