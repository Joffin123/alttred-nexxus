"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HeroSection() {
  const heroRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const words = heroRef.current?.querySelectorAll(".hw");
    if (words?.length) {
      gsap.fromTo(words,
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.3, stagger: 0.12, ease: "power4.out", delay: 0.25 }
      );
    }
  }, []);

  return (
    <section id="hero" ref={heroRef}
      className="w-full h-[82vh] flex flex-col justify-end px-8 md:px-14 pb-14 relative overflow-hidden">

      <div className="flex flex-col items-start gap-1">
        <div className="overflow-hidden">
          <h1 className="hw font-sans font-extrabold text-[8.5vw] md:text-[5.2vw] tracking-[-0.03em] leading-none uppercase">
            WE MAKE EXPERIENCE
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="hw font-sans font-normal text-[8.5vw] md:text-[5.2vw] tracking-[-0.03em] leading-none uppercase">
            For The New Mainstream
          </h1>
        </div>
      </div>

      <div ref={scrollRef}
        className="scroll-drop absolute right-10 md:right-14 bottom-14 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[9px] font-sans tracking-[0.35em] text-neutral-500 uppercase">
          SCROLL
        </span>
        <div className="relative w-px h-10 bg-white/15 rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-3 bg-[#ff6b3d] rounded-full" />
        </div>
      </div>
    </section>
  );
}
