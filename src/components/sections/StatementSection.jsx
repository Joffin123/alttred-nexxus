"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const PARAGRAPH =
  "We build digital experiences, create scroll-stopping content, and make creative that performs.";

// Scroll timeline across the pinned section (0 → 1)
const LIGHT = [0.02, 0.82];   // paragraph lights up; 0.82 → 1 holds fully lit, then the page moves on
// Each letter fades over a window ~10 letters wide, overlapping its neighbours,
// so the white flows across the text as a soft gradient instead of stepping
const SOFTNESS = 10;
const DIM = 0.28;

// Function-form transforms keep framer on its JS scroll path — range-form ones
// get handed to native ScrollTimeline, which mis-measures pinned sections.
const ramp = ([a, b], [from, to]) => (v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  // smoothstep easing — each letter eases in and out of its fade
  const e = t * t * (3 - 2 * t);
  return from + (to - from) * e;
};

function Char({ char, progress, range, reduce }) {
  const opacity = useTransform(progress, ramp(range, [DIM, 1]));
  return <motion.span style={{ opacity: reduce ? 1 : opacity }}>{char}</motion.span>;
}

export default function StatementSection() {
  const sectionRef = useRef(null);
  const reduce = useReducedMotion();

  // Paragraph eases up into place as the section arrives
  const { scrollYProgress: enter } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });
  const enterY  = useTransform(enter, ramp([0.3, 1], [90, 0]));
  const enterOp = useTransform(enter, ramp([0.3, 0.85], [0, 1]));

  // While pinned: letters light up
  const { scrollYProgress: pin } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const words = PARAGRAPH.split(" ");
  const total = PARAGRAPH.replace(/ /g, "").length;
  const span = LIGHT[1] - LIGHT[0];
  const step = span / (total + SOFTNESS);   // so the last letter finishes exactly at LIGHT[1]
  let index = 0;

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About Alttred Nexxus"
      className="relative w-full bg-black h-[200vh]"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center">
        <motion.div
          style={reduce ? undefined : { y: enterY, opacity: enterOp }}
          className="w-full px-8 md:px-14 will-change-transform"
        >
          <p
            aria-label={PARAGRAPH}
            className="mx-auto max-w-[18ch] md:max-w-[22ch] text-left md:text-center font-sans font-medium text-white text-[clamp(2.1rem,8.6vw,5.25rem)] leading-[1.24] md:leading-[1.12] tracking-[-0.015em]"
          >
            {words.map((word, w) => (
              <span key={w} aria-hidden="true">
                <span className="inline-block whitespace-nowrap">
                  {word.split("").map((char, c) => {
                    const start = LIGHT[0] + index * step;
                    const end   = start + SOFTNESS * step;
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
