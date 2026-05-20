"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const gooeySvgRef = useRef(null);

  const [isMobile, setIsMobile] = useState(true);
  const [hoveredType, setHoveredType] = useState(""); // "", "magnetic", "inverted", "service", "project"
  const [hoveredText, setHoveredText] = useState("");

  // Mouse positions
  const mouse = useRef({ x: 0, y: 0 });
  const cursor = useRef({ x: 0, y: 0 });
  
  // Velocity and stretch values
  const lastMouse = useRef({ x: 0, y: 0 });
  const speed = useRef(0);
  const angle = useRef(0);

  useEffect(() => {
    // Check if device is touch or mobile
    const checkDevice = () => {
      const mobile = 
        window.matchMedia("(max-width: 768px)").matches || 
        "ontouchstart" in window || 
        navigator.maxTouchPoints > 0;
      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    if (isMobile) return;

    // Track mouse coordinates
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationFrameId;
    
    const updateCursor = () => {
      // Lerp (Linear Interpolation) for smooth trailing effect
      const ease = 0.15;
      cursor.current.x += (mouse.current.x - cursor.current.x) * ease;
      cursor.current.y += (mouse.current.y - cursor.current.y) * ease;

      // Calculate speed (velocity)
      const dx = mouse.current.x - lastMouse.current.x;
      const dy = mouse.current.y - lastMouse.current.y;
      
      // Calculate speed and angle
      const calculatedSpeed = Math.sqrt(dx * dx + dy * dy);
      speed.current += (calculatedSpeed - speed.current) * 0.1; // Smooth speed
      
      if (calculatedSpeed > 1) {
        angle.current = Math.atan2(dy, dx) * (180 / Math.PI);
      }

      // Update dot cursor (instant)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }

      // Update gooey trailing cursor (lerped with stretching and rotation)
      if (cursorRef.current) {
        // Limit maximum stretch
        const maxStretch = 1.8;
        const stretchFactor = 0.008;
        const scaleX = Math.min(1 + speed.current * stretchFactor, maxStretch);
        const scaleY = Math.max(1 - speed.current * stretchFactor * 0.7, 0.5);

        cursorRef.current.style.transform = `
          translate3d(${cursor.current.x}px, ${cursor.current.y}px, 0)
          rotate(${angle.current}deg)
          scale(${scaleX}, ${scaleY})
        `;
      }

      // Save last coordinates
      lastMouse.current.x = mouse.current.x;
      lastMouse.current.y = mouse.current.y;

      animationFrameId = requestAnimationFrame(updateCursor);
    };

    animationFrameId = requestAnimationFrame(updateCursor);

    // Track hover classes on mouse over
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const interactive = target.closest("a, button, [data-cursor]");
      if (interactive) {
        const type = interactive.getAttribute("data-cursor") || "inverted";
        const text = interactive.getAttribute("data-cursor-text") || "";
        setHoveredType(type);
        setHoveredText(text);
      } else {
        setHoveredType("");
        setHoveredText("");
      }
    };

    const handleMouseOut = () => {
      setHoveredType("");
      setHoveredText("");
    };

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Global SVG Gooey Filter definitions */}
      <svg className="hidden pointer-events-none" ref={gooeySvgRef}>
        <defs>
          <filter id="cursor-gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Main Cursor Element Wrapper */}
      <div 
        className="fixed inset-0 pointer-events-none z-[10000] mix-blend-difference"
        style={{ filter: "url(#cursor-gooey)" }}
      >
        {/* Core Dot (Tracks cursor perfectly) */}
        <div 
          ref={dotRef}
          className="absolute w-2 h-2 -ml-1 -mt-1 bg-white rounded-full transition-all duration-150 ease-out"
        />

        {/* Trail Blob (Gooey effect matches with dot) */}
        <div 
          ref={cursorRef}
          className={`absolute rounded-full bg-white/40 flex items-center justify-center transition-all duration-300 ease-out
            ${hoveredType === "" ? "w-10 h-10 -ml-5 -mt-5" : ""}
            ${hoveredType === "inverted" ? "w-16 h-16 -ml-8 -mt-8 bg-white" : ""}
            ${hoveredType === "magnetic" ? "w-14 h-14 -ml-7 -mt-7 bg-white" : ""}
            ${hoveredType === "service" ? "w-20 h-20 -ml-10 -mt-10 bg-[#ff6b3d]" : ""}
            ${hoveredType === "project" ? "w-24 h-24 -ml-12 -mt-12 bg-white" : ""}
          `}
        >
          {/* Custom text inside cursor on hover */}
          {hoveredText && (
            <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-black animate-fade-in select-none">
              {hoveredText}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
