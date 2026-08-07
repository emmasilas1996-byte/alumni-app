import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const COOKIE_NAME = "alumni_session";
const SESSION_HOURS = 8;

/**
 * Detects whether the ORIGINAL request from the browser was HTTPS.
 * Checks X-Forwarded-Proto first, since Nginx sits in front of Node —
 * once HTTPS is set up, Nginx terminates SSL and forwards plain HTTP
 * to Node internally, so req.url alone would always say "http" even
 * on a fully HTTPS site. Falls back to the request's own protocol for
 * local dev (no proxy in front).
 */
export function isHttpsRequest(req: NextRequest): boolean {
  const forwardedProto = req.headers.get("x-forwarded-proto");
  if (forwardedProto) return forwardedProto.split(",")[0].trim() === "https";
  return req.nextUrl.protocol === "https:";
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set in .env");
  return secret;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function createSessionToken(userId: number, username: string): string {
  return jwt.sign({ userId, username }, getSecret(), {
    expiresIn: `${SESSION_HOURS}h`,
  });
}

export function setSessionCookie(token: string, isHttps: boolean) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    // Reflects whether THIS request actually arrived over HTTPS, not
    // NODE_ENV. A cookie marked Secure is silently dropped by the
    // browser on a plain HTTP connection — using NODE_ENV="production"
    // as the signal broke login entirely on a production site still
    // served over HTTP (no SSL certificate set up yet). Once HTTPS is
    // added, requests will naturally come in as isHttps=true and the
    // cookie becomes Secure automatically — no code change needed then.
    secure: isHttps,
    sameSite: "lax",
    // No maxAge/expires on purpose: this makes it a true browser-session
    // cookie, cleared automatically when the browser is fully closed —
    // so leaving and coming back later requires signing in again. The
    // JWT itself still expires server-side after SESSION_HOURS as a
    // backstop for tabs left open longer than that.
    path: "/",
  });
}

export function clearSessionCookie() {
  cookies().delete({ name: COOKIE_NAME, path: "/" });
}

export interface SessionPayload {
  userId: number;
  username: string;
}

/** Reads and verifies the session cookie. Returns null if not signed in. */
export function getSession(): SessionPayload | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, getSecret()) as SessionPayload;
  } catch {
    return null;
  }
}

/** Use inside API routes that require sign-in (Add Contribution / Add Dues). */
export function requireSession(): SessionPayload {
  const session = getSession();
  if (!session) {
    const err = new Error("UNAUTHENTICATED");
    err.name = "UNAUTHENTICATED";
    throw err;
  }
  return session;
}
