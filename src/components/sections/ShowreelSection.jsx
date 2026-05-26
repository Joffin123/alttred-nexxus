"use client";

import { useEffect, useRef, useState } from "react";
import { SHOWREEL } from "@/data";

export default function ShowreelSection() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const desktopStyle = (top, zIndex) =>
    isDesktop
      ? { position: "sticky", top, zIndex, height: "480px", marginBottom: "1.5rem" }
      : { position: "relative", height: "400px", marginBottom: "1.5rem" };

  return (
    <section id="showreel-sec" className="w-full bg-[#030303] py-12 md:py-20 px-8 md:px-14 border-t border-neutral-900">
      <div className="w-full flex flex-col items-center relative gap-0 lg:min-h-[145vh]">

        {/* Card 3 — back-most / UVAIRSPACE */}
        <div
          className="w-full overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl transition-all duration-500 ease-out"
          style={desktopStyle("80px", 10)}>
          <div className="relative w-full h-full bg-gradient-to-br from-[#0a2f1d] via-[#103a20] to-[#0a1e12] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-16 h-16 rounded-full border border-white/25 flex items-center justify-center bg-white/10 backdrop-blur-md hover:scale-110 hover:bg-[#ff6b3d] hover:border-transparent transition-all duration-500 cursor-pointer shadow-xl">
                <div className="w-0 h-0 border-t-[9px] border-t-transparent border-l-[16px] border-l-white border-b-[9px] border-b-transparent ml-1" />
              </div>
            </div>
            <span className="absolute bottom-5 left-7 text-[10px] font-sans tracking-[0.25em] text-white/55 uppercase font-semibold">
              {SHOWREEL[2].label}
            </span>
            <span className="absolute top-5 right-7 font-mono text-xs text-white/20">
              {SHOWREEL[2].num}
            </span>
          </div>
        </div>

        {/* Card 2 — middle / NOBLE MISFIT */}
        <div
          className="w-full overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl transition-all duration-500 ease-out"
          style={desktopStyle("128px", 20)}>
          <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
            <img src={SHOWREEL[1].image} alt={SHOWREEL[1].label}
              className="absolute inset-0 w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-16 h-16 rounded-full border border-white/25 flex items-center justify-center bg-white/10 backdrop-blur-md hover:scale-110 hover:bg-[#ff6b3d] hover:border-transparent transition-all duration-500 cursor-pointer shadow-xl">
                <div className="w-0 h-0 border-t-[9px] border-t-transparent border-l-[16px] border-l-white border-b-[9px] border-b-transparent ml-1" />
              </div>
            </div>
            <span className="absolute bottom-5 left-7 text-[10px] font-sans tracking-[0.25em] text-white/55 uppercase font-semibold">
              {SHOWREEL[1].label}
            </span>
            <span className="absolute top-5 right-7 font-mono text-xs text-white/20">
              {SHOWREEL[1].num}
            </span>
          </div>
        </div>

        {/* Card 1 — front-most / AMINU */}
        <div
          className="w-full overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl transition-all duration-500 ease-out"
          style={desktopStyle("176px", 30)}>
          <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
            <img src={SHOWREEL[0].image} alt={SHOWREEL[0].label}
              className="absolute inset-0 w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-16 h-16 rounded-full border border-white/25 flex items-center justify-center bg-white/10 backdrop-blur-md hover:scale-110 hover:bg-[#ff6b3d] hover:border-transparent transition-all duration-500 cursor-pointer shadow-xl">
                <div className="w-0 h-0 border-t-[9px] border-t-transparent border-l-[16px] border-l-white border-b-[9px] border-b-transparent ml-1" />
              </div>
            </div>
            <span className="absolute bottom-5 left-7 text-[10px] font-sans tracking-[0.25em] text-white/55 uppercase font-semibold">
              {SHOWREEL[0].label}
            </span>
            <span className="absolute top-5 right-7 font-mono text-xs text-white/20">
              {SHOWREEL[0].num}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
