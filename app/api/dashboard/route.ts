import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/dashboard?year=2026
export async function GET(req: NextRequest) {
  const year = Number(req.nextUrl.searchParams.get("year")) || new Date().getFullYear();

  const totalMembers = await prisma.member.count();

  const yearStart = new Date(`${year}-01-01`);
  const yearEnd = new Date(`${year}-12-31T23:59:59`);

  const contributionAgg = await prisma.contributionPayment.aggregate({
    where: { paymentDate: { gte: yearStart, lte: yearEnd } },
    _sum: { amount: true },
  });

  const duesAgg = await prisma.monthlyDue.aggregate({
    where: { dueYear: year },
    _sum: { amount: true },
  });

  const releasedAgg = await prisma.contributionRelease.aggregate({
    where: { releaseDate: { gte: yearStart, lte: yearEnd } },
    _sum: { amountReleased: true },
  });

  const today = new Date();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();
  const todaysBirthdays = (await prisma.member.findMany({
    select: {
      memberId: true,
      firstName: true,
      lastName: true,
      occupation: true,
      location: true,
      dateOfBirth: true,
    },
  }))
    .filter((member) => {
      const dob = new Date(member.dateOfBirth);
      return dob.getMonth() === todayMonth && dob.getDate() === todayDay;
    })
    .map((member) => ({
      memberId: member.memberId,
      firstName: member.firstName,
      lastName: member.lastName,
      occupation: member.occupation,
      location: member.location,
    }));

  // Top 3 contributors: sum contribution + dues payments per member for the year
  const contribByMember = await prisma.contributionPayment.groupBy({
    by: ["memberId"],
    where: { paymentDate: { gte: yearStart, lte: yearEnd } },
    _sum: { amount: true },
  });
  const duesByMember = await prisma.monthlyDue.groupBy({
    by: ["memberId"],
    where: { dueYear: year },
    _sum: { amount: true },
  });

  const totals = new Map<number, number>();
  for (const c of contribByMember) {
    totals.set(c.memberId, (totals.get(c.memberId) || 0) + Number(c._sum.amount || 0));
  }
  for (const d of duesByMember) {
    totals.set(d.memberId, (totals.get(d.memberId) || 0) + Number(d._sum.amount || 0));
  }

  const ranked = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  const topContributors: { memberId: number; name: string; total: number }[] = [];
  for (const [memberId, total] of ranked) {
    const member = await prisma.member.findUnique({
      where: { memberId },
      select: { firstName: true, lastName: true },
    });
    if (member) {
      topContributors.push({ memberId, name: `${member.firstName} ${member.lastName}`, total });
    }
  }

  // "Net Available Balance" mirrors what a real bank balance represents —
  // a running total, not scoped to one year (a contribution collected in
  // one year could be released in a later year). Computed all-time here,
  // separate from the year-filtered cards above.
  const allTimeContributions = await prisma.contributionPayment.aggregate({
    _sum: { amount: true },
  });
  const allTimeReleased = await prisma.contributionRelease.aggregate({
    _sum: { amountReleased: true },
  });
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
