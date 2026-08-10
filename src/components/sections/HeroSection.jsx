"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImageProps } from "next/image";
import heroDesktop from "../../../public/hero-desktop.webp";
import heroMobile from "../../../public/hero-mobile.webp";

gsap.registerPlugin(ScrollTrigger);

function HeroImage() {
  const common = {
    alt: "Be Alttred — we are a design agency with good taste.",
    sizes: "100vw",
  };

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: heroDesktop });

  const {
    props: { srcSet: mobileSrcSet, ...imgProps },
  } = getImageProps({ ...common, src: heroMobile });

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
      <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
      <img
        {...imgProps}
        loading="eager"
        fetchPriority="high"
        className="block w-full h-auto aspect-[780/1232] md:aspect-[2880/1526] object-cover"
      />
    </picture>
  );
}

export default function HeroSection() {
  const heroRef   = useRef(null);
  const imageRef  = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    const img = imageRef.current;
    if (!el || !img) return;

    // Single context — ctx.revert() cleans up everything atomically
    const ctx = gsap.context(() => {

      // ── Initial state (before paint) ───────────────────────────────────────
      gsap.set(img, { opacity: 0, scale: 1.06 });

      // ── Entrance ───────────────────────────────────────────────────────────
      gsap.to(img, {
        opacity: 1, scale: 1,
        duration: 1.4, ease: "power4.out", delay: 0.2,
      });

    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="w-full relative overflow-hidden"
    >
      {/* Hero Image */}
      <div ref={imageRef} className="relative w-full">
        <HeroImage />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10" />
      </div>
    </section>
  );
}
