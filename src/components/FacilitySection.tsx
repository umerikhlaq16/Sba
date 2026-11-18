"use client";

import Image from "next/image";
import Link from "next/link";
import { useSection } from "@/contexts/ContentContext";

export default function FacilitySection() {
  const copy = useSection("facility") as {
    heroTitle: string;
    heroSubtext: string;
    facilityImage: string;
  };

  return (
    <section id="facility" className="scroll-mt-24 border-t border-foreground/10 bg-background px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <p
          className="section-label text-brand"
        >
          Facility &amp; Process
        </p>
        <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-snug text-foreground sm:text-5xl">
          {copy.heroTitle}
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/60">
          {copy.heroSubtext}
        </p>

        <div className="mt-14">
          <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/7]">
            {copy.facilityImage ? (
              <Image src={copy.facilityImage} alt="SB Alliance facility" fill sizes="100vw" className="object-cover" />
            ) : (
              <div
                className="h-full w-full"
                style={{ background: "linear-gradient(135deg, #ffd9e2, #ee4e72)" }}
              />
            )}
          </div>
        </div>

        <div className="mt-16 flex justify-center sm:mt-20">
          <Link
            href="/contact"
            className="border border-brand px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.1em] text-brand hover:bg-brand hover:text-white"
          >
            Start an Inquiry
          </Link>
        </div>
      </div>
    </section>
  );
}
