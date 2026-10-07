"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

// Every size on the stage is expressed in "u" — 1/100 of the stage width —
// so the whole sticker composition scales as one piece from phone to desktop.
const u = (n) => `calc(var(--u) * ${n})`;

const INK = "#111111";
const C = {
  pink:   "#FF4F8B",
  orange: "#FF7A1A",
  green:  "#8BE04E",
  teal:   "#4FD8C9",
  yellow: "#FFD233",
  white:  "#F2F2F2",
};

function starPoints(n, outer, inner) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / n - Math.PI / 2;
    // Rounded so server and browser trig output serialise identically (hydration)
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

/* ── Sticker artwork ──────────────────────────────────────────────────────── */

function Label({ size, children, className = "", style }) {
  return (
    <span
      className={`block font-sans font-extrabold uppercase leading-[0.95] text-center ${className}`}
      style={{ fontSize: u(size), color: INK, ...style }}
    >
      {children}
    </span>
  );
}

function Tiny({ children }) {
  return (
    <span
      className="block font-sans font-semibold uppercase text-center leading-none"
      style={{ fontSize: u(1.05), letterSpacing: "0.12em", color: INK }}
    >
      {children}
    </span>
  );
}

function BlobDoGood() {
  return (
    <div className="relative w-full aspect-[100/88]">
      <svg viewBox="0 0 100 88" className="absolute inset-0 w-full h-full">
        <path fill={C.pink} d="M50 3C73 1 97 14 97 40c1 25-17 44-45 45C25 87 3 73 3 47 3 21 26 5 50 3z" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center -rotate-12">
        <Label size={3.4}>Do<br />Good</Label>
      </div>
    </div>
  );
}

function RectSticker({ bg, top, main, mainSize = 2.6, bottom, radius = 1 }) {
  return (
    <div
      className="w-full flex flex-col items-center justify-center gap-[0.15em]"
      style={{ background: bg, borderRadius: u(radius), padding: `${u(1.6)} ${u(1.4)}` }}
    >
      {top && <Tiny>{top}</Tiny>}
      <Label size={mainSize}>{main}</Label>
      {bottom && <Tiny>{bottom}</Tiny>}
    </div>
  );
}

function ThumbsUp() {
  return (
    <div className="w-full aspect-square rounded-full flex items-center justify-center" style={{ background: C.white }}>
      <svg viewBox="0 0 24 24" className="w-[52%] h-[52%]" fill={INK} aria-hidden="true">
        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
      </svg>
    </div>
  );
}

function CircleText({ bg, text }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full block">
      <circle cx="50" cy="50" r="50" fill={bg} />
      <defs>
        <path id={`ring-${id}`} d="M50 50 m-34 0 a34 34 0 1 1 68 0 a34 34 0 1 1 -68 0" />
      </defs>
      <text fill={INK} fontSize="11" fontWeight="800" letterSpacing="2.2" style={{ textTransform: "uppercase" }}>
        <textPath href={`#ring-${id}`}>{text}</textPath>
      </text>
      <circle cx="50" cy="50" r="7" fill={INK} />
    </svg>
  );
}

function StarBadge({ bg, points, children }) {
  return (
    <div className="relative w-full aspect-square">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        <polygon fill={bg} points={points} strokeLinejoin="round" stroke={bg} strokeWidth="4" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[0.2em]">{children}</div>
    </div>
  );
}

function AppleRing() {
  return (
    <div
      className="w-full aspect-square rounded-full flex items-center justify-center"
      style={{ border: `${u(2.4)} solid ${C.yellow}` }}
    >
      <svg viewBox="0 0 24 24" className="w-[48%] h-[48%]" aria-hidden="true">
        <path fill={C.white} d="M12 7.2c-1.6-1.2-5.2-1.4-6.7 1.6-1.4 2.9-.4 7.6 2.6 10.4 1.2 1.1 2.6.9 4.1.2 1.5.7 2.9.9 4.1-.2 3-2.8 4-7.5 2.6-10.4-1.5-3-5.1-2.8-6.7-1.6z" />
        <path fill="none" stroke={C.white} strokeWidth="1.6" strokeLinecap="round" d="M12 7.2c0-2 .9-3.6 2.8-4.4" />
      </svg>
    </div>
  );
}

function RoundDoGood() {
  return (
    <div className="w-full aspect-square rounded-full flex items-center justify-center" style={{ background: C.teal }}>
      <Label size={3.3} className="-rotate-12">Do<br />Good</Label>
    </div>
  );
}

/* ── Composition — positions measured off the reference layout ───────────── */

