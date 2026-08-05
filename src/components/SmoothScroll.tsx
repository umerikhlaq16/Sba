"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      autoRaf: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    lenisRef.current = lenis;
    (window as unknown as { __appLenis?: Lenis }).__appLenis = lenis;

    // Content height changes constantly here (Firestore data streaming in,
    // images loading, route swaps) — Lenis only knows the real scroll range
    // if it re-measures whenever that height changes, otherwise it clamps
    // scrolling to a stale (usually shorter) height and feels "stuck".
    let raf = 0;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      });
    });
    resizeObserver.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __appLenis?: Lenis }).__appLenis;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    const hash = window.location.hash.slice(1);
    if (hash) {
      // Landed here via a nav link like "/#about" — smooth-scroll to that
      // section instead of snapping to top once its content has painted.
      lenis.resize();
      ScrollTrigger.refresh();
      const raf = requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (el) lenis.scrollTo(el, { duration: 1.2 });
        lenis.resize();
        ScrollTrigger.refresh();
      });
      return () => cancelAnimationFrame(raf);
    }

    lenis.scrollTo(0, { immediate: true });
    lenis.resize();
    ScrollTrigger.refresh();

    // Content for the new route (Firestore-driven sections, images) can
    // keep growing for a moment after mount, so re-measure once more on
    // the next frame in case that first pass measured too early.
    const raf = requestAnimationFrame(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
