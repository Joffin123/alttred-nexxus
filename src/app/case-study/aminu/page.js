"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Content ──────────────────────────────────────────────────────────── */

const TAGS = [
  "GTmetrix Optimisation",
  "JavaScript Cleanup",
  "Image Compression",
  "CSS Audit",
  "Plugin Management",
  "7-Day Turnaround",
];

const FIXES = [
  {
    num: "01",
    title: "JavaScript Cleanup",
    desc: "Removed unused scripts, deferred non-critical JS, and eliminated render-blocking code in the <head> — the single biggest drag on first paint.",
    tags: ["JS", "DEFER", "RENDER-BLOCKING"],
  },
  {
    num: "02",
    title: "Image Optimisation",
    desc: "Compressed all hero and content images, converted to WebP where supported, and added lazy loading to every off-screen asset on the page.",
    tags: ["WEBP", "LAZY LOAD", "COMPRESSION"],
  },
  {
    num: "03",
    title: "CSS Purge",
    desc: "Scanned all stylesheets with Coverage tools and stripped out unused rules left behind by old theme versions — hundreds of lines of dead CSS removed.",
    tags: ["CSS", "COVERAGE", "MINIFY"],
  },
  {
    num: "04",
    title: "Plugin Removal",
    desc: "Identified and deactivated plugins that were silently loading assets on every page request while serving no visible function on the site.",
    tags: ["PLUGINS", "PAYLOAD", "AUDIT"],
  },
  {
    num: "05",
    title: "Manual Code Inspection",
    desc: "Reviewed rendered HTML end-to-end to catch inline styles, duplicate resource loads, and redundant third-party embeds not flagged by automated tools.",
    tags: ["HTML", "THIRD-PARTY", "INLINE STYLES"],
  },
];

const TIMELINE = [
  {
    period: "Day 1-2",
    title: "Audit & Diagnosis",
    desc: "Full GTmetrix scan, DevTools profiling, plugin inventory, and manual HTML review. Issues ranked by performance impact.",
  },
  {
    period: "Day 3",
    title: "JavaScript & Plugin Cleanup",
    desc: "Non-critical scripts deferred, unused plugins removed, render-blocking resources eliminated from the critical path.",
  },
  {
    period: "Day 4",
    title: "Image Compression",
    desc: "Bulk-compressed all images, converted to WebP where supported, and added lazy loading to off-screen assets.",
  },
  {
    period: "Day 5",
    title: "CSS Purge & Code Review",
    desc: "Unused styles removed, stylesheets minified, inline style clutter cleaned up across the codebase.",
  },
  {
    period: "Day 6-7",
    title: "Testing & Final Report",
    desc: "Cross-browser and mobile regression testing, then the final GTmetrix run confirming 80% and Grade B.",
  },
];

/* ── Helpers ──────────────────────────────────────────────────────────── */

