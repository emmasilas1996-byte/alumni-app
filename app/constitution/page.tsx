"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import ConfirmModal from "@/components/ConfirmModal";

interface Section {
  sectionId: number;
  title: string;
  content: string;
  parentSectionId?: number | null;
  children: Section[];
}

// Flattens the nested TOC into one list (top-level + children) so the
// "select which section to amend" view and the full-constitution view
// can both iterate it simply.
function flatten(sections: Section[]): Section[] {
  const out: Section[] = [];
  for (const s of sections) {
    out.push(s);
    if (s.children) out.push(...s.children);
  }
  return out;
}

export default function ConstitutionPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [viewing, setViewing] = useState<Section | null>(null);

  const [amendMode, setAmendMode] = useState(false);
  const [editing, setEditing] = useState<Section | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [error, setError] = useState("");

  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newParentId, setNewParentId] = useState("");

  const [deleteSectionId, setDeleteSectionId] = useState<number | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  async function load() {
    const res = await fetch("/api/constitution");
    setSections(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  // "Amend" button — checks session first, same login-gate pattern used
  // everywhere else in the app (Add Contribution, Add Dues, Member Edit).
  async function handleAmendClick() {
    try {
      const res = await fetch("/api/auth/session");
      if (!res.ok) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      const session = await res.json();
      if (!session.authenticated) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      setViewing(null);
      setAmendMode(true);
    } catch {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }

  function startEdit(section: Section) {
    setEditing(section);
    setEditTitle(section.title);
    setEditContent(section.content);
    setError("");
  }

  async function handleSaveEdit() {
    if (!editing) return;
    setError("");
    const res = await fetch(`/api/constitution/${editing.sectionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    });
    if (res.status === 401) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setEditing(null);
    load();
  }

  function confirmDelete(section: Section) {
    setDeleteSectionId(section.sectionId);
  }

  async function handleDelete() {
    if (deleteSectionId === null) return;
    const res = await fetch(`/api/constitution/${deleteSectionId}`, { method: "DELETE" });
    if (res.status === 401) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setDeleteSectionId(null);
    setEditing(null);
    load();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/constitution", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        content: newContent,
        parentSectionId: newParentId ? Number(newParentId) : null,
      }),
    });
    if (res.status === 401) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setShowNewForm(false);
    setNewTitle("");
    setNewContent("");
    setNewParentId("");
    load();
  }

  const flatSections = flatten(sections);

  // ---------- AMEND MODE: pick a section to edit, or add a new one ----------
  if (amendMode) {
    if (editing) {
      return (
        <div>
          <button onClick={() => setEditing(null)} className="text-sm text-navy mb-4 font-medium">
            ← Back to section list
          </button>
          <div className="bg-white border border-line rounded-2xl p-6">
            {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border border-line rounded-lg px-3 py-2 mb-3 font-display text-lg font-semibold"
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={16}
              className="w-full border border-line rounded-lg px-3 py-2 text-sm leading-relaxed mb-3"
            />
            <div className="flex justify-between">
              <button onClick={() => confirmDelete(editing)} className="text-sm text-red-600">
                Delete this section
              </button>
              <div className="flex gap-3">
                <button onClick={() => setEditing(null)} className="border border-line px-4 py-2 rounded-lg text-sm">
                  Cancel
                </button>
                <button onClick={handleSaveEdit} className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {deleteSectionId !== null && (
            <ConfirmModal
              title="Delete section"
              description="This will also delete any sub-sections under it. This cannot be undone."
              confirmLabel="Delete section"
              cancelLabel="Cancel"
              onConfirm={handleDelete}
              onCancel={() => setDeleteSectionId(null)}
            />
          )}
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-1 flex-wrap gap-3">
          <h1 className="font-display text-[26px] font-semibold">Amend Constitution</h1>
          <button onClick={() => setAmendMode(false)} className="text-sm text-gray-500">
            Done — back to view mode
          </button>
        </div>
        <p className="text-[13.5px] text-gray-500 mb-6">Select a section below to amend it.</p>

        <button
          onClick={() => setShowNewForm((s) => !s)}
          className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium mb-4"
        >
          {showNewForm ? "Cancel" : "+ Add New Section"}
        </button>

        {showNewForm && (
          <form onSubmit={handleCreate} className="bg-white border border-line rounded-2xl p-4 mb-6 space-y-3">
            {error && <div className="text-sm text-red-600">{error}</div>}
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Section title (e.g. 5. Amendments)"
              required
              className="w-full border border-line rounded-lg px-3 py-2"
            />
            <select
              value={newParentId}
              onChange={(e) => setNewParentId(e.target.value)}
              className="w-full border border-line rounded-lg px-3 py-2"
            >
              <option value="">Top-level section</option>
              {sections.map((s) => (
                <option key={s.sectionId} value={s.sectionId}>Sub-section of: {s.title}</option>
              ))}
            </select>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Section text..."
              rows={8}
              required
              className="w-full border border-line rounded-lg px-3 py-2"
            />
            <button type="submit" className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium">
              Save Section
            </button>
          </form>
        )}

        <div className="bg-white border border-line rounded-2xl divide-y divide-line">
          {flatSections.map((s) => (
            <button
              key={s.sectionId}
              onClick={() => startEdit(s)}
              className="w-full text-left p-3 hover:bg-ivory font-medium transition-colors flex justify-between items-center"
            >
              <span>{s.parentSectionId ? `↳ ${s.title}` : s.title}</span>
              <span className="text-xs text-navy">Amend →</span>
            </button>
          ))}
          {flatSections.length === 0 && <div className="p-4 text-sm text-gray-500">No sections yet — add one above.</div>}
        </div>
      </div>
    );
  }

  // ---------- VIEW MODE: full constitution list, click a section to pop it open ----------
  return (
    <div>
      <div className="flex justify-between items-center mb-1 flex-wrap gap-3">
        <h1 className="font-display text-[26px] font-semibold">Constitution</h1>
        <button
          onClick={handleAmendClick}
          className="border border-navy text-navy px-4 py-2 rounded-lg text-sm font-medium"
        >
          Amend
        </button>
      </div>
      <p className="text-[13.5px] text-gray-500 mb-6">Click any section below to read it in full.</p>

      <div className="bg-white border border-line rounded-2xl divide-y divide-line">
        {sections.map((s) => (
          <div key={s.sectionId}>
            <button onClick={() => setViewing(s)} className="w-full text-left p-3 hover:bg-ivory font-medium transition-colors">
              {s.title}
            </button>
            {s.children?.map((c) => (
              <button
                key={c.sectionId}
                onClick={() => setViewing(c)}
                className="w-full text-left pl-8 pr-3 py-2 hover:bg-ivory text-sm text-gray-600 border-t border-line transition-colors"
              >
                {c.title}
              </button>
            ))}
          </div>
        ))}
        {sections.length === 0 && <div className="p-4 text-sm text-gray-500">No constitution content yet.</div>}
      </div>

      {/* SECTION POPUP — closing returns to this list to pick another */}
      {viewing && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setViewing(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-line sticky top-0 bg-white">
              <div className="font-display text-lg font-semibold">{viewing.title}</div>
              <button onClick={() => setViewing(null)} className="text-sm text-gray-600 hover:text-black">
                Close
              </button>
            </div>
            <div className="p-6 whitespace-pre-wrap text-sm leading-relaxed">{viewing.content}</div>
          </div>
        </div>
      )}
    </div>
  );
}
