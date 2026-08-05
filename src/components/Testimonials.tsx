"use client";

import { useState } from "react";
import { useSection } from "@/contexts/ContentContext";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const copy = useSection("testimonials") as {
    enabled?: boolean;
    eyebrow: string;
    eyebrowSize?: number;
    heading1: string;
    heading2: string;
    subtext: string;
    items: { quote: string; name: string; role: string }[];
  };
  const testimonials = copy.items ?? [];
  const total = testimonials.length || 1;
  const t = testimonials[index] ?? { quote: "", name: "", role: "" };
  const prevT = testimonials[(index - 1 + total) % total] ?? t;
  const nextT = testimonials[(index + 1) % total] ?? t;

  const next = () => setIndex((index + 1) % total);
  const prev = () => setIndex((index - 1 + total) % total);

  if (copy.enabled === false) return null;

  const navControls = (
    <div className="flex items-center gap-4">
      <span className="text-xs font-medium uppercase tracking-widest text-foreground/40">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={prev}
          aria-label="Previous testimonial"
          className="flex h-10 w-10 items-center justify-center border border-foreground/15 text-foreground/60 hover:border-brand hover:text-brand"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={next}
          aria-label="Next testimonial"
          className="flex h-10 w-10 items-center justify-center border border-foreground/15 text-foreground/60 hover:border-brand hover:text-brand"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden border-t border-foreground/10 bg-background px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="relative mx-auto max-w-[1600px]">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <div className="max-w-md">
            <p
              className="font-medium uppercase tracking-widest text-brand"
              style={{ fontSize: `${copy.eyebrowSize ?? 12}px` }}
            >
              {copy.eyebrow}
            </p>
            <h2 className="mt-3 font-serif text-2xl leading-snug text-foreground sm:text-3xl">
              {copy.heading1}
              <br />
              {copy.heading2}
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-foreground/60">{copy.subtext}</p>
          </div>

          <div className="hidden sm:block">{navControls}</div>
        </div>

        <div className="relative mt-16 sm:mt-20">
          <p
            aria-hidden
            className="pointer-events-none absolute left-0 top-1/2 hidden w-[280px] -translate-y-1/2 select-none font-serif text-xl leading-snug text-foreground/[0.08] lg:block"
          >
            &ldquo;{prevT.quote}&rdquo;
          </p>
          <p
            aria-hidden
            className="pointer-events-none absolute right-0 top-1/2 hidden w-[280px] -translate-y-1/2 select-none text-right font-serif text-xl leading-snug text-foreground/[0.08] lg:block"
          >
            &ldquo;{nextT.quote}&rdquo;
          </p>

          <blockquote className="mx-auto max-w-3xl text-center font-serif text-2xl leading-snug text-foreground sm:text-3xl lg:text-4xl">
            &ldquo;{t.quote}&rdquo;
          </blockquote>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-brand" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">{t.name}</p>
              <p className="text-xs text-foreground/50">{t.role}</p>
            </div>
            <span className="h-px w-8 bg-brand" />
          </div>
        </div>

        <div className="mt-10 flex justify-center sm:hidden">{navControls}</div>
      </div>
    </section>
  );
}
