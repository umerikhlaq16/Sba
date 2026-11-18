"use client";

import Image from "next/image";
import { useSection } from "@/contexts/ContentContext";

export default function BrandsWeWorkWith() {
  const copy = useSection("brandsHome") as {
    enabled?: boolean;
    eyebrow: string;
    heading: string;
    badgeLabel: string;
    brands: { name: string; logo?: string }[];
  };
  const brands = copy.brands ?? [];

  if (copy.enabled === false) return null;

  return (
    <section
      id="partners"
      className="scroll-mt-24 border-t border-foreground/10 bg-background px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col items-center text-center">
          <p
            className="section-label text-brand"
          >
            {copy.eyebrow}
          </p>
          <h2 className="mt-3 max-w-xl font-serif text-4xl leading-snug text-foreground sm:text-5xl">
            {copy.heading}
          </h2>
          {copy.badgeLabel && (
            <span className="mt-6 border border-brand/30 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-brand">
              {copy.badgeLabel}
            </span>
          )}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-16 sm:grid-cols-3 sm:gap-x-8">
          {brands.map((b, i) => (
            <div
              key={i}
              className="flex h-16 items-center justify-center border-b border-foreground/10 pb-6 sm:h-20"
            >
              {b.logo ? (
                <div className="relative h-full w-full max-w-[160px]">
                  <Image src={b.logo} alt={b.name} fill className="object-contain" />
                </div>
              ) : (
                <p className="font-serif text-lg text-foreground/70 sm:text-xl">{b.name}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
