"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { PokerChip } from "./ChessPokerIcons";

const navLinks = [
  { label: "Ante", index: 0 },
  { label: "Player", index: 1 },
  { label: "Strategy", index: 2 },
  { label: "Deck", index: 3 },
  { label: "Gambit", index: 4 },
  { label: "Endgame", index: 5 },
];

type NavbarProps = {
  activePage: number;
  onPageChange: (index: number) => void;
};

export default function Navbar({ activePage, onPageChange }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-40 glass border-gradient"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <button
          onClick={() => onPageChange(0)}
          className="font-[family-name:var(--font-syne)] text-lg font-bold tracking-tight text-foreground transition-all duration-300 hover:text-accent-gold flex items-center gap-2"
        >
          AA<span className="text-poker-red">♦</span>
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = activePage === link.index;
            return (
              <li key={link.index} className="flex items-center gap-1.5">
                <button
                  onClick={() => onPageChange(link.index)}
                  className={`relative px-3 py-1.5 text-xs tracking-wider uppercase font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    isActive ? "text-accent-gold" : "text-muted hover:text-foreground"
                  }`}
                >
                  <PokerChip size={14} active={isActive} className="transition-transform duration-500 hover:rotate-180" />
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-gold"
                      transition={{ duration: 0.35 }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* View Work Shortcut */}
        <button
          onClick={() => onPageChange(3)}
          className="hidden rounded-full border border-accent-gold/30 bg-accent-gold/5 px-4.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-gold transition-all duration-300 hover:bg-accent-gold/10 hover:shadow-[0_0_15px_rgba(207,168,70,0.25)] md:block cursor-pointer"
        >
          View Work
        </button>

        {/* Mobile Navigation Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-foreground md:hidden p-1"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} className="text-accent-gold" /> : <Menu size={20} className="text-accent-gold" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-accent-gold/15 bg-charcoal/95 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-2 px-6 py-4">
              {navLinks.map((link) => {
                const isActive = activePage === link.index;
                return (
                  <li key={link.index}>
                    <button
                      onClick={() => {
                        onPageChange(link.index);
                        setMobileOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 py-2.5 text-sm tracking-wider uppercase font-semibold text-left transition-all ${
                        isActive ? "text-accent-gold font-bold" : "text-muted"
                      }`}
                    >
                      <PokerChip size={16} active={isActive} />
                      {link.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
