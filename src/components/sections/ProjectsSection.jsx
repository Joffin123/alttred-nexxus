"use client";

import { PROJECTS } from "@/data";

// 4 copies — animation goes from 0 → -50%, creating a seamless loop
const ITEMS = [...PROJECTS, ...PROJECTS, ...PROJECTS, ...PROJECTS];
const N     = PROJECTS.length;

export default function ProjectsSection() {
  return (
    <section id="projects" className="w-full bg-white text-black pt-4 pb-16 md:pt-10 md:pb-20 overflow-hidden">

      {/* Header */}
      <div className="px-8 md:px-14 flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 border-t border-neutral-200 pt-10 md:pt-14">
        <div>
          <p className="text-[10px] tracking-[0.35em] text-neutral-400 uppercase font-sans font-bold mb-3">
            SELECTED WORKS
          </p>
          <h2 className="font-sans font-extrabold text-3xl md:text-5xl tracking-tight text-neutral-900 leading-tight uppercase">
            OUR CASE{" "}
            <span className="text-neutral-500">Work</span>
          </h2>
        </div>
        <a
          href="#talk"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] font-sans font-bold text-neutral-400 uppercase hover:text-black transition-colors group mt-5 md:mt-0"
        >
          VIEW ALL
          <span className="group-hover:translate-x-1 transition-transform duration-300">›</span>
        </a>
      </div>

      {/* Infinite ticker */}
      <div className="case-ticker-track">
        {ITEMS.map((p, i) => {
          return (
            <div
              key={i}
              className="case-card"
              style={{
                width: "var(--slider-card-w)",
              }}
            >
              <div
                className={`overflow-hidden relative cursor-pointer bg-gradient-to-br ${p.gradient} flex flex-col justify-between h-[400px] md:h-[520px] border border-neutral-100/10 shadow-lg hover:shadow-2xl transition-shadow duration-500`}
              >
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 hover:opacity-85 hover:scale-[1.03] transition-all duration-700 ease-out"
                  />
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
      </div>

    </section>
  );
}
