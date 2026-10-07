"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SLIDES = [
  {
    client: "ORACLE",
    caption: "Delivered a high-impact video shoot for the brand.",
    video: "/hero-oracle.mp4",
    poster: "/hero-oracle-poster.jpg",
  },
  {
    client: "METRO CASH & CARRY",
    caption: "Produced a Diwali campaign film for the brand.",
    video: "/hero-metro.mp4",
    poster: "/hero-metro-poster.jpg",
  },
  {
    client: "MANIPAL UNIVERSITY",
    caption: "Crafted a New Year campaign film for Online Manipal.",
    video: "/hero-manipal.mp4",
    poster: "/hero-manipal-poster.jpg",
  },
];

function SoundIcon({ muted }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" />
      {muted ? (
        <>
          <line x1="22" y1="9" x2="16" y2="15" />
          <line x1="16" y1="9" x2="22" y2="15" />
        </>
      ) : (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </>
      )}
    </svg>
  );
}

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [muted,  setMuted]  = useState(true);
  const videoRefs = useRef([]);
  const barRefs   = useRef([]);

  const sectionRef = useRef(null);
  const [inView, setInView] = useState(true);

  // Stop decoding video + progress updates once the hero scrolls away
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Sound is off by default — only the toggle can turn it on
  useEffect(() => {
    videoRefs.current.forEach((v) => { if (v) v.muted = muted; });
  }, [muted]);

  // Restart the active slide from the beginning whenever it changes
  useEffect(() => {
    const v = videoRefs.current[active];
    if (v) v.currentTime = 0;
  }, [active]);

  // Play only the active slide, and only while the hero is on screen
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && inView) {
        v.muted = muted;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, inView]);

  // Drive the segmented progress bar from the active video's playback position
  useEffect(() => {
    barRefs.current.forEach((bar, i) => {
      if (bar && i !== active) bar.style.transform = `scaleX(${i < active ? 1 : 0})`;
    });
    if (!inView) return;

    const v = videoRefs.current[active];
    const bar = barRefs.current[active];
    let raf;
    const tick = () => {
      if (v?.duration && bar) bar.style.transform = `scaleX(${v.currentTime / v.duration})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, inView]);

  const next = () => setActive((i) => (i + 1) % SLIDES.length);
  const slide = SLIDES[active];

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full h-[100svh] min-h-[560px] overflow-hidden bg-black"
    >
      <h1 className="sr-only">
        Alttred Nexxus — Web Design, Development & Digital Experiences
      </h1>

      {/* Background videos — stacked, active one faded in */}
      <motion.div
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="absolute inset-0"
      >
        {SLIDES.map((s, i) => (
          <video
            key={s.video}
            ref={(el) => (videoRefs.current[i] = el)}
            src={s.video}
            poster={s.poster}
            muted
            playsInline
            preload={i === 0 ? "auto" : "metadata"}
            onEnded={i === active ? next : undefined}
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover object-[62%_center] md:object-center transition-opacity duration-700 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* Top scrim keeps the nav legible over bright footage */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
      </motion.div>

      {/* Caption + sound toggle */}
      <div className="absolute left-0 right-0 bottom-0 px-6 md:px-14 pb-12 md:pb-16 flex items-end justify-between gap-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <p className="font-sans font-semibold text-[13px] md:text-[14px] tracking-[0.08em] text-white uppercase mb-2 md:mb-3">
              {slide.client}
            </p>
            <p className="font-sans font-light text-[22px] leading-[1.25] md:text-[40px] md:leading-[1.15] text-white max-w-[22ch] md:max-w-[26ch]">
              {slide.caption}
            </p>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute video" : "Mute video"}
          aria-pressed={!muted}
          className="shrink-0 w-11 h-11 rounded-full border border-white/30 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300"
        >
          <SoundIcon muted={muted} />
        </button>
      </div>

      {/* Segmented playback progress — click a segment to jump to that film */}
      <div className="absolute left-0 right-0 bottom-0 flex gap-1">
        {SLIDES.map((s, i) => (
          <button
            key={s.video}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Play ${s.client} film`}
            className="flex-1 h-[3px] bg-white/15 overflow-hidden"
          >
            <span
              ref={(el) => (barRefs.current[i] = el)}
              className="block h-full w-full bg-[#F5C518] origin-left"
              style={{ transform: "scaleX(0)" }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
