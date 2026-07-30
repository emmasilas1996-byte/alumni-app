"use client";

import { useEffect, useState } from "react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface Due {
  dueId: number;
  amount: string;
  paymentDate: string;
  member: { firstName: string; lastName: string };
}

interface MemberOption {
  memberId: number;
  firstName: string;
  lastName: string;
}

export default function DuesPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [dues, setDues] = useState<Due[]>([]);
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPaystackForm, setShowPaystackForm] = useState(false);
  const [error, setError] = useState("");
  const [paystackError, setPaystackError] = useState("");
  const [paystackLoading, setPaystackLoading] = useState(false);

  async function load() {
    const [duesRes, membersRes] = await Promise.all([
      fetch(`/api/dues?year=${year}&month=${month}`),
      fetch("/api/members"),
    ]);
    setDues(await duesRes.json());
    setMembers(await membersRes.json());
  }

  useEffect(() => {
    load();
  }, [year, month]);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    formData.set("dueYear", String(year));
    formData.set("dueMonth", String(month));
    const res = await fetch("/api/dues", { method: "POST", body: formData });
    if (res.status === 401) {
      setError("Sign in required to add a payment.");
      return;
    }
    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Could not save payment.");
      return;
    }
    setShowForm(false);
    (e.target as HTMLFormElement).reset();
    load();
  }

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
        purpose: "dues",
        dueYear: year,
        dueMonth: month,
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

  const years = Array.from({ length: 6 }, (_, i) => now.getFullYear() - i);
  const total = dues.reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div>
      <h1 className="font-display text-[26px] font-semibold mb-1">Monthly Dues</h1>
      <p className="text-sm text-gray-500 mb-4">Only module filtered by year and month.</p>

      <div className="flex gap-3 mb-4">
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="border rounded px-3 py-2">
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="border rounded px-3 py-2">
          {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
        </select>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <button
          onClick={() => { setShowPaystackForm((s) => !s); setShowForm(false); }}
          className="bg-emerald-600 text-white px-4 py-2 rounded text-sm"
        >
          {showPaystackForm ? "Cancel" : "💳 Pay via Paystack"}
        </button>
        <button
          onClick={() => { setShowForm((s) => !s); setShowPaystackForm(false); }}
          className="bg-navy text-white px-4 py-2 rounded text-sm"
        >
          {showForm ? "Cancel" : "+ Manual / Cash (login required)"}
        </button>
        <a
          href={`/api/dues/export?year=${year}&month=${month}`}
          className="border border-navy text-navy px-4 py-2 rounded text-sm"
        >
          ⬇ Export This Month as PDF
        </a>
      </div>

      {showPaystackForm && (
        <form onSubmit={handlePayViaPaystack} className="bg-white border border-line rounded-2xl p-4 mb-6 space-y-3">
          {paystackError && <div className="text-sm text-red-600">{paystackError}</div>}
          <p className="text-xs text-gray-500">
            No sign-in needed — the member pays directly, and Paystack confirms the payment automatically.
          </p>
          <select name="memberId" required className="border rounded px-3 py-2 w-full">
            <option value="">Select member...</option>
            {members.map((m) => (
              <option key={m.memberId} value={m.memberId}>{m.firstName} {m.lastName}</option>
            ))}
          </select>
          <input name="amount" type="number" step="0.01" placeholder="Amount (NGN)" required className="border rounded px-3 py-2 w-full" />
          <button type="submit" disabled={paystackLoading} className="bg-emerald-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50">
            {paystackLoading ? "Redirecting to Paystack..." : "Continue to Paystack"}
          </button>
        </form>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white border border-line rounded-2xl p-4 mb-6 space-y-3">
          {error && <div className="text-sm text-red-600">{error}</div>}
          <select name="memberId" required className="border rounded px-3 py-2 w-full">
            <option value="">Select member...</option>
            {members.map((m) => (
              <option key={m.memberId} value={m.memberId}>{m.firstName} {m.lastName}</option>
            ))}
          </select>
          <input name="amount" type="number" step="0.01" placeholder="Amount" required className="border rounded px-3 py-2 w-full" />
          <label className="text-sm text-gray-600 block">
            Receipt (encrypted on upload)
            <input name="receipt" type="file" accept="image/*,.pdf" className="block mt-1" />
          </label>
          <button type="submit" className="bg-navy text-white px-4 py-2 rounded text-sm">Save Payment</button>
        </form>
      )}

      <div className="bg-white border border-line rounded-2xl divide-y">
        {dues.map((d) => (
          <div key={d.dueId} className="flex justify-between p-3 text-sm">
            <span>{d.member.firstName} {d.member.lastName}</span>
            <span>NGN {Number(d.amount).toLocaleString()}</span>
            <span className="text-gray-400">{d.paymentDate.slice(0, 10)}</span>
          </div>
        ))}
        {dues.length === 0 && <div className="p-4 text-sm text-gray-500">No payments recorded for {MONTHS[month - 1]} {year}.</div>}
      </div>

      <div className="text-right font-semibold mt-3">Total: NGN {total.toLocaleString()}</div>
    </div>
  );
}
