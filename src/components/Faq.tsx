"use client";

import { useState } from "react";
import { useSection } from "@/contexts/ContentContext";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const copy = useSection("faq") as {
    enabled?: boolean;
    eyebrow: string;
    eyebrowSize?: number;
    heading1: string;
    heading2: string;
    subtext: string;
    items: { q: string; a: string }[];
  };
  const faqs = copy.items ?? [];

  if (copy.enabled === false) return null;

  return (
    <section
      id="faq"
      className="border-t border-foreground/10 bg-background px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 lg:grid-cols-[420px_1fr] lg:items-start lg:gap-16">
        <div>
          <p
            className="font-medium uppercase tracking-widest text-brand"
            style={{ fontSize: `${copy.eyebrowSize ?? 12}px` }}
          >
            {copy.eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-snug text-foreground sm:text-4xl">
            {copy.heading1}
            <br />
            {copy.heading2}
          </h2>

          <div className="mt-5">
            <p className="max-w-sm text-sm leading-relaxed text-foreground/60">{copy.subtext}</p>

            <div className="mt-8 hidden sm:block">
              <p className="text-sm text-foreground/50">Have another question?</p>
              <a href="/contact" className="mt-1 inline-block border-b border-brand pb-0.5 text-sm font-medium text-brand">
                Contact Us
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-foreground/10">
          {faqs.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.q} className="border-b border-foreground/10">
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="flex items-center gap-4">
                    <span
                      className={`text-xs font-medium uppercase tracking-widest ${
                        open ? "text-brand" : "text-foreground/30"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-base text-foreground sm:text-lg">{item.q}</span>
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center border ${
                      open ? "border-brand text-brand" : "border-foreground/20 text-foreground/50"
                    }`}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      {open ? (
                        <path d="M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      ) : (
                        <path
                          d="M12 5v14M5 12h14"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      )}
                    </svg>
                  </span>
                </button>

                {open && <p className="ml-9 pb-5 text-sm leading-relaxed text-foreground/60">{item.a}</p>}
              </div>
            );
          })}

          <div className="mt-8 flex flex-col items-center gap-2 text-center sm:hidden">
            <p className="text-sm text-foreground/50">Have another question?</p>
            <a href="/contact" className="inline-block text-sm font-medium text-brand underline underline-offset-4">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
