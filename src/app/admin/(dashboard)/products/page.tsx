"use client";

import { useState } from "react";
import Link from "next/link";
import { doc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { products as defaultProducts } from "@/lib/products";
import { useContent } from "@/contexts/ContentContext";
import Spinner from "@/components/Spinner";

export default function ProductsListPage() {
  const { products } = useContent();
  const [syncing, setSyncing] = useState(false);

  async function handleDelete(slug: string) {
    if (!db) return;
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await deleteDoc(doc(db, "products", slug));
  }

  async function handleSync() {
    if (!db) return;
    if (
      !confirm(
        "This will delete every product currently in the database and replace it with the 6 default Dr. Choice products from the code. Continue?"
      )
    )
      return;
    setSyncing(true);
    const batch = writeBatch(db);
    for (const p of products) {
      if (!defaultProducts.some((d) => d.slug === p.slug)) {
        batch.delete(doc(db, "products", p.slug));
      }
    }
    for (const p of defaultProducts) {
      const { slug, ...data } = p;
      batch.set(doc(db, "products", slug), data);
    }
    await batch.commit();
    setSyncing(false);
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
            Catalog
          </p>
          <h1 className="mt-1 text-2xl text-gray-900">Products</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900 disabled:opacity-60"
          >
            {syncing && <Spinner size={14} className="border-gray-300 border-t-gray-700" />}
            {syncing ? "Syncing..." : "Sync with code defaults"}
          </button>
          <Link
            href="/admin/products/new"
            className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            + Add product
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {products.map((p, i) => (
          <div
            key={p.slug}
            className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md animate-[fadeIn_0.4s_ease-out_forwards] opacity-0 sm:flex-row sm:items-center sm:justify-between"
            style={{ animationDelay: `${Math.min(i * 60, 300)}ms` }}
          >
            <div>
              <p className="text-sm font-medium text-gray-900">{p.name}</p>
              <p className="mt-1 text-xs text-gray-400">
                {p.category} &middot; {p.price} &middot; /{p.slug}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/products/${p.slug}`}
                className="rounded-lg border border-gray-200 px-4 py-2 text-xs text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(p.slug)}
                className="rounded-lg px-3 py-2 text-xs text-gray-400 transition-colors hover:text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <p className="text-sm text-gray-400">No products yet. Add your first one.</p>
        )}
      </div>

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
