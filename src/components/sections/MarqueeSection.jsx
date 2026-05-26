"use client";

import { PARTNERS } from "@/data";

export default function MarqueeSection() {
  return (
    <section className="w-full bg-[#030303] border-t border-b border-neutral-900 py-7 overflow-hidden">
      <div className="ticker-track">
        {[...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS].map((p, i) => (
          <div key={i} className="flex items-center gap-8 px-10 shrink-0">
            <img
              src={p.logo}
              alt={p.name}
              className="h-10 w-auto object-contain opacity-65 hover:opacity-90 transition-opacity duration-300 grayscale"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
