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
    storyImage: string;
    gallery?: { image: string }[];
  };
  // Up to 4 extra photos shown beside the main image (managed in Admin → About).
  const gallery = (copy.gallery ?? [])
    .map((g) => g.image)
    .filter(Boolean)
    .slice(0, 4);
  return (
    <section id="about" className="scroll-mt-24 border-t border-foreground/10 bg-background px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <p className="section-label text-brand">
          Who We Are
        </p>
        <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-snug text-foreground sm:text-5xl">
          {copy.heroTitle}
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/60">
          {copy.heroSubtext}
        </p>

        <div
          className={`mt-14 grid grid-cols-1 gap-4 sm:gap-6 ${gallery.length > 0 ? "lg:grid-cols-2" : ""}`}
        >
          <div className={`relative w-full overflow-hidden ${gallery.length > 0 ? "aspect-[4/3]" : "aspect-[4/3] sm:aspect-[16/7]"}`}>
            {copy.storyImage ? (
              <Image src={copy.storyImage} alt="SB Alliance facility" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            ) : (
              <div
                className="h-full w-full"
                style={{ background: "linear-gradient(135deg, #ffd9e2, #ee4e72)" }}
              />
            )}
          </div>
          {gallery.length > 0 && (
            <div
              className={`grid gap-4 sm:gap-6 ${gallery.length === 1 ? "grid-cols-1" : "grid-cols-2"} ${
                gallery.length >= 3 ? "lg:grid-rows-2" : "lg:grid-rows-1"
              }`}
            >
              {gallery.map((img, i) => (
                <div
                  key={img + i}
                  className={`relative w-full overflow-hidden ${
                    gallery.length === 1
                      ? "aspect-[4/3]"
                      : gallery.length === 3 && i === 0
                        ? "col-span-2 aspect-[2/1] lg:aspect-auto"
                        : "aspect-square lg:aspect-auto"
                  } lg:min-h-0`}
                >
                  <Image src={img} alt={`SB Alliance photo ${i + 1}`} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 border-t border-foreground/10 pt-16 sm:mt-20 sm:pt-20">
          <div className="reveal-block">
            <p className="section-label text-brand">What we stand for</p>
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
                <span className="text-sm font-medium uppercase tracking-widest text-foreground/40 sm:text-base">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-4 font-serif text-xl text-foreground sm:text-2xl">{v.title}</p>
                <p className="mt-3 text-base leading-relaxed text-foreground/70 sm:text-lg">{v.desc}</p>
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
