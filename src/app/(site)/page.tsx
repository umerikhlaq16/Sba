"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AboutSection from "@/components/AboutSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import Products from "@/components/Products";
import FacilitySection from "@/components/FacilitySection";
import BrandsWeWorkWith from "@/components/BrandsWeWorkWith";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import { useSection } from "@/contexts/ContentContext";

export default function Home() {
  const hero = useSection("hero") as {
    eyebrow: string;
    eyebrowSize?: number;
    title: string;
    description: string;
    image: string;
    video: string;
    slides?: { image: string }[];
    primaryCtaLabel: string;
    primaryCtaLink: string;
    secondaryCtaLabel: string;
    secondaryCtaLink: string;
    stats: { value: string; label: string }[];
  };

  const slides = (hero.slides ?? []).filter((s) => s.image);
  const bannerImages = slides.length > 0 ? slides.map((s) => s.image) : hero.image ? [hero.image] : [];
  const [current, setCurrent] = useState(0);
  const videoSrc = hero.video || "/hero-video.mp4";

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
              <span
                className="inline-block font-medium uppercase tracking-[0.16em] text-white/80"
                style={{ fontSize: `${hero.eyebrowSize ?? 12}px` }}
              >
                {hero.eyebrow}
              </span>
              <h1 className="mt-5 max-w-2xl font-serif text-4xl leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {hero.title}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
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

        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-b border-foreground/10 py-10 sm:grid-cols-4 sm:py-12">
            {(hero.stats ?? []).map((stat, i) => (
              <div key={i}>
                <p className="font-serif text-3xl text-foreground sm:text-4xl">{stat.value}</p>
                <p className="mt-1.5 text-xs uppercase tracking-[0.08em] text-foreground/55 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AboutSection />
      <WhyChooseUs />
      <Products />
      <FacilitySection />
      <BrandsWeWorkWith />
      <Testimonials />
      <Faq />
    </div>
  );
}
