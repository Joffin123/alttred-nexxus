"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL = 151;
const pad = (n, size) => String(n).padStart(size, "0");

export default function Preloader({ onComplete }) {
  // Initialise from window so Fast Refresh remounts skip straight to done
  const [progress, setProgress] = useState(
    () => (typeof window !== "undefined" && window.fluidFrames?.length > 0 ? 100 : 0)
  );
  const [done, setDone] = useState(
    () => typeof window !== "undefined" && window._preloaderDone === true
  );

  useEffect(() => {
    // Already complete — call onComplete and leave
    if (window._preloaderDone) {
      onComplete?.();
      return;
    }

    // Frames already cached (prev page navigation)
    if (Array.isArray(window.fluidFrames) && window.fluidFrames.length > 0) {
      setProgress(100);
      window._preloaderDone = true;
      setDone(true);
      setTimeout(() => onComplete?.(), 700);
      return;
    }

    // Another instance owns the load — just poll
    if (window._fluidLoading) {
      const poll = setInterval(() => {
        setProgress(Math.floor(((window._fluidLoaded ?? 0) / TOTAL) * 100));
        if (Array.isArray(window.fluidFrames) && window.fluidFrames.length > 0) {
          clearInterval(poll);
          setProgress(100);
          window._preloaderDone = true;
          setDone(true);
          setTimeout(() => onComplete?.(), 700);
        }
      }, 150);
      return () => clearInterval(poll);
    }

    // This instance owns the load
    window._fluidLoading = true;
    window._fluidLoaded = 0;

    const promises = Array.from({ length: TOTAL }, (_, i) =>
      new Promise((resolve) => {
        const img = new Image();
        img.src = `/fluid-sequence/ezgif-frame-${pad(i + 1, 3)}.png`;
        const settle = () => {
          window._fluidLoaded = (window._fluidLoaded ?? 0) + 1;
          setProgress(Math.floor((window._fluidLoaded / TOTAL) * 100));
          resolve(img.complete && img.naturalWidth ? img : null);
        };
        img.onload = settle;
        img.onerror = settle;
      })
    );

    Promise.all(promises).then((imgs) => {
      window.fluidFrames = imgs.filter(Boolean);
      window._fluidLoading = false;
      setProgress(100);
      // Short pause so the 100% counter is readable, then exit
      setTimeout(() => {
        window._preloaderDone = true;
        setDone(true);
        setTimeout(() => onComplete?.(), 700);
      }, 600);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-[#030303] px-10 py-12 md:px-16 md:py-16 text-white select-none"
        >
          <div className="w-full flex justify-between items-center">
            <span className="text-[11px] tracking-[0.3em] text-neutral-500 uppercase font-sans font-medium">
              ALTTRED NEXXUS
            </span>
            <span className="text-[11px] tracking-[0.3em] text-neutral-600 uppercase font-sans">
              AGENCY ©2026
            </span>
          </div>

          <div className="flex flex-col items-center gap-5">
            <div className="relative">
              <div className="absolute -inset-16 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,107,61,0.1)_0%,transparent_70%)] blur-3xl animate-pulse pointer-events-none" />
              <div className="relative font-serif text-[18vw] md:text-[12vw] leading-none italic font-bold text-white tabular-nums">
                {progress < 10 ? `0${progress}` : progress}
                <span className="text-[4vw] md:text-[3vw] text-[#ff6b3d] ml-2 font-sans font-light not-italic align-baseline">
                  %
                </span>
              </div>
            </div>
            <p className="text-[11px] uppercase tracking-[0.5em] text-neutral-500 font-sans">
              {progress === 100 ? "ENTERING EXPERIENCE" : "LOADING FLUID ENGINE"}
            </p>
          </div>

          <div className="w-full max-w-sm flex flex-col items-center gap-3">
            <div className="w-full h-px bg-neutral-900 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-neutral-700 via-white to-neutral-700 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase font-sans">
              PRELOADING SEQUENCE FRAMES
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
