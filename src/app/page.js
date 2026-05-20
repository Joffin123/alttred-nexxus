"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import FluidBackground from "@/components/FluidBackground";
import SmoothScroll from "@/components/SmoothScroll";

import NavBar from "@/components/sections/NavBar";
import HeroSection from "@/components/sections/HeroSection";
import MarqueeSection from "@/components/sections/MarqueeSection";
import AgencyIntro from "@/components/sections/AgencyIntro";
import ShowreelSection from "@/components/sections/ShowreelSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";
import FooterSection from "@/components/sections/FooterSection";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Preloader onComplete={() => setLoading(false)} />

      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <SmoothScroll>
              <CustomCursor />
              <FluidBackground />

              <main className="relative z-10 w-full text-white">
                <NavBar />
                <HeroSection />
                <MarqueeSection />
                <AgencyIntro />
                <ShowreelSection />
                <ServicesSection />
                <ProjectsSection />
                <ContactSection />
                <FooterSection />
              </main>
            </SmoothScroll>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
