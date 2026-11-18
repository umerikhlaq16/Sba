"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getProduct, type Category, type ProductIconType } from "@/lib/products";
import Spinner, { LoadingScreen } from "@/components/Spinner";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { useSection } from "@/contexts/ContentContext";

const icons: ProductIconType[] = ["brush", "charge", "case", "bundle"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type FormState = {
  slug: string;
  name: string;
  price: string;
  category: Category;
  badge: string;
  image: string;
  from: string;
  to: string;
  icon: ProductIconType;
  desc: string;
  tagline: string;
  features: string[];
  specs: { label: string; value: string }[];
};

const empty: FormState = {
  slug: "",
  name: "",
  price: "$0",
  category: "Brushes",
  badge: "",
  image: "",
  from: "#e0e7ff",
  to: "#818cf8",
  icon: "brush",
  desc: "",
  tagline: "",
  features: [""],
  specs: [{ label: "", value: "" }],
};

export default function ProductFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();

  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const categoryList = useSection("categories") as { items: string[] };
  const categories: Category[] = categoryList.items ?? [];

  useEffect(() => {
    if (isNew || !db) return;
    getDoc(doc(db, "products", id)).then((snap) => {
      if (snap.exists()) {
        setForm({ ...empty, ...snap.data(), slug: id } as FormState);
      } else {
        const fallback = getProduct(id);
        if (fallback) {
          setForm({
            ...empty,
            ...fallback,
            slug: id,
            badge: fallback.badge ?? "",
            image: fallback.image ?? "",
          });
        }
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!db) return;
    const slug = form.slug.trim();
    if (!slug) {
      alert("Slug is required.");
      return;
    }
    setSaving(true);
    const data: Partial<typeof form> = { ...form };
    delete data.slug;
    await setDoc(doc(db, "products", slug), data, { merge: true });
    setSaving(false);
    router.push("/admin/products");
  }

  if (loading) {
    return <LoadingScreen label="Loading product..." />;
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/products"
        className="group inline-flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-gray-900"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:-translate-x-0.5">
          <path d="M19 12H5M11 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Products
      </Link>
      <h1 className="mt-3 text-2xl text-gray-900">{isNew ? "Add product" : `Edit ${form.name || id}`}</h1>

      <div className="mt-8 flex flex-col gap-6">
        <Field label="Slug (auto-generated from name, used in URL)">
          <input
            type="text"
            value={form.slug}
            disabled={!isNew}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", slugify(e.target.value));
            }}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none disabled:opacity-50 disabled:bg-gray-50"
          />
        </Field>

        <Field label="Name">
          <input
            type="text"
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm((prev) => ({
                ...prev,
                name,
                slug: isNew && !slugTouched ? slugify(name) : prev.slug,
              }));
            }}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Price">
            <input
              type="text"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
            />
          </Field>
          <Field label="Badge (optional)">
            <input
              type="text"
              value={form.badge}
              onChange={(e) => set("badge", e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value as Category)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Icon (used when no image)">
            <select
              value={form.icon}
              onChange={(e) => set("icon", e.target.value as ProductIconType)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
            >
              {icons.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Image (leave empty to use gradient + icon)">
          <ImageUploadField value={form.image} onChange={(v) => set("image", v)} />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Gradient from">
            <input
              type="text"
              value={form.from}
              onChange={(e) => set("from", e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
            />
          </Field>
          <Field label="Gradient to">
            <input
              type="text"
              value={form.to}
              onChange={(e) => set("to", e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
            />
          </Field>
        </div>

        <Field label="Short description (used on cards)">
          <textarea
            value={form.desc}
            onChange={(e) => set("desc", e.target.value)}
            rows={2}
            className="resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
          />
        </Field>

        <Field label="Tagline (used on product page)">
          <textarea
            value={form.tagline}
            onChange={(e) => set("tagline", e.target.value)}
            rows={2}
            className="resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
          />
        </Field>

        <Field label="Features">
          <div className="flex flex-col gap-2">
            {form.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={f}
                  onChange={(e) => {
                    const next = [...form.features];
                    next[i] = e.target.value;
                    set("features", next);
                  }}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
                />
                <button
                  onClick={() => set("features", form.features.filter((_, idx) => idx !== i))}
                  className="rounded-lg border border-gray-200 px-3 py-2.5 text-xs text-gray-500 transition-colors hover:border-gray-900 hover:text-gray-900"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => set("features", [...form.features, ""])}
              className="self-start rounded-full border border-gray-200 px-4 py-2 text-xs text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900"
            >
              + Add feature
            </button>
          </div>
        </Field>

        <Field label="Specs">
          <div className="flex flex-col gap-2">
            {form.specs.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Label"
                  value={s.label}
                  onChange={(e) => {
                    const next = [...form.specs];
                    next[i] = { ...next[i], label: e.target.value };
                    set("specs", next);
                  }}
                  className="w-1/3 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={s.value}
                  onChange={(e) => {
                    const next = [...form.specs];
                    next[i] = { ...next[i], value: e.target.value };
                    set("specs", next);
                  }}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
                />
                <button
                  onClick={() => set("specs", form.specs.filter((_, idx) => idx !== i))}
                  className="rounded-lg border border-gray-200 px-3 py-2.5 text-xs text-gray-500 transition-colors hover:border-gray-900 hover:text-gray-900"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => set("specs", [...form.specs, { label: "", value: "" }])}
              className="self-start rounded-full border border-gray-200 px-4 py-2 text-xs text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900"
            >
              + Add spec
            </button>
          </div>
        </Field>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-2 flex items-center gap-2 self-start rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105 disabled:opacity-60"
        >
          {saving && <Spinner size={14} className="border-white/30 border-t-white" />}
          {saving ? "Saving..." : "Save product"}
        </button>
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