function FadeUp({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimBar({ pct, color, delay = 0 }) {
  return (
    <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay }}
      />
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function AminuCaseStudy() {
  const heroRef = useRef(null);
  const imgRef  = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (imgRef.current) {
        gsap.to(imgRef.current, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 md:px-14 py-6 bg-white/90 backdrop-blur-md border-b border-neutral-200">
        <Link href="/" className="font-bold text-[13px] tracking-[0.18em] text-neutral-900 hover:opacity-50 transition-opacity">
          ALTTRED NEXXUS
        </Link>
        <Link
          href="/#projects"
          className="flex items-center gap-2 text-[11px] tracking-[0.22em] font-bold uppercase text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <span className="text-base leading-none">←</span> All Projects
        </Link>
      </nav>

      {/* ── Hero (kept dark — full-bleed image) ─────────────────────────── */}
      <section
        ref={heroRef}
        className="relative w-full h-[75vh] md:h-screen overflow-hidden flex items-end"
      >
        <div ref={imgRef} className="absolute inset-0 scale-110 origin-center">
          <img
            src="/projects/aminu.png"
            alt="AMINU"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/65 to-[#030303]/15" />
          <div className="absolute inset-0 pointer-events-none cyber-grid opacity-25" />
        </div>

        <div className="relative z-10 px-8 md:px-14 pb-14 md:pb-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center gap-2 mb-5"
          >
            <span className="text-[9px] tracking-[0.4em] uppercase font-bold text-black bg-neutral-100 border border-neutral-300 px-3 py-1.5 rounded-full">
              WEB PERFORMANCE
            </span>
            <span className="text-[9px] tracking-[0.3em] uppercase font-bold text-neutral-400">
              01 — AMINU
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="font-semibold text-[9vw] md:text-[5.5vw] tracking-[-0.04em] leading-none uppercase max-w-3xl text-white"
          >
            From Grade D<br />
            <span className="text-neutral-400">To Grade B</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="text-neutral-300 text-sm md:text-base mt-5 max-w-xl leading-relaxed"
          >
            Aminu's homepage was slow and scoring poorly on GTmetrix. We ran a full audit, cleared the dead weight, and delivered a 20-point performance gain without touching the design.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap gap-2 mt-6"
          >
            {TAGS.map((t) => (
              <span
                key={t}
                className="text-[9px] tracking-[0.15em] font-bold uppercase px-3 py-1.5 border border-white/20 text-neutral-300 rounded-full"
              >
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Score Banner ─────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-14 md:py-20 border-b border-neutral-200">
        <FadeUp className="mb-10">
          <p className="text-[9px] tracking-[0.4em] uppercase font-bold text-black mb-3">GTmetrix Performance Score</p>
          <h2 className="font-semibold text-2xl md:text-3xl tracking-tight uppercase text-neutral-900">The Result, At A Glance</h2>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-0 border border-neutral-200 overflow-hidden">
            {/* Before */}
            <div className="p-8 md:p-10 bg-red-50 border-b md:border-b-0 md:border-r border-neutral-200">
              <p className="text-[9px] tracking-[0.4em] uppercase font-bold text-red-500 mb-5">Before</p>
              <p className="font-extrabold text-[80px] md:text-[100px] leading-none tracking-[-0.05em] text-red-500">D</p>
              <p className="font-bold text-2xl text-red-400 mt-1 mb-3">60%</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">GTmetrix performance score</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center px-8 bg-neutral-100 border-r border-neutral-200">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </div>
            <div className="flex md:hidden items-center justify-center py-5 bg-neutral-100 border-b border-neutral-200">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 rotate-90">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </div>

            {/* After */}
            <div className="p-8 md:p-10 bg-emerald-50">
              <p className="text-[9px] tracking-[0.4em] uppercase font-bold text-emerald-600 mb-5">After</p>
              <p className="font-extrabold text-[80px] md:text-[100px] leading-none tracking-[-0.05em] text-emerald-600">B</p>
              <p className="font-bold text-2xl text-emerald-500 mt-1 mb-3">80%</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">GTmetrix performance score</p>
            </div>
          </div>
        </FadeUp>

        {/* GTmetrix report screenshots */}
        <FadeUp delay={0.18} className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] tracking-[0.3em] uppercase font-bold text-red-500 mb-3">Before — GTmetrix Report</p>
              <img
                src="/projects/before-aminu.jpeg"
                alt="GTmetrix report before optimisation — Grade D, 60%"
                className="w-full border border-neutral-200"
              />
            </div>
            <div>
              <p className="text-[9px] tracking-[0.3em] uppercase font-bold text-emerald-600 mb-3">After — GTmetrix Report</p>
              <img
                src="/projects/after-aminu.jpeg"
                alt="GTmetrix report after optimisation — Grade B, 80%"
                className="w-full border border-neutral-200"
              />
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ── Project Meta ────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-12 border-b border-neutral-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-neutral-200">
          {[
            { label: "Client",    value: "AMINU" },
            { label: "Scope",     value: "GTmetrix Optimisation" },
            { label: "Timeline",  value: "7 Days" },
            { label: "Result",    value: "D → B · +20 pts" },
          ].map((item) => (
            <FadeUp key={item.label} className="md:px-8 first:pl-0 last:pr-0">
              <p className="text-[9px] tracking-[0.35em] uppercase text-neutral-400 mb-1.5">{item.label}</p>
              <p className="font-bold text-sm text-neutral-900">{item.value}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── The Problem ─────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-20 md:py-28 border-b border-neutral-200">
        <div className="grid md:grid-cols-2 gap-14 md:gap-20 items-start max-w-6xl">
          <FadeUp>
            <p className="text-[9px] tracking-[0.4em] uppercase font-bold text-black mb-5">The Problem</p>
            <h2 className="font-semibold text-3xl md:text-4xl tracking-tight leading-tight uppercase mb-6 text-neutral-900">
              A Homepage That<br />
              <span className="text-neutral-400">Kept Visitors Waiting</span>
            </h2>
            <p className="text-neutral-600 text-base leading-relaxed mb-5">
              Aminu's website was loading slowly and grading C–D on GTmetrix. For visitors, this meant a noticeably sluggish experience — especially on mobile. For the business, it translated to higher bounce rates and weaker search visibility.
            </p>
            <p className="text-neutral-600 text-base leading-relaxed">
              The culprits were buried in the codebase: bloated JavaScript loaded before any content, uncompressed images that dwarfed their display size, CSS filled with rules no page was using, and plugins silently adding weight to every request.
            </p>
          </FadeUp>

          <FadeUp delay={0.12}>
            <p className="text-[9px] tracking-[0.35em] uppercase text-neutral-400 mb-6">Initial GTmetrix Snapshot</p>
            <div className="space-y-6 bg-neutral-50 border border-neutral-200 p-6 md:p-8">
              {[
                { label: "Performance Score", pct: 60, grade: "D", color: "#ef4444" },
                { label: "Structure",         pct: 72, grade: "C", color: "#f97316" },
                { label: "LCP",               pct: 55, grade: "D", color: "#ef4444" },
                { label: "TBT",               pct: 40, grade: "E", color: "#dc2626" },
              ].map((item, i) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-600 font-bold">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs" style={{ color: item.color }}>{item.pct}%</span>
                      <span
                        className="w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-extrabold"
                        style={{ borderColor: item.color, color: item.color }}
                      >
                        {item.grade}
                      </span>
                    </div>
                  </div>
                  <AnimBar pct={item.pct} color={item.color} delay={i * 0.08} />
                </div>
              ))}
              <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 pt-3 border-t border-neutral-200">
                GTmetrix · Desktop · Cold load · Pre-optimisation
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── The Audit ───────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-20 md:py-28 border-b border-neutral-200">
        <div className="max-w-4xl">
          <FadeUp>
            <p className="text-[9px] tracking-[0.4em] uppercase font-bold text-black mb-5">The Audit</p>
            <h2 className="font-semibold text-3xl md:text-4xl tracking-tight leading-tight uppercase mb-6 text-neutral-900">
              Finding The Real Culprits
            </h2>
          </FadeUp>
          <FadeUp delay={0.08}>
            <p className="text-neutral-600 text-base leading-relaxed mb-5 max-w-2xl">
              We started with a full GTmetrix scan and crossed it with a manual code inspection. The waterfall chart told the story clearly: render-blocking scripts were delaying the first paint, images were arriving three times heavier than they needed to be, and the stylesheet was carrying hundreds of unused rules from old theme versions.
            </p>
            <p className="text-neutral-600 text-base leading-relaxed max-w-2xl">
              Rather than chasing every minor issue, we ranked each problem by its direct impact on the GTmetrix score — and worked down the list in order. Five fixes accounted for the full 20-point gain.
            </p>
          </FadeUp>

          {/* Audit findings pills */}
          <FadeUp delay={0.14} className="mt-10">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: "Render-blocking JS", impact: "−12 pts", color: "#ef4444" },
                { label: "Oversized images",   impact: "−6 pts",  color: "#f97316" },
                { label: "Unused CSS rules",   impact: "−4 pts",  color: "#f97316" },
                { label: "Inactive plugins",   impact: "−3 pts",  color: "#eab308" },
                { label: "Inline style bloat", impact: "−2 pts",  color: "#eab308" },
                { label: "Duplicate resources",impact: "−1 pt",   color: "#9ca3af" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="flex items-center justify-between bg-neutral-50 border border-neutral-200 px-5 py-4"
                >
                  <span className="text-[11px] tracking-[0.1em] uppercase font-bold text-neutral-700">{item.label}</span>
                  <span className="text-[11px] font-extrabold" style={{ color: item.color }}>{item.impact}</span>
                </motion.div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Five Fixes ──────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-20 md:py-28 border-b border-neutral-200">
        <FadeUp className="mb-14">
          <p className="text-[9px] tracking-[0.4em] uppercase font-bold text-black mb-4">What We Did</p>
          <h2 className="font-semibold text-3xl md:text-4xl tracking-tight uppercase leading-tight text-neutral-900">
            Five Targeted Fixes,<br />
            <span className="text-neutral-400">One Week</span>
          </h2>
          <p className="text-neutral-600 text-base leading-relaxed mt-5 max-w-2xl">
            We worked through the codebase systematically — no redesign, no infrastructure changes. Every fix earned its place by directly improving the GTmetrix score.
          </p>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-px bg-neutral-200">
          {FIXES.map((item, i) => (
            <FadeUp key={item.num} delay={i * 0.06} className="bg-white p-8 md:p-10 service-row-item relative group">
              <div className="neon-service-bar" />
              <div className="flex items-start justify-between mb-5">
                <span className="font-mono text-[10px] text-black tracking-widest">{item.num}</span>
                <div className="flex flex-wrap gap-1.5 justify-end max-w-[60%]">
                  {item.tags.map((t) => (
                    <span key={t} className="text-[8px] tracking-widest font-bold uppercase px-2 py-1 border border-neutral-200 text-neutral-500">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="font-semibold text-lg md:text-xl uppercase tracking-tight mb-3 leading-tight text-neutral-900">
                {item.title}
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">{item.desc}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Image break ─────────────────────────────────────────────────── */}
      <div className="w-full h-[45vw] md:h-[55vh] overflow-hidden">
        <motion.img
          src="/projects/aminu.png"
          alt="AMINU storefront"
          className="w-full h-full object-cover object-center"
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* ── Timeline ────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-20 md:py-28 border-b border-neutral-200">
        <FadeUp className="mb-14">
          <p className="text-[9px] tracking-[0.4em] uppercase font-bold text-black mb-4">Timeline</p>
          <h2 className="font-semibold text-3xl md:text-4xl tracking-tight uppercase leading-tight text-neutral-900">
            Seven Days,<br />
            <span className="text-neutral-400">Start to Finish</span>
          </h2>
        </FadeUp>

        <div className="relative max-w-2xl">
          <div className="absolute left-[69px] top-0 bottom-0 w-px bg-neutral-300" />

          {TIMELINE.map((item, i) => (
            <FadeUp key={item.period} delay={i * 0.07}>
              <div className="flex items-start border-b border-neutral-200 last:border-0 py-8">

                <div className="shrink-0 flex items-center gap-3 relative z-10">
                  <span className="text-[8px] tracking-[0.15em] uppercase font-bold text-black leading-none whitespace-nowrap w-[52px] text-right block">
                    {item.period}
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-black bg-white shrink-0" />
                </div>

                <div className="flex-1 pl-6">
                  <h3 className="font-semibold text-[13px] uppercase tracking-[0.06em] mb-2 leading-tight text-neutral-900">
                    {item.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                </div>

              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Results ─────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-20 md:py-28 border-b border-neutral-200">
        <FadeUp className="mb-14">
          <p className="text-[9px] tracking-[0.4em] uppercase font-bold text-black mb-4">Results</p>
          <h2 className="font-semibold text-3xl md:text-4xl tracking-tight uppercase leading-tight text-neutral-900">
            A Score You Can See —<br />
            <span className="text-neutral-400">And Feel</span>
          </h2>
        </FadeUp>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {[
            { value: "+20 pts", label: "GTmetrix score gain",  sub: "60% → 80%" },
            { value: "D → B",   label: "Grade improvement",    sub: "In 7 days" },
            { value: "7 days",  label: "Time to completion",   sub: "No redesign" },
          ].map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.08}>
              <div className="border border-neutral-200 p-7 flex flex-col gap-1.5">
                <p className="font-extrabold text-3xl md:text-4xl tracking-[-0.03em] text-neutral-900 leading-none">{s.value}</p>
                <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-neutral-500 mt-2">{s.label}</p>
                <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400">{s.sub}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Before / After score bars */}
        <FadeUp delay={0.1} className="bg-neutral-50 border border-neutral-200 p-6 md:p-10 mb-10 max-w-2xl">
          <p className="text-[9px] tracking-[0.35em] uppercase text-neutral-400 mb-7">GTmetrix Score Comparison</p>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-600">Before</span>
                <span className="font-extrabold text-sm text-red-500">Grade D — 60%</span>
              </div>
              <AnimBar pct={60} color="#ef4444" delay={0} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-600">After</span>
                <span className="font-extrabold text-sm text-emerald-600">Grade B — 80%</span>
              </div>
              <AnimBar pct={80} color="#22c55e" delay={0.2} />
            </div>
          </div>
        </FadeUp>

        {/* Callout */}
        <FadeUp delay={0.15}>
          <div className="border-l-2 border-black pl-6 md:pl-8 py-2 max-w-2xl">
            <p className="font-extrabold text-base uppercase tracking-tight mb-2 text-neutral-900">
              From Grade D to Grade B in One Week
            </p>
            <p className="text-neutral-500 text-sm leading-relaxed">
              No redesign, no infrastructure changes — just a disciplined audit and targeted fixes. Faster pages, lighter assets, and a cleaner codebase that's easier to maintain going forward.
            </p>
          </div>
        </FadeUp>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-24 md:py-32 text-center bg-white">
        <FadeUp>
          <p className="text-[9px] tracking-[0.4em] uppercase font-bold text-black mb-6">
            Is your site slowing down your revenue?
          </p>
          <h2 className="font-semibold text-4xl md:text-6xl tracking-[-0.03em] uppercase leading-tight mb-10 text-neutral-900">
            Let's Fix Your<br />
            <span className="text-neutral-400">Speed Score</span>
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <a
              href="/#talk"
              className="inline-block bg-black text-white font-bold text-[11px] tracking-[0.25em] uppercase px-10 py-4 hover:bg-neutral-900 transition-all duration-300"
            >
              GET A FREE AUDIT
            </a>
            <Link
              href="/#projects"
              className="inline-block border border-neutral-300 text-neutral-600 font-bold text-[11px] tracking-[0.25em] uppercase px-10 py-4 hover:border-neutral-900 hover:text-neutral-900 transition-all duration-300"
            >
              VIEW ALL WORK
            </Link>
          </div>
        </FadeUp>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="px-8 md:px-14 py-8 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400">
          © 2024 ALTTRED NEXXUS
        </p>
        <Link href="/" className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors">
          Back to Home
        </Link>
      </footer>

    </div>
  );
}
