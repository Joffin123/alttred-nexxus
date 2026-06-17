"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroCanvasBg from "../HeroCanvasBg";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const heroRef   = useRef(null);
  const scrollRef = useRef(null);
  const line1Ref  = useRef(null);
  const line2Ref  = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    const si = scrollRef.current;
    if (!el || !l1 || !l2 || !si) return;

    // Single context — ctx.revert() cleans up everything atomically
    const ctx = gsap.context(() => {

      // ── Initial state (before paint) ───────────────────────────────────────
      gsap.set([l1, l2], { opacity: 0, y: 40 });
      gsap.set(si, { opacity: 0 });

      // ── Entrance ───────────────────────────────────────────────────────────
      gsap.to([l1, l2], {
        opacity: 1, y: 0,
        duration: 1.2, stagger: 0.14,
        ease: "power4.out", delay: 0.3,
      });
      gsap.to(si, {
        opacity: 1,
        duration: 0.9, ease: "power3.out", delay: 1.0,
      });

      // ── Scroll exit ────────────────────────────────────────────────────────
      // immediateRender: false — critical: stops scroll tweens from snapshotting
      // the initial opacity:0 / y:40 state while the entrance is still running.

      gsap.to(si, {
        opacity: 0, y: -18,
        ease: "none", immediateRender: false,
        scrollTrigger: {
          trigger: el, start: "top top", end: "18% top", scrub: 1,
        },
      });

      gsap.to(l1, {
        y: -110, opacity: 0,
        ease: "none", immediateRender: false,
        scrollTrigger: {
          trigger: el, start: "top top", end: "50% top", scrub: 1.2,
        },
      });

      gsap.to(l2, {
        y: -70, opacity: 0,
        ease: "none", immediateRender: false,
        scrollTrigger: {
          trigger: el, start: "8% top", end: "55% top", scrub: 1.5,
        },
      });

      gsap.to(el, {
        scale: 0.97, filter: "blur(3px)",
        ease: "none", immediateRender: false,
        scrollTrigger: {
          trigger: el, start: "top top", end: "55% top", scrub: 1,
        },
      });

    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="w-full h-[70vh] md:h-screen flex flex-col justify-end px-8 md:px-14 pb-14 relative overflow-hidden"
    >
      {/* Interactive Hero Canvas Background */}
      <HeroCanvasBg />

      {/* Cyber Grid Background layer */}
      <div className="absolute inset-0 pointer-events-none cyber-grid z-10" />

      {/* Text Content */}
      <div className="flex flex-col items-start gap-1 relative z-20">
        <h1
          ref={line1Ref}
          className="font-sans font-extrabold text-[8vw] md:text-[3.8vw] tracking-[-0.03em] leading-none uppercase md:whitespace-nowrap"
        >
          WE MAKE EXPERIENCE
        </h1>
        <h1
          ref={line2Ref}
          className="font-sans font-normal text-[8vw] md:text-[3.8vw] tracking-[-0.03em] leading-none uppercase md:whitespace-nowrap"
        >
          For The New Mainstream
        </h1>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="scroll-drop absolute right-10 md:right-14 bottom-14 flex flex-col items-center gap-2 pointer-events-none z-20"
      >
        <span className="text-[9px] font-sans tracking-[0.35em] text-neutral-500 uppercase">
          SCROLL
        </span>
        <div className="relative w-px h-10 bg-white/15 rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-3 bg-[#ff6b3d] rounded-full" />
        </div>
      </div>
    </section>
  );
}
