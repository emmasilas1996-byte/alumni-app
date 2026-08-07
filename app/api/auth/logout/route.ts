import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

// Never statically cache this route — it reads/writes live data via
// Prisma on every request. Without this, Next.js can silently
// pre-render a GET handler with no request-derived params ONCE at
// build time and serve that frozen snapshot forever after (this is
// exactly what broke newly-assigned executives from ever showing up).
export const dynamic = "force-dynamic";

export async function POST() {
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}
