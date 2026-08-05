"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { contentSchema } from "@/lib/schema";
import { useContent } from "@/contexts/ContentContext";

export default function AdminDashboard() {
  const { products } = useContent();
  const pages = Array.from(new Set(contentSchema.map((s) => s.page)));
  const [mounted, setMounted] = useState(false);
  const pageDelays = ["delay-200", "delay-300", "delay-400", "delay-500"];

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const fade = (delay: string) =>
    `transition-all duration-500 ease-out ${delay} ${
      mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
    }`;

  return (
    <div>
      <p className={`text-xs font-medium uppercase tracking-widest text-gray-400 ${fade("delay-0")}`}>
        Overview
      </p>
      <h1 className={`mt-2 text-2xl text-gray-900 ${fade("delay-75")}`}>What do you want to edit?</h1>
      <p className={`mt-2 max-w-xl text-sm text-gray-500 ${fade("delay-100")}`}>
        Edit a section, hit save, and the live site updates instantly, no
        redeploy needed.
      </p>

      <Link
        href="/admin/products"
        className={`group mt-8 flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md ${fade("delay-150")}`}
      >
        <div>
          <p className="text-sm font-medium text-gray-900">Products</p>
          <p className="mt-1 text-xs text-gray-400">
            {products.length} products, used across Home, Catalog, and product pages
          </p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-gray-900 group-hover:text-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14M13 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </Link>

      {pages.map((page, pi) => (
        <div key={page} className={`mt-10 ${fade(pageDelays[pi % pageDelays.length])}`}>
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">{page}</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {contentSchema
              .filter((s) => s.page === page)
              .map((s) => (
                <Link
                  key={s.key}
                  href={`/admin/content/${s.key}`}
                  className="group rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md"
                >
                  <p className="text-sm font-medium text-gray-900">{s.label}</p>
                  <p className="mt-1 text-xs text-gray-400">{s.fields.length} fields</p>
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
