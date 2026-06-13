"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import Hero from "@/components/Hero";
import About from "@/components/About";
import CareerJourney from "@/components/CareerJourney";
import Projects from "@/components/Projects";
import Research from "@/components/Research";
import Goals from "@/components/Goals";
import DigitalTwinChat from "@/components/DigitalTwinChat";
import { Spade, Heart, Diamond, Club } from "@/components/ChessPokerIcons";

const TOTAL_PAGES = 6;

export default function Home() {
  const [activePage, setActivePage] = useState(0);
  const [displayPage, setDisplayPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const handlePageChange = (targetPage: number) => {
    if (targetPage === activePage || isTransitioning) return;
    if (targetPage < 0 || targetPage >= TOTAL_PAGES) return;

    setDirection(targetPage > activePage ? 1 : -1);
    setIsTransitioning(true);
    setActivePage(targetPage);

    // Swap content mid-fold (0.4s into the 0.8s transition)
    setTimeout(() => {
      setDisplayPage(targetPage);
    }, 400);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      if (e.key === "ArrowRight" || e.key === "Right") {
        if (activePage < TOTAL_PAGES - 1) handlePageChange(activePage + 1);
      } else if (e.key === "ArrowLeft" || e.key === "Left") {
        if (activePage > 0) handlePageChange(activePage - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePage, isTransitioning]);

  // Card Suit & Value indicators for corner decoration
  const getCardDetails = (pageIndex: number) => {
    switch (pageIndex) {
      case 0:
        return { suit: <Spade className="text-accent-gold" size={14} />, value: "A", name: "The Ante" };
      case 1:
        return { suit: <Heart className="text-poker-red" size={14} />, value: "K", name: "The Player" };
      case 2:
        return { suit: <Diamond className="text-poker-red" size={14} />, value: "J", name: "The Strategy" };
      case 3:
        return { suit: <Club className="text-accent-gold" size={14} />, value: "Q", name: "The Deck" };
      case 4:
        return { suit: <Spade className="text-accent-gold" size={14} />, value: "10", name: "The Gambit" };
      case 5:
        return { suit: <Diamond className="text-poker-red" size={14} />, value: "K", name: "The Endgame" };
      default:
        return { suit: <Spade className="text-accent-gold" size={14} />, value: "A", name: "Card" };
    }
  };

  const currentCard = getCardDetails(displayPage);

  const renderActiveComponent = () => {
    switch (displayPage) {
      case 0:
        return <Hero onExplore={() => handlePageChange(3)} onAbout={() => handlePageChange(1)} />;
      case 1:
        return <About />;
      case 2:
        return <CareerJourney />;
      case 3:
        return <Projects />;
      case 4:
        return <Research />;
      case 5:
        return <Goals />;
      default:
        return <Hero onExplore={() => handlePageChange(3)} onAbout={() => handlePageChange(1)} />;
    }
  };

  return (
    <>
      <ScrollProgress activePage={activePage} totalPages={TOTAL_PAGES} />
      <Navbar activePage={activePage} onPageChange={handlePageChange} />

      <main className="felt-bg chess-grid relative flex h-screen w-screen items-center justify-center overflow-hidden px-4 pt-16 select-none">
        <div className="absolute inset-0 bg-radial from-transparent to-[#030705]/80 pointer-events-none" />

        {/* Previous Page Button (Poker Chip) */}
        {activePage > 0 && (
          <button
            onClick={() => handlePageChange(activePage - 1)}
            disabled={isTransitioning}
            className="absolute left-4 z-40 hidden h-12 w-12 items-center justify-center rounded-full border border-accent-gold/40 bg-charcoal text-accent-gold transition-all duration-300 hover:scale-110 hover:border-accent-gold hover:shadow-[0_0_15px_rgba(207,168,70,0.4)] disabled:opacity-40 sm:flex"
            aria-label="Previous Page"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Next Page Button (Poker Chip) */}
        {activePage < TOTAL_PAGES - 1 && (
          <button
            onClick={() => handlePageChange(activePage + 1)}
            disabled={isTransitioning}
            className="absolute right-4 z-40 hidden h-12 w-12 items-center justify-center rounded-full border border-accent-gold/40 bg-charcoal text-accent-gold transition-all duration-300 hover:scale-110 hover:border-accent-gold hover:shadow-[0_0_15px_rgba(207,168,70,0.4)] disabled:opacity-40 sm:flex"
            aria-label="Next Page"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* The 3D Game Table Viewport */}
        <div className="perspective-2000 relative flex h-full w-full max-w-5xl items-center justify-center py-6">
          <motion.div
            className="preserve-3d relative flex h-[min(650px,78vh)] w-full max-w-4xl flex-col rounded-[2.5rem] border border-accent-gold/25 bg-charcoal p-6 shadow-[0_30px_100px_rgba(0,0,0,0.7)] glow-gold select-text sm:p-8"
            animate={
              isTransitioning
                ? {
                    rotateX: [6, 14, 6],
                    rotateY: [0, -12 * direction, 0],
                    rotateZ: [0, 0.8 * direction, 0],
                    scale: [1, 0.95, 1],
                  }
                : {
                    rotateX: 6,
                    rotateY: 0,
                    rotateZ: 0,
                    scale: 1,
                  }
            }
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Card Background Overlay Texture */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/[0.01] via-transparent to-black/40 pointer-events-none" />
            <div className="absolute inset-4 rounded-[1.5rem] border border-white/[0.02] pointer-events-none" />

            {/* Top Left Playing Card Marker */}
            <div className="absolute top-6 left-6 z-20 flex flex-col items-center leading-none font-bold text-xs pointer-events-none text-accent-gold/60">
              <span className="text-[14px]">{currentCard.value}</span>
              <span className="mt-0.5">{currentCard.suit}</span>
            </div>

            {/* Bottom Right Playing Card Marker */}
            <div className="absolute bottom-6 right-6 z-20 flex flex-col items-center leading-none font-bold text-xs pointer-events-none rotate-180 text-accent-gold/60">
              <span className="text-[14px]">{currentCard.value}</span>
              <span className="mt-0.5">{currentCard.suit}</span>
            </div>

            {/* Page Title Stamp (Center Top) */}
            <div className="absolute top-5 left-1/2 z-20 -translate-x-1/2 font-[family-name:var(--font-syne)] text-[9px] font-bold tracking-[0.3em] uppercase text-accent-gold/40 pointer-events-none">
              {currentCard.name}
            </div>

            {/* Active Card Page Content Container */}
            <div className="relative z-10 flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayPage}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="h-full w-full overflow-y-auto px-4 py-4 sm:px-8 select-text"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <style jsx global>{`
                    .relative.z-10.flex-1.overflow-hidden::-webkit-scrollbar {
                      display: none;
                    }
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  {renderActiveComponent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>

      <DigitalTwinChat />
    </>
  );
}
