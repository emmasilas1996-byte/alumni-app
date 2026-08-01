"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Contribution {
  contributionId: number;
  title: string;
  description: string | null;
  _count: { payments: number };
}

export default function ContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/contributions");
    setContributions(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/contributions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    if (res.status === 401) {
      router.push(`/login?redirect=${encodeURIComponent("/contributions")}`);
      return;
    }
    setShowForm(false);
    setTitle("");
    setDescription("");
    load();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h1 className="font-display text-[26px] font-semibold">Contributions</h1>
        <button onClick={() => setShowForm((s) => !s)} className="bg-navy text-white px-4 py-2 rounded text-sm">
          {showForm ? "Cancel" : "+ New Contribution"}
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-4">Static list — not filtered by year or month.</p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🔍 Search contributions by title or description..."
        className="border border-line rounded-lg px-3 py-2 w-full text-sm mb-4"
      />

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-line rounded-2xl p-4 mb-6 space-y-3">
          {error && <div className="text-sm text-red-600">{error} <Link href="/login" className="underline">Sign in</Link></div>}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contribution title (e.g. Building Fund 2026)"
            required
            className="border rounded px-3 py-2 w-full"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="border rounded px-3 py-2 w-full"
          />
          <button type="submit" className="bg-navy text-white px-4 py-2 rounded text-sm">Create</button>
        </form>
      )}

      <div className="bg-white border border-line rounded-2xl divide-y">
        {contributions
          .filter((c) => {
            const q = query.trim().toLowerCase();
            if (!q) return true;
            return c.title.toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q);
          })
          .map((c) => (
          <Link
            key={c.contributionId}
            href={`/contributions/${c.contributionId}`}
            className="block p-4 hover:bg-gray-50"
          >
            <div className="font-medium">{c.title}</div>
            <div className="text-xs text-gray-500">{c._count.payments} payer(s)</div>
          </Link>
        ))}
        {contributions.length === 0 && <div className="p-4 text-sm text-gray-500">No contributions yet.</div>}
      </div>
    </div>
  );
}
