import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decryptBuffer, decryptText } from "@/lib/crypto";
import { sendBirthdayEmail } from "@/lib/email";

// GET /api/cron/birthday — call this once a day from a free external
// scheduler (e.g. cron-job.org or a GitHub Actions scheduled workflow),
// since there's no paid "always-on" server to run node-cron on.
// Protect with CRON_SECRET so randoms can't trigger mass emails.
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // SQL Server has no simple MONTH()/DAY() filter in Prisma's query builder,
  // so pull everyone with an email and filter in JS. Fine at alumni-association scale.
  const members = await prisma.member.findMany({
    where: { emailEncrypted: { not: null } },
    select: {
      memberId: true,
      firstName: true,
      dateOfBirth: true,
      emailEncrypted: true,
      photoData: true,
      photoContentType: true,
    },
  });

  const celebrants = members.filter((m: { dateOfBirth: string | Date }) => {
    const dob = new Date(m.dateOfBirth);
    return dob.getMonth() + 1 === month && dob.getDate() === day;
  });

  let sent = 0;
  for (const m of celebrants) {
    try {
      const email = decryptText(Buffer.from(m.emailEncrypted!));
      const photoBuffer = m.photoData ? decryptBuffer(Buffer.from(m.photoData)) : null;

      await sendBirthdayEmail({
        toEmail: email,
        firstName: m.firstName,
        photoBuffer,
        photoContentType: m.photoContentType,
      });

      await prisma.emailLog.create({
        data: { memberId: m.memberId, emailType: "Birthday", status: "Sent" },
      });
      sent++;
    } catch (err) {
      await prisma.emailLog.create({
        data: { memberId: m.memberId, emailType: "Birthday", status: "Failed" },
      });
    }
  }

  return NextResponse.json({ celebrantsToday: celebrants.length, sent });
}
