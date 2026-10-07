"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

// Last word of the headline — swapped by scrolling, each in its own brand colour
const WORDS = [
  { text: "purpose.", color: "#F8EF3B" },
  { text: "brands.",  color: "#FF4F8B" },
  { text: "you.",     color: "#4FD8C9" },
];

const PARAGRAPH =
  "We build digital experiences, create scroll-stopping content, and make creative that performs.";

// Scroll timeline (0 → 1 across the pinned section)
const WORD_STEPS   = [0.11, 0.22];  // purpose → brands → you
const HEADLINE_OUT = [0.31, 0.39];  // headline lifts away
const PARA_IN      = [0.41, 0.49];  // paragraph rises in, dim — only after the headline is gone
const PARA_LIGHT   = [0.51, 0.92];  // paragraph lights up letter by letter
// 0.92 → 1: fully lit paragraph holds, then the page scrolls on

const DIM = 0.32;

// Linear map of scroll progress `v` from [a, b] onto [from, to], clamped.
// Function-form transforms keep framer on its JS scroll path — range-form ones
// get handed to native ScrollTimeline, which mis-measures this pinned section.
const ramp = ([a, b], [from, to]) => (v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return from + (to - from) * t;
};

function Char({ char, progress, range, reduce }) {
  const opacity = useTransform(progress, ramp(range, [DIM, 1]));
  return <motion.span style={{ opacity: reduce ? 1 : opacity }}>{char}</motion.span>;
}

const wordVariants = {
  enter: (dir) => ({ y: dir > 0 ? "45%" : "-45%", opacity: 0, filter: "blur(8px)" }),
  show:  { y: "0%", opacity: 1, filter: "blur(0px)" },
  exit:  (dir) => ({ y: dir > 0 ? "-45%" : "45%", opacity: 0, filter: "blur(8px)" }),
};

const EASE = [0.22, 1, 0.36, 1];

// Highlight = the word in its brand colour + a hand-drawn underline in the same
// colour that draws itself in every time the word changes. No background box,
// so nothing depends on the font's vertical metrics.
function RotatingWord({ index, dir }) {
  const word = WORDS[index];

  return (
    <motion.span
      layout
      transition={{ layout: { duration: 0.5, ease: EASE } }}
      className="relative inline-block whitespace-nowrap"
    >
      <AnimatePresence mode="popLayout" initial={false} custom={dir}>
        <motion.span
          key={word.text}
          custom={dir}
          variants={wordVariants}
          initial="enter"
          animate="show"
          exit="exit"
          transition={{ duration: 0.5, ease: EASE }}
          className="relative inline-block"
          style={{ color: word.color }}
        >
          {word.text}

          {/* Underline swoosh — sits just under the descenders (p, y) */}
          <svg
            aria-hidden="true"
            viewBox="0 0 300 24"
            preserveAspectRatio="none"
            className="absolute left-[-2%] w-[104%] h-[0.16em] top-[1.08em] overflow-visible pointer-events-none"
          >
            <motion.path
              d="M4 16 C 70 6, 150 4, 296 12"
              fill="none"
              stroke={word.color}
              strokeWidth="7"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ strokeWidth: "0.07em" }}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            />
          </svg>
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}

export default function PurposeSection() {
  const sectionRef  = useRef(null);
  const reduce = useReducedMotion();

  // While the section scrolls into view: headline travels in "from far away"
  const { scrollYProgress: enter } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });
  const headScale   = useTransform(enter, ramp([0, 1], [0.35, 1]));
  const headEnterOp = useTransform(enter, ramp([0, 0.55], [0, 1]));

  // While pinned: headline out → paragraph in → paragraph lights up
  const { scrollYProgress: pin } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const headY     = useTransform(pin, (v) => `${ramp(HEADLINE_OUT, [0, -35])(v)}%`);
  const headOutOp = useTransform(pin, ramp(HEADLINE_OUT, [1, 0]));
  const headOp    = useTransform([headEnterOp, headOutOp], ([a, b]) => a * b);
  const paraY     = useTransform(pin, ramp(PARA_IN, [80, 0]));
  const paraOp    = useTransform(pin, ramp(PARA_IN, [0, 1]));

  // Scrolling steps the headline word forward (and back when scrolling up)
  const [word, setWord] = useState({ index: 0, dir: 1 });
  useMotionValueEvent(pin, "change", (v) => {
    const next = WORD_STEPS.filter((step) => v >= step).length;
    setWord((cur) => (cur.index === next ? cur : { index: next, dir: next > cur.index ? 1 : -1 }));
  });

  const words = PARAGRAPH.split(" ");
  const total = PARAGRAPH.replace(/ /g, "").length;
  const span = PARA_LIGHT[1] - PARA_LIGHT[0];
  let index = 0;

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About Alttred Nexxus"
      className="relative w-full bg-black h-[480vh]"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center">
        {/* ── Phase 1 — headline ─────────────────────────────────────────── */}
        <motion.h2
          style={reduce ? undefined : { scale: headScale, opacity: headOp, y: headY }}
          className="absolute inset-x-0 px-6 text-center font-sans font-extrabold text-white leading-[0.95] tracking-[-0.045em] text-[clamp(3rem,12.5vw,8.75rem)] will-change-transform"
        >
          <span className="block">We exist</span>
          <span className="block mt-[0.1em]">
            for <RotatingWord index={word.index} dir={word.dir} />
          </span>
        </motion.h2>

        {/* ── Phase 2 — paragraph ────────────────────────────────────────── */}
        <motion.div
          style={reduce ? undefined : { y: paraY, opacity: paraOp }}
          className="absolute inset-x-0 px-6 md:px-14"
        >
          <p
            aria-label={PARAGRAPH}
            className="mx-auto max-w-[17ch] md:max-w-[22ch] text-left md:text-center font-sans font-medium text-white text-[clamp(2.1rem,8.6vw,5.25rem)] leading-[1.12] tracking-[-0.015em]"
          >
            {words.map((word, w) => (
              <span key={w} aria-hidden="true">
                <span className="inline-block whitespace-nowrap">
                  {word.split("").map((char, c) => {
                    const start = PARA_LIGHT[0] + (index / total) * span;
                    const end   = PARA_LIGHT[0] + ((index + 1) / total) * span;
                    index++;
                    return (
                      <Char key={c} char={char} progress={pin} range={[start, end]} reduce={reduce} />
                    );
                  })}
                </span>
                {w < words.length - 1 && " "}
              </span>
            ))}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
