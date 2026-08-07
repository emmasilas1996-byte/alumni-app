import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Never statically cache this route — it reads/writes live data via
// Prisma on every request. Without this, Next.js can silently
// pre-render a GET handler with no request-derived params ONCE at
// build time and serve that frozen snapshot forever after (this is
// exactly what broke newly-assigned executives from ever showing up).
export const dynamic = "force-dynamic";

// GET /api/dashboard?year=2026
export async function GET(req: NextRequest) {
  const year = Number(req.nextUrl.searchParams.get("year")) || new Date().getFullYear();
  const yearStart = new Date(`${year}-01-01`);
  const yearEnd = new Date(`${year}-12-31T23:59:59`);

  const today = new Date();
  const todayMonth = today.getMonth() + 1; // JS getMonth() is 0-indexed
  const todayDay = today.getDate();

  // Every query below is independent of the others, so they run in
  // parallel instead of one-after-another — this was previously ~9
  // sequential round trips to the database on every single Dashboard
  // load, which is exactly the kind of thing that makes a page feel
  // slow to open.
  const [
    totalMembers,
    contributionAgg,
    duesAgg,
    releasedAgg,
    todaysBirthdaysRaw,
    contribByMember,
    duesByMember,
    allTimeContributions,
    allTimeReleased,
  ] = await Promise.all([
    prisma.member.count(),
    prisma.contributionPayment.aggregate({
      where: { paymentDate: { gte: yearStart, lte: yearEnd } },
      _sum: { amount: true },
    }),
    prisma.monthlyDue.aggregate({
      where: { dueYear: year },
      _sum: { amount: true },
    }),
    prisma.contributionRelease.aggregate({
      where: { releaseDate: { gte: yearStart, lte: yearEnd } },
      _sum: { amountReleased: true },
    }),
    // Filtered in the database via raw SQL month/day match instead of
    // pulling every member's full record into memory and filtering in
    // JS — scales far better as the member list grows.
    prisma.$queryRaw<
      { memberId: number; firstName: string; lastName: string; occupation: string | null; location: string | null }[]
    >`
      SELECT MemberId as memberId, FirstName as firstName, LastName as lastName, Occupation as occupation, Location as location
      FROM Members
      WHERE MONTH(DateOfBirth) = ${todayMonth} AND DAY(DateOfBirth) = ${todayDay}
    `,
    prisma.contributionPayment.groupBy({
      by: ["memberId"],
      where: { paymentDate: { gte: yearStart, lte: yearEnd } },
      _sum: { amount: true },
    }),
    prisma.monthlyDue.groupBy({
      by: ["memberId"],
      where: { dueYear: year },
      _sum: { amount: true },
    }),
    prisma.contributionPayment.aggregate({ _sum: { amount: true } }),
    prisma.contributionRelease.aggregate({ _sum: { amountReleased: true } }),
  ]);

  const todaysBirthdays = todaysBirthdaysRaw.map((m) => ({
    memberId: m.memberId,
    firstName: m.firstName,
    lastName: m.lastName,
    occupation: m.occupation,
    location: m.location,
  }));

  // Top 3 contributors: sum contribution + dues payments per member for the year
  const totals = new Map<number, number>();
  for (const c of contribByMember) {
    totals.set(c.memberId, (totals.get(c.memberId) || 0) + Number(c._sum.amount || 0));
  }
  for (const d of duesByMember) {
    totals.set(d.memberId, (totals.get(d.memberId) || 0) + Number(d._sum.amount || 0));
  }

  const ranked = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);

  // One batched query for all top-contributor names instead of a loop
  // of separate findUnique calls (previously up to 3 extra sequential
  // round trips just to look up names).
  const topMemberIds = ranked.map(([memberId]) => memberId);
  const topMembers: { memberId: number; firstName: string; lastName: string }[] = topMemberIds.length
    ? await prisma.member.findMany({
        where: { memberId: { in: topMemberIds } },
        select: { memberId: true, firstName: true, lastName: true },
      })
    : [];
  const topMemberById = new Map<number, { memberId: number; firstName: string; lastName: string }>(
    topMembers.map((m) => [m.memberId, m])
  );

  const topContributors = ranked
    .map(([memberId, total]) => {
      const member = topMemberById.get(memberId);
      if (!member) return null;
      return { memberId, name: `${member.firstName} ${member.lastName}`, total };
    })
    .filter((x): x is { memberId: number; name: string; total: number } => x !== null);

  // "Net Available Balance" mirrors what a real bank balance represents —
  // a running total, not scoped to one year (a contribution collected in
  // one year could be released in a later year).
  const netAvailableBalance =
    Number(allTimeContributions._sum.amount || 0) - Number(allTimeReleased._sum.amountReleased || 0);

  return NextResponse.json({
    year,
    totalMembers,
    totalContributions: Number(contributionAgg._sum.amount || 0),
    totalMonthlyDues: Number(duesAgg._sum.amount || 0),
    totalReleased: Number(releasedAgg._sum.amountReleased || 0),
    netAvailableBalance,
    topContributors,
    todaysBirthdays,
  });
}
