"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LoadingScreen } from "@/components/Spinner";
import type { PolicyPage } from "@/lib/policyPages";
import { slugify } from "@/lib/policyPages";

// Kept outside the component: it's only called from event handlers, never during render.
function currentTime() {
  return Date.now();
}

export default function PolicyPagesListPage() {
  const [pages, setPages] = useState<PolicyPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "policyPages"), orderBy("updatedAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setPages(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PolicyPage));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(p: PolicyPage) {
    if (!db) return;
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    await deleteDoc(doc(db, "policyPages", p.id));
  }

  async function handleDuplicate(p: PolicyPage) {
    if (!db) return;
    let newSlug = `${p.slug}-copy`;
    let n = 2;
    while (pages.some((x) => x.slug === newSlug)) {
      newSlug = `${p.slug}-copy-${n}`;
      n++;
    }
    const now = Date.now();
    const newId = crypto.randomUUID();
    await setDoc(doc(db, "policyPages", newId), {
      title: `${p.title} (Copy)`,
      slug: newSlug,
      content: p.content,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      featuredImage: p.featuredImage,
      status: "draft",
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
    });
  }

  async function handleToggleStatus(p: PolicyPage) {
    if (!db) return;
    const nextStatus = p.status === "published" ? "draft" : "published";
    await setDoc(
      doc(db, "policyPages", p.id),
      {
        status: nextStatus,
        publishedAt: nextStatus === "published" ? currentTime() : p.publishedAt,
        updatedAt: currentTime(),
      },
      { merge: true }
    );
  }

  if (loading) return <LoadingScreen label="Loading policy pages..." />;

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Policy Pages</p>
          <h1 className="mt-1 text-2xl text-gray-900">
            Privacy, Terms, Refunds &amp; other legal pages
          </h1>
        </div>
        <Link
          href="/admin/policies/new"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105"
        >
          + New Page
        </Link>
      </div>

      <div className="mt-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or slug..."
          className="w-full max-w-sm rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-20 text-center">
          <p className="text-sm font-medium text-gray-900">
            {pages.length === 0 ? "No policy pages yet" : "No pages match your search"}
          </p>
          <p className="mt-1 text-sm text-gray-400">
            {pages.length === 0
              ? "Create your first page, e.g. Privacy Policy or Terms & Conditions."
              : "Try a different search term."}
          </p>
          {pages.length === 0 && (
            <Link
              href="/admin/policies/new"
              className="mt-5 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105"
            >
              + New Page
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-400">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Slug</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Last Updated</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50/60 last:border-0">
                  <td className="px-5 py-4 font-medium text-gray-900">{p.title || "Untitled"}</td>
                  <td className="px-5 py-4 text-gray-500">/{p.slug || slugify(p.title)}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleStatus(p)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        p.status === "published"
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {p.status === "published" ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/admin/policies/${p.id}`}
                        className="text-xs font-medium text-gray-700 hover:text-gray-900 hover:underline"
                      >
                        Edit
                      </Link>
                      {p.status === "published" && (
                        <a
                          href={`/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-medium text-gray-700 hover:text-gray-900 hover:underline"
                        >
                          Preview
                        </a>
                      )}
                      <button
                        onClick={() => handleDuplicate(p)}
                        className="text-xs font-medium text-gray-700 hover:text-gray-900 hover:underline"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="text-xs font-medium text-gray-400 hover:text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
