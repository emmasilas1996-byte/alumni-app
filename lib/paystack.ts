import crypto from "crypto";

// ============================================================
// Paystack integration. Settlement account (your UBA account) is
// configured entirely inside your Paystack dashboard — this app
// never sees or stores the account number, only your API keys.
// ============================================================

const PAYSTACK_BASE = "https://api.paystack.co";

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set in .env");
  return key;
}

export interface InitializePaymentInput {
  email: string;
  amountNaira: number;
  /** Encoded into Paystack's metadata so the webhook knows what this payment is for. */
  metadata: {
    purpose: "contribution" | "dues";
    memberId: number;
    contributionId?: number;
    dueYear?: number;
    dueMonth?: number;
  };
  callbackUrl: string;
}

export interface InitializePaymentResult {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

/**
 * Calls Paystack's Initialize Transaction endpoint. Paystack amounts are
 * in kobo (smallest currency unit), so naira is multiplied by 100.
 */
export async function initializePaystackTransaction(
  input: InitializePaymentInput
): Promise<InitializePaymentResult> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: Math.round(input.amountNaira * 100),
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(data.message || "Paystack initialization failed.");
  }

  return {
    authorizationUrl: data.data.authorization_url,
    accessCode: data.data.access_code,
    reference: data.data.reference,
  };
}

/** Verifies a transaction reference directly with Paystack (belt-and-braces alongside the webhook). */
export async function verifyPaystackTransaction(reference: string) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${getSecretKey()}` },
  });
  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(data.message || "Paystack verification failed.");
  }
  return data.data; // includes status, amount, metadata, reference, etc.
}

/**
 * Validates the `x-paystack-signature` header on incoming webhooks.
 * Paystack signs the raw request body with your secret key using HMAC-SHA512.
 * Reject anything that doesn't match — otherwise anyone could POST a fake
 * "payment successful" event straight into your database.
 */
export function verifyPaystackWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!signatureHeader) return false;
  const hash = crypto.createHmac("sha512", getSecretKey()).update(rawBody).digest("hex");
  return hash === signatureHeader;
}
