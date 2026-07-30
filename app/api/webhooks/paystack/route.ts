import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPaystackWebhookSignature } from "@/lib/paystack";

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
  const amountNaira = amount / 100;

  // Guard against double-processing if Paystack retries the same webhook.
  const alreadyProcessed =
    (await prisma.contributionPayment.findFirst({ where: { paystackReference: reference } })) ||
    (await prisma.monthlyDue.findFirst({ where: { paystackReference: reference } }));

  if (alreadyProcessed) {
    return NextResponse.json({ received: true, note: "Already processed." });
  }

  try {
    if (metadata.purpose === "contribution") {
      await prisma.contributionPayment.create({
        data: {
          contributionId: Number(metadata.contributionId),
          memberId: Number(metadata.memberId),
          amount: amountNaira,
          paymentMethod: "Paystack",
          paystackReference: reference,
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
