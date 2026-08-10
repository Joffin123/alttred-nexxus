"use client";

export default function FooterSection() {
  return (
    <section id="talk"
      className="w-full bg-[#030303]/90 backdrop-blur-sm py-16 md:py-24 px-8 md:px-14 border-t border-neutral-900">

      {/* Giant footer text — shimmer overlay, tracking fixed to prevent letter overlap */}
      <div className="w-full border-t border-neutral-900 pt-16 shimmer-overlay">
        <h1 className="font-sans font-semibold text-[10vw] leading-none tracking-tight uppercase text-white/[0.08] text-center whitespace-nowrap select-none pointer-events-none">
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
