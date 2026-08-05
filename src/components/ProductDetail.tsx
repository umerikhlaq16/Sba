"use client";

import Image from "next/image";
import Link from "next/link";
import { useContent } from "@/contexts/ContentContext";

export default function ProductDetail({ slug }: { slug: string }) {
  const { products, loading } = useContent();
  const product = products.find((p) => p.slug === slug);
  const related = product ? products.filter((p) => p.slug !== product.slug).slice(0, 3) : [];

  if (!product) {
    return (
      <div className="bg-background px-6 py-40 text-center">
        <p className="text-sm text-foreground/60">
          {loading ? "Loading product..." : "Product not found."}
        </p>
        {!loading && (
          <Link href="/#products" className="mt-4 inline-block text-sm font-medium text-foreground underline">
            Back to catalog
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="bg-background px-4 pb-24 pt-32 sm:px-6 sm:pt-40 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-center gap-2 text-xs text-foreground/40">
          <Link href="/#products" className="uppercase tracking-widest hover:text-foreground">
            Catalog
          </Link>
          <span>/</span>
          <span className="uppercase tracking-widest text-brand">{product.category}</span>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-square w-full overflow-hidden rounded-md bg-foreground/5">
            {product.image ? (
              <Image src={product.image} alt={product.name} fill className="object-cover" priority />
            ) : (
              <div
                className="h-full w-full"
                style={{ background: `linear-gradient(135deg, ${product.from}, ${product.to})` }}
              />
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-xs font-medium uppercase tracking-widest text-brand">
              {product.category}
            </p>
            <h1 className="mt-3 font-serif text-3xl leading-snug text-foreground sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/60">
              {product.tagline}
            </p>

            <ul className="mt-8 flex flex-col gap-3">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-foreground/70">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="border border-brand px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.1em] text-brand hover:bg-brand hover:text-white"
              >
                Start an Inquiry
              </Link>

              <Link
                href="/#products"
                className="border border-foreground/20 px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.1em] text-foreground hover:border-foreground"
              >
                Back to Catalog
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-foreground/10 pt-10 sm:mt-20">
          <p className="text-xs font-medium uppercase tracking-widest text-foreground/40">Specs</p>
          <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
            {product.specs.map((s) => (
              <div key={s.label} className="flex items-center justify-between border-b border-foreground/10 py-3">
                <span className="text-sm text-foreground/50">{s.label}</span>
                <span className="text-sm font-medium text-foreground">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16 sm:mt-20">
            <p className="text-xs font-medium uppercase tracking-widest text-foreground/40">
              Also in the range
            </p>
            <div className="mt-6 border-t border-foreground/10">
              {related.map((p, i) => (
                <Link
                  key={p.slug}
                  href={`/product/${p.slug}`}
                  className="group flex flex-col gap-2 border-b border-foreground/10 py-6 hover:bg-foreground/[0.03] sm:flex-row sm:items-center sm:gap-8"
                >
                  <span className="text-xs font-medium uppercase tracking-widest text-foreground/40 sm:w-10">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-serif text-lg text-foreground sm:w-56 sm:shrink-0">{p.name}</p>
                  <p className="flex-1 text-sm leading-relaxed text-foreground/60">{p.desc}</p>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-foreground/15 text-foreground/50 group-hover:border-brand group-hover:text-brand">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7 17 17 7M9 7h8v8"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
