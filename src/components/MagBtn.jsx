"use client";

import { useRef } from "react";
import { gsap } from "gsap";

export default function MagBtn({ children, className = "", ...props }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - (r.left + r.width  / 2)) * 0.32,
      y: (e.clientY - (r.top  + r.height / 2)) * 0.32,
      duration: 0.3, ease: "power2.out",
    });
  };

  const onLeave = () =>
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.3)" });

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className={`inline-block ${className}`} {...props}>
      {children}
    </div>
  );
}
