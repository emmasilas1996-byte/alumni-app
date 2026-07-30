"use client";

import { useEffect, useState } from "react";

interface Section {
  sectionId: number;
  title: string;
  content: string;
  orderIndex: number;
  parentSectionId: number | null;
  children: Section[];
}

interface SectionForm {
  title: string;
  content: string;
  orderIndex: string;
  parentSectionId: string;
}

const emptyForm: SectionForm = {
  title: "",
  content: "",
  orderIndex: "1",
  parentSectionId: "",
};

export default function ConstitutionPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [active, setActive] = useState<Section | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [form, setForm] = useState<SectionForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Section | null>(null);

  async function loadSections() {
    const res = await fetch("/api/constitution");
    setSections(await res.json());
  }

  useEffect(() => {
    loadSections();
  }, []);

  function resetForm() {
    setEditingSection(null);
    setForm(emptyForm);
    setShowForm(false);
  }

  function openForm(parentId?: number) {
    setEditingSection(null);
    setForm({ ...emptyForm, parentSectionId: parentId ? String(parentId) : "" });
    setShowForm(true);
  }

  function startEdit(section: Section) {
    setEditingSection(section);
    setForm({
      title: section.title,
      content: section.content,
      orderIndex: String(section.orderIndex),
      parentSectionId: section.parentSectionId ? String(section.parentSectionId) : "",
    });
    setShowForm(true);
  }

  function confirmDelete(section: Section) {
    setDeleteTarget(section);
  }

  async function completeDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/constitution/${deleteTarget.sectionId}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Could not delete section.");
      return;
    }
    if (active?.sectionId === deleteTarget.sectionId) {
      setActive(null);
    }
    setDeleteTarget(null);
    loadSections();
  }

  function cancelDelete() {
    setDeleteTarget(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      orderIndex: Number(form.orderIndex),
      parentSectionId: form.parentSectionId ? Number(form.parentSectionId) : null,
    };

    if (!payload.title || !payload.content || !payload.orderIndex) {
      alert("Please provide a title, content, and order.");
      setSubmitting(false);
      return;
    }

    const url = editingSection ? `/api/constitution/${editingSection.sectionId}` : "/api/constitution";
    const method = editingSection ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSubmitting(false);
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Could not save constitution section.");
      return;
    }

    resetForm();
    loadSections();
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-[26px] font-semibold">Constitution</h1>
          <p className="text-sm text-gray-500">Create and manage your constitution sections directly inside the app.</p>
        </div>
        <button
          onClick={() => openForm()}
          className="bg-navy text-white rounded-full px-4 py-2 text-sm"
        >
          + Add section
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-line rounded-2xl p-6 mb-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Section title"
              className="border rounded px-3 py-2 w-full"
              required
            />
            <input
              value={form.orderIndex}
              onChange={(e) => setForm((prev) => ({ ...prev, orderIndex: e.target.value }))}
              placeholder="Order"
              type="number"
              min="1"
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={form.parentSectionId}
              onChange={(e) => setForm((prev) => ({ ...prev, parentSectionId: e.target.value }))}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">Top-level section</option>
              {sections.map((section) => (
                <option key={section.sectionId} value={section.sectionId}>
                  {section.title}
                </option>
              ))}
            </select>
            <div className="text-right">
              <button
                type="button"
                onClick={resetForm}
                className="text-sm text-gray-600 mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-navy text-white rounded-full px-4 py-2 text-sm disabled:opacity-50"
              >
                {editingSection ? "Save section" : "Create section"}
              </button>
            </div>
          </div>
          <textarea
            value={form.content}
            onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
            placeholder="Section content"
            rows={8}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </form>
      )}

      <div className="bg-white border border-line rounded-2xl divide-y">
        {sections.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No constitution content yet. Start by creating your first section.</div>
        ) : (
          sections.map((section) => (
            <div key={section.sectionId} className="border-b border-line last:border-b-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4">
                <div>
                  <button
                    onClick={() => setActive(section)}
                    className="text-left text-lg font-medium hover:text-navy"
                  >
                    {section.title}
                  </button>
                  <p className="text-sm text-gray-500 mt-1">{section.children.length} subsection{section.children.length === 1 ? "" : "s"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => openForm(section.sectionId)}
                    className="text-sm text-navy border border-navy rounded-full px-3 py-1"
                  >
                    Add subsection
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(section)}
                    className="text-sm text-gray-700 border border-line rounded-full px-3 py-1"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmDelete(section)}
                    className="text-sm text-red-600 border border-red-200 rounded-full px-3 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {section.children.length > 0 && (
                <div className="space-y-1 border-t border-line bg-slate-50 px-4 py-3">
                  {section.children.map((child) => (
                    <div key={child.sectionId} className="rounded-2xl bg-white p-3 border border-line">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <button
                          onClick={() => setActive(child)}
                          className="text-left font-medium hover:text-navy"
                        >
                          {child.title}
                        </button>
                        <button
                          type="button"
                          onClick={() => startEdit(child)}
                          className="text-sm text-gray-700 border border-line rounded-full px-3 py-1"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(child)}
                          className="text-sm text-red-600 border border-red-200 rounded-full px-3 py-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {active && (
        <div className="mt-6">
          <button onClick={() => setActive(null)} className="text-sm text-navy mb-4">
            ← Back to Table of Contents
          </button>
          <h2 className="font-display text-[24px] font-semibold mb-3">{active.title}</h2>
          <div className="bg-white border border-line rounded-2xl p-6 whitespace-pre-wrap text-sm leading-relaxed">
            {active.content}
          </div>
        </div>
      )}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4 py-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden">
            <div className="p-6">
              <h2 className="font-display text-xl font-semibold mb-2">Delete Section</h2>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete "{deleteTarget.title}" and all its subsections? This cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelDelete}
                  className="rounded-full border border-line px-4 py-2 text-sm text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={completeDelete}
                  className="rounded-full bg-red-600 text-white px-4 py-2 text-sm"
                >
                  Delete section
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
