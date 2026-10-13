"use client";

import { motion, useReducedMotion } from "framer-motion";

const YELLOW = "#F8EF3B";
const EASE = [0.22, 1, 0.36, 1];

const EMAIL = "matts@alttrednexxus.com";
const PHONE_DISPLAY = "+91 7012507771";
const PHONE_HREF = "tel:+917012507771";

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/alttred-nexxus/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
        <path d="M4.98 3.5a2.5 2.5 0 1 1-.001 5.001A2.5 2.5 0 0 1 4.98 3.5zM3 9.75h4v11.5H3zM9.5 9.75h3.8v1.7h.05c.53-1 1.82-2.05 3.75-2.05 4 0 4.75 2.6 4.75 6v5.85h-4v-5.2c0-1.25 0-2.85-1.75-2.85s-2 1.35-2 2.75v5.3h-4z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/alttrednexxus_?stkn=N2FuZzBhanU1MTJh&utm_source=qr",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[18px] h-[18px]" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
      </svg>
    ),
  },
];

const LINKS = [
  // No careers page yet — opens an email with the subject pre-filled
  { label: "Careers", href: `mailto:${EMAIL}?subject=Careers` },
  { label: "About",   href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function FooterSection() {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };
  const rise = {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  };
  // Wordmark wipes upward — the direction it reads in
  const wipe = {
    hidden: { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
    show: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, transition: { duration: 1.6, ease: EASE, delay: 0.1 } },
  };

  return (
    <motion.footer
      id="talk"
      aria-label="Contact and site links"
      variants={container}
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="relative w-full overflow-hidden bg-[#030303] border-t border-neutral-900 text-white"
    >
      {/* Vertical "Alttred" wordmark — full height of the footer, cropped slightly at the edge.
          Taken from the logo artwork itself so the letterforms match the nav. */}
      <motion.div
        variants={wipe}
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-y-0 right-0 translate-x-[5%]"
      >
        <img
          src="/footer-wordmark.svg"
          alt=""
          width={50}
          height={257}
          draggable={false}
          className="block h-full w-auto opacity-[0.1]"
        />
      </motion.div>

      {/* Right padding keeps text clear of the wordmark band */}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-14 pt-14 pb-8 md:pt-24 md:pb-10 pr-[104px] md:pr-[150px] xl:pr-[190px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-9 md:gap-y-12">

          {/* Heading */}
          <motion.h2
            variants={rise}
            className="font-sans leading-[1.02] tracking-[-0.02em] text-[38px] sm:text-[44px] md:text-[clamp(3.25rem,6.2vw,6.75rem)]"
          >
            <span className="block font-light text-white">Let&rsquo;s Work</span>
            <span className="block font-extrabold" style={{ color: YELLOW }}>Together</span>
          </motion.h2>

          {/* Details */}
          <div className="flex flex-col gap-7 md:gap-8 md:pt-3">
            <motion.div
              variants={rise}
              className="flex flex-col font-sans font-light text-[15px] md:text-[18px] leading-[1.6]"
            >
              <a href={`mailto:${EMAIL}`} className="w-fit transition-colors duration-300 hover:text-[#F8EF3B]">
                {EMAIL}
              </a>
              <a href={PHONE_HREF} className="w-fit transition-colors duration-300 hover:text-[#F8EF3B]">
                {PHONE_DISPLAY}
              </a>
              <p>
                Based in <strong className="font-bold">Bengaluru</strong>
              </p>
            </motion.div>

            <motion.ul variants={rise} className="flex items-center gap-3" aria-label="Social media">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full border border-white/60 text-white transition-[background-color,color,border-color,transform] duration-300 hover:bg-[#F8EF3B] hover:border-[#F8EF3B] hover:text-black hover:-translate-y-0.5"
                  >
                    {s.icon}
                  </a>
                </li>
              ))}
            </motion.ul>

            <motion.nav variants={rise} aria-label="Footer" className="flex items-center font-sans font-light text-[15px] md:text-[18px] leading-none">
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="px-3 first:pl-0 border-l border-white/70 first:border-l-0 py-0.5 transition-colors duration-300 hover:text-[#F8EF3B]"
                >
                  {l.label}
                </a>
              ))}
            </motion.nav>
          </div>
        </div>

        {/* Copyright */}
        <motion.p
          variants={rise}
          className="mt-12 md:mt-20 font-sans font-light text-[12px] md:text-[15px] leading-relaxed text-white/80"
        >
          &copy;alttrednexxus 2026. all rights reserved
        </motion.p>
      </div>
    </motion.footer>
  );
}
