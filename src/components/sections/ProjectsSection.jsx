"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { PROJECTS } from "@/data";

// ── infinite-loop setup ──────────────────────────────────
const N      = PROJECTS.length;          // 3
const COPIES = 5;
const ITEMS  = Array.from({ length: COPIES }, () => PROJECTS).flat(); // 15
const MID    = Math.floor(COPIES / 2) * N; // 6 — start index (middle copy)

function getCardW(el) {
  const c = el.querySelector("[data-card]");
  return c ? c.offsetWidth + 20 : 0; // width + gap (gap-5 = 20px)
}

export default function ProjectsSection() {
  const [absIdx, setAbsIdx] = useState(MID);
  const absRef   = useRef(MID);
  const trackRef = useRef(null);
  const jumping  = useRef(false);
  const drag     = useRef({ active: false, x: 0, sl: 0 });

  // ── init: scroll to middle copy ─────────────────────────
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const init = () => {
      const cw = getCardW(el);
      if (!cw) { requestAnimationFrame(init); return; }
      el.style.scrollSnapType = "none";
      el.scrollLeft = MID * cw;
      requestAnimationFrame(() => {
        el.style.scrollSnapType = "x mandatory";
      });
    };
    requestAnimationFrame(init);
  }, []);

  // ── scroll handler + loop logic ─────────────────────────
  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || jumping.current) return;
    const cw = getCardW(el);
    if (!cw) return;

    const idx = Math.round(el.scrollLeft / cw);
    absRef.current = idx;
    setAbsIdx(idx);

    // Skip wrap logic while user is dragging — avoids jump fighting the drag
    if (drag.current.active) return;

    // Wrap: if drifted into first or last copy, jump silently to middle
    if (idx < N || idx >= (COPIES - 1) * N) {
      jumping.current = true;
      const target = idx < N
        ? idx + Math.floor(COPIES / 2) * N
        : idx - Math.floor(COPIES / 2) * N;

      el.style.scrollSnapType = "none";
      el.scrollLeft = target * cw;
      absRef.current = target;
      setAbsIdx(target);

      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.scrollSnapType = "x mandatory";
        jumping.current = false;
      }));
    }
  }, []);

  // ── mouse drag ───────────────────────────────────────────
  const onPointerDown = (e) => {
    if (e.pointerType === "touch") return;
    const el = trackRef.current;
    drag.current = { active: true, x: e.clientX, sl: el.scrollLeft };
    el.style.scrollSnapType = "none";
    el.style.cursor = "grabbing";
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    trackRef.current.scrollLeft = drag.current.sl - (e.clientX - drag.current.x);
  };

  const onPointerUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const el = trackRef.current;
    if (!el) return;
    el.style.cursor = "grab";
    const cw = getCardW(el);
    if (!cw) { el.style.scrollSnapType = "x mandatory"; return; }
    const idx = Math.round(el.scrollLeft / cw);
    el.style.scrollSnapType = "x mandatory";
    el.scrollTo({ left: idx * cw, behavior: "smooth" });
    absRef.current = idx;
    setAbsIdx(idx);
  };

  // active real-index (0–2) for blur comparison
  const activeReal = absIdx % N;

  return (
    <section id="projects" className="w-full bg-white text-black pt-4 pb-16 md:pt-10 md:pb-28">

      {/* Header */}
      <div className="px-8 md:px-14 flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 border-t border-neutral-200 pt-10 md:pt-14">
        <div>
          <p className="text-[10px] tracking-[0.35em] text-neutral-400 uppercase font-sans font-bold mb-3">
            SELECTED WORKS
          </p>
          <h2 className="font-sans font-extrabold text-3xl md:text-5xl tracking-tight text-neutral-900 leading-tight uppercase">
            OUR CASE{" "}
            <span className="font-serif font-normal italic text-neutral-500">Work</span>
          </h2>
        </div>
        <a href="#talk"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] font-sans font-bold text-neutral-400 uppercase hover:text-black transition-colors group mt-5 md:mt-0">
          VIEW ALL
          <span className="group-hover:translate-x-1 transition-transform duration-300">›</span>
        </a>
      </div>

      {/* Slider — items-start so cards can sit at different vertical positions */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="flex items-start gap-5 overflow-x-scroll no-scrollbar pl-8 md:pl-14 pb-20"
        style={{ scrollSnapType: "x mandatory", cursor: "grab" }}
      >
        {ITEMS.map((p, i) => {
          const realIdx = i % N;
          const isActive = realIdx === activeReal && Math.abs(i - absIdx) < N;
          // odd real-index cards sit lower (even/odd alternating stagger)
          const isLow = realIdx % 2 === 1;

          return (
            <div
              key={i}
              data-card
              className="shrink-0 transition-all duration-500"
              style={{
                width: "var(--slider-card-w)",
                scrollSnapAlign: "start",
                marginTop: isLow ? "80px" : "0px",
                filter:    isActive ? "none"     : "blur(3px)",
                opacity:   isActive ? 1          : 0.5,
                transform: isActive ? "scale(1)" : "scale(0.97)",
              }}
            >
              <div
                className={`rounded-[24px] overflow-hidden relative cursor-pointer shadow-lg bg-gradient-to-br ${p.gradient} flex flex-col justify-between h-[400px] md:h-[540px] border border-neutral-100/10 transition-shadow duration-500 hover:shadow-2xl`}
              >
                {p.image ? (
                  <img src={p.image} alt={p.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 hover:opacity-85 hover:scale-[1.03] transition-all duration-700 ease-out" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0a2f1d] via-[#103a20] to-[#0a1e12] opacity-70" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                <div className="relative z-10 flex justify-between items-center p-5 md:p-6">
                  <span className="text-[9px] tracking-widest font-sans font-bold uppercase bg-[#0f2d1e]/80 text-[#2ebd59] border border-[#2ebd59]/20 px-3.5 py-1.5 rounded-full backdrop-blur-md">
                    {p.tags[0]}
                  </span>
                  <span className="font-mono text-xs text-white/40">{p.id}</span>
                </div>

                <div className="relative z-10 p-5 md:p-8">
                  <h3 className="font-sans font-extrabold text-xl md:text-3xl text-white mb-2 tracking-tight uppercase">
                    {p.title}
                  </h3>
                  <p className="text-xs text-neutral-300 font-sans leading-relaxed max-w-[240px] opacity-80">
                    {p.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* trailing spacer */}
        <div className="shrink-0 w-8 md:w-14" aria-hidden />
      </div>
    </section>
  );
}
