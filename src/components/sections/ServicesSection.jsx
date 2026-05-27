"use client";

import { motion } from "framer-motion";
import { SERVICES } from "@/data";

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98], delay: i * 0.09 },
  }),
};

export default function ServicesSection() {
  return (
    <section id="services"
      className="w-full bg-white text-black py-12 md:py-20 px-8 md:px-14 border-t border-neutral-100 flex flex-col justify-center relative overflow-hidden">

      <motion.h2
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-5%" }}
        transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="font-sans font-extrabold text-4xl md:text-6xl tracking-tight text-neutral-900 uppercase mb-12 text-center w-full pb-10 border-b border-neutral-200">
        SERVICES
      </motion.h2>

      <div className="flex flex-col w-full">
        {SERVICES.map((s, i) => (
          <motion.div key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-5%" }}
            custom={i}
            variants={rowVariants}
            className="service-row-item group relative py-10 md:py-12 border-b border-neutral-200/80 transition-all duration-300"
            data-cursor="service">

            {/* Neon left accent bar — expands on hover */}
            <div className="neon-service-bar" />

            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] lg:grid-cols-[1.2fr_1fr] gap-8 items-start pl-4 md:pl-6">

              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-neutral-400 select-none group-hover:text-[#ff6b3d] transition-colors duration-300">
                  {s.num}
                </span>
                <h3 className="font-sans font-extrabold text-3xl md:text-[2.6rem] tracking-tight text-neutral-900 leading-none uppercase group-hover:translate-x-1.5 transition-transform duration-400">
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
          </motion.div>
        ))}
      </div>
    </section>
  );
}
