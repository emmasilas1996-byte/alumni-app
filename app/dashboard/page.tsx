"use client";

import { useEffect, useState } from "react";

interface Contributor {
  memberId: number;
  name: string;
  total: number;
}

interface BirthdayMember {
  memberId: number;
  firstName: string;
  lastName: string;
  occupation?: string | null;
  location?: string | null;
}

interface DashboardData {
  year: number;
  totalMembers: number;
  totalContributions: number;
  totalMonthlyDues: number;
  totalReleased: number;
  topContributors: Contributor[];
  todaysBirthdays: BirthdayMember[];
}

const MEDALS = ["🥇", "🥈", "🥉"];

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function DashboardPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLogo, setHasLogo] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetch(`/api/dashboard?year=${year}`)
      .then(async (response) => {
        if (!response.ok) {
          const message = await response.text();
          throw new Error(`Failed to load dashboard data: ${response.status} ${response.statusText} ${message}`);
        }
        return response.json();
      })
      .then((payload: DashboardData) => setData(payload))
      .catch((err) => setError(err.message || "Unable to fetch dashboard data."))
      .finally(() => setIsLoading(false));
  }, [year]);

  const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div>
      <div className="flex justify-between items-end mb-7 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-[30px] font-semibold mb-1">Dashboard</h1>
          <p className="text-[13.5px] text-gray-500">Year-by-year overview of membership and finances</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-500">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 bg-white text-sm"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {data?.todaysBirthdays.length ? (
        <div className="mb-6 overflow-hidden rounded-2xl border border-line bg-slate-50 px-4 py-3">
          <div className="birthday-marquee overflow-hidden whitespace-nowrap text-sm text-navy">
            <div className="animate-marquee inline-flex items-center gap-6">
              {data.todaysBirthdays.map((member, index) => (
                <span key={member.memberId} className="inline-flex gap-1 items-center">
                  🎉 <span className="font-medium">Happy birthday to {member.firstName} {member.lastName}</span>
                  {member.occupation || member.location
                    ? ` — ${[member.occupation, member.location].filter(Boolean).join(", ")}`
                    : ""}
                  {index < data.todaysBirthdays.length - 1 ? "•" : ""}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {hasLogo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/api/settings/logo"
          alt="NEMSS logo"
          className="h-12 mb-6"
          onError={() => setHasLogo(false)}
        />
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-line bg-white p-6 text-sm text-gray-600">Loading dashboard data…</div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">{error}</div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="stat-card bg-white border border-line rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all">
              <div className="text-[11.5px] uppercase tracking-wide text-gray-500 font-semibold mb-2">Total Members</div>
              <div className="font-display text-[26px] font-semibold text-navy">{data.totalMembers}</div>
            </div>
            <div className="stat-card bg-white border border-line rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all">
              <div className="text-[11.5px] uppercase tracking-wide text-gray-500 font-semibold mb-2">Total Contributions</div>
              <div className="font-display text-[26px] font-semibold text-navy">NGN {data.totalContributions.toLocaleString()}</div>
            </div>
            <div className="stat-card bg-white border border-line rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all">
              <div className="text-[11.5px] uppercase tracking-wide text-gray-500 font-semibold mb-2">Total Monthly Dues</div>
              <div className="font-display text-[26px] font-semibold text-navy">NGN {data.totalMonthlyDues.toLocaleString()}</div>
            </div>
          </div>

          <div className="stat-card bg-white border border-line rounded-2xl p-5 mb-4">
            <div className="text-[11.5px] uppercase tracking-wide text-gray-500 font-semibold mb-2">Total Amount Released</div>
            <div className="font-display text-[26px] font-semibold text-navy">NGN {data.totalReleased.toLocaleString()}</div>
          </div>

          <div className="bg-navy rounded-2xl p-6 text-white" style={{ backgroundImage: "radial-gradient(circle at 100% 0%, rgba(200,153,46,0.25), transparent 55%)" }}>
            <div className="text-[11px] uppercase tracking-wide text-gold-light font-semibold mb-4">Top Contributors</div>
            {data.topContributors.length === 0 && (
              <div className="text-sm text-white/70">No contributions recorded for this year yet.</div>
            )}
            <div className="space-y-3">
              {data.topContributors.map((c, i) => (
                <div key={c.memberId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold to-[#a5741f] flex items-center justify-center font-display font-semibold text-[15px]">
                      {initials(c.name)}
                    </div>
                    <div>
                      <div className="text-[11px] text-gold-light">{MEDALS[i]} {i === 0 ? "1st" : i === 1 ? "2nd" : "3rd"}</div>
                      <div className="font-display text-[16px] font-semibold">{c.name}</div>
                    </div>
                  </div>
                  <div className="font-display text-[18px] font-bold text-gold-light">NGN {c.total.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-line bg-white p-6 text-sm text-gray-600">No dashboard data is available.</div>
      )}
    </div>
  );
}
