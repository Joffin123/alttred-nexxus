"use client";

import { motion } from "framer-motion";
import MagBtn from "@/components/MagBtn";

export default function FooterSection() {
  return (
    <section id="talk"
      className="w-full bg-[#030303]/90 backdrop-blur-sm py-16 md:py-24 px-8 md:px-14 border-t border-neutral-900">

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 0.85, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6 mb-12 md:mb-16">

        {/* Animated accent line above label */}
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-[#ff6b3d]/60" />
          <p className="text-[10px] tracking-[0.4em] font-sans font-bold text-[#ff6b3d] uppercase">
            GET IN TOUCH
          </p>
          <div className="h-px w-8 bg-[#ff6b3d]/60" />
        </div>

        <h2 className="font-sans font-extrabold text-[12vw] md:text-[7vw] tracking-[-0.04em] leading-none uppercase">
          BUILD{" "}
          <span className="text-neutral-500 lowercase">with</span>{" "}
          US
        </h2>
        <p className="text-sm text-neutral-400 font-sans font-light leading-relaxed max-w-sm">
          We're always looking for new creative missions. Drop a query or invite us for an interactive pitch.
        </p>
        <MagBtn>
          <a href="mailto:matts@alttrednexxus.com"
            className="bg-white text-black font-sans font-bold text-[10px] tracking-[0.25em] uppercase px-10 py-4 rounded-full hover:bg-[#ff6b3d] hover:text-white transition-all duration-300 inline-block shadow-lg">
            START A PROJECT
          </a>
        </MagBtn>
      </motion.div>

      {/* Giant footer text — shimmer overlay, tracking fixed to prevent letter overlap */}
      <div className="w-full border-t border-neutral-900 pt-16 shimmer-overlay">
        <h1 className="font-sans font-extrabold text-[10vw] leading-none tracking-tight uppercase text-white/[0.08] text-center whitespace-nowrap select-none pointer-events-none">
          ALTTRED NEXXUS
        </h1>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] tracking-[0.25em] font-sans text-neutral-600 uppercase font-medium">
        <span>©2026 ALTTRED NEXXUS AGENCY. ALL RIGHTS RESERVED.</span>
        <div className="flex gap-7">
          {["TWITTER", "INSTAGRAM", "DRIBBBLE"].map((s) => (
            <a key={s} href="#" className="hover:text-white transition-colors duration-300">{s}</a>
          ))}
        </div>
      </div>
    </section>
  );
}
