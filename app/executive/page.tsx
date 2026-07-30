"use client";

import { useEffect, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";

interface Member {
  memberId: number;
  firstName: string;
  lastName: string;
  isExecutive: boolean;
  executiveTitle: string | null;
}

export default function ExecutivePage() {
  const [execs, setExecs] = useState<Member[]>([]);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [title, setTitle] = useState("");
  const [deleteExecId, setDeleteExecId] = useState<number | null>(null);

  async function load() {
    const [execRes, memberRes] = await Promise.all([
      fetch("/api/executives"),
      fetch("/api/members"),
    ]);
    setExecs(await execRes.json());
    setAllMembers(await memberRes.json());
  }

  useEffect(() => {
    load();
  }, []);

  const nonExecMembers = allMembers.filter((m) => !m.isExecutive);

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMemberId) return;
    await fetch(`/api/members/${selectedMemberId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isExecutive: true, executiveTitle: title || "Executive" }),
    });
    setSelectedMemberId("");
    setTitle("");
    load();
  }

  function confirmRemove(memberId: number) {
    setDeleteExecId(memberId);
  }

  async function handleRemove() {
    if (deleteExecId === null) return;
    await fetch(`/api/members/${deleteExecId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isExecutive: false, executiveTitle: null }),
    });
    setDeleteExecId(null);
    load();
  }

  return (
    <div>
      <h1 className="font-display text-[26px] font-semibold mb-1">Executive</h1>
      <p className="text-sm text-gray-500 mb-4">Filtered from Members — only executives shown here.</p>

      <form onSubmit={handleAssign} className="bg-white border border-line rounded-2xl p-4 mb-6 flex gap-3 items-end flex-wrap">
        <label className="text-sm text-gray-600">
          Member
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="border rounded px-3 py-2 block mt-1"
          >
            <option value="">Select a member...</option>
            {nonExecMembers.map((m) => (
              <option key={m.memberId} value={m.memberId}>
                {m.firstName} {m.lastName}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-gray-600">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. President"
            className="border rounded px-3 py-2 block mt-1"
          />
        </label>
        <button type="submit" className="bg-navy text-white px-4 py-2 rounded text-sm">
          + Add Executive
        </button>
      </form>

      <div className="bg-white border border-line rounded-2xl divide-y">
        {execs.map((m) => (
          <div key={m.memberId} className="flex items-center gap-3 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/members/${m.memberId}/photo`}
              alt={m.firstName}
              className="w-10 h-10 rounded-full object-cover bg-gray-200"
              onError={(e) => ((e.target as HTMLImageElement).style.visibility = "hidden")}
            />
            <div className="flex-1">
              <div className="font-medium">{m.firstName} {m.lastName}</div>
              <div className="text-xs text-gray-500">{m.executiveTitle}</div>
            </div>
            <button onClick={() => confirmRemove(m.memberId)} className="text-sm text-red-600">
              Remove
            </button>
          </div>
        ))}
        {execs.length === 0 && <div className="p-4 text-sm text-gray-500">No executives assigned yet.</div>}
      </div>

      {deleteExecId !== null ? (
        <ConfirmModal
          title="Remove executive title"
          description="Are you sure you want to remove this member from the executive list? They will remain in Members."
          confirmLabel="Remove"
          cancelLabel="Cancel"
          onConfirm={handleRemove}
          onCancel={() => setDeleteExecId(null)}
        />
      ) : null}
    </div>
  );
}
