import crypto from "crypto";

// ============================================================
// AES-256-GCM encryption for images and PII stored in the DB.
//
// Every uploaded image (member photo, receipt, logo) is encrypted
// here BEFORE it's written to a VARBINARY(MAX) column, and decrypted
// here right before it's streamed back out to the browser. Nothing
// is ever written to disk or an external URL.
//
// Requires ENCRYPTION_KEY in .env — a 32-byte key, base64-encoded.
// Generate one with:  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
// ============================================================

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // recommended for GCM
const AUTH_TAG_LENGTH = 16;

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error(
      "ENCRYPTION_KEY is not set. Generate one and add it to .env — see comment in lib/crypto.ts"
    );
  }
  const buf = Buffer.from(key, "base64");
  if (buf.length !== 32) {
    throw new Error("ENCRYPTION_KEY must decode to exactly 32 bytes.");
  }
  return buf;
}

/**
 * Encrypts a buffer (image bytes, or any binary/text data).
 * Output layout: [12-byte IV][16-byte auth tag][ciphertext]
 * This single Buffer is what gets stored in the DB column.
 */
export function encryptBuffer(plain: Buffer): Buffer {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plain), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]);
}

/**
 * Reverses encryptBuffer(). Throws if the data was tampered with
 * or the key is wrong (GCM auth tag verification fails).
 */
export function decryptBuffer(payload: Buffer): Buffer {
  const key = getKey();
  const iv = payload.subarray(0, IV_LENGTH);
  const authTag = payload.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = payload.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

/** Convenience wrappers for short text fields like email/phone. */
export function encryptText(text: string): Buffer {
  return encryptBuffer(Buffer.from(text, "utf-8"));
}

export function decryptText(payload: Buffer): string {
  return decryptBuffer(payload).toString("utf-8");
}
