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
  const [editingExec, setEditingExec] = useState<Member | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [replacementMemberId, setReplacementMemberId] = useState("");
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [editError, setEditError] = useState("");
  const [loaded, setLoaded] = useState(false);

  async function load() {
    const [execRes, memberRes] = await Promise.all([
      fetch("/api/executives"),
      fetch("/api/members"),
    ]);
    setExecs(await execRes.json());
    setAllMembers(await memberRes.json());
  }

  useEffect(() => {
    (async () => {
      await load();
      setLoaded(true);
    })();
  }, []);

  const nonExecMembers = allMembers.filter((m) => !m.isExecutive);
  const replacementCandidates = allMembers.filter((m) => m.memberId !== editingExec?.memberId && !m.isExecutive);

  // Executive assign/remove is intentionally NOT login-gated — matches
  // the app's original design (only financial actions like Add
  // Contribution / Add Dues, plus Member Edit and Constitution Amend,
  // require sign-in). Every request below still checks the response
  // and surfaces a real error instead of silently doing nothing if it
  // fails, which is what masked the underlying bug here before.

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMemberId) return;
    setAssignError("");

    try {
      const res = await fetch(`/api/members/${selectedMemberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isExecutive: true, executiveTitle: title || "Executive" }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setAssignError(body.error || `Could not add executive (status ${res.status}).`);
        return;
      }

      setSelectedMemberId("");
      setTitle("");
      await load();
    } catch {
      setAssignError("Network error — could not reach the server.");
    }
  }

  function openEditExec(member: Member) {
    setEditingExec(member);
    setEditTitle(member.executiveTitle || "");
    setReplacementMemberId("");
    setEditError("");
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingExec) return;
    setEditError("");

    try {
      if (replacementMemberId) {
        const removeRes = await fetch(`/api/members/${editingExec.memberId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isExecutive: false, executiveTitle: null }),
        });
        if (!removeRes.ok) {
          const body = await removeRes.json().catch(() => ({}));
          setEditError(body.error || "Could not remove the current executive.");
          return;
        }

        const assignRes = await fetch(`/api/members/${replacementMemberId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isExecutive: true, executiveTitle: editTitle || "Executive" }),
        });
        if (!assignRes.ok) {
          const body = await assignRes.json().catch(() => ({}));
          setEditError(body.error || "Could not assign the replacement executive.");
          return;
        }
      } else {
        const res = await fetch(`/api/members/${editingExec.memberId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isExecutive: true, executiveTitle: editTitle || "Executive" }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setEditError(body.error || "Could not update executive details.");
          return;
        }
      }

      setEditingExec(null);
      setReplacementMemberId("");
      setEditTitle("");
      await load();
    } catch {
      setEditError("Network error — could not reach the server.");
    }
  }

  async function handleRemoveFromExec() {
    if (!editingExec) return;
    setEditError("");

    try {
      const res = await fetch(`/api/members/${editingExec.memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isExecutive: false, executiveTitle: null }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setEditError(body.error || "Could not remove executive role.");
        return;
      }

      setEditingExec(null);
      setEditTitle("");
      setReplacementMemberId("");
      await load();
    } catch {
      setEditError("Network error — could not reach the server.");
    }
  }

  if (!loaded) {
    return <div className="p-4 text-sm text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <h1 className="font-display text-[26px] font-semibold mb-1">Executive</h1>
      <p className="text-sm text-gray-500 mb-4">Filtered from Members — only executives shown here.</p>

      <form onSubmit={handleAssign} className="bg-white border border-line rounded-2xl p-4 mb-6 flex gap-3 items-end flex-wrap">
        {assignError && <div className="text-sm text-red-600 w-full">{assignError}</div>}
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
            <button onClick={() => openEditExec(m)} className="text-sm text-navy border border-navy px-3 py-1.5 rounded-lg">
              Edit
            </button>
          </div>
        ))}
        {execs.length === 0 && <div className="p-4 text-sm text-gray-500">No executives assigned yet.</div>}
      </div>

      {editingExec ? (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditingExec(null)}>
          <div className="bg-white rounded-3xl max-w-lg w-full p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">Edit executive</div>
              <button onClick={() => setEditingExec(null)} className="text-sm text-gray-600">Close</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              {editError && <div className="text-sm text-red-600">{editError}</div>}

              <label className="text-sm text-gray-600 block">
                Role / Title
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. President"
                  className="border rounded px-3 py-2 w-full mt-1"
                />
              </label>

              <label className="text-sm text-gray-600 block">
                Replace with another member (optional)
                <select
                  value={replacementMemberId}
                  onChange={(e) => setReplacementMemberId(e.target.value)}
                  className="border rounded px-3 py-2 w-full mt-1"
                >
                  <option value="">Keep current executive</option>
                  {replacementCandidates.map((m) => (
                    <option key={m.memberId} value={m.memberId}>{m.firstName} {m.lastName}</option>
                  ))}
                </select>
              </label>

              <div className="flex flex-wrap gap-3 pt-2">
                <button type="button" onClick={() => setConfirmingRemove(true)} className="text-sm text-red-600 border border-red-200 px-3 py-2 rounded-lg">
                  Remove from executive list
                </button>
                <button type="submit" className="bg-navy text-white px-4 py-2 rounded-lg text-sm">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {confirmingRemove && editingExec ? (
        <ConfirmModal
          title="Remove from executive list"
          description={`Remove ${editingExec.firstName} ${editingExec.lastName} from the executive list? They'll stay a regular member.`}
          confirmLabel="Remove"
          cancelLabel="Cancel"
          onConfirm={() => {
            setConfirmingRemove(false);
            handleRemoveFromExec();
          }}
          onCancel={() => setConfirmingRemove(false)}
        />
      ) : null}
    </div>
  );
}
