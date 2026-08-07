"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import ConfirmModal from "@/components/ConfirmModal";

interface Section {
  sectionId: number;
  title: string;
  content: string;
  parentSectionId?: number | null;
  children: Section[];
}

export default function ConstitutionPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [amendOpen, setAmendOpen] = useState(false);
  const [amendTab, setAmendTab] = useState<"edit" | "add">("edit");

  const [editSectionId, setEditSectionId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editError, setEditError] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newParentId, setNewParentId] = useState("");
  const [newError, setNewError] = useState("");
  const [savingNew, setSavingNew] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Section | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  async function load() {
    const res = await fetch("/api/constitution");
    const data: Section[] = await res.json();
    setSections(data);
    if (data.length > 0) {
      setExpanded(new Set(data.map((s) => s.sectionId)));
      if (selectedId === null) {
        const firstWithSelectable = data[0].children[0] || data[0];
        setSelectedId(firstWithSelectable.sectionId);
      }
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Flattened list (Article + its Sections) for dropdowns and lookups.
  const flat = useMemo(() => {
    const out: Section[] = [];
    for (const s of sections) {
      out.push(s);
      out.push(...s.children);
    }
    return out;
  }, [sections]);

  const selected = flat.find((s) => s.sectionId === selectedId) || null;
  const selectedParent = selected?.parentSectionId
    ? sections.find((s) => s.sectionId === selected.parentSectionId)
    : null;

  function toggleArticle(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function checkSignedIn(): Promise<boolean> {
    try {
      const res = await fetch("/api/auth/session");
      if (!res.ok) return false;
      const body = await res.json();
      return !!body.authenticated;
    } catch {
      return false;
    }
  }

  async function openAmend(preselectSectionId?: number) {
    const signedIn = await checkSignedIn();
    if (!signedIn) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setAmendOpen(true);
    if (preselectSectionId) {
      setAmendTab("edit");
      selectEditSection(String(preselectSectionId));
    }
  }

  function selectEditSection(id: string) {
    setEditSectionId(id);
    const section = flat.find((s) => String(s.sectionId) === id);
    setEditTitle(section?.title || "");
    setEditContent(section?.content || "");
    setEditError("");
  }

  async function handleSaveEdit() {
    if (!editSectionId) return;
    setSavingEdit(true);
    setEditError("");
    const res = await fetch(`/api/constitution/${editSectionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    });
    setSavingEdit(false);
    if (res.status === 401) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setEditError(body.error || "Could not save changes.");
      return;
    }
    await load();
  }

  async function handleAddSection() {
    if (!newTitle || !newContent) {
      setNewError("Title and content are required.");
      return;
    }
    setSavingNew(true);
    setNewError("");
    const res = await fetch("/api/constitution", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        content: newContent,
        parentSectionId: newParentId ? Number(newParentId) : null,
      }),
    });
    setSavingNew(false);
    if (res.status === 401) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setNewError(body.error || "Could not add section.");
      return;
    }
    setNewTitle("");
    setNewContent("");
    setNewParentId("");
    await load();
  }

  async function confirmDelete(section: Section) {
    const signedIn = await checkSignedIn();
    if (!signedIn) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setDeleteError("");
    setDeleteTarget(section);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/constitution/${deleteTarget.sectionId}`, { method: "DELETE" });
    if (res.status === 401) {
      setDeleteTarget(null);
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setDeleteError(body.error || "Could not delete section.");
      return;
    }
    if (selectedId === deleteTarget.sectionId) setSelectedId(null);
    setDeleteTarget(null);
    await load();
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-[26px] font-semibold mb-1">Constitution</h1>
          <p className="text-[13.5px] text-gray-500">View and manage the constitution of NEMSS.</p>
        </div>
        <div className="flex gap-2">
          <a
            href="/api/constitution/export"
            className="border border-navy text-navy px-4 py-2 rounded-lg text-sm font-medium"
          >
            ⬇ Export as PDF
          </a>
          <button
            onClick={() => openAmend()}
            className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            ✏️ Amend Constitution
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-5">
        {/* SIDEBAR: Table of Contents */}
        <div className="bg-white border border-line rounded-2xl p-3 h-fit">
          <div className="font-display text-[15px] font-semibold px-2 py-1 mb-1">Table of Contents</div>
          {sections.map((article) => (
            <div key={article.sectionId} className="mb-1">
              <button
                onClick={() => toggleArticle(article.sectionId)}
                className="w-full flex justify-between items-center text-left px-2 py-2 rounded-lg hover:bg-ivory text-[13.5px] font-semibold"
              >
                <span>{article.title}</span>
                <span className="text-gray-400 text-xs">{expanded.has(article.sectionId) ? "▾" : "▸"}</span>
              </button>
              {expanded.has(article.sectionId) &&
                article.children.map((child) => (
                  <button
                    key={child.sectionId}
                    onClick={() => setSelectedId(child.sectionId)}
                    className={`w-full text-left pl-5 pr-2 py-1.5 rounded-lg text-[13px] transition-colors ${
                      selectedId === child.sectionId
                        ? "bg-navy/10 text-navy font-medium"
                        : "text-gray-600 hover:bg-ivory"
                    }`}
                  >
                    {child.title}
                  </button>
                ))}
              {expanded.has(article.sectionId) && article.children.length === 0 && (
                <button
                  onClick={() => setSelectedId(article.sectionId)}
                  className={`w-full text-left pl-5 pr-2 py-1.5 rounded-lg text-[13px] transition-colors ${
                    selectedId === article.sectionId
                      ? "bg-navy/10 text-navy font-medium"
                      : "text-gray-600 hover:bg-ivory"
                  }`}
                >
                  View content →
                </button>
              )}
            </div>
          ))}
          {sections.length === 0 && <div className="px-2 py-3 text-sm text-gray-500">No sections yet.</div>}
        </div>

        {/* MAIN PANE */}
        <div>
          {selected ? (
            <div className="bg-white border border-line rounded-2xl p-6 mb-5">
              <button onClick={() => setSelectedId(null)} className="text-sm text-navy mb-3 font-medium">
                ← Back to full constitution
              </button>
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  {selectedParent && <div className="text-[13px] text-gray-500 mb-1">{selectedParent.title}</div>}
                  <div className="font-display text-xl font-semibold">{selected.title}</div>
                </div>
                <div className="flex gap-2">
                  {amendOpen ? (
                    <>
                      <button
                        onClick={() => openAmend(selected.sectionId)}
                        className="bg-navy text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(selected)}
                        className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                      >
                        🗑 Delete
                      </button>
                    </>
                  ) : (
                    <div className="text-[11.5px] text-gray-500">
                      Click "Amend Constitution" above to edit or delete
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink">{selected.content}</div>
            </div>
          ) : (
            <div className="bg-white border border-line rounded-2xl p-6 mb-5 text-sm text-gray-500">
              Select a section from the Table of Contents to read it.
            </div>
          )}

          {/* AMEND PANEL — inline, login-gated via openAmend() */}
          {amendOpen && (
            <div className="bg-navy/5 border border-navy/20 rounded-2xl overflow-hidden">
              <div className="bg-navy/10 px-5 py-3 flex justify-between items-center">
                <div className="font-display text-[15px] font-semibold text-navy">Amend Constitution</div>
                <button onClick={() => setAmendOpen(false)} className="text-sm text-gray-500">Close</button>
              </div>

              <div className="flex border-b border-navy/10">
                <button
                  onClick={() => setAmendTab("edit")}
                  className={`px-5 py-2.5 text-sm font-medium ${amendTab === "edit" ? "text-navy border-b-2 border-navy" : "text-gray-500"}`}
                >
                  Edit Existing Section
                </button>
                <button
                  onClick={() => setAmendTab("add")}
                  className={`px-5 py-2.5 text-sm font-medium ${amendTab === "add" ? "text-navy border-b-2 border-navy" : "text-gray-500"}`}
                >
                  Add New Section
                </button>
              </div>

              {amendTab === "edit" ? (
                <div className="p-5 space-y-3">
                  {editError && <div className="text-sm text-red-600">{editError}</div>}
                  <label className="text-xs text-gray-600 block">
                    Select Section to Edit
                    <select
                      value={editSectionId}
                      onChange={(e) => selectEditSection(e.target.value)}
                      className="border border-line rounded-lg px-3 py-2 w-full mt-1 bg-white"
                    >
                      <option value="">Choose a section...</option>
                      {sections.map((article) => (
                        <optgroup key={article.sectionId} label={article.title}>
                          <option value={article.sectionId}>{article.title} (top-level)</option>
                          {article.children.map((c) => (
                            <option key={c.sectionId} value={c.sectionId}>
                              {article.title} — {c.title}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </label>

                  {editSectionId && (
                    <>
                      <label className="text-xs text-gray-600 block">
                        Title
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="border border-line rounded-lg px-3 py-2 w-full mt-1 bg-white"
                        />
                      </label>
                      <label className="text-xs text-gray-600 block">
                        Content
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={8}
                          className="border border-line rounded-lg px-3 py-2 w-full mt-1 bg-white"
                        />
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={handleSaveEdit}
                          disabled={savingEdit}
                          className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                          {savingEdit ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          onClick={() => selectEditSection("")}
                          className="border border-line px-4 py-2 rounded-lg text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="p-5 space-y-3">
                  {newError && <div className="text-sm text-red-600">{newError}</div>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="text-xs text-gray-600 block">
                      Title
                      <input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Enter title"
                        className="border border-line rounded-lg px-3 py-2 w-full mt-1 bg-white"
                      />
                    </label>
                    <label className="text-xs text-gray-600 block">
                      Parent Section (optional)
                      <select
                        value={newParentId}
                        onChange={(e) => setNewParentId(e.target.value)}
                        className="border border-line rounded-lg px-3 py-2 w-full mt-1 bg-white"
                      >
                        <option value="">— Top Level (No Parent) —</option>
                        {sections.map((article) => (
                          <option key={article.sectionId} value={article.sectionId}>{article.title}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="text-xs text-gray-600 block">
                    Content
                    <textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      rows={6}
                      placeholder="Enter content"
                      className="border border-line rounded-lg px-3 py-2 w-full mt-1 bg-white"
                    />
                  </label>
                  <button
                    onClick={handleAddSection}
                    disabled={savingNew}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    {savingNew ? "Adding..." : "+ Add Section"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="Confirm Deletion"
          description={`Are you sure you want to delete "${deleteTarget.title}"? This will also delete any sub-sections under it. This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {deleteError && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
          {deleteError}
        </div>
      )}
    </div>
  );
}
