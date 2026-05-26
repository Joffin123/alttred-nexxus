"use client";

import { SERVICES } from "@/data";

export default function ServicesSection() {
  return (
    <section id="services"
      className="w-full bg-white text-black py-12 md:py-20 px-8 md:px-14 border-t border-neutral-100 flex flex-col justify-center relative overflow-hidden">

      <h2 className="font-sans font-extrabold text-4xl md:text-6xl tracking-tight text-neutral-900 uppercase mb-12 text-center w-full pb-10 border-b border-neutral-200">
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
