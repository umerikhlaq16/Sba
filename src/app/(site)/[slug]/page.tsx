"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { PolicyPage } from "@/lib/policyPages";
import { LoadingScreen } from "@/components/Spinner";
import { useFooterVisibility } from "@/contexts/FooterVisibilityContext";
import { sanitizePolicyHtml } from "@/lib/sanitizeHtml";
import { getDefaultPolicy } from "@/lib/defaultPolicies";

export default function PolicyPageView() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  // Result of the Firestore lookup, tagged with the slug it belongs to so a stale
  // result from a previous slug is never shown.
  const [fetched, setFetched] = useState<{ slug: string; page: PolicyPage | null } | null>(null);
  const { setHideFooter } = useFooterVisibility();

  const fallback = slug ? getDefaultPolicy(slug) : null;
  const page: PolicyPage | null | undefined = !db || !slug
    ? fallback
    : fetched?.slug === slug
      ? fetched.page ?? fallback
      : undefined;

  useEffect(() => {
    setHideFooter(page === undefined);
    return () => setHideFooter(false);
  }, [page, setHideFooter]);

  useEffect(() => {
    if (!db || !slug) return;
    let cancelled = false;

    const q = query(
      collection(db, "policyPages"),
      where("slug", "==", slug),
      where("status", "==", "published"),
      limit(1)
    );
    getDocs(q)
      .then((snap) => {
        if (cancelled) return;
        const d = snap.docs[0];
        setFetched({ slug, page: d ? ({ id: d.id, ...d.data() } as PolicyPage) : null });
      })
      .catch(() => {
        if (!cancelled) setFetched({ slug, page: null });
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (page) {
      document.title = page.seoTitle || page.title;
      const desc = page.seoDescription;
      if (desc) {
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute("name", "description");
          document.head.appendChild(meta);
        }
        meta.setAttribute("content", desc);
      }
    }
  }, [page]);

  // CSS-only entrance animation (see .fade-up in globals.css), so content is
  // always visible once the animation ends, even if JS timing is throttled.
  const fade = (delay: string) => `fade-up ${delay}`;

  if (page === undefined) {
    return <LoadingScreen />;
  }

  if (page === null) {
    return (
      <div className={`flex min-h-[70vh] flex-col items-center justify-center px-6 text-center ${fade("delay-0")}`}>
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400">404</p>
        <h1 className="mt-3 text-2xl text-gray-900">Page not found</h1>
        <p className="mt-2 text-sm text-gray-500">
          This page doesn&apos;t exist or hasn&apos;t been published yet.
        </p>
        <Link href="/" className="mt-6 rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105">
          Back to home
        </Link>
      </div>
    );
  }

  const updated = page.updatedAt
    ? new Date(page.updatedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="bg-white px-6 pb-24 pt-32 sm:px-8 sm:pt-40 lg:px-12">
      <div className="mx-auto max-w-[850px]">
        <nav className={`flex items-center gap-2 text-xs text-gray-400 ${fade("delay-0")}`}>
          <Link href="/" className="transition-colors hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-600">{page.title}</span>
        </nav>

        {page.featuredImage && (
          <div className={`relative mt-8 aspect-[16/7] w-full overflow-hidden rounded-2xl bg-gray-100 ${fade("delay-100")}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={page.featuredImage} alt={page.title} className="h-full w-full object-cover" />
          </div>
        )}

        <h1 className={`mt-8 text-3xl font-normal leading-snug text-gray-900 sm:text-4xl ${fade("delay-150")}`}>
          {page.title}
        </h1>
        {updated && (
          <p className={`mt-3 text-sm text-gray-400 ${fade("delay-200")}`}>Last updated {updated}</p>
        )}

        <div
          className={`policy-prose prose prose-neutral mt-10 max-w-none prose-headings:font-normal prose-headings:tracking-tight prose-a:text-gray-900 prose-img:rounded-xl ${fade("delay-300")}`}
          dangerouslySetInnerHTML={{
            // Built-in pages are trusted, static HTML and can render on the server;
            // admin-authored content is sanitized (which only works in the browser).
            __html: page.id.startsWith("default-") ? page.content : sanitizePolicyHtml(page.content),
          }}
        />
      </div>
    </div>
  );
}
