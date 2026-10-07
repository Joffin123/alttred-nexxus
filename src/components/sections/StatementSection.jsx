"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const TEXT =
  "We build digital experiences, create scroll-stopping content, and make creative that performs.";

// Dim → full white. Opacity (not colour) keeps the scrubbing on the compositor.
const DIM = 0.32;

function Char({ char, progress, range, reduce }) {
  const opacity = useTransform(progress, range, [DIM, 1]);
  return (
    <motion.span style={{ opacity: reduce ? 1 : opacity }}>{char}</motion.span>
  );
}

export default function StatementSection() {
  const textRef = useRef(null);
  const reduce = useReducedMotion();

  // Lights up from when the paragraph enters the lower part of the screen
  // until it reaches the upper-middle — fully lit before it scrolls away
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ["start 0.85", "end 0.45"],
  });

  const words = TEXT.split(" ");
  const total = TEXT.replace(/ /g, "").length;
  let index = 0;

  return (
    <section
      id="about"
      className="relative w-full bg-black px-6 md:px-14 pt-12 md:pt-20 pb-36 md:pb-56"
    >
      <p
        ref={textRef}
        aria-label={TEXT}
        className="mx-auto max-w-[17ch] md:max-w-[22ch] text-left md:text-center font-sans font-medium text-white text-[clamp(2.1rem,8.6vw,5.25rem)] leading-[1.12] tracking-[-0.015em]"
      >
        {words.map((word, w) => (
          <span key={w} aria-hidden="true">
            <span className="inline-block whitespace-nowrap">
              {word.split("").map((char, c) => {
                const start = index / total;
                const end = (index + 1) / total;
                index++;
                return (
                  <Char
                    key={c}
                    char={char}
                    progress={scrollYProgress}
                    range={[start, end]}
                    reduce={reduce}
                  />
                );
              })}
            </span>
            {w < words.length - 1 && " "}
          </span>
        ))}
      </p>
    </section>
  );
}
