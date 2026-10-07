"use client";

import { PARTNERS } from "@/data";

export default function MarqueeSection() {
  return (
    <section
      aria-label="Clients"
      className="w-full bg-[#F8EF3B] border-t-2 border-black py-6 md:py-8 overflow-hidden"
    >
      <div className="ticker-track ticker-track--clients">
        {[...PARTNERS, ...PARTNERS].map((p, i) => (
          <div
            key={i}
            aria-hidden={i >= PARTNERS.length}
            className="flex items-center px-7 md:px-12 shrink-0"
          >
            {/* Logos are transparent PNGs — brightness(0) renders them solid black on the yellow */}
            <img
              src={p.logo}
              alt={i < PARTNERS.length ? p.name : ""}
              decoding="async"
              className="h-7 md:h-10 w-auto object-contain brightness-0"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
