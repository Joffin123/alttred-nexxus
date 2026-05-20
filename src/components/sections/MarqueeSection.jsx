"use client";

import { PARTNERS } from "@/data";

export default function MarqueeSection() {
  return (
    <section className="w-full bg-[#030303] border-t border-b border-neutral-900 py-7 overflow-hidden">
      <div className="ticker-track">
        {[...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS].map((p, i) => (
          <div key={i} className="flex items-center gap-5 px-10 shrink-0">
            <span className="text-neutral-700 text-xs leading-none">{p.symbol}</span>
            <span className="text-sm font-sans font-semibold tracking-[0.38em] text-neutral-500 hover:text-white transition-colors duration-300 cursor-default whitespace-nowrap">
              {p.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
