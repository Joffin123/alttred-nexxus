"use client";

import { useId, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { WHAT_WE_DO } from "@/data";
import GrowthChart3D from "@/components/GrowthChart3D";

const YELLOW = "#F8EF3B";
const EASE = [0.22, 1, 0.36, 1];
// Same curve as EASE, for CSS hover transitions
const HOVER = "duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";


/* ── Heading ───────────────────────────────────────────────────────────── */

function Heading({ reduce }) {
  const letters = "whaaat".split("");
  return (
    <h2
      aria-label="We do whaaat?"
      className="relative z-10 font-sans font-extrabold lowercase leading-[0.82] tracking-[-0.04em]"
      style={{ color: YELLOW }}
    >
      <motion.span
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0, x: -30, rotate: -6 }}
        whileInView={{ opacity: 1, x: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: EASE }}
        // Handwritten accent — Figma Hand stand-in, see --font-hand in layout.js
        className="block italic font-extrabold normal-case text-[clamp(2.6rem,11vw,6.5rem)] tracking-[-0.01em] leading-[1] origin-bottom-left"
        style={{ fontFamily: "var(--font-hand), var(--font-chakra), sans-serif" }}
      >
        we do
      </motion.span>

      <span aria-hidden="true" className="flex items-end gap-[0.12em] text-[clamp(3.6rem,15.5vw,10.5rem)]">
        <span className="inline-flex">
          {letters.map((l, i) => (
            <motion.span
              key={i}
              initial={reduce ? false : { y: "60%", opacity: 0 }}
              whileInView={{ y: "0%", opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.25 + i * 0.05 }}
              className="inline-block"
            >
              {l}
            </motion.span>
          ))}
        </span>

        {/* Echoing question marks — each one a shade darker, stepping back */}
        <span className="relative inline-flex text-[0.8em] leading-none">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              initial={reduce ? false : { opacity: 0, scale: 0.4, rotate: -30 }}
              whileInView={{ opacity: 1 - i * 0.2, scale: 1, rotate: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.6 + i * 0.08 }}
              className="relative inline-block -ml-[0.3em] first:ml-0"
              style={{ color: i === 0 ? YELLOW : `color-mix(in srgb, ${YELLOW} ${70 - i * 15}%, #000)`, zIndex: 4 - i }}
            >
              {/* Wobble lives on an inner span so it doesn't fight framer's transform */}
              <span className={`inline-block ${reduce ? "" : "wwd-wobble"}`} style={{ animationDelay: `${i * 0.15}s` }}>?</span>
            </motion.span>
          ))}
        </span>
      </span>
    </h2>
  );
}

/* ── Growth chart (three.js) ──────────────────────────────────────────── */

function GrowthChart({ reduce }) {
  const ref = useRef(null);
  // The whole chart drifts up a touch as it scrolls through the viewport
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lift = useTransform(scrollYProgress, (v) => (reduce ? 0 : (0.5 - v) * 30));

  return (
    <motion.div ref={ref} style={{ y: lift }} className="relative w-full -mt-[12%] md:-mt-[9%] pointer-events-none">
      <GrowthChart3D className="w-full h-[46vw] max-h-[420px] min-h-[180px]" />
    </motion.div>
  );
}

/* ── Accordion ─────────────────────────────────────────────────────────── */

function PlusIcon({ open }) {
  return (
    <span className="relative block w-5 h-5 md:w-6 md:h-6 shrink-0" aria-hidden="true">
      <span className="absolute left-0 top-1/2 w-full h-[1.5px] -translate-y-1/2 bg-current" />
      <motion.span
        className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 bg-current"
        animate={{ scaleY: open ? 0 : 1 }}
        transition={{ duration: 0.35, ease: EASE }}
      />
    </span>
  );
}

function Row({ item, index, open, onToggle, reduce }) {
  const id = useId();
  const panelId = `wwd-panel-${id}`;
  const buttonId = `wwd-button-${id}`;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.08 }}
      className="relative border-b border-white/15"
    >
      {/* The whole row (title + open panel) is one hover area, so moving the
          mouse down into the open content doesn't drop the hover state.
          Dimming lives here rather than on the motion.div — framer's entrance
          leaves an inline opacity on that, which would override these classes. */}
      <div className={`group/row relative transition-opacity ${HOVER} group-hover/list:opacity-35 hover:!opacity-100 focus-within:!opacity-100`}>
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-6 py-7 md:py-9 text-left text-white"
        >
          <span
            className={`font-sans font-normal text-[20px] md:text-[clamp(1.75rem,3.2vw,2.75rem)] tracking-[-0.01em] transition-[color,translate] ${HOVER} will-change-transform group-hover/row:translate-x-3 md:group-hover/row:translate-x-5 ${open ? "translate-x-3 md:translate-x-5" : ""}`}
            style={{ color: open ? YELLOW : undefined }}
          >
            {item.title}
          </span>
          {/* Quarter turn on hover only while closed — on the open "–" it would read as "|" */}
          <span
            className={`transition-[color,rotate] ${HOVER} ${open ? "" : "text-white/80 group-hover/row:text-white group-hover/row:rotate-90"}`}
            style={{ color: open ? YELLOW : undefined }}
          >
            <PlusIcon open={open} />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: { duration: 0.5, ease: EASE }, opacity: { duration: 0.35, ease: "easeOut" } }}
            className="overflow-hidden"
          >
            <div className="pb-8 md:pb-10 grid gap-6 md:grid-cols-[1.2fr_1fr] md:gap-14 md:pl-2">
              <p className="font-sans text-[15px] md:text-[17px] leading-relaxed text-white/70 max-w-[48ch]">
                {item.desc}
              </p>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                {item.points.map((pt, i) => (
                  <motion.li
                    key={pt}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.12 + i * 0.05 }}
                    className="flex items-start gap-2.5 font-sans text-[14px] md:text-[15px] text-white"
                  >
                    <span className="mt-[0.55em] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: YELLOW }} />
                    {pt}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Yellow line wipes in along the row's bottom edge (under the panel when open) */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 bottom-[-1px] h-px w-full origin-left scale-x-0 group-hover/row:scale-x-100 transition-[scale] ${HOVER}`}
        style={{ background: YELLOW }}
      />
      </div>
    </motion.div>
  );
}

/* ── Section ───────────────────────────────────────────────────────────── */

export default function ServicesSection() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(-1);  // all closed to start; one open at a time
  const { intro, items } = WHAT_WE_DO;

  return (
    <section
      id="services"
      aria-label="What we do"
      className="relative w-full bg-black text-white overflow-hidden pt-16 md:pt-28 pb-20 md:pb-32"
    >
      <div className="px-6 md:px-14">
        <Heading reduce={reduce} />
      </div>

      <GrowthChart reduce={reduce} />

      <div className="px-6 md:px-14">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="ml-auto mt-6 md:mt-8 max-w-[34ch] md:max-w-[44ch] text-right font-sans font-light text-[13px] md:text-[17px] leading-[1.7] text-white/75"
        >
          {intro.lead} <strong className="font-bold text-white">{intro.highlight}</strong> {intro.tail}
        </motion.p>

        <div className="group/list mt-14 md:mt-20 border-t border-white/15">
          {items.map((item, i) => (
            <Row
              key={item.title}
              item={item}
              index={i}
              open={open === i}
              onToggle={() => setOpen((cur) => (cur === i ? -1 : i))}
              reduce={reduce}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
