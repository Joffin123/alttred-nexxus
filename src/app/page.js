"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Preloader hidden for now
// import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import FluidBackground from "@/components/FluidBackground";
import SmoothScroll from "@/components/SmoothScroll";

import NavBar from "@/components/sections/NavBar";
import HeroSection from "@/components/sections/HeroSection";
import PurposeSection from "@/components/sections/PurposeSection";
import StatementSection from "@/components/sections/StatementSection";
import MarqueeSection from "@/components/sections/MarqueeSection";
// Agency intro hidden for now — the nav "About" link now targets the statement section
// import AgencyIntro from "@/components/sections/AgencyIntro";
// Showreel hidden for now — films are featured in the hero instead
// import ShowreelSection from "@/components/sections/ShowreelSection";
import ServicesSection from "@/components/sections/ServicesSection";
import WorkGallerySection from "@/components/sections/WorkGallerySection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";
import FooterSection from "@/components/sections/FooterSection";

export default function Home() {
  // Set back to true when re-enabling the Preloader
  const [loading, setLoading] = useState(false);

  return (
    <>
      {/* <Preloader onComplete={() => setLoading(false)} /> */}

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
                <PurposeSection />
                <StatementSection />
                <MarqueeSection />
                {/* <AgencyIntro /> */}
                {/* <ShowreelSection /> */}
                <ServicesSection />
                <WorkGallerySection />
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
