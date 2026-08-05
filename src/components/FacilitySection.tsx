"use client";

import Image from "next/image";
import Link from "next/link";
import { useSection } from "@/contexts/ContentContext";

const stats = [
  { value: "40,000 sqft", label: "Total plot size" },
  { value: "10,000 sqft", label: "Covered facility" },
  { value: "20M+", label: "Units produced yearly" },
  { value: "6", label: "Stage production process" },
];

const materials = [
  {
    title: "Polymers",
    desc: "Sourced from SABIC, ExxonMobil, and Kumho for consistent handle and body quality.",
  },
  {
    title: "Bristles",
    desc: "Nylon 6,12 bristles, selected for durability and consistent softness across every range.",
  },
  {
    title: "Wire",
    desc: "UK-sourced nickel-silver wire, used across our tufting process for reliable bristle anchoring.",
  },
];

const process = [
  { title: "Injection Molding", desc: "Handles and bodies are molded from raw polymer to precise specification." },
  { title: "CNC Tufting", desc: "Bristles are tufted into each handle with CNC precision for consistent density." },
  { title: "Hot Stamping", desc: "Branding and detailing are applied with hot stamping for a durable finish." },
  { title: "Packaging", desc: "Each range is packaged to its final retail or export specification." },
  { title: "Quality Control", desc: "Every batch is tested against our quality standard before it leaves the floor." },
  { title: "Warehouse & Logistics", desc: "Finished goods are stored and dispatched to domestic and export partners." },
];

export default function FacilitySection() {
  const copy = useSection("facility") as {
    heroTitle: string;
    eyebrowSize?: number;
    heroSubtext: string;
    facilityHeading: string;
    facilityPara1: string;
    facilityPara2: string;
    facilityImage: string;
  };

  return (
    <section id="facility" className="scroll-mt-24 border-t border-foreground/10 bg-background px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <p
          className="font-medium uppercase tracking-widest text-brand"
          style={{ fontSize: `${copy.eyebrowSize ?? 20}px` }}
        >
          Facility &amp; Process
        </p>
        <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-snug text-foreground sm:text-5xl">
          {copy.heroTitle}
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/60">
          {copy.heroSubtext}
        </p>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            {copy.facilityImage ? (
              <Image src={copy.facilityImage} alt="SB Alliance facility" fill className="object-cover" />
            ) : (
              <div
                className="h-full w-full"
                style={{ background: "linear-gradient(135deg, #ffd9e2, #ee4e72)" }}
              />
            )}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-foreground/40">The facility</p>
            <h3 className="mt-3 font-serif text-2xl leading-snug text-foreground sm:text-3xl">
              {copy.facilityHeading}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-foreground/60">{copy.facilityPara1}</p>
            <p className="mt-4 text-sm leading-relaxed text-foreground/60">{copy.facilityPara2}</p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 border-y border-foreground/10 py-10 sm:mt-20 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-serif text-2xl text-foreground sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-foreground/40">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 sm:mt-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-brand">Raw materials</p>
            <h3 className="mt-3 max-w-xl font-serif text-2xl leading-snug text-foreground sm:text-3xl">
              Sourced from trusted global suppliers.
            </h3>
          </div>

          <div className="mt-10 grid grid-cols-1 border-t border-foreground/10 sm:grid-cols-3">
            {materials.map((m, i) => (
              <div
                key={m.title}
                className={`border-b border-foreground/10 py-8 pr-6 sm:pr-8 ${
                  i < materials.length - 1 ? "sm:border-r" : ""
                } ${i > 0 ? "sm:pl-8" : ""}`}
              >
                <span className="text-xs font-medium uppercase tracking-widest text-foreground/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-4 font-serif text-lg text-foreground">{m.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/60">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 sm:mt-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-brand">The process</p>
            <h3 className="mt-3 max-w-xl font-serif text-2xl leading-snug text-foreground sm:text-3xl">
              From raw material to finished range.
            </h3>
          </div>

          <div className="mt-10 border-t border-foreground/10">
            {process.map((step, i) => (
              <div
                key={step.title}
                className="flex flex-col gap-2 border-b border-foreground/10 py-6 sm:flex-row sm:items-center sm:gap-8"
              >
                <span className="text-xs font-medium uppercase tracking-widest text-foreground/40 sm:w-10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-serif text-lg text-foreground sm:w-56 sm:shrink-0">{step.title}</p>
                <p className="flex-1 text-sm leading-relaxed text-foreground/60">{step.desc}</p>
              </div>
            ))}
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
