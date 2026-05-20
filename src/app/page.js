"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import FluidBackground from "@/components/FluidBackground";
import SmoothScroll from "@/components/SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

// ─── data ────────────────────────────────────────────
const NAV_LINKS = ["SERVICES", "PROJECTS", "ABOUT"];

const PARTNERS = [
  { name: "NOBLE MISFIT", symbol: "▲" },
  { name: "AMINU",        symbol: "✦" },
  { name: "UVAIRSPACE",   symbol: "▼" },
];

const SERVICES = [
  {
    num: "01",
    title: "Web Design",
    desc: "Websites That Do The Selling. We Design And Build Conversion-Focused Experiences That Reflect Your Brand At Its Best.",
    tags: ["UI DESIGN", "INTERACTIVE", "3D ENVIRONMENTS"],
  },
  {
    num: "02",
    title: "Development",
    desc: "Every Brand With A Story Deserves A Platform To Tell It. With Fans Who Listen To Your Story. Realized By Experts With One Shared Passion: Creating Digital Things.",
    tags: ["NEXT.JS / REACT", "WEBGL / GSAP", "API INTEGRATION"],
  },
  {
    num: "03",
    title: "Video Production",
    desc: "Brand Films, Product Launches, Campaign Content. We Shoot, Edit, And Deliver Stories That Move People — And Algorithms.",
    tags: ["DIRECTING", "MOTION GRAPHICS", "SFX DESIGN"],
  },
  {
    num: "04",
    title: "Performance Creatives",
    desc: "Brand Films, Product Launches, Campaign Content. We Shoot, Edit, And Deliver Stories That Move People — And Algorithms.",
    tags: ["DATA RESEARCH", "CONTENT ADS", "CONVERSION FLOW"],
  },
];

const PROJECTS = [
  {
    id: "01",
    title: "AMINU",
    desc: "Every Brand With A Story Deserves A Platform To Tell It.",
    tags: ["UX", "DEVELOPMENT"],
    image: "/projects/aminu.png",
    gradient: "from-emerald-950 via-rose-950 to-neutral-950",
  },
  {
    id: "02",
    title: "NOBLE MISFIT",
    desc: "Every Brand With A Story Deserves A Platform To Tell It.",
    tags: ["UX", "DEVELOPMENT"],
    image: "/projects/noble_misfit.png",
    gradient: "from-blue-950 via-neutral-900 to-neutral-950",
  },
  {
    id: "03",
    title: "UVAIRSPACE",
    desc: "Cinematic portal experience with fluid physics overlays.",
    tags: ["MOTION", "WEBGL"],
    image: null,
    gradient: "from-orange-950 via-blue-950 to-neutral-950",
  },
];

const SHOWREEL = [
  { label: "AMINU — BRAND FILM 2025",        image: "/projects/aminu.png" },
  { label: "NOBLE MISFIT — IDENTITY SHOOT",  image: "/projects/noble_misfit.png" },
  { label: "UVAIRSPACE — PORTAL EXPERIENCE", image: null },
];

// ─── magnetic button ──────────────────────────────────
function MagBtn({ children, className = "", ...props }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - (r.left + r.width  / 2)) * 0.32,
      y: (e.clientY - (r.top  + r.height / 2)) * 0.32,
      duration: 0.3, ease: "power2.out",
    });
  };
  const onLeave = () =>
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.3)" });

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className={`inline-block ${className}`} {...props}>
      {children}
    </div>
  );
}

