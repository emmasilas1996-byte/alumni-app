import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { encryptBuffer } from "@/lib/crypto";
import { verifyPaystackTransaction } from "@/lib/paystack";

const schema = z.object({
  reference: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { reference } = parsed.data;

  try {
    const transaction = await verifyPaystackTransaction(reference);

    if (transaction.status !== "success") {
      return NextResponse.json(
        { ok: false, status: transaction.status, message: "Payment is not yet successful." },
        { status: 200 }
      );
    }

    const alreadyProcessed =
      (await prisma.contributionPayment.findFirst({ where: { paystackReference: reference } })) ||
      (await prisma.monthlyDue.findFirst({ where: { paystackReference: reference } }));

    if (alreadyProcessed) {
      return NextResponse.json({ ok: true, alreadyProcessed: true, message: "Payment already recorded." });
    }

    const metadata = transaction.metadata ?? {};
    // Prefer the settled or charged amount if Paystack provides it (this
    // reflects the actual amount received after any adjustments). Fall
    // back to `amount` if none of the others are present.
    let amountKoboNum: number;
    if (transaction.settlement_amount != null) {
      amountKoboNum = Number(transaction.settlement_amount);
    } else if (transaction.charged_amount != null) {
      amountKoboNum = Number(transaction.charged_amount);
    } else if (transaction.fees != null) {
      amountKoboNum = Number(transaction.amount) - Number(transaction.fees);
    } else {
      amountKoboNum = Number(transaction.amount);
    }
    const amountNaira = amountKoboNum / 100;
    const memberIdFromMetadata = Number(metadata?.memberId ?? metadata?.member_id ?? 0);

    const payerUser = memberIdFromMetadata
      ? await prisma.user.findUnique({ where: { memberId: memberIdFromMetadata } })
      : null;

    const receiptData = encryptBuffer(
      Buffer.from(
        JSON.stringify({
          reference,
          amountNaira,
          paidAt: transaction.paid_at || null,
          currency: transaction.currency || null,
          metadata,
          raw: transaction,
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
          paymentDate: transaction.paid_at ? new Date(transaction.paid_at) : new Date(),
          receiptData,
          receiptContentType,
          createdByUserId: payerUser?.userId,
        },
      });
    } else if (metadata.purpose === "dues") {
      const existingDue = await prisma.monthlyDue.findFirst({
        where: {
          memberId: Number(metadata.memberId),
          dueYear: Number(metadata.dueYear),
          dueMonth: Number(metadata.dueMonth),
        },
      });

      if (existingDue) {
        return NextResponse.json({ ok: true, alreadyProcessed: true, message: "Payment already recorded." });
      }

      await prisma.monthlyDue.create({
        data: {
          memberId: Number(metadata.memberId),
          dueYear: Number(metadata.dueYear),
          dueMonth: Number(metadata.dueMonth),
          amount: amountNaira,
          paymentMethod: "Paystack",
          paystackReference: reference,
          paymentDate: transaction.paid_at ? new Date(transaction.paid_at) : new Date(),
          receiptData,
          receiptContentType,
          createdByUserId: payerUser?.userId,
        },
      });
    } else {
      return NextResponse.json({ error: "Unsupported payment purpose." }, { status: 400 });
    }

    await prisma.paystackWebhookLog.create({
      data: {
        eventType: "verify.success",
        reference,
        processed: true,
        rawPayload: JSON.stringify(transaction),
      },
    });

    return NextResponse.json({ ok: true, recorded: true, amountNaira });
  } catch (err: any) {
    console.error("Failed to verify Paystack payment:", err);
    return NextResponse.json({ error: err.message || "Payment verification failed." }, { status: 502 });
  }
}
