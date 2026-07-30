"use client";

import { useEffect, useState } from "react";

interface ReleaseLine {
  releaseId: number;
  amountReleased: number;
  purpose: string;
  releaseDate: string;
  hasReceipt: boolean;
}

interface Category {
  contributionId: number;
  title: string;
  totalReleased: number;
  releases: ReleaseLine[];
}

export default function ReleasedFundsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/releases").then((r) => r.json()).then(setCategories);
  }, []);

  const active = categories.find((c) => c.contributionId === activeId);

  return (
    <div>
      <h1 className="font-display text-[26px] font-semibold mb-1">Released Funds</h1>
      <p className="text-[13.5px] text-gray-500 mb-6">Grouped by contribution category</p>

      <div className="bg-white border border-line rounded-2xl divide-y divide-line mb-6">
        {categories.map((c) => (
          <button
            key={c.contributionId}
            onClick={() => setActiveId(activeId === c.contributionId ? null : c.contributionId)}
            className="w-full text-left p-4 flex justify-between items-center hover:bg-ivory transition-colors"
          >
            <span className="font-medium">{c.title}</span>
            <span className="font-display font-semibold text-navy">NGN {c.totalReleased.toLocaleString()}</span>
          </button>
        ))}
        {categories.length === 0 && (
          <div className="p-4 text-sm text-gray-500">No funds released yet.</div>
        )}
      </div>

      {active && (
        <div className="bg-white border border-line rounded-2xl p-5">
          <div className="font-display text-lg font-semibold mb-3">{active.title} — Releases</div>
          <div className="space-y-2">
            {active.releases.map((r) => (
              <div key={r.releaseId} className="flex justify-between items-center text-sm border-b border-line last:border-0 pb-2 last:pb-0">
                <div>
                  <div className="font-medium">{r.purpose}</div>
                  <div className="text-xs text-gray-400">{r.releaseDate.slice(0, 10)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">NGN {r.amountReleased.toLocaleString()}</span>
                  {r.hasReceipt && (
                    <a href={`/api/releases/${r.releaseId}/receipt`} target="_blank" className="text-xs text-navy underline">
                      📎 Receipt
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