// ─── main page ────────────────────────────────────────
export default function Home() {
  const [loading, setLoading] = useState(true);
  const heroRef  = useRef(null);
  const scrollRef = useRef(null);

  // entrance animation after preloader
  useEffect(() => {
    if (loading) return;
    const words = heroRef.current?.querySelectorAll(".hw");
    if (words?.length) {
      gsap.fromTo(words,
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.3, stagger: 0.12, ease: "power4.out", delay: 0.25 }
      );
    }
  }, [loading]);

  return (
    <>
      <Preloader onComplete={() => setLoading(false)} />

      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <SmoothScroll>
              <CustomCursor />
              <FluidBackground />

              <main className="relative z-10 w-full text-white">

                {/* ════════════════════════════════════════
                    1. NAVIGATION
                ════════════════════════════════════════ */}
                <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 md:px-14 py-5">
                  <a href="#hero"
                    className="font-sans font-bold text-[13px] tracking-[0.18em] text-white hover:opacity-60 transition-opacity">
                    ALTTRED NEXXUS
                  </a>

                  <div className="hidden md:flex items-center gap-9">
                    {NAV_LINKS.map((l) => (
                      <a key={l} href={`#${l.toLowerCase()}`}
                        className="text-[10px] font-sans font-medium tracking-[0.28em] text-neutral-400 hover:text-white transition-colors duration-300">
                        {l}
                      </a>
                    ))}
                  </div>

                  <MagBtn>
                    <a href="#talk"
                      className="text-[10px] font-sans font-semibold tracking-[0.22em] text-white hover:opacity-60 transition-opacity">
                      LET'S TALK
                    </a>
                  </MagBtn>
                </nav>

                {/* ════════════════════════════════════════
                    2. HERO  — fluid canvas shows through
                ════════════════════════════════════════ */}
                <section id="hero" ref={heroRef}
                  className="w-full h-screen flex flex-col justify-end px-8 md:px-14 pb-14 relative overflow-hidden">

                  {/* headline — bottom-left */}
                  <div className="flex flex-col items-start gap-1">
                    <div className="overflow-hidden">
                      <h1 className="hw font-sans font-extrabold text-[8.5vw] md:text-[5.2vw] tracking-[-0.03em] leading-none uppercase flex items-baseline gap-3 flex-wrap">
                        WE MAKE
                        <span className="font-serif font-bold italic text-[9.5vw] md:text-[6vw] tracking-normal leading-none">
                          Experience
                        </span>
                      </h1>
                    </div>
                    <div className="overflow-hidden">
                      <h1 className="hw font-sans font-extrabold text-[8.5vw] md:text-[5.2vw] tracking-[-0.03em] leading-none uppercase">
                        For The New Mainstream
                      </h1>
                    </div>
                  </div>

                  {/* scroll cue — bottom-right */}
                  <div ref={scrollRef}
                    className="scroll-drop absolute right-10 md:right-14 bottom-14 flex flex-col items-center gap-2 pointer-events-none">
                    <span className="text-[9px] font-sans tracking-[0.35em] text-neutral-500 uppercase">
                      SCROLL
                    </span>
                    <div className="relative w-px h-10 bg-white/15 rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-3 bg-[#ff6b3d] rounded-full" />
                    </div>
                  </div>
                </section>

                {/* ════════════════════════════════════════
                    3. MARQUEE / TICKER
                ════════════════════════════════════════ */}
                <section className="w-full bg-[#030303] border-t border-b border-neutral-900 py-7 overflow-hidden">
                  <div className="ticker-track">
                    {/* 4 repetitions so the seam is invisible */}
                    {[...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS].map((p, i) => (
                      <div key={i} className="flex items-center gap-5 px-10 shrink-0">
                        <span className="text-neutral-700 text-xs leading-none">{p.symbol}</span>
                        <span className="text-sm font-sans font-semibold tracking-[0.38em] text-neutral-500 hover:text-white transition-colors duration-300 cursor-default whitespace-nowrap">
                          {p.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ════════════════════════════════════════
                    4. AGENCY INTRO
                ════════════════════════════════════════ */}
                <section id="about"
                  className="w-full bg-[#030303] py-20 md:py-28 px-8 md:px-14">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 pt-10 border-t border-neutral-800">

                    <div>
                      <p className="text-[10px] tracking-[0.35em] text-neutral-500 uppercase font-sans font-semibold">
                        AN AGENCY
                      </p>
                    </div>

                    <div>
                      <h2 className="font-sans font-bold text-2xl md:text-[1.75rem] leading-snug tracking-tight text-white">
                        Helping Brands Stand Out,{" "}
                        <span className="font-serif font-normal italic text-neutral-500">
                          Not Blend In
                        </span>
                      </h2>
                    </div>

                    <div className="flex flex-col gap-5">
                      <p className="text-sm text-neutral-400 font-sans font-light leading-relaxed">
                        Every Brand With A Story Deserves A Platform To Tell It.
                        With Fans Who Listen To Your Story. Realized By Experts
                        With One Shared Passion: Creating Digital Things.
                      </p>
                      <a href="#services"
                        className="text-[10px] tracking-[0.25em] font-sans font-semibold text-white uppercase inline-flex items-center gap-2 group">
                        DISCOVER MORE
                        <span className="group-hover:translate-x-1 transition-transform duration-300">›</span>
                      </a>
                    </div>
                  </div>
                </section>

                {/* ════════════════════════════════════════
                    5. VIDEO / SHOWREEL  (3 images)
                ════════════════════════════════════════ */}
                <section className="w-full bg-[#030303] pb-20 md:pb-28 px-8 md:px-14">
                  <div
                    className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory"
                    style={{ scrollPaddingLeft: "0px" }}
                  >
                    {SHOWREEL.map((item, i) => (
                      <div key={i}
                        className="snap-start shrink-0 w-[85vw] md:w-[75vw] aspect-video rounded-2xl overflow-hidden relative bg-neutral-950 border border-neutral-900 group">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.label}
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-[1.03] transition-all duration-700"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b3d]/20 via-[#0055ff]/15 to-transparent" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                        {/* play button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                            <div className="w-0 h-0 border-t-[9px] border-t-transparent border-l-[16px] border-l-white/60 border-b-[9px] border-b-transparent ml-1" />
                          </div>
                        </div>

                        <span className="absolute bottom-5 left-6 text-[10px] font-sans tracking-[0.25em] text-white/50 uppercase">
                          {item.label}
                        </span>
                        <span className="absolute top-5 right-5 font-mono text-xs text-white/30">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ════════════════════════════════════════
                    6. WHAT WE DO
                ════════════════════════════════════════ */}
                <section className="w-full bg-[#030303] py-20 md:py-28 px-8 md:px-14 border-t border-neutral-900">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 pt-10 border-t border-neutral-800">

                    <div>
                      <p className="text-[10px] tracking-[0.35em] text-neutral-500 uppercase font-sans font-semibold">
                        WHAT WE DO
                      </p>
                    </div>

                    <div>
                      <h2 className="font-sans font-bold text-2xl md:text-[1.75rem] leading-snug tracking-tight text-white">
                        Helping Brands Stand Out,{" "}
                        <span className="font-serif font-normal italic text-neutral-500">
                          Not Blend In
                        </span>
                      </h2>
                    </div>

                    <div className="flex flex-col gap-5">
                      <p className="text-sm text-neutral-400 font-sans font-light leading-relaxed">
                        Every Brand With A Story Deserves A Platform To Tell It.
                        With Fans Who Listen To Your Story. Realized By Experts
                        With One Shared Passion: Creating Digital Things.
                      </p>
                      <a href="#services"
                        className="text-[10px] tracking-[0.25em] font-sans font-semibold text-white uppercase inline-flex items-center gap-2 group">
                        DISCOVER MORE
                        <span className="group-hover:translate-x-1 transition-transform duration-300">›</span>
                      </a>
                    </div>
                  </div>
                </section>

                {/* ════════════════════════════════════════
                    7. SERVICES  — white background
                ════════════════════════════════════════ */}
                <section id="services"
                  className="w-full bg-white text-black py-20 md:py-28 px-8 md:px-14">
                  <div className="flex flex-col">
                    {SERVICES.map((s, i) => (
                      <div key={i}
                        className="service-row relative grid grid-cols-1 md:grid-cols-[72px_1fr_1fr] gap-6 py-10 md:py-12 border-b border-neutral-200 group cursor-default">

                        {/* left accent bar */}
                        <div className="service-bar absolute left-0 top-0 w-0.5 h-full bg-[#ff6b3d]" />

                        {/* number */}
                        <span className="font-mono text-sm text-neutral-400 pt-1 pl-3 md:pl-0">
                          {s.num}
                        </span>

                        {/* title */}
                        <h3 className="font-sans font-semibold text-3xl md:text-5xl tracking-tight text-neutral-900 group-hover:pl-2 transition-all duration-300 leading-tight">
                          {s.title}
                        </h3>

                        {/* desc + tags */}
                        <div className="flex flex-col gap-4">
                          <p className="text-xs md:text-sm text-neutral-500 font-sans leading-relaxed">
                            {s.desc}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {s.tags.map((t, j) => (
                              <span key={j}
                                className="text-[9px] tracking-widest font-sans font-semibold uppercase text-neutral-400 border border-neutral-200 px-3 py-1 rounded-full">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ════════════════════════════════════════
                    8. PROJECTS SLIDER
                ════════════════════════════════════════ */}
                <section id="projects"
                  className="w-full bg-[#0a0a0a] py-20 md:py-28 px-8 md:px-14">

                  <div className="flex items-end justify-between mb-10">
                    <div>
                      <p className="text-[10px] tracking-[0.35em] text-neutral-600 uppercase font-sans font-semibold mb-3">
                        OUR CASE WORK
                      </p>
                      <h2 className="font-sans font-bold text-3xl md:text-5xl tracking-tight text-white leading-tight">
                        Selected{" "}
                        <span className="font-serif font-normal italic text-neutral-500">Works</span>
                      </h2>
                    </div>
                    <a href="#talk"
                      className="hidden md:inline-flex items-center gap-2 text-[10px] tracking-[0.25em] font-sans font-semibold text-neutral-500 uppercase hover:text-white transition-colors group">
                      VIEW ALL
                      <span className="group-hover:translate-x-1 transition-transform duration-300">›</span>
                    </a>
                  </div>

                  <div className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
                    {PROJECTS.map((p) => (
                      <div key={p.id}
                        className={`snap-start shrink-0 w-[78vw] md:w-[38vw] rounded-2xl overflow-hidden relative group cursor-pointer bg-gradient-to-br ${p.gradient} flex flex-col justify-between`}
                        style={{ minHeight: "60vh" }}>

                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                        {/* tags */}
                        <div className="relative z-10 flex gap-2 p-5">
                          {p.tags.map((t, j) => (
                            <span key={j}
                              className="text-[9px] tracking-widest font-sans font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 px-3 py-1 rounded-full">
                              {t}
                            </span>
                          ))}
                          <span className="ml-auto font-mono text-xs text-white/30">{p.id}</span>
                        </div>

                        {/* title + desc */}
                        <div className="relative z-10 p-5 md:p-6">
                          <h3 className="font-sans font-bold text-2xl md:text-3xl text-white mb-2 tracking-tight group-hover:text-[#ff6b3d] transition-colors duration-300">
                            {p.title}
                          </h3>
                          <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-xs">
                            {p.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ════════════════════════════════════════
                    9. FOOTER / CONTACT
                ════════════════════════════════════════ */}
                <section id="talk"
                  className="w-full bg-[#030303] py-24 md:py-36 px-8 md:px-14 border-t border-neutral-900">

                  {/* contact headline */}
                  <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6 mb-24 md:mb-32">
                    <p className="text-[10px] tracking-[0.4em] font-sans font-semibold text-[#ff6b3d] uppercase">
                      GET IN TOUCH
                    </p>
                    <h2 className="font-sans font-extrabold text-[12vw] md:text-[7vw] tracking-[-0.04em] leading-none uppercase">
                      BUILD{" "}
                      <span className="font-serif font-normal italic text-neutral-500">
                        with
                      </span>{" "}
                      US
                    </h2>
                    <p className="text-sm text-neutral-400 font-sans font-light leading-relaxed max-w-sm">
                      We're always looking for new creative missions. Drop a
                      query or invite us for an interactive pitch.
                    </p>
                    <MagBtn>
                      <a href="mailto:hello@alttrednexxus.agency"
                        className="bg-white text-black font-sans font-semibold text-[10px] tracking-[0.25em] uppercase px-10 py-4 rounded-full hover:bg-[#ff6b3d] hover:text-white transition-all duration-300 inline-block">
                        START A PROJECT
                      </a>
                    </MagBtn>
                  </div>

                  {/* big brand text */}
                  <div className="w-full overflow-hidden border-t border-neutral-900 pt-16">
                    <h1 className="font-sans font-extrabold text-[11vw] leading-none tracking-[-0.05em] uppercase text-white/[0.06] text-center whitespace-nowrap select-none pointer-events-none">
                      ALTTRED NEXXUS
                    </h1>
                  </div>

                  {/* sub-footer */}
                  <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] tracking-[0.25em] font-sans text-neutral-600 uppercase">
                    <span>©2026 ALTTRED NEXXUS AGENCY. ALL RIGHTS RESERVED.</span>
                    <div className="flex gap-7">
                      {["TWITTER", "INSTAGRAM", "DRIBBBLE"].map((s) => (
                        <a key={s} href="#"
                          className="hover:text-white transition-colors duration-300">
                          {s}
                        </a>
                      ))}
                    </div>
                  </div>
                </section>

              </main>
            </SmoothScroll>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