const STICKERS = [
  { id: "dogood-1",  x: 2,  y: 5,  w: 16, rot: -14, depth: 1.2, delay: 0.05, art: <BlobDoGood /> },
  { id: "positive",  x: 15, y: 2,  w: 17, rot: -6,  depth: 0.6, delay: 0.12, art: <RectSticker bg={C.orange} top="Positive" main="Impact" mainSize={2.5} /> },
  { id: "thumb",     x: 37, y: 3,  w: 14, rot: 8,   depth: 0.9, delay: 0.2,  art: <ThumbsUp /> },
  { id: "difference",x: 62, y: 0,  w: 14, rot: 0,   depth: 1.4, delay: 0.28, art: <CircleText bg={C.green} text="Make a difference • Make a difference •" /> },
  { id: "making",    x: 76, y: 0,  w: 18, rot: 9,   depth: 0.7, delay: 0.16, art: <RectSticker bg={C.orange} main={<span className="tracking-[0.12em] font-semibold">Making<br />Change<br />Happen</span>} mainSize={1.9} /> },
  { id: "social",    x: 82, y: 13, w: 17, rot: -12, depth: 1.1, delay: 0.34, art: <RectSticker bg={C.teal} main={<>Social<br />Impact</>} mainSize={2.5} radius={2.2} /> },
  { id: "hundred",   x: 1,  y: 34, w: 16, rot: -8,  depth: 1.3, delay: 0.22, art: (
    <StarBadge bg={C.green} points={starPoints(14, 50, 44)}>
      <Tiny>All in</Tiny>
      <Label size={3.6}>100%</Label>
      <Tiny>Every time</Tiny>
    </StarBadge>
  ) },
  { id: "apple",     x: 14, y: 46, w: 13, rot: 0,   depth: 0.8, delay: 0.4,  art: <AppleRing /> },
  { id: "purpose",   x: 31, y: 43, w: 18, rot: -3,  depth: 0.5, delay: 0.3,  art: <RectSticker bg={C.pink} top="I live a" main="Purpose!" mainSize={2.5} bottom="Do you?" radius={1.4} /> },
  { id: "dogood-2",  x: 51, y: 45, w: 15, rot: -10, depth: 1.2, delay: 0.46, art: <RoundDoGood /> },
  { id: "business",  x: 65, y: 40, w: 17, rot: 8,   depth: 0.9, delay: 0.38, art: (
    <StarBadge bg={C.yellow} points={starPoints(10, 50, 45)}>
      <Tiny>The</Tiny>
      <Label size={2.2}>Business</Label>
      <Tiny>of</Tiny>
      <Label size={2.2}>Impact</Label>
    </StarBadge>
  ) },
  { id: "change",    x: 81, y: 40, w: 18, rot: 10,  depth: 0.6, delay: 0.5,  art: <RectSticker bg={C.white} top="I invest in" main="Change!" mainSize={2.7} bottom="Do you?" radius={1.6} /> },
];

function Sticker({ s, progress, draggable, constraintsRef, reduce }) {
  // Each sticker drifts at its own speed while scrolling → layered depth
  const y = useTransform(progress, [0, 1], [s.depth * 60, s.depth * -60]);

  return (
    <motion.div
      className="absolute"
      style={{ left: u(s.x), top: u(s.y), width: u(s.w), y: reduce ? 0 : y, zIndex: 1 }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.2, rotate: s.rot - 28 },
          show: {
            opacity: 1, scale: 1, rotate: s.rot,
            transition: { type: "spring", stiffness: 260, damping: 15, delay: s.delay },
          },
        }}
        whileHover={{ scale: 1.08, rotate: s.rot + 5, transition: { type: "spring", stiffness: 400, damping: 12 } }}
        whileTap={{ scale: 0.96 }}
        whileDrag={{ scale: 1.15, rotate: s.rot - 4, zIndex: 30 }}
        drag={draggable}
        dragConstraints={constraintsRef}
        dragElastic={0.25}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}
        data-cursor={draggable ? "magnetic" : undefined}
        data-cursor-text={draggable ? "DRAG" : undefined}
        className={draggable ? "cursor-grab active:cursor-grabbing" : ""}
      >
        <div
          className={reduce ? "" : "sticker-float"}
          style={{ "--float-dur": `${4 + s.depth * 2.2}s`, "--float-delay": `${-s.delay * 6}s` }}
        >
          {s.art}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PurposeSection() {
  const sectionRef = useRef(null);
  const reduce = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);

  // Dragging only on mouse/trackpad — on touch screens it would hijack scrolling
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineVariants = {
    hidden: { y: "110%" },
    show: (i) => ({
      y: "0%",
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.12 },
    }),
  };

  return (
    <section
      ref={sectionRef}
      id="purpose"
      aria-label="We exist for purpose"
      className="relative z-10 w-full bg-black overflow-x-clip pt-24 md:pt-36 pb-4 md:pb-8 flex justify-center"
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        className="relative"
        style={{
          "--u": "min(0.92vw, 11.5px)",
          width: u(100),
          height: u(62),
        }}
      >
        {/* Headline */}
        <h2
          className="absolute inset-x-0 z-10 pointer-events-none text-center font-sans font-extrabold text-white leading-[0.92] tracking-[-0.045em]"
          style={{ top: u(13), fontSize: u(13.5) }}
        >
          {["We exist", "for purpose."].map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <motion.span className="block" custom={i} variants={lineVariants}>
                {line}
              </motion.span>
            </span>
          ))}
        </h2>

        {STICKERS.map((s) => (
          <Sticker
            key={s.id}
            s={s}
            progress={scrollYProgress}
            draggable={finePointer}
            constraintsRef={sectionRef}
            reduce={reduce}
          />
        ))}
      </motion.div>
    </section>
  );
}
