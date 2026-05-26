"use client";

import { SERVICES } from "@/data";

export default function ServicesSection() {
  return (
    <section id="services"
      className="w-full bg-white text-black py-12 md:py-20 px-8 md:px-14 border-t border-neutral-100 flex flex-col justify-center relative overflow-hidden">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 pb-14 border-b border-neutral-200 mb-10 w-full">
        <div>
          <p className="text-[10px] tracking-[0.35em] text-neutral-400 uppercase font-sans font-bold">
            WHAT WE DO
          </p>
        </div>

        <div>
          <h2 className="font-sans font-bold text-2xl md:text-[1.75rem] leading-snug tracking-tight text-neutral-950 uppercase">
            Helping Brands Stand Out,{" "} <br />
            <span className="text-neutral-500">
              Not Blend In
            </span>
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-500 font-sans leading-relaxed">
            Every Brand With A Story Deserves A Platform To Tell It.
            With Fans Who Listen To Your Story. Realized By Experts
            With One Shared Passion: Creating Digital Things.
          </p>
          <a href="#projects"
            className="text-[10px] tracking-[0.25em] font-sans font-bold text-neutral-800 uppercase inline-flex items-center gap-2 group w-fit">
            DISCOVER MORE
            <span className="group-hover:translate-x-1 transition-transform duration-300">›</span>
          </a>
        </div>
      </div>

      <h2 className="font-sans font-extrabold text-4xl md:text-6xl tracking-tight text-neutral-900 uppercase mb-10">
        SERVICES
      </h2>

      <div className="flex flex-col w-full">
        {SERVICES.map((s, i) => (
          <div key={i}
            className="service-row-item relative py-10 md:py-12 border-b border-neutral-200/80 transition-all duration-300"
            data-cursor="service">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] lg:grid-cols-[1.2fr_1fr] gap-8 items-start">

              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-neutral-400 select-none">{s.num}</span>
                <h3 className="font-sans font-extrabold text-3xl md:text-[2.6rem] tracking-tight text-neutral-900 leading-none uppercase">
                  {s.title}
                </h3>
              </div>

              <div className="flex flex-col gap-5 pt-1.5">
                <p className="text-xs md:text-sm text-neutral-500 font-sans leading-relaxed">{s.desc}</p>
                <div className="flex flex-wrap gap-2.5">
                  {s.tags.map((t, j) => (
                    <span key={j}
                      className="text-[9px] tracking-widest font-sans font-bold uppercase text-neutral-400 border border-neutral-200 px-3.5 py-1.5 rounded-full select-none cursor-default">
                      {t}
                    </span>
                  ))}
                  <a href="#talk"
                    className="text-[9px] tracking-widest font-sans font-bold uppercase text-neutral-400 border border-neutral-200 px-3.5 py-1.5 rounded-full select-none hover:text-black hover:border-neutral-400 transition-colors duration-300">
                    DISCOVER MORE
                  </a>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
