"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { contentSchema, getSectionDefaults, pageLinkOptions, type FieldDef } from "@/lib/schema";
import Spinner, { LoadingScreen } from "@/components/Spinner";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { useContent } from "@/contexts/ContentContext";

export default function ContentEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const section = contentSchema.find((s) => s.key === slug);

  const [values, setValues] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!section || !db) return;
    setLoading(true);
    getDoc(doc(db, "content", section.key)).then((snap) => {
      const defaults = getSectionDefaults(section);
      if (!snap.exists()) {
        setValues(defaults);
        setLoading(false);
        return;
      }
      const saved = snap.data();
      const current = { ...defaults };
      for (const field of section.fields) {
        if (field.key in saved) current[field.key] = saved[field.key];
      }
      setValues(current);
      setLoading(false);
    });
  }, [section]);

  if (!section) {
    return (
      <div>
        <p className="text-sm text-gray-500">Section not found.</p>
        <Link href="/admin" className="mt-2 inline-block text-sm text-gray-900 underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  function setField(key: string, value: unknown) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    if (!db || !section) return;
    setSaving(true);
    await setDoc(doc(db, "content", section.key), values);
    setSaving(false);
    setSaved(true);
  }

  function handleReset() {
    if (!section) return;
    if (!confirm("Reset every field in this section back to the code defaults? This won't save until you click Save.")) return;
    setValues(getSectionDefaults(section));
    setSaved(false);
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin"
        className="group inline-flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-gray-900"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:-translate-x-0.5">
          <path d="M19 12H5M11 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Dashboard
      </Link>
      <p className="mt-3 text-xs font-medium uppercase tracking-widest text-gray-400">
        {section.page}
      </p>
      <h1 className="mt-1 text-2xl text-gray-900">{section.label}</h1>

      {loading ? (
        <LoadingScreen label="Loading section..." />
      ) : (
        <div className="mt-8 flex flex-col gap-6">
          {section.fields.map((field, i) => {
            const prevGroup = i > 0 ? section.fields[i - 1].group : undefined;
            const showGroupHeading = field.group && field.group !== prevGroup;
            return (
              <div key={field.key}>
                {showGroupHeading && (
                  <div
                    className={`mb-1 ${i > 0 ? "mt-2 border-t border-gray-100 pt-6" : ""} animate-[fadeIn_0.5s_ease-out_forwards] opacity-0`}
                    style={{ animationDelay: `${Math.min(i * 60, 400)}ms` }}
                  >
                    <p className="text-sm font-medium text-gray-900">{field.group}</p>
                  </div>
                )}
                <div
                  className="animate-[fadeIn_0.5s_ease-out_forwards] opacity-0"
                  style={{ animationDelay: `${Math.min(i * 60, 400)}ms` }}
                >
                  <FieldEditor
                    field={field}
                    value={values[field.key]}
                    onChange={(v) => setField(field.key, v)}
                  />
                </div>
              </div>
            );
          })}

          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105 disabled:opacity-60"
            >
              {saving && <Spinner size={14} className="border-white/30 border-t-white" />}
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button
              onClick={handleReset}
              className="rounded-full border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900"
            >
              Reset to defaults
            </button>
            <span
              className={`text-sm text-green-600 transition-opacity duration-300 ${
                saved ? "opacity-100" : "opacity-0"
              }`}
            >
              Saved
            </span>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (field.type === "color") {
    const v = (value as string) ?? "#000000";
    return (
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {field.label}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={v}
            onChange={(e) => onChange(e.target.value)}
            className="h-11 w-14 shrink-0 cursor-pointer rounded-lg border border-gray-200 bg-white p-1"
          />
          <input
            type="text"
            value={v}
            onChange={(e) => onChange(e.target.value)}
            className="w-32 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
          />
        </div>
      </div>
    );
  }

  if (field.type === "number") {
    const v = (value as number) ?? field.default;
    const min = field.min ?? 10;
    const max = field.max ?? 80;
    return (
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {field.label}
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={min}
            max={max}
            value={v}
            onChange={(e) => onChange(Number(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            min={min}
            max={max}
            value={v}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-20 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
          />
          <span className="text-xs text-gray-400">px</span>
        </div>
      </div>
    );
  }

  if (field.type === "toggle") {
    const v = (value as boolean) ?? true;
    return (
      <button
        type="button"
        onClick={() => onChange(!v)}
        className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-left transition-colors hover:border-gray-200"
      >
        <span>
          <span className="block text-sm font-medium text-gray-900">{field.label}</span>
          <span className="mt-0.5 block text-xs text-gray-400">
            {v ? "Visible on the live site" : "Hidden from the live site"}
          </span>
        </span>
        <span
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ease-out ${
            v ? "bg-gray-900" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 ease-out ${
              v ? "left-6" : "left-1"
            }`}
          />
        </span>
      </button>
    );
  }

  if (field.type === "image") {
    const v = (value as string) ?? "";
    return (
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {field.label}
        </label>
        <ImageUploadField value={v} onChange={onChange} />
      </div>
    );
  }

  if (field.type === "text") {
    const v = (value as string) ?? "";
    return (
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {field.label}
        </label>
        <input
          type="text"
          value={v}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
        />
      </div>
    );
  }

  if (field.type === "pageLink") {
    const v = (value as string) ?? "";
    return <PageLinkPicker label={field.label} value={v} onChange={onChange} />;
  }

  if (field.type === "textarea") {
    const v = (value as string) ?? "";
    return (
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {field.label}
        </label>
        <textarea
          value={v}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
        />
      </div>
    );
  }

  if (field.type === "list") {
    const v = (value as string[]) ?? [];
    return (
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {field.label}
        </label>
        {v.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const next = [...v];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
            />
            <button
              onClick={() => onChange(v.filter((_, idx) => idx !== i))}
              className="shrink-0 rounded-lg border border-gray-200 px-3 py-2.5 text-xs text-gray-500 transition-colors hover:border-gray-900 hover:text-gray-900"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange([...v, ""])}
          className="self-start rounded-full border border-gray-200 px-4 py-2 text-xs text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900"
        >
          + Add item
        </button>
      </div>
    );
  }

  if (field.type === "products") {
    return (
      <ProductPicker
        label={field.label}
        count={field.count}
        slotLabels={field.slotLabels}
        value={(value as string[]) ?? []}
        onChange={onChange}
      />
    );
  }

  // listOfObjects
  const items = (value as Record<string, string>[]) ?? [];
  const emptyItem = Object.fromEntries(field.itemFields.map((f) => [f.key, ""]));
  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {field.label}
      </label>
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:border-gray-200"
        >
          <div className="flex flex-col gap-3">
            {field.itemFields.map((sub) => (
              <div key={sub.key} className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wide text-gray-400">
                  {sub.label}
                </label>
                {sub.type === "textarea" ? (
                  <textarea
                    value={item[sub.key] ?? ""}
                    rows={2}
                    onChange={(e) => {
                      const next = [...items];
                      next[i] = { ...next[i], [sub.key]: e.target.value };
                      onChange(next);
                    }}
                    className="resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
                  />
                ) : sub.type === "image" ? (
                  <ImageUploadField
                    value={item[sub.key] ?? ""}
                    onChange={(v) => {
                      const next = [...items];
                      next[i] = { ...next[i], [sub.key]: v };
                      onChange(next);
                    }}
                  />
                ) : (
                  <input
                    type="text"
                    value={item[sub.key] ?? ""}
                    onChange={(e) => {
                      const next = [...items];
                      next[i] = { ...next[i], [sub.key]: e.target.value };
                      onChange(next);
                    }}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="mt-3 text-xs text-gray-400 transition-colors hover:text-red-500"
          >
            Remove item
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, emptyItem])}
        className="self-start rounded-full border border-gray-200 px-4 py-2 text-xs text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900"
      >
        + Add item
      </button>
    </div>
  );
}

function ProductPicker({
  label,
  count,
  value,
  onChange,
  slotLabels,
}: {
  label: string;
  count: number;
  value: string[];
  onChange: (v: string[]) => void;
  slotLabels?: string[];
}) {
  const { products } = useContent();
  const slots = Array.from({ length: count }, (_, i) => value[i] ?? "");

  function setSlot(i: number, slug: string) {
    const next = [...slots];
    next[i] = slug;
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</label>
      <p className="text-xs text-gray-400">
        Leave all as "Auto" to show the default lineup. Each product can only be picked once.
      </p>
      <div className="flex flex-col gap-2">
        {slots.map((slug, i) => {
          const usedElsewhere = slots.filter((s, idx) => idx !== i && s);
          return (
            <select
              key={i}
              value={slug}
              onChange={(e) => setSlot(i, e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
            >
              <option value="">Auto ({slotLabels?.[i] ?? `slot ${i + 1}`})</option>
              {products.map((p) => (
                <option key={p.slug} value={p.slug} disabled={usedElsewhere.includes(p.slug)}>
                  {p.name}
                </option>
              ))}
            </select>
          );
        })}
      </div>
    </div>
  );
}

function PageLinkPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const isKnown = pageLinkOptions.some((o) => o.value === value);
  const [custom, setCustom] = useState(!isKnown && value !== "");

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</label>
      <select
        value={custom ? "__custom__" : value}
        onChange={(e) => {
          if (e.target.value === "__custom__") {
            setCustom(true);
            return;
          }
          setCustom(false);
          onChange(e.target.value);
        }}
        className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
      >
        {pageLinkOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
        <option value="__custom__">Custom link</option>
      </select>
      {custom && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/some-page or #section"
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
        />
      )}
    </div>
  );
}
