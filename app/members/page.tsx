"use client";

import { useEffect, useState } from "react";
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
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [deleteMemberId, setDeleteMemberId] = useState<number | null>(null);
  const [updatingPhoto, setUpdatingPhoto] = useState(false);

  async function load() {
    const res = await fetch("/api/members");
    setMembers(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/members", { method: "POST", body: formData });
    setSubmitting(false);
    if (res.ok) {
      setShowForm(false);
      (e.target as HTMLFormElement).reset();
      load();
    } else {
      const err = await res.json();
      alert(err.error || "Could not add member.");
    }
  }

  function confirmRemove(id: number) {
    setDeleteMemberId(id);
  }

  async function handleRemove() {
    if (deleteMemberId === null) return;
    const res = await fetch(`/api/members/${deleteMemberId}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Could not remove member.");
      return;
    }
    setDeleteMemberId(null);
    load();
  }

  async function handlePhotoUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedMember) return;

    const formData = new FormData(e.currentTarget);
    const photo = formData.get("photo") as File | null;
    if (!photo || photo.size === 0) {
      alert("Please choose a photo to upload.");
      return;
    }

    setUpdatingPhoto(true);
    const res = await fetch(`/api/members/${selectedMember.memberId}`, {
      method: "PATCH",
      body: formData,
    });
    setUpdatingPhoto(false);

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Could not update member photo.");
      return;
    }

    setSelectedMember(null);
    load();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-display text-[26px] font-semibold">Members</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-navy text-white px-4 py-2 rounded text-sm"
        >
          {showForm ? "Cancel" : "+ Add Member"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white border border-line rounded-2xl p-4 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input name="firstName" placeholder="First name" required className="border rounded px-3 py-2" />
            <input name="lastName" placeholder="Last name" required className="border rounded px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input name="email" type="email" placeholder="Email" className="border rounded px-3 py-2" />
            <input name="phone" placeholder="Phone" className="border rounded px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input name="occupation" placeholder="Occupation" className="border rounded px-3 py-2" />
            <input name="location" placeholder="Location" className="border rounded px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-3">
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
        {members.map((m) => (
          <div key={m.memberId} className="flex items-center gap-3 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/members/${m.memberId}/photo`}
              alt={m.firstName}
              className="w-10 h-10 rounded-full object-cover bg-gray-200 cursor-pointer"
              onClick={() => setSelectedMember(m)}
              onError={(e) => ((e.target as HTMLImageElement).style.visibility = "hidden")}
            />
            <div className="flex-1">
              <div className="font-medium">{m.firstName} {m.lastName}</div>
              <div className="text-xs text-gray-500">
                {m.isExecutive ? `Executive — ${m.executiveTitle || "No title"}` : "Member"}
              </div>
              {(m.occupation || m.location) ? (
                <div className="text-xs text-gray-500">
                  {[m.occupation, m.location].filter(Boolean).join(" • ")}
                </div>
              ) : null}
            </div>
            <button onClick={() => confirmRemove(m.memberId)} className="text-sm text-red-600">
              Remove
            </button>
          </div>
        ))}
        {members.length === 0 && <div className="p-4 text-sm text-gray-500">No members yet.</div>}
      </div>

      {selectedMember ? (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedMember(null)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-line">
              <div>
                <div className="text-lg font-semibold">{selectedMember.firstName} {selectedMember.lastName}</div>
                <div className="text-sm text-gray-500">{selectedMember.isExecutive ? `Executive — ${selectedMember.executiveTitle || "No title"}` : "Member"}</div>
              </div>
              <button onClick={() => setSelectedMember(null)} className="text-sm text-gray-600 hover:text-black">Close</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-[180px_1fr] p-4">
              <div className="rounded-3xl overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/members/${selectedMember.memberId}/photo`}
                  alt={selectedMember.firstName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3">
                <form onSubmit={handlePhotoUpdate} className="space-y-3">
                  <label className="text-sm text-gray-600 block">
                    Replace photo
                    <input name="photo" type="file" accept="image/*" className="block mt-1" />
                  </label>
                  <button
                    type="submit"
                    disabled={updatingPhoto}
                    className="bg-navy text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                  >
                    {updatingPhoto ? "Uploading..." : "Upload New Photo"}
                  </button>
                </form>

                {selectedMember.occupation && (
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">Occupation</div>
                    <div className="text-sm font-medium">{selectedMember.occupation}</div>
                  </div>
                )}
                {selectedMember.location && (
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">Location</div>
                    <div className="text-sm font-medium">{selectedMember.location}</div>
                  </div>
                )}
                {selectedMember.dateJoined && (
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">Joined</div>
                    <div className="text-sm font-medium">{new Date(selectedMember.dateJoined).toLocaleDateString()}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {deleteMemberId !== null ? (
        <ConfirmModal
          title="Delete member"
          description="Are you sure you want to remove this member? This action cannot be undone."
          confirmLabel="Remove member"
          cancelLabel="Cancel"
          onConfirm={handleRemove}
          onCancel={() => setDeleteMemberId(null)}
        />
      ) : null}
    </div>
  );
}
