"use client";

import Link from "next/link";
import { PROJECTS } from "@/data";

function CaseCard({ p }) {
  const inner = (
    <>
      {p.image ? (
        <img
          src={p.image}
          alt={p.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60 hover:opacity-85 hover:scale-[1.03] transition-all duration-700 ease-out"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a2f1d] via-[#103a20] to-[#0a1e12] opacity-70" />
      )}

      {!p.hideOverlay && (
        <>
          <div className="relative z-10 flex justify-between items-center p-5 md:p-6">
            <span className="text-[9px] tracking-widest font-sans font-bold uppercase bg-black/70 text-[#ff6b3d] border border-neutral-700/50 px-3.5 py-1.5 rounded-full backdrop-blur-md">
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
            {p.slug && (
              <span className="inline-flex items-center gap-1.5 mt-4 text-[9px] tracking-[0.2em] font-sans font-bold uppercase text-[#ff6b3d] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                VIEW CASE STUDY <span>→</span>
              </span>
            )}
          </div>
        </>
      )}
    </>
  );

  const cardCls = `overflow-hidden relative bg-gradient-to-br ${p.gradient} flex flex-col justify-between h-[400px] md:h-[520px] border border-neutral-100/10 shadow-lg hover:shadow-2xl transition-shadow duration-500 group`;

  if (p.slug) {
    return (
      <Link href={`/case-study/${p.slug}`} className={cardCls}>
        {inner}
      </Link>
    );
  }
  return <div className={`${cardCls} cursor-default`}>{inner}</div>;
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="w-full bg-white text-black pt-4 pb-16 md:pt-10 md:pb-20">

      {/* Header */}
      <div className="px-8 md:px-14 mb-10 md:mb-14 border-t border-neutral-200 pt-10 md:pt-14">
        <p className="text-[10px] tracking-[0.35em] text-neutral-400 uppercase font-sans font-bold mb-3">
          SELECTED WORKS
        </p>
        <h2 className="font-sans font-extrabold text-3xl md:text-5xl tracking-tight text-neutral-900 leading-tight uppercase">
          OUR CASE{" "}
          <span className="text-neutral-500">Work</span>
        </h2>
      </div>

      {/* 2-column grid */}
      <div className="px-8 md:px-14 grid grid-cols-1 md:grid-cols-2 gap-5">
        {PROJECTS.map((p) => (
          <CaseCard key={p.id} p={p} />
        ))}
      </div>

    </section>
  );
}
