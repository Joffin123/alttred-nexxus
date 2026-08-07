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
  const scrollRef = useRef(null);
  const imageRef  = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    const img = imageRef.current;
    const si = scrollRef.current;
    if (!el || !img || !si) return;

    // Single context — ctx.revert() cleans up everything atomically
    const ctx = gsap.context(() => {

      // ── Initial state (before paint) ───────────────────────────────────────
      gsap.set(img, { opacity: 0, scale: 1.06 });
      gsap.set(si, { opacity: 0 });

      // ── Entrance ───────────────────────────────────────────────────────────
      gsap.to(img, {
        opacity: 1, scale: 1,
        duration: 1.4, ease: "power4.out", delay: 0.2,
      });
      gsap.to(si, {
        opacity: 1,
        duration: 0.9, ease: "power3.out", delay: 1.0,
      });

      // ── Scroll exit ────────────────────────────────────────────────────────
      // immediateRender: false — critical: stops scroll tweens from snapshotting
      // the initial opacity:0 / scale:1.06 state while the entrance is still running.

      gsap.to(si, {
        opacity: 0, y: -18,
        ease: "none", immediateRender: false,
        scrollTrigger: {
          trigger: el, start: "top top", end: "18% top", scrub: 1,
        },
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

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="scroll-drop absolute right-10 md:right-14 bottom-14 flex flex-col items-center gap-2 pointer-events-none z-20"
      >
        <span className="text-[9px] font-sans tracking-[0.35em] text-neutral-300 uppercase">
          SCROLL
        </span>
        <div className="relative w-px h-10 bg-white/25 rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-3 bg-[#ff6b3d] rounded-full" />
        </div>
      </div>
    </section>
  );
}
