"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FluidBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawCover = (img) => {
      if (!img?.complete || !img.naturalWidth) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let dw, dh, dx, dy;
      if (cr > ir) {
        dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2;
      } else {
        dh = ch; dw = ch * ir; dx = (cw - dw) / 2; dy = 0;
      }
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const frameObj = { frame: 0 };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      const f = window.fluidFrames;
      if (f?.[Math.round(frameObj.frame)]) {
        drawCover(f[Math.round(frameObj.frame)]);
      }
    };

    let st;
    const check = setInterval(() => {
      if (!window.fluidFrames?.length) return;
      clearInterval(check);

      resize();
      drawCover(window.fluidFrames[0]);

      st = gsap.to(frameObj, {
        frame: window.fluidFrames.length - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.2,
          onUpdate: () => {
            const frames = window.fluidFrames;
            const i = Math.round(frameObj.frame);
            if (frames?.[i]) drawCover(frames[i]);
          },
        },
      });
    }, 50);

    window.addEventListener("resize", resize);

    return () => {
      clearInterval(check);
      window.removeEventListener("resize", resize);
      st?.scrollTrigger?.kill();
      st?.kill();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-[#030303] overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Radial vignette — makes canvas read as centred arch, not flat wallpaper */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 45%, transparent 35%, #030303 80%)",
        }}
      />
    </div>
  );
}
