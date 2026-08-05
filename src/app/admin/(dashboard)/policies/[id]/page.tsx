"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { slugify, type PolicyStatus } from "@/lib/policyPages";
import { LoadingScreen } from "@/components/Spinner";
import ImageUploadField from "@/components/admin/ImageUploadField";
import RichTextEditor from "@/components/admin/RichTextEditor";

type FormState = {
  title: string;
  slug: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  featuredImage: string;
  status: PolicyStatus;
  createdAt: number;
  updatedAt: number;
  publishedAt: number | null;
};

const empty: FormState = {
  title: "",
  slug: "",
  content: "",
  seoTitle: "",
  seoDescription: "",
  featuredImage: "",
  status: "draft",
  createdAt: 0,
  updatedAt: 0,
  publishedAt: null,
};

export default function PolicyPageEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();

  const [pageId, setPageId] = useState<string | null>(isNew ? null : id);
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextAutosave = useRef(true);

  useEffect(() => {
    if (isNew || !db) return;
    getDoc(doc(db, "policyPages", id)).then((snap) => {
      if (snap.exists()) {
        setForm({ ...empty, ...snap.data() } as FormState);
        setSlugTouched(true);
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const persist = useCallback(
    async (data: FormState, options?: { publishOverride?: PolicyStatus }) => {
      if (!db) return;
      const slug = (data.slug || slugify(data.title)).trim();
      if (!slug) return;

      const now = Date.now();
      const status = options?.publishOverride ?? data.status;
      const targetId = pageId ?? crypto.randomUUID();

      const payload = {
        title: data.title,
        slug,
        content: data.content,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        featuredImage: data.featuredImage,
        status,
        createdAt: data.createdAt || now,
        updatedAt: now,
        publishedAt: status === "published" ? data.publishedAt || now : data.publishedAt,
      };

      await setDoc(doc(db, "policyPages", targetId), payload, { merge: true });

      if (!pageId) setPageId(targetId);
      setForm((prev) => ({ ...prev, slug, status, updatedAt: now, publishedAt: payload.publishedAt }));
      return targetId;
    },
    [pageId]
  );

  // Autosave (debounced) after the first successful save exists
  useEffect(() => {
    if (loading) return;
    if (skipNextAutosave.current) {
      skipNextAutosave.current = false;
      return;
    }
    if (!pageId) return; // don't autosave until the page has been created once
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    setAutosaveStatus("saving");
    autosaveTimer.current = setTimeout(async () => {
      await persist(form);
      setAutosaveStatus("saved");
    }, 1500);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.title, form.slug, form.content, form.seoTitle, form.seoDescription, form.featuredImage]);

  async function handleSaveDraft() {
    setSaving(true);
    const newId = await persist(form, { publishOverride: "draft" });
    setSaving(false);
    if (isNew && newId) router.replace(`/admin/policies/${newId}`);
  }

  async function handlePublish() {
    setSaving(true);
    const newId = await persist(form, { publishOverride: "published" });
    setSaving(false);
    if (isNew && newId) router.replace(`/admin/policies/${newId}`);
  }

  async function handleUnpublish() {
    setSaving(true);
    await persist(form, { publishOverride: "draft" });
    setSaving(false);
  }

  if (loading) return <LoadingScreen label="Loading page..." />;

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/policies"
        className="group inline-flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-gray-900"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:-translate-x-0.5">
          <path d="M19 12H5M11 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Policy Pages
      </Link>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl text-gray-900">{isNew ? "New policy page" : form.title || "Edit page"}</h1>
        <div className="flex items-center gap-3">
          {!isNew && (
            <span className="text-xs text-gray-400">
              {autosaveStatus === "saving" && "Saving..."}
              {autosaveStatus === "saved" && "All changes saved"}
            </span>
          )}
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              form.status === "published" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
            }`}
          >
            {form.status === "published" ? "Published" : "Draft"}
          </span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <Field label="Title">
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  title,
                  slug: !slugTouched ? slugify(title) : prev.slug,
                }));
              }}
              placeholder="Privacy Policy"
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
            />
          </Field>

          <Field label="Slug (page URL: yoursite.com/slug)">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">/</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", slugify(e.target.value));
                }}
                placeholder="privacy-policy"
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
              />
            </div>
          </Field>

          <Field label="Content">
            <RichTextEditor value={form.content} onChange={(html) => set("content", html)} />
          </Field>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Publish</p>
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={handleSaveDraft}
                disabled={saving}
                className="rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900 disabled:opacity-50"
              >
                Save draft
              </button>
              {form.status === "published" ? (
                <button
                  onClick={handleUnpublish}
                  disabled={saving}
                  className="rounded-full bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
                >
                  Unpublish
                </button>
              ) : (
                <button
                  onClick={handlePublish}
                  disabled={saving}
                  className="rounded-full bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105 disabled:opacity-50"
                >
                  Publish
                </button>
              )}
              {form.status === "published" && (
                <a
                  href={`/${form.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900"
                >
                  View live page
                </a>
              )}
            </div>
            {form.updatedAt > 0 && (
              <p className="mt-4 text-xs text-gray-400">
                Last updated {new Date(form.updatedAt).toLocaleString()}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Featured image</p>
            <div className="mt-4">
              <ImageUploadField value={form.featuredImage} onChange={(v) => set("featuredImage", v)} />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">SEO</p>
            <div className="mt-4 flex flex-col gap-4">
              <Field label="SEO title">
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => set("seoTitle", e.target.value)}
                  placeholder={form.title || "Page title for search engines"}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
                />
              </Field>
              <Field label="SEO description">
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => set("seoDescription", e.target.value)}
                  rows={3}
                  placeholder="A short summary shown in search results"
                  className="resize-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
                />
              </Field>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</label>
      {children}
    </div>
  );
}
