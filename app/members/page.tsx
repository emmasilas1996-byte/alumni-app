"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import ConfirmModal from "@/components/ConfirmModal";

interface Member {
  memberId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  dateJoined: string | null;
  isExecutive: boolean;
  executiveTitle: string | null;
  occupation: string | null;
  location: string | null;
  thoughts?: string | null;
  email?: string | null;
  phone?: string | null;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleteMemberId, setDeleteMemberId] = useState<number | null>(null);
  const [photoVersion, setPhotoVersion] = useState(0);
  const [viewedPhotoMember, setViewedPhotoMember] = useState<Member | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  async function load() {
    const res = await fetch("/api/members");
    setMembers(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function ensureAuthenticated(next: () => void) {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const session = await res.json();
        if (session.authenticated) {
          next();
          return true;
        }
      }
    } catch {
      // fall through to login redirect
    }
    window.location.assign(`/login?redirect=${encodeURIComponent(pathname)}`);
    return false;
  }

  function findForm(e: React.FormEvent) {
    if (e.currentTarget instanceof HTMLFormElement) {
      return e.currentTarget;
    }
    return e.target instanceof Element ? e.target.closest("form") : null;
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const authenticated = await ensureAuthenticated(() => undefined);
    if (!authenticated) return;

    const form = findForm(e);
    if (!form) {
      alert("Could not find the member form. Please try again.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData(form);
    const res = await fetch("/api/members", { method: "POST", body: formData });
    setSubmitting(false);
    if (res.ok) {
      setShowForm(false);
      (e.target as HTMLFormElement).reset();
      load();
    } else {
      if (res.status === 401) {
        window.location.assign(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      const err = await res.json();
      alert(err.error || "Could not add member.");
    }
  }

  // Clicking "Edit" checks the session first — if not signed in, sends
  // the person to /login and back here, matching how Add Contribution /
  // Add Dues already work elsewhere in the app.
  async function handleEditClick(member: Member) {
    await ensureAuthenticated(() => {
      setEditError("");
      setEditingMember(member);
    });
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingMember) return;
    const authenticated = await ensureAuthenticated(() => undefined);
    if (!authenticated) return;

    const form = findForm(e);
    if (!form) {
      setEditError("Could not find the edit form. Please try again.");
      return;
    }

    setSavingEdit(true);
    setEditError("");
    const formData = new FormData(form);
    const res = await fetch(`/api/members/${editingMember.memberId}`, {
      method: "PATCH",
      body: formData,
    });
    setSavingEdit(false);

    if (res.status === 401) {
      window.location.assign(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!res.ok) {
      const err = await res.json();
      setEditError(err.error || "Could not save changes.");
      return;
    }

    setPhotoVersion((v) => v + 1);
    setEditingMember(null);
    load();
  }

  async function confirmDelete() {
    if (!editingMember) return;
    await ensureAuthenticated(() => {
      setDeleteMemberId(editingMember.memberId);
    });
  }

  async function handleDelete() {
    if (deleteMemberId === null) return;
    const authenticated = await ensureAuthenticated(() => undefined);
    if (!authenticated) return;

    const res = await fetch(`/api/members/${deleteMemberId}`, { method: "DELETE" });
    if (res.status === 401) {
      window.location.assign(`/login?redirect=${encodeURIComponent(pathname)}`);
      setDeleteMemberId(null);
      return;
    }
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Could not remove member.");
      setDeleteMemberId(null);
      return;
    }
    setDeleteMemberId(null);
    setEditingMember(null);
    load();
  }

  const filtered = members.filter((m) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
      (m.occupation || "").toLowerCase().includes(q) ||
      (m.location || "").toLowerCase().includes(q) ||
      (m.executiveTitle || "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <h1 className="font-display text-[26px] font-semibold">Members</h1>
        <button
          onClick={async () => {
            try {
              const res = await fetch("/api/auth/session");
              if (res.ok) {
                const body = await res.json();
                if (body.authenticated) {
                  setShowForm((s) => !s);
                  return;
                }
              }
            } catch {
              // fall through to login redirect
            }
            window.location.assign(`/login?redirect=${encodeURIComponent(pathname)}`);
          }}
          className="bg-navy text-white px-4 py-2 rounded text-sm"
        >
          {showForm ? "Cancel" : "+ Add Member"}
        </button>
      </div>

      <div className="relative mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Search members by name, occupation, location, or title..."
          className="border border-line rounded-lg px-3 py-2 w-full text-sm"
        />
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white border border-line rounded-2xl p-4 mb-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="firstName" placeholder="First name" required className="border rounded px-3 py-2" />
            <input name="lastName" placeholder="Last name" required className="border rounded px-3 py-2" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="email" type="email" placeholder="Email" className="border rounded px-3 py-2" />
            <input name="phone" placeholder="Phone" className="border rounded px-3 py-2" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="occupation" placeholder="Occupation" className="border rounded px-3 py-2" />
            <input name="location" placeholder="Location" className="border rounded px-3 py-2" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="text-sm text-gray-600">
              Date of birth
              <input name="dateOfBirth" type="date" required className="border rounded px-3 py-2 w-full mt-1" />
            </label>
            <label className="text-sm text-gray-600">
              Date joined
              <input name="dateJoined" type="date" className="border rounded px-3 py-2 w-full mt-1" />
            </label>
          </div>
          <textarea
            name="thoughts"
            placeholder="A few words / thoughts (used in Gallery)"
            className="border rounded px-3 py-2 w-full"
          />
          <label className="text-sm text-gray-600 block">
            Photo
            <input name="photo" type="file" accept="image/*" className="block mt-1" />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="bg-navy text-white px-4 py-2 rounded text-sm disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Member"}
          </button>
        </form>
      )}

      <div className="bg-white border border-line rounded-2xl divide-y">
        {filtered.map((m) => (
          <div key={m.memberId} className="flex items-center gap-3 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/members/${m.memberId}/photo?v=${photoVersion}`}
              alt={m.firstName}
              className="w-10 h-10 rounded-full object-cover bg-gray-200 cursor-pointer"
              onClick={() => setViewedPhotoMember(m)}
              onError={(e) => ((e.target as HTMLImageElement).style.visibility = "hidden")}
            />
            <div className="flex-1">
              <div className="font-medium">{m.firstName} {m.lastName}</div>
              <div className="text-xs text-gray-500">
                {m.isExecutive ? `Executive — ${m.executiveTitle || "No title"}` : "Member"}
              </div>
              {(m.occupation || m.location || m.email || m.phone) ? (
                <div className="text-xs text-gray-500">
                  {[m.occupation, m.location, m.email ? `📧 ${m.email}` : null, m.phone ? `📞 ${m.phone}` : null]
                    .filter(Boolean)
                    .join(" • ")}
                </div>
              ) : null}
            </div>
            <button
              onClick={() => handleEditClick(m)}
              className="text-sm text-navy border border-navy px-3 py-1.5 rounded-lg"
            >
              ✏️ Edit
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-4 text-sm text-gray-500">
            {members.length === 0 ? "No members yet." : "No members match your search."}
          </div>
        )}
      </div>

      {viewedPhotoMember ? (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4" onClick={() => setViewedPhotoMember(null)}>
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setViewedPhotoMember(null)} className="absolute right-3 top-3 text-white text-xl">✕</button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/members/${viewedPhotoMember.memberId}/photo?v=${photoVersion}`}
              alt={viewedPhotoMember.firstName}
              className="w-full max-h-[80vh] object-contain rounded-2xl bg-white/10"
            />
          </div>
        </div>
      ) : null}

      {/* EDIT MODAL — reachable only after the session check above passes */}
      {editingMember ? (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEditingMember(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-line">
              <div className="text-lg font-semibold">Edit {editingMember.firstName} {editingMember.lastName}</div>
              <button onClick={() => setEditingMember(null)} className="text-sm text-gray-600 hover:text-black">Close</button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-4 space-y-3">
              {editError && <div className="text-sm text-red-600">{editError}</div>}

              <div className="flex items-center gap-3 mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/members/${editingMember.memberId}/photo?v=${photoVersion}`}
                  alt={editingMember.firstName}
                  className="w-16 h-16 rounded-full object-cover bg-gray-200"
                  onError={(e) => ((e.target as HTMLImageElement).style.visibility = "hidden")}
                />
                <label className="text-sm text-gray-600 block flex-1">
                  Replace photo
                  <input name="photo" type="file" accept="image/*" className="block mt-1" />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input name="firstName" defaultValue={editingMember.firstName} placeholder="First name" required className="border rounded px-3 py-2" />
                <input name="lastName" defaultValue={editingMember.lastName} placeholder="Last name" required className="border rounded px-3 py-2" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  name="email"
                  type="email"
                  defaultValue={editingMember.email || ""}
                  placeholder="Email (leave blank to keep current)"
                  className="border rounded px-3 py-2"
                />
                <input
                  name="phone"
                  defaultValue={editingMember.phone || ""}
                  placeholder="Phone (leave blank to keep current)"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input name="occupation" defaultValue={editingMember.occupation || ""} placeholder="Occupation" className="border rounded px-3 py-2" />
                <input name="location" defaultValue={editingMember.location || ""} placeholder="Location" className="border rounded px-3 py-2" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="text-sm text-gray-600">
                  Date of birth
                  <input
                    name="dateOfBirth"
                    type="date"
                    defaultValue={editingMember.dateOfBirth?.slice(0, 10)}
                    className="border rounded px-3 py-2 w-full mt-1"
                  />
                </label>
                <label className="text-sm text-gray-600">
                  Date joined
                  <input
                    name="dateJoined"
                    type="date"
                    defaultValue={editingMember.dateJoined?.slice(0, 10) || ""}
                    className="border rounded px-3 py-2 w-full mt-1"
                  />
                </label>
              </div>
              <textarea
                name="thoughts"
                defaultValue={editingMember.thoughts || ""}
                placeholder="A few words / thoughts (used in Gallery)"
                className="border rounded px-3 py-2 w-full"
              />

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="text-sm text-red-600"
                >
                  Delete member
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="bg-navy text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteMemberId !== null ? (
        <ConfirmModal
          title="Delete member"
          description="Are you sure you want to remove this member? This action cannot be undone."
          confirmLabel="Remove member"
          cancelLabel="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setDeleteMemberId(null)}
        />
      ) : null}
    </div>
  );
}
