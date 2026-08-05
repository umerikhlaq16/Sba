"use client";

import { useSection } from "@/contexts/ContentContext";

export default function WhyChooseUs() {
  const copy = useSection("whyChooseUs") as {
    enabled?: boolean;
    eyebrow: string;
    eyebrowSize?: number;
    description: string;
    headingPrefix: string;
    headingHighlight: string;
    headingHighlightColor: string;
    headingSuffix: string;
    reasons: { title: string; desc: string }[];
  };
  const reasons = copy.reasons ?? [];
  const columns = [reasons.slice(0, 2), reasons.slice(2, 4)];

  if (copy.enabled === false) return null;

  return (
    <section id="why-us" className="scroll-mt-24 border-t border-foreground/10 bg-background px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.3fr] lg:gap-16">
          <div>
            <div>
              <p
                className="font-serif font-semibold uppercase tracking-wide text-brand"
                style={{ fontSize: `${copy.eyebrowSize ?? 30}px` }}
              >
                {copy.eyebrow}
              </p>
              <h2 className="mt-3 font-serif text-4xl leading-snug text-foreground sm:text-5xl">
                {copy.headingPrefix}{" "}
                <span
                  className="px-1"
                  style={{ backgroundColor: copy.headingHighlightColor }}
                >
                  {copy.headingHighlight}
                </span>{" "}
                {copy.headingSuffix}
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-foreground/60">{copy.description}</p>
            </div>

            <a
              href="/contact"
              className="mt-8 inline-block border border-brand px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.1em] text-brand hover:bg-brand hover:text-white"
            >
              Start an Inquiry
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x sm:divide-foreground/10">
            {columns.map((col, ci) => (
              <div key={ci}>
                {col.map((r, ri) => (
                  <div
                    key={ri}
                    className={ri > 0 ? "border-t border-foreground/10" : ""}
                  >
                    <div
                      className={`flex items-start gap-4 py-6 ${
                        ci === 1 ? "sm:pl-10" : "sm:pr-10"
                      }`}
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand/30 font-serif text-sm text-brand">
                        {ci * 2 + ri + 1}
                      </span>
                      <div>
                        <p className="font-serif text-lg text-foreground">{r.title}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-foreground/60">{r.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
