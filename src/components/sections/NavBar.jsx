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
      setScrolled(window.scrollY >= window.innerHeight);
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
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 md:px-14 py-5 select-none transition-all duration-500 ${
          scrolled || menuOpen
            ? "bg-[#030303]/90 backdrop-blur-md border-b border-neutral-900/60"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        {/* Logo */}
        <a href="#hero" onClick={close}
          className="font-sans font-bold text-[13px] tracking-[0.18em] text-white hover:opacity-60 transition-opacity relative z-50">
          ALTTRED NEXXUS
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`}
              className="text-[13px] font-sans font-medium tracking-[0.22em] text-neutral-400 hover:text-white transition-colors duration-300">
              {l}
            </a>
          ))}
        </div>

        {/* Right side: CTA + hamburger */}
        <div className="flex items-center gap-5">
          <MagBtn className="hidden md:block">
            <a href="#talk"
              className="text-[13px] font-sans font-semibold tracking-[0.18em] text-white hover:opacity-60 transition-opacity">
              LET'S TALK
            </a>
          </MagBtn>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden relative z-50 w-7 h-5 flex flex-col justify-between"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {/* Line 1 */}
            <span
              className="block h-px bg-white transition-all duration-300 origin-center"
              style={{
                width: "28px",
                transform: menuOpen ? "translateY(10px) rotate(45deg)" : "none",
              }}
            />
            {/* Line 2 */}
            <span
              className="block h-px bg-white transition-all duration-300"
              style={{
                width: menuOpen ? "0px" : "18px",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            {/* Line 3 */}
            <span
              className="block h-px bg-white transition-all duration-300 origin-center"
              style={{
                width: "28px",
                transform: menuOpen ? "translateY(-10px) rotate(-45deg)" : "none",
              }}
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
                className="font-sans font-extrabold text-[11vw] text-white tracking-[-0.02em] uppercase hover:text-[#ff6b3d] transition-colors duration-300"
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
              className="mt-3 inline-block bg-white text-black font-sans font-bold text-[10px] tracking-[0.25em] uppercase px-10 py-4 rounded-full hover:bg-[#ff6b3d] hover:text-white transition-all duration-300"
            >
              LET'S TALK
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
