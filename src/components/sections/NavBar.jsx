"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MagBtn from "@/components/MagBtn";
import { NAV_LINKS } from "@/data";

export default function NavBar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      if (window.scrollY > 120) setMenuOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-14 py-3 md:py-5 select-none transition-all duration-500 bg-black md:bg-transparent ${
          scrolled || menuOpen
            ? "md:bg-[#030303]/90 md:backdrop-blur-md border-b border-neutral-900/60"
            : "border-b border-transparent"
        }`}
      >
        {/* Logo — flex-1 left */}
        <div className="flex-1">
          <a href="#hero" onClick={close} aria-label="Alttred Nexxus — home"
            className="inline-block hover:opacity-60 transition-opacity relative z-50">
            <img
              src="/new-logo.svg"
              alt="Alttred Nexxus"
              width={257}
              height={93}
              className="block h-7 md:h-9 w-auto"
            />
          </a>
        </div>

        {/* Desktop links — centered */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`}
              className="group relative py-1 text-[15px] font-sans font-medium tracking-normal text-white/85 hover:text-white transition-colors duration-300">
              {l}
              <span className="absolute left-0 -bottom-0.5 h-px w-full bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </a>
          ))}
        </div>

        {/* Right side: CTA + hamburger — flex-1 right-aligned */}
        <div className="flex-1 flex items-center justify-end gap-5">
          <div className="hidden md:block">
            <MagBtn>
              <a href="#talk"
                className="inline-block rounded-full border border-white/40 px-6 py-2.5 text-[14px] font-sans font-medium tracking-normal text-white hover:bg-white hover:text-black hover:border-white transition-colors duration-300">
                Let&apos;s talk
              </a>
            </MagBtn>
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden relative z-50 w-7 h-[14px] flex flex-col justify-between"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            <span
              className="block h-[2px] w-7 bg-white transition-transform duration-300 origin-center"
              style={{ transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none" }}
            />
            <span
              className="block h-[2px] w-7 bg-white transition-transform duration-300 origin-center"
              style={{ transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none" }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#030303]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-7 md:hidden"
          >
            {NAV_LINKS.map((l, i) => (
              <motion.a
                key={l}
                href={`#${l.toLowerCase()}`}
                onClick={close}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 + 0.05, duration: 0.35, ease: "easeOut" }}
                className="font-sans font-semibold text-[11vw] text-white tracking-normal uppercase hover:text-neutral-400 transition-colors duration-300"
              >
                {l}
              </motion.a>
            ))}

            <motion.a
              href="#talk"
              onClick={close}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: NAV_LINKS.length * 0.07 + 0.1, duration: 0.35 }}
              className="mt-3 inline-block bg-white text-black font-sans font-bold text-[12px] tracking-normal uppercase px-10 py-4 rounded-full hover:bg-neutral-300 transition-all duration-300"
            >
              LET&apos;S TALK
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
