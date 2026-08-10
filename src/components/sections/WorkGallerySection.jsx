"use client";

import { useEffect, useRef } from "react";
import { WORK_GALLERY } from "@/data";

function GalleryCard({ item }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="group cursor-pointer">
      <div
        className="relative w-full overflow-hidden bg-neutral-100"
        style={{ aspectRatio: item.ratio }}
      >
        {item.type === "video" ? (
          <video
            ref={videoRef}
            src={item.src}
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <img
            src={item.src}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}

        <span className="absolute top-3 left-3 z-10 text-[8px] md:text-[9px] tracking-wide font-sans font-medium bg-black/35 text-white/90 px-2.5 py-1 rounded-full backdrop-blur-md">
          Production
        </span>
      </div>

      <div className="pt-2.5">
        <h3 className="font-sans font-medium text-sm md:text-[15px] text-neutral-900 leading-snug">
          {item.title}
        </h3>
        <p className="font-sans text-[11px] md:text-xs text-neutral-400 leading-snug">
          {item.subtitle}
        </p>
      </div>
    </div>
  );
}

export default function WorkGallerySection() {
  return (
    <section id="work-gallery" className="w-full bg-white text-black pt-4 pb-16 md:pt-10 md:pb-20">

      {/* Header */}
      <div className="px-8 md:px-14 mb-10 md:mb-14 border-t border-neutral-200 pt-10 md:pt-14">
        <p className="text-[10px] tracking-[0.35em] text-neutral-400 uppercase font-sans font-bold mb-3">
          RECENT WORK
        </p>
        <h2 className="font-sans font-extrabold text-3xl md:text-5xl tracking-tight text-neutral-900 leading-tight uppercase">
          IN THE{" "}
          <span className="text-neutral-500">Frame</span>
        </h2>
      </div>

      {/* Two-column staggered gallery — left column is wider */}
      <div
        className="px-8 md:px-14 grid gap-4 md:gap-6 items-start"
        style={{ gridTemplateColumns: "1.28fr 1fr" }}
      >
        <div className="flex flex-col gap-5 md:gap-7">
          {WORK_GALLERY.left.map((item, i) => (
            <GalleryCard key={`l-${i}`} item={item} />
          ))}
        </div>

        <div className="flex flex-col gap-5 md:gap-7">
          {WORK_GALLERY.right.map((item, i) => (
            <GalleryCard key={`r-${i}`} item={item} />
          ))}
        </div>
      </div>

    </section>
  );
}
