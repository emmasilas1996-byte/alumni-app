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

// GET /api/dues?year=2026&month=3 — members who paid dues that month.
export async function GET(req: NextRequest) {
  const year = Number(req.nextUrl.searchParams.get("year"));
  const month = Number(req.nextUrl.searchParams.get("month"));

  if (!year || !month) {
    return NextResponse.json({ error: "year and month query params are required." }, { status: 400 });
  }

  const dues = await prisma.monthlyDue.findMany({
    where: { dueYear: year, dueMonth: month },
    include: { member: { select: { firstName: true, lastName: true } } },
    orderBy: { paymentDate: "desc" },
  });

  return NextResponse.json(dues);
}

// POST /api/dues — add a member's payment for a given year/month.
// Login required (this is the "Add Monthly Dues" action gated by auth).
export async function POST(req: NextRequest) {
  let session;
  try {
    session = requireSession();
  } catch {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const form = await req.formData();
  const memberId = Number(form.get("memberId"));
  const dueYear = Number(form.get("dueYear"));
  const dueMonth = Number(form.get("dueMonth"));
  const amount = Number(form.get("amount"));
  const receipt = form.get("receipt") as File | null;

  if (!memberId || !dueYear || !dueMonth || !amount) {
    return NextResponse.json(
      { error: "memberId, dueYear, dueMonth, and amount are required." },
      { status: 400 }
    );
  }

  let receiptData: Buffer | null = null;
  let receiptContentType: string | null = null;
  if (receipt && receipt.size > 0) {
    receiptData = encryptBuffer(Buffer.from(await receipt.arrayBuffer()));
    receiptContentType = receipt.type || "image/jpeg";
  }

  try {
    const due = await prisma.monthlyDue.create({
      data: {
        memberId,
        dueYear,
        dueMonth,
        amount,
        receiptData,
        receiptContentType,
        createdByUserId: session.userId,
      },
    });
    return NextResponse.json(due, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json(
        { error: "This member already has a due recorded for that month." },
        { status: 409 }
      );
    }
    throw e;
  }
}
