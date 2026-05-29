"use client";

import { useEffect, useRef, useState } from "react";
import { SHOWREEL } from "@/data";

function VideoCard({ item, sticky, top, zIndex }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleSound = (e) => {
    e.stopPropagation();
    setMuted((prev) => {
      if (videoRef.current) videoRef.current.muted = !prev;
      return !prev;
    });
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const cardStyle = sticky
    ? { position: "sticky", top, zIndex, height: "480px", marginBottom: "1.5rem" }
    : { position: "relative", height: "400px", marginBottom: "1.5rem" };

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl"
      style={cardStyle}
    >
      <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src={item.video}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Top-right controls */}
        <div className="absolute top-5 left-7 font-mono text-xs text-white/20 z-20">
          {item.num}
        </div>
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-7 z-20 flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white/60 hover:text-white hover:bg-[#ff6b3d]/80 hover:border-transparent transition-all duration-300 cursor-pointer"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
          )}
        </button>

        {/* Bottom controls */}
        <span className="absolute bottom-5 left-7 text-[10px] font-sans tracking-[0.25em] text-white/55 uppercase font-semibold z-20">
          {item.label}
        </span>
        <button
          onClick={toggleSound}
          className="absolute bottom-5 right-7 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white/70 hover:text-white hover:bg-[#ff6b3d]/80 hover:border-transparent transition-all duration-300 text-[10px] font-sans tracking-[0.2em] uppercase font-semibold cursor-pointer"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
              SOUND OFF
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
              SOUND ON
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function ShowreelSection() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const tops = ["80px", "128px", "176px"];
  const zIndexes = [10, 20, 30];

  return (
    <section id="showreel-sec" className="w-full bg-[#030303] py-12 md:py-20 px-8 md:px-14 border-t border-neutral-900">
      <div className="w-full flex flex-col items-center relative gap-0 lg:min-h-[145vh]">
        {SHOWREEL.map((item, i) => (
          <VideoCard
            key={item.num}
            item={item}
            sticky={isDesktop}
            top={tops[i]}
            zIndex={zIndexes[i]}
          />
        ))}
      </div>
    </section>
  );
}
