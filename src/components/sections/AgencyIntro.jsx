"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.21, 0.47, 0.32, 0.98], delay: i * 0.14 },
  }),
};

export default function AgencyIntro() {
  return (
    <section id="about"
      className="w-full bg-[#030303] py-20 md:py-28 px-8 md:px-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 pt-10 border-t border-neutral-800">

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-8%" }}
          custom={0}
          variants={fadeUp}>
          <p className="text-[10px] tracking-[0.35em] text-neutral-500 uppercase font-sans font-bold">
            AN AGENCY
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-8%" }}
          custom={1}
          variants={fadeUp}>
          <h2 className="font-sans font-bold text-2xl md:text-[1.75rem] leading-snug tracking-tight text-white">
            Helping Brands Stand Out,{" "}<br />
            <span className="text-neutral-500">Not Blend In</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-8%" }}
          custom={2}
          variants={fadeUp}
          className="flex flex-col gap-5">
          <p className="text-sm text-neutral-400 font-sans font-light leading-relaxed">
            Every Brand With A Story Deserves A Platform To Tell It.
            With Fans Who Listen To Your Story. Realized By Experts
            With One Shared Passion: Creating Digital Things.
          </p>
          <a href="#showreel-sec"
            className="text-[10px] tracking-[0.25em] font-sans font-semibold text-white uppercase inline-flex items-center gap-2 group">
            DISCOVER MORE
            <span className="group-hover:translate-x-1 transition-transform duration-300">›</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
