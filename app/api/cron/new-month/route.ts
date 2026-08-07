import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decryptText } from "@/lib/crypto";
import { sendNewMonthEmail } from "@/lib/email";

// Never statically cache this route — it reads/writes live data via
// Prisma on every request. Without this, Next.js can silently
// pre-render a GET handler with no request-derived params ONCE at
// build time and serve that frozen snapshot forever after (this is
// exactly what broke newly-assigned executives from ever showing up).
export const dynamic = "force-dynamic";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// GET /api/cron/new-month — call this daily too; it's a no-op unless
// today is the 1st of the month, so a single external scheduler covers
// both this and /api/cron/birthday.
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const today = new Date();
  if (today.getDate() !== 1) {
    return NextResponse.json({ skipped: true, reason: "Not the 1st of the month." });
  }

  const monthName = MONTH_NAMES[today.getMonth()];
  const members = await prisma.member.findMany({
    where: { emailEncrypted: { not: null } },
    select: { memberId: true, firstName: true, emailEncrypted: true },
  });

  let sent = 0;
  for (const m of members) {
    try {
      const email = decryptText(Buffer.from(m.emailEncrypted!));
      await sendNewMonthEmail({ toEmail: email, firstName: m.firstName, monthName });
      await prisma.emailLog.create({
        data: { memberId: m.memberId, emailType: "NewMonth", status: "Sent" },
      });
      sent++;
    } catch {
      await prisma.emailLog.create({
        data: { memberId: m.memberId, emailType: "NewMonth", status: "Failed" },
      });
    }
  }

  return NextResponse.json({ month: monthName, sent });
}
