"use client";

import Image from "next/image";
import Link from "next/link";
import { useSection, useContent } from "@/contexts/ContentContext";

export default function Products() {
  const copy = useSection("productsHome") as {
    enabled?: boolean;
    eyebrow: string;
    eyebrowSize?: number;
    heading1: string;
    heading2: string;
    ctaLink: string;
    catalogPdfUrl?: string;
    selectedProducts?: string[];
  };
  const { products: allProducts } = useContent();
  const selectedSlugs = [...new Set((copy.selectedProducts ?? []).filter(Boolean))];
  const chosen = selectedSlugs
    .map((slug) => allProducts.find((p) => p.slug === slug))
    .filter(Boolean) as typeof allProducts;
  const products = chosen.length >= 4 ? chosen : allProducts.slice(0, 4);

  if (copy.enabled === false) return null;

  return (
    <section id="products" className="scroll-mt-24 border-t border-foreground/10 bg-background px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p
              className="font-medium uppercase tracking-widest text-brand"
              style={{ fontSize: `${copy.eyebrowSize ?? 12}px` }}
            >
              {copy.eyebrow}
            </p>
            <h2 className="mt-3 max-w-xl font-serif text-4xl leading-snug text-foreground sm:text-5xl">
              {copy.heading1}
              <br />
              {copy.heading2}
            </h2>
          </div>

          <a
            href={copy.catalogPdfUrl || copy.ctaLink}
            target={copy.catalogPdfUrl ? "_blank" : undefined}
            rel={copy.catalogPdfUrl ? "noreferrer" : undefined}
            className="hidden shrink-0 border border-brand px-6 py-3 text-xs font-medium uppercase tracking-widest text-brand hover:bg-brand hover:text-white sm:inline-block"
          >
            Download Catalog
          </a>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-16 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8">
          {products.map((p) => (
            <Link key={p.slug} href={`/product/${p.slug}`} className="group cursor-pointer">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                {p.image ? (
                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
                  />
                )}
              </div>

              <p className="mt-5 font-serif text-xl text-foreground">{p.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/60">{p.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-16 flex justify-center sm:hidden">
          <a
            href={copy.catalogPdfUrl || copy.ctaLink}
            target={copy.catalogPdfUrl ? "_blank" : undefined}
            rel={copy.catalogPdfUrl ? "noreferrer" : undefined}
            className="border border-brand px-6 py-3 text-xs font-medium uppercase tracking-widest text-brand hover:bg-brand hover:text-white"
          >
            Download Catalog
          </a>
        </div>
      </div>
    </section>
  );
}
