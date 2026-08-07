import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// Never statically cache this route — it reads/writes live data via
// Prisma on every request. Without this, Next.js can silently
// pre-render a GET handler with no request-derived params ONCE at
// build time and serve that frozen snapshot forever after (this is
// exactly what broke newly-assigned executives from ever showing up).
export const dynamic = "force-dynamic";

export async function GET() {
  const session = getSession();
  return NextResponse.json({
    authenticated: !!session,
    username: session?.username || null,
  });
}
