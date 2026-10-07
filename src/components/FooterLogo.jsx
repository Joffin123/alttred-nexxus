"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];
const LOGO = "/new-logo.svg";

// The wordmark is always rendered as one flat image — several letters in the
// artwork overlap, and animating them as separate shapes exposes those seams.
//
//  1. Reveal: wipes in left → right, rising and sharpening, when scrolled into view
//  2. Spotlight (mouse/trackpad only): a soft light follows the cursor and
//     brightens the part of the logo underneath it
export default function FooterLogo({ className = "" }) {
  const reduce = useReducedMotion();
  const wrapRef = useRef(null);
  const lightRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const light = lightRef.current;
    if (!wrap || !light || reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    // Listen on the whole footer so the light can enter from anywhere around the logo
    const area = wrap.closest("section") || wrap;
    let raf = 0;
    let x = 0, y = 0;

    const paint = () => {
      raf = 0;
      light.style.setProperty("--x", `${x}px`);
      light.style.setProperty("--y", `${y}px`);
    };
    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      light.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onLeave = () => { light.style.opacity = "0"; };

    area.addEventListener("pointermove", onMove);
    area.addEventListener("pointerleave", onLeave);
    return () => {
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    // The outer box triggers the reveal and the inner one animates: an element
    // clipped to zero width counts as "not visible", so it can't watch itself.
    <motion.div
      ref={wrapRef}
      role="img"
      aria-label="Alttred Nexxus"
      className={`relative ${className}`}
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        variants={{
          hidden: { clipPath: "inset(0% 100% 0% 0%)", y: 40, filter: "blur(12px)" },
          show:   { clipPath: "inset(0% 0% 0% 0%)", y: 0, filter: "blur(0px)", transition: { duration: 1.6, ease: EASE } },
        }}
        className="relative"
      >
      {/* Base watermark */}
      <img
        src={LOGO}
        alt=""
        aria-hidden="true"
        width={257}
        height={93}
        draggable={false}
        className="block w-full h-auto opacity-[0.12] select-none pointer-events-none"
      />

      {/* Spotlight layer — same logo, brighter, masked to a soft circle at the cursor */}
      <img
        ref={lightRef}
        src={LOGO}
        alt=""
        aria-hidden="true"
        width={257}
        height={93}
        draggable={false}
        className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-500 ease-out select-none pointer-events-none"
        style={{
          "--x": "50%",
          "--y": "50%",
          WebkitMaskImage: "radial-gradient(circle 220px at var(--x) var(--y), rgba(0,0,0,0.7), transparent 70%)",
          maskImage: "radial-gradient(circle 220px at var(--x) var(--y), rgba(0,0,0,0.7), transparent 70%)",
        }}
      />
      </motion.div>
    </motion.div>
  );
}
