import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decryptText } from "@/lib/crypto";
import { initializePaystackTransaction } from "@/lib/paystack";
import { z } from "zod";

// POST /api/payments/paystack/initialize
// No login required here — this is the self-serve "Pay via Paystack" path,
// separate from the login-gated manual/cash entry path.
const schema = z.object({
  memberId: z.number(),
  amount: z.number().positive(),
  purpose: z.enum(["contribution", "dues"]),
  contributionId: z.number().optional(),
  dueYear: z.number().optional(),
  dueMonth: z.number().optional(),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { memberId, amount, purpose, contributionId, dueYear, dueMonth } = parsed.data;

  const member = await prisma.member.findUnique({
    where: { memberId },
    select: { emailEncrypted: true, firstName: true },
  });
  if (!member?.emailEncrypted) {
    return NextResponse.json(
      { error: "This member has no email on file — required for Paystack receipts." },
      { status: 400 }
    );
  }

  if (purpose === "contribution" && !contributionId) {
    return NextResponse.json({ error: "contributionId is required." }, { status: 400 });
  }
  if (purpose === "dues" && (!dueYear || !dueMonth)) {
    return NextResponse.json({ error: "dueYear and dueMonth are required." }, { status: 400 });
  }

  const email = decryptText(Buffer.from(member.emailEncrypted));
  const origin = req.nextUrl.origin;

  const result = await initializePaystackTransaction({
    email,
    amountNaira: amount,
    metadata: { purpose, memberId, contributionId, dueYear, dueMonth },
    callbackUrl:
      purpose === "contribution"
        ? `${origin}/contributions/${contributionId}?paystack=pending`
        : `${origin}/dues?paystack=pending&year=${dueYear}&month=${dueMonth}`,
  });

  return NextResponse.json(result);
}
