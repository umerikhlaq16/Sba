"use client";

import Image from "next/image";
import Link from "next/link";
import { useSection } from "@/contexts/ContentContext";

const values = [
  {
    title: "Export-Grade Quality",
    desc: "Every range is manufactured and tested to meet the standards of our international export partners.",
  },
  {
    title: "Decades of Experience",
    desc: "A family-run business built over more than a decade, backed by partners with 50+ years of combined experience.",
  },
  {
    title: "Ergonomic Design Expertise",
    desc: "Each range is engineered to balance everyday comfort with price sensitivity.",
  },
  {
    title: "Consistent Standards",
    desc: "One quality standard applied from raw material sourcing to final packaging, at every scale.",
  },
];

export default function AboutSection() {
  const copy = useSection("about") as {
    heroTitle: string;
    heroSubtext: string;
    storyHeading: string;
    storyPara1: string;
    storyPara2: string;
    storyImage: string;
    labelSize?: number;
  };
  const labelStyle = { fontSize: `${copy.labelSize ?? 15}px` };

  return (
    <section id="about" className="scroll-mt-24 border-t border-foreground/10 bg-background px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <p className="font-medium uppercase tracking-widest text-brand" style={labelStyle}>
          Who We Are
        </p>
        <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-snug text-foreground sm:text-5xl">
          {copy.heroTitle}
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/60">
          {copy.heroSubtext}
        </p>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            {copy.storyImage ? (
              <Image src={copy.storyImage} alt="SB Alliance" fill className="object-cover" />
            ) : (
              <div
                className="h-full w-full"
                style={{ background: "linear-gradient(135deg, #ffd9e2, #ee4e72)" }}
              />
            )}
          </div>
          <div>
            <p className="font-medium uppercase tracking-widest text-foreground/40" style={labelStyle}>Our story</p>
            <h3 className="mt-3 font-serif text-2xl leading-snug text-foreground sm:text-3xl">
              {copy.storyHeading}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-foreground/60">{copy.storyPara1}</p>
            <p className="mt-4 text-sm leading-relaxed text-foreground/60">{copy.storyPara2}</p>
          </div>
        </div>

        <div className="mt-16 border-t border-foreground/10 pt-16 sm:mt-20 sm:pt-20">
          <div className="reveal-block">
            <p className="font-medium uppercase tracking-widest text-brand" style={labelStyle}>What we stand for</p>
            <h3 className="mt-3 max-w-xl font-serif text-2xl leading-snug text-foreground sm:text-3xl">
              The principles behind every range we manufacture.
            </h3>
          </div>

          <div className="mt-10 grid grid-cols-1 border-t border-foreground/10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div
                key={v.title}
                className={`border-b border-foreground/10 py-8 pr-6 lg:py-10 lg:pr-8 ${
                  i < values.length - 1 ? "lg:border-r" : ""
                } ${i % 2 === 1 ? "sm:pl-6" : ""} ${i > 0 ? "lg:pl-8" : ""}`}
              >
                <span className="text-xs font-medium uppercase tracking-widest text-foreground/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-4 font-serif text-lg text-foreground">{v.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/60">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex justify-center sm:mt-20">
          <Link
            href="/#products"
            className="border border-brand px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.1em] text-brand hover:bg-brand hover:text-white"
          >
            Explore the Dr. Choice Range
          </Link>
        </div>
      </div>
    </section>
  );
}
