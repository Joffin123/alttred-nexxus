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
    <a
      ref={containerRef}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block cursor-pointer"
    >
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
            alt={item.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}

        <span className="absolute top-2.5 left-2.5 md:top-4 md:left-4 z-10 text-[11px] md:text-[12px] tracking-[0.01em] font-sans font-medium bg-black/50 text-white px-2.5 py-1 md:px-3 rounded-full backdrop-blur-md">
          {item.tag}
        </span>
      </div>

      <div className="pt-3 md:pt-4">
        <h3 className="font-sans font-medium text-[16px] md:text-[20px] tracking-[-0.01em] text-neutral-900 leading-tight">
          {item.title}
        </h3>
        <p className="mt-1 font-sans text-[13px] md:text-[15px] text-neutral-500 leading-snug">
          {item.subtitle}
        </p>
      </div>
    </a>
  );
}

export default function WorkGallerySection() {
  return (
    <section id="work-gallery" className="w-full bg-white text-black pt-16 md:pt-24 pb-20 md:pb-28">

      {/* Header */}
      <div className="px-6 md:px-14 mb-10 md:mb-14">
        {/* <p className="text-[10px] tracking-[0.35em] text-neutral-400 uppercase font-sans font-bold mb-3">
          RECENT WORK
        </p> */}
        <h2 className="font-sans font-medium text-[34px] md:text-[clamp(2.75rem,4.5vw,4rem)] tracking-[-0.02em] text-neutral-900 leading-[1.05]">
          Featured{" "}
          <span className="text-neutral-500">Works</span>
        </h2>
      </div>

      {/* Two-column staggered gallery — left column is wider */}
      <div
        className="px-6 md:px-14 grid gap-4 md:gap-6 items-start"
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
