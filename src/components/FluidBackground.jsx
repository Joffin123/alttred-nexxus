"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 151;
const frameUrl = (i) =>
  `/fluid-sequence/ezgif-frame-${String(i).padStart(3, "0")}.png`;

export default function FluidBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameObj = { frame: 0 };
    const frames = new Array(FRAME_COUNT);

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

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width  = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cur = frames[Math.round(frameObj.frame)];
      if (cur?.complete) drawCover(cur);
    };

    resize();
    window.addEventListener("resize", resize);

    // Load all frames; draw frame 0 as soon as it's ready
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameUrl(i + 1);
      img.onload = () => {
        if (i === 0) drawCover(img);
      };
      frames[i] = img;
    }

    const st = gsap.to(frameObj, {
      frame: FRAME_COUNT - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.4,
        onUpdate: () => {
          const i = Math.round(frameObj.frame);
          if (frames[i]?.complete) drawCover(frames[i]);
        },
      },
    });

    return () => {
      window.removeEventListener("resize", resize);
      st?.scrollTrigger?.kill();
      st?.kill();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-[#030303] overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
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
