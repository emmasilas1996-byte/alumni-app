"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

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

function DuesPageContent() {
  const now = new Date();
  const searchParams = useSearchParams();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [dues, setDues] = useState<Due[]>([]);
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPaystackForm, setShowPaystackForm] = useState(false);
  const [error, setError] = useState("");
  const [paystackError, setPaystackError] = useState("");
  const [paystackLoading, setPaystackLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImporting, setBulkImporting] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ imported: number; skipped: number; errors: string[] } | null>(null);
  const [bulkError, setBulkError] = useState("");
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

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    formData.set("dueYear", String(year));
    formData.set("dueMonth", String(month));
    const res = await fetch("/api/dues", { method: "POST", body: formData });
    if (res.status === 401) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Could not save payment.");
      return;
    }
    setShowForm(false);
    (e.target as HTMLFormElement).reset();
    setAuthenticated(false);
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

  async function handleBulkImport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBulkError("");
    setBulkResult(null);
    setBulkImporting(true);
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/dues/bulk-import", { method: "POST", body: formData });
    setBulkImporting(false);
    if (res.status === 401) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    const body = await res.json();
    if (!res.ok) {
      setBulkError(body.error || "Could not process the CSV file.");
      return;
    }
    setBulkResult(body);
    (e.target as HTMLFormElement).reset();
    setAuthenticated(false);
    load();
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
          onClick={() => {
            if (!authenticated) {
              router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
              return;
            }
            setShowForm((s) => !s);
            setShowPaystackForm(false);
          }}
          className="bg-navy text-white px-4 py-2 rounded text-sm"
        >
          {showForm ? "Cancel" : "+ Manual / Cash (login required)"}
        </button>
        <button
          onClick={() => {
            if (!authenticated) {
              router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
              return;
            }
            setShowBulkImport((s) => !s);
            setShowForm(false);
            setShowPaystackForm(false);
          }}
          className="border border-navy text-navy px-4 py-2 rounded text-sm"
        >
          {showBulkImport ? "Cancel" : "📤 Upload Historical Dues (CSV, login required)"}
        </button>
        <a
          href={`/api/dues/export?year=${year}&month=${month}`}
          className="border border-navy text-navy px-4 py-2 rounded text-sm"
        >
          ⬇ Export This Month as PDF
        </a>
      </div>

      {showBulkImport && (
        <form onSubmit={handleBulkImport} className="bg-white border border-line rounded-2xl p-4 mb-6 space-y-3">
          {bulkError && <div className="text-sm text-red-600">{bulkError}</div>}
          <p className="text-xs text-gray-500">
            For recording dues collected in past years before this app existed. Upload a CSV with columns:{" "}
            <code className="bg-gray-100 px-1 rounded">FirstName,LastName,Year,Month,Amount</code>{" "}
            (optionally add <code className="bg-gray-100 px-1 rounded">PaymentDate</code> as YYYY-MM-DD).
            Names must match existing Members exactly.
          </p>
          <input
            name="file"
            type="file"
            accept=".csv,text/csv"
            required
            className="block text-sm"
          />
          <button
            type="submit"
            disabled={bulkImporting}
            className="bg-navy text-white px-4 py-2 rounded text-sm disabled:opacity-50"
          >
            {bulkImporting ? "Importing..." : "Upload and Import"}
          </button>

          {bulkResult && (
            <div className="mt-3 text-sm bg-ivory rounded-lg p-3">
              <div className="font-medium mb-1">
                ✅ {bulkResult.imported} imported, ⚠️ {bulkResult.skipped} skipped
              </div>
              {bulkResult.errors.length > 0 && (
                <ul className="text-xs text-gray-600 space-y-0.5 list-disc pl-4 max-h-40 overflow-y-auto">
                  {bulkResult.errors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              )}
            </div>
          )}
        </form>
      )}

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

export default function DuesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DuesPageContent />
    </Suspense>
  );
}
