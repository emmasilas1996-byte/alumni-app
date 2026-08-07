import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { encryptBuffer } from "@/lib/crypto";
import { verifyPaystackWebhookSignature } from "@/lib/paystack";

// Never statically cache this route — it reads/writes live data via
// Prisma on every request. Without this, Next.js can silently
// pre-render a GET handler with no request-derived params ONCE at
// build time and serve that frozen snapshot forever after (this is
// exactly what broke newly-assigned executives from ever showing up).
export const dynamic = "force-dynamic";

// POST /api/webhooks/paystack
// Configure this URL in your Paystack dashboard under Settings > API Keys
// & Webhooks once the app is deployed: https://yourapp.com/api/webhooks/paystack
//
// Every event is logged to PaystackWebhookLog first (audit trail), then
// only "charge.success" events actually create a payment record. This
// endpoint deliberately has NO login requirement — Paystack calls it
// directly — so the HMAC signature check below is what protects it
// instead of a session cookie.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!verifyPaystackWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  await prisma.paystackWebhookLog.create({
    data: {
      eventType: event.event,
      reference: event.data?.reference || "unknown",
      rawPayload: rawBody,
      processed: false,
    },
  });

  if (event.event !== "charge.success") {
    // Acknowledge receipt so Paystack doesn't retry; we just don't act on it.
    return NextResponse.json({ received: true });
  }

  const { reference, amount, metadata } = event.data;
  // Prefer Paystack's settled/charged amount when available so we record
  // the actual value received rather than the original charge amount.
  let amountKoboNum: number;
  if (event.data?.settlement_amount != null) {
    amountKoboNum = Number(event.data.settlement_amount);
  } else if (event.data?.charged_amount != null) {
    amountKoboNum = Number(event.data.charged_amount);
  } else if (event.data?.fees != null) {
    amountKoboNum = Number(amount) - Number(event.data.fees);
  } else {
    amountKoboNum = Number(amount);
  }
  const amountNaira = amountKoboNum / 100;
  const memberIdFromMetadata = Number(metadata?.memberId ?? metadata?.member_id ?? 0);

  const payerUser = memberIdFromMetadata
    ? await prisma.user.findUnique({ where: { memberId: memberIdFromMetadata } })
    : null;

  // Guard against double-processing if Paystack retries the same webhook.
  const alreadyProcessed =
    (await prisma.contributionPayment.findFirst({ where: { paystackReference: reference } })) ||
    (await prisma.monthlyDue.findFirst({ where: { paystackReference: reference } }));

  if (alreadyProcessed) {
    return NextResponse.json({ received: true, note: "Already processed." });
  }

  try {
    const receiptData = encryptBuffer(
      Buffer.from(
        JSON.stringify({
          reference,
          amountNaira,
          paidAt: event.data?.paid_at || null,
          currency: event.data?.currency || null,
          metadata,
          raw: event.data,
        })
      )
    );
    const receiptContentType = "application/json";

    if (metadata.purpose === "contribution") {
      await prisma.contributionPayment.create({
        data: {
          contributionId: Number(metadata.contributionId),
          memberId: Number(metadata.memberId),
          amount: amountNaira,
          paymentMethod: "Paystack",
          paystackReference: reference,
          receiptData,
          receiptContentType,
          createdByUserId: payerUser?.userId,
        },
      });
    } else if (metadata.purpose === "dues") {
      await prisma.monthlyDue.create({
        data: {
          memberId: Number(metadata.memberId),
          dueYear: Number(metadata.dueYear),
          dueMonth: Number(metadata.dueMonth),
          amount: amountNaira,
          paymentMethod: "Paystack",
          paystackReference: reference,
          receiptData,
          receiptContentType,
          createdByUserId: payerUser?.userId,
        },
      });
    }

    await prisma.paystackWebhookLog.updateMany({
      where: { reference },
      data: { processed: true },
    });
  } catch (err) {
    // Record creation can fail (e.g. duplicate monthly due for the same
    // member/month). The webhook log entry above still preserves the raw
    // event so nothing is silently lost — check PaystackWebhookLog for
    // any reference where processed = 0.
    console.error("Failed to record Paystack payment:", err);
  }

  return NextResponse.json({ received: true });
}
