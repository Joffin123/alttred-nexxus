"use client";

export default function FluidBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-[#030303] overflow-hidden">
      <video
        src="/hero-video.mp4"
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
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
