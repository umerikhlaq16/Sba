"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AboutSection from "@/components/AboutSection";
import Products from "@/components/Products";
import FacilitySection from "@/components/FacilitySection";
import BrandsWeWorkWith from "@/components/BrandsWeWorkWith";
import { useSection } from "@/contexts/ContentContext";

export default function Home() {
  const hero = useSection("hero") as {
    title: string;
    description: string;
    image: string;
    video: string;
    slides?: { image: string }[];
    primaryCtaLabel: string;
    primaryCtaLink: string;
    secondaryCtaLabel: string;
    secondaryCtaLink: string;
  };

  const slides = (hero.slides ?? []).filter((s) => s.image);
  const bannerImages = slides.length > 0 ? slides.map((s) => s.image) : hero.image ? [hero.image] : [];
  const [current, setCurrent] = useState(0);
  const videoSrc = hero.video || "/hero-video-2.mp4";

  useEffect(() => {
    if (videoSrc || bannerImages.length < 2) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [bannerImages.length, videoSrc]);

  function handleHeroLinkClick(e: React.MouseEvent, href: string) {
    if (!href.startsWith("/#")) return;
    e.preventDefault();
    document.getElementById(href.slice(2))?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div>
      <section id="home" className="relative w-full overflow-hidden">
        <div className="relative h-screen w-full bg-foreground">
          {videoSrc ? (
            <video
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
          ) : (
            bannerImages.map((img, i) => (
              <Image
                key={img + i}
                src={img}
                alt="SB Alliance"
                fill
                priority={i === 0}
                className={`absolute inset-0 object-cover transition-opacity duration-700 ${
                  i === current ? "opacity-40" : "opacity-0"
                }`}
              />
            ))
          )}

          <div className="absolute inset-0 bg-black/40" />

          <div className="relative flex h-full items-center justify-center px-4 text-center sm:px-6 lg:px-8">
            <div className="hero-fade-up mx-auto flex w-full max-w-[1600px] flex-col items-center">
              <h1 className="max-w-4xl font-serif text-5xl leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
                {hero.title}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white sm:text-lg">
                {hero.description}
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={hero.primaryCtaLink}
                  onClick={(e) => handleHeroLinkClick(e, hero.primaryCtaLink)}
                  className="min-w-[220px] bg-brand px-7 py-3.5 text-center text-[13px] font-medium uppercase tracking-[0.1em] text-white hover:bg-white hover:text-foreground"
                >
                  {hero.primaryCtaLabel}
                </Link>
                <Link
                  href={hero.secondaryCtaLink}
                  onClick={(e) => handleHeroLinkClick(e, hero.secondaryCtaLink)}
                  className="min-w-[220px] border border-white/40 px-7 py-3.5 text-center text-[13px] font-medium uppercase tracking-[0.1em] text-white hover:border-white"
                >
                  {hero.secondaryCtaLabel}
                </Link>
              </div>
            </div>
          </div>

          {!videoSrc && bannerImages.length > 1 && (
            <div className="absolute bottom-6 right-6 flex items-center gap-2 sm:bottom-8 sm:right-8">
              {bannerImages.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setCurrent(i)}
                  className={`h-2 w-2 rounded-full ${i === current ? "bg-white" : "bg-white/40"}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <AboutSection />
      <Products />
      <FacilitySection />
      <BrandsWeWorkWith />
    </div>
  );
}
