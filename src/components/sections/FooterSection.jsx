"use client";

import MagBtn from "@/components/MagBtn";

export default function FooterSection() {
  return (
    <section id="talk"
      className="w-full bg-[#030303]/90 backdrop-blur-sm py-16 md:py-24 px-8 md:px-14 border-t border-neutral-900">

      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6 mb-12 md:mb-16">
        <p className="text-[10px] tracking-[0.4em] font-sans font-bold text-[#ff6b3d] uppercase">
          GET IN TOUCH
        </p>
        <h2 className="font-sans font-extrabold text-[12vw] md:text-[7vw] tracking-[-0.04em] leading-none uppercase">
          BUILD{" "}
          <span className="text-neutral-500 lowercase">with</span>{" "}
          US
        </h2>
        <p className="text-sm text-neutral-400 font-sans font-light leading-relaxed max-w-sm">
          We're always looking for new creative missions. Drop a query or invite us for an interactive pitch.
        </p>
        <MagBtn>
          <a href="mailto:hello@alttrednexxus.agency"
            className="bg-white text-black font-sans font-bold text-[10px] tracking-[0.25em] uppercase px-10 py-4 rounded-full hover:bg-[#ff6b3d] hover:text-white transition-all duration-300 inline-block shadow-lg">
            START A PROJECT
          </a>
        </MagBtn>
      </div>

      <div className="w-full overflow-hidden border-t border-neutral-900 pt-16">
        <h1 className="font-sans font-extrabold text-[12vw] leading-none tracking-[-0.05em] uppercase text-white/[0.08] text-center whitespace-nowrap select-none pointer-events-none">
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
