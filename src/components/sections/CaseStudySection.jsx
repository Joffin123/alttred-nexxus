"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CASE_STUDIES } from "@/data";

const EASE = [0.22, 1, 0.36, 1];

function CaseStudyCard({ item, index }) {
  const reduce = useReducedMotion();
  const external = item.href?.startsWith("http");
  // "Coming soon" cards aren't links yet
  const Tag = item.comingSoon ? motion.div : motion.a;
  const linkProps = item.comingSoon
    ? { "aria-label": `${item.client} — case study coming soon` }
    : { href: item.href, ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}) };

  return (
    <Tag
      {...linkProps}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      // Image then title; the second column starts a beat later so the pair doesn't move as one block
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.12, delayChildren: index % 2 ? 0.12 : 0 } },
      }}
      className={`group block ${item.comingSoon ? "cursor-default" : ""}`}
    >
      {/* Image — wipes up into view, then zooms gently on hover */}
      <motion.div
        variants={{
          hidden: { clipPath: "inset(100% 0% 0% 0%)" },
          show:   { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.1, ease: EASE } },
        }}
        className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-100"
      >
        {item.comingSoon ? (
          <motion.div
            variants={{
              hidden: { scale: 1.15 },
              show:   { scale: 1, transition: { duration: 1.4, ease: EASE } },
            }}
            className="absolute inset-0 bg-[linear-gradient(135deg,#f4f4f4_0%,#e9e9e9_100%)] flex items-center justify-center"
          >
            <span className="font-sans font-medium text-[22px] md:text-[30px] tracking-[-0.01em] text-neutral-400">
              Coming soon
            </span>
          </motion.div>
        ) : (
          <motion.img
            src={item.image}
            alt={item.alt}
            loading="lazy"
            decoding="async"
            variants={{
              hidden: { scale: 1.15 },
              show:   { scale: 1, transition: { duration: 1.4, ease: EASE } },
            }}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          />
        )}
      </motion.div>

      {/* Title */}
      <motion.h3
        variants={{
          hidden: { opacity: 0, y: 24 },
          show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
        }}
        className="mt-4 md:mt-5 font-sans font-normal text-[#111] text-[19px] md:text-[24px] leading-[1.35] tracking-normal max-w-[30ch]"
      >
        <span className={item.comingSoon
          ? "text-neutral-400"
          : "bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0%_1px] bg-[position:0_100%] group-hover:bg-[length:100%_1px] transition-[background-size] duration-500 ease-out"}>
          {item.title}
        </span>
      </motion.h3>
    </Tag>
  );
}

export default function CaseStudySection() {
  return (
    <section
      id="projects"
      aria-label="Case studies"
      className="relative w-full bg-white text-black px-6 md:px-14 py-14 md:py-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-16 md:gap-y-20">
        {CASE_STUDIES.map((item, i) => (
          <CaseStudyCard key={item.title} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
