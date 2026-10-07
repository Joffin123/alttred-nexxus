"use client";

import FooterLogo from "@/components/FooterLogo";

export default function FooterSection() {
  return (
    <section id="talk"
      className="w-full bg-[#030303]/90 backdrop-blur-sm py-16 md:py-24 px-6 md:px-14 border-t border-neutral-900">

      {/* Giant footer logo — letters draw themselves in when the footer comes into view */}
      <div className="w-full pt-4 text-white">
        <FooterLogo className="block mx-auto w-[78%] md:w-[62%] h-auto select-none pointer-events-none" />
      </div>

      <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] tracking-[0.25em] font-sans text-neutral-600 uppercase font-medium">
        <span>©2026 ALTTRED NEXXUS AGENCY. ALL RIGHTS RESERVED.</span>
        <div className="flex gap-7">
        <a
        href="https://www.linkedin.com/company/alttred-nexxus/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white transition-colors duration-300"
    >
    LINKEDIN
  </a>

    <a
    href="https://www.instagram.com/alttrednexxus_?stkn=N2FuZzBhanU1MTJh&utm_source=qr"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-white transition-colors duration-300"
  >
    INSTAGRAM
  </a>
</div>
      </div>
    </section>
  );
}
