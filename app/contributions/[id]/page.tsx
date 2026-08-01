"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface Payment {
  paymentId: number;
  amount: string;
  paymentDate: string;
  member: { firstName: string; lastName: string };
}

interface ContributionDetail {
  contributionId: number;
  title: string;
  description: string | null;
  payments: Payment[];
}

interface MemberOption {
  memberId: number;
  firstName: string;
  lastName: string;
}

interface ReleaseLine {
  releaseId: number;
  amountReleased: string;
  purpose: string;
  releaseDate: string;
  hasReceipt: boolean;
}

interface ReleasesData {
  balanceAvailable: number;
  totalPaid: number;
  totalReleased: number;
  releases: ReleaseLine[];
}

export default function ContributionDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContributionDetailPageContent params={params} />
    </Suspense>
  );
}

function ContributionDetailPageContent({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const [data, setData] = useState<ContributionDetail | null>(null);
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [releases, setReleases] = useState<ReleasesData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showPaystackForm, setShowPaystackForm] = useState(false);
  const [showReleaseForm, setShowReleaseForm] = useState(false);
  const [error, setError] = useState("");
  const [paystackError, setPaystackError] = useState("");
  const [paystackLoading, setPaystackLoading] = useState(false);
  const [releaseError, setReleaseError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const body = await res.json();
          setAuthenticated(!!body.authenticated);
        }
      } catch (err) {
        console.error("Failed to check auth session", err);
      }
    })();
  }, []);

  async function load() {
    const [detailRes, membersRes, releasesRes] = await Promise.all([
      fetch(`/api/contributions/${params.id}`),
      fetch("/api/members"),
      fetch(`/api/contributions/${params.id}/releases`),
    ]);
    setData(await detailRes.json());
    setMembers(await membersRes.json());
    setReleases(await releasesRes.json());
  }

  useEffect(() => {
    load();
  }, [params.id]);

  useEffect(() => {
    const reference = searchParams.get("reference");
    const paystackStatus = searchParams.get("paystack");

    if (!reference || paystackStatus !== "pending") {
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch("/api/payments/paystack/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });
        const body = await res.json();
        if (res.ok && body.recorded) {
          await load();
        }
      } catch (err) {
        console.error("Paystack verification failed", err);
      }
    };

    verifyPayment();
  }, [searchParams]);

  async function handlePayViaPaystack(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPaystackError("");
    setPaystackLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/payments/paystack/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        memberId: Number(formData.get("memberId")),
        amount: Number(formData.get("amount")),
        purpose: "contribution",
        contributionId: Number(params.id),
      }),
    });
    setPaystackLoading(false);
    const body = await res.json();
    if (!res.ok) {
      setPaystackError(body.error || "Could not start Paystack payment.");
      return;
    }
    window.location.href = body.authorizationUrl;
  }

  async function handleAddPayer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const res = await fetch(`/api/contributions/${params.id}/payments`, {
      method: "POST",
      body: formData,
    });
    if (res.status === 401) {
      setError("Sign in required to add a payer.");
      return;
    }
    setShowForm(false);
    (e.target as HTMLFormElement).reset();
    setAuthenticated(false);
    load();
  }

  async function handleRelease(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setReleaseError("");
    const formData = new FormData(e.currentTarget);
    const res = await fetch(`/api/contributions/${params.id}/releases`, {
      method: "POST",
      body: formData,
    });
    if (res.status === 401) {
      setReleaseError("Sign in required to release funds.");
      return;
    }
    if (!res.ok) {
      const body = await res.json();
      setReleaseError(body.error || "Could not release funds.");
      return;
    }
    setShowReleaseForm(false);
    (e.target as HTMLFormElement).reset();
    setAuthenticated(false);
    load();
  }

  if (!data) return <div>Loading...</div>;

  const total = data.payments.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div>
      <h1 className="font-display text-[26px] font-semibold mb-1">{data.title}</h1>
      {data.description && <p className="text-sm text-gray-500 mb-4">{data.description}</p>}

      <div className="flex gap-3 mb-4 flex-wrap">
        <button
          onClick={() => { setShowPaystackForm((s) => !s); setShowForm(false); setShowReleaseForm(false); }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          {showPaystackForm ? "Cancel" : "💳 Pay via Paystack"}
        </button>
        <button
          onClick={() => {
            if (!authenticated) {
              router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
              return;
            }
            setShowForm((s) => !s);
            setShowPaystackForm(false);
            setShowReleaseForm(false);
          }}
          className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          {showForm ? "Cancel" : "+ Manual / Cash (login required)"}
        </button>
        <a
          href={`/api/contributions/${params.id}/export`}
          className="border border-navy text-navy px-4 py-2 rounded-lg text-sm font-medium"
        >
          ⬇ Export as PDF
        </a>
      </div>

      {showPaystackForm && (
        <form onSubmit={handlePayViaPaystack} className="bg-white border border-line rounded-2xl p-4 mb-6 space-y-3">
          {paystackError && <div className="text-sm text-red-600">{paystackError}</div>}
          <p className="text-xs text-gray-500">No sign-in needed — Paystack confirms the payment automatically.</p>
          <select name="memberId" required className="border border-line rounded-lg px-3 py-2 w-full">
            <option value="">Select member...</option>
            {members.map((m) => (
              <option key={m.memberId} value={m.memberId}>{m.firstName} {m.lastName}</option>
            ))}
          </select>
          <input name="amount" type="number" step="0.01" placeholder="Amount (NGN)" required className="border border-line rounded-lg px-3 py-2 w-full" />
          <button type="submit" disabled={paystackLoading} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
            {paystackLoading ? "Redirecting to Paystack..." : "Continue to Paystack"}
          </button>
        </form>
      )}

      {showForm && (
        <form onSubmit={handleAddPayer} className="bg-white border border-line rounded-2xl p-4 mb-6 space-y-3">
          {error && <div className="text-sm text-red-600">{error}</div>}
          <select name="memberId" required className="border border-line rounded-lg px-3 py-2 w-full">
            <option value="">Select member...</option>
            {members.map((m) => (
              <option key={m.memberId} value={m.memberId}>{m.firstName} {m.lastName}</option>
            ))}
          </select>
          <input name="amount" type="number" step="0.01" placeholder="Amount" required className="border border-line rounded-lg px-3 py-2 w-full" />
          <label className="text-sm text-gray-600 block">
            Receipt (encrypted on upload)
            <input name="receipt" type="file" accept="image/*,.pdf" className="block mt-1" />
          </label>
          <button type="submit" className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium">Save Payment</button>
        </form>
      )}

      <div className="bg-white border border-line rounded-2xl divide-y divide-line mb-4">
        {data.payments.map((p) => (
          <div key={p.paymentId} className="flex justify-between p-3 text-sm">
            <span>{p.member.firstName} {p.member.lastName}</span>
            <span>NGN {Number(p.amount).toLocaleString()}</span>
            <span className="text-gray-400">{p.paymentDate.slice(0, 10)}</span>
          </div>
        ))}
        {data.payments.length === 0 && <div className="p-4 text-sm text-gray-500">No payments yet.</div>}
      </div>

      <div className="text-right font-semibold mb-8">Total: NGN {total.toLocaleString()}</div>

      {/* RELEASE SECTION */}
      <div className="bg-navy rounded-2xl p-5 text-white mb-4">
        <div className="flex justify-between items-center mb-3 flex-wrap gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-gold-light font-semibold mb-1">Balance Available</div>
            <div className="font-display text-xl font-semibold">
              NGN {releases ? releases.balanceAvailable.toLocaleString() : "—"}
            </div>
          </div>
          <button
            onClick={() => { setShowReleaseForm((s) => !s); setShowForm(false); setShowPaystackForm(false); }}
            className="bg-gold text-navy px-4 py-2 rounded-lg text-sm font-semibold"
          >
            {showReleaseForm ? "Cancel" : "💸 Release Funds (login required)"}
          </button>
        </div>

        {showReleaseForm && (
          <form onSubmit={handleRelease} className="bg-white/10 rounded-xl p-4 space-y-3 mt-3">
            {releaseError && <div className="text-sm text-red-300">{releaseError}</div>}
            <input name="amount" type="number" step="0.01" placeholder="Amount to release (NGN)" required className="w-full rounded-lg px-3 py-2 text-ink" />
            <input name="purpose" placeholder="Purpose (e.g. Venue deposit)" required className="w-full rounded-lg px-3 py-2 text-ink" />
            <label className="text-xs text-white/80 block">
              Release receipt (encrypted on upload)
              <input name="receipt" type="file" accept="image/*,.pdf" className="block mt-1 text-white" />
            </label>
            <button type="submit" className="bg-gold text-navy px-4 py-2 rounded-lg text-sm font-semibold">Confirm Release</button>
          </form>
        )}

        {releases && releases.releases.length > 0 && (
          <div className="mt-4 space-y-2">
            {releases.releases.map((r) => (
              <div key={r.releaseId} className="flex justify-between items-center text-sm border-t border-white/10 pt-2">
                <div>
                  <div>{r.purpose}</div>
                  <div className="text-xs text-white/50">{r.releaseDate.slice(0, 10)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gold-light">NGN {Number(r.amountReleased).toLocaleString()}</span>
                  {r.hasReceipt && (
                    <a href={`/api/releases/${r.releaseId}/receipt`} target="_blank" className="text-xs underline text-white/70">
                      📎
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
