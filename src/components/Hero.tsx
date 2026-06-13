"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { profile } from "@/data/profile";
import { ChessKing, Spade } from "./ChessPokerIcons";

type HeroProps = {
  onExplore: () => void;
  onAbout: () => void;
};

export default function Hero({ onExplore, onAbout }: HeroProps) {
  return (
    <div className="flex h-full w-full flex-col justify-between py-2 sm:py-4 select-none">
      {/* Decorative Top Segment */}
      <div className="flex items-center justify-between opacity-40">
        <span className="text-[10px] tracking-[0.25em] uppercase text-accent-gold">
          Opening Ante
        </span>
        <span className="text-[10px] tracking-[0.25em] uppercase text-accent-gold">
          Table 1 · Player 1
        </span>
      </div>

      {/* Main Grid: Card Face */}
      <div className="my-auto grid gap-6 md:grid-cols-12 md:items-center">
        {/* Left column: Card Art Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative col-span-12 flex items-center justify-center md:col-span-5"
        >
          {/* Glowing Aura */}
          <div className="absolute h-52 w-52 rounded-full bg-accent-gold/5 blur-[50px] animate-pulse-glow" />
          
          <div className="relative flex h-56 w-56 items-center justify-center rounded-3xl border border-accent-gold/15 bg-felt-dark/60 shadow-[inset_0_0_20px_rgba(207,168,70,0.06)] animate-float">
            <Spade size={160} className="text-felt-light/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ChessKing size={72} className="text-accent-gold drop-shadow-[0_0_15px_rgba(207,168,70,0.4)]" />
            </div>
          </div>
        </motion.div>

        {/* Right column: Details */}
        <div className="col-span-12 text-center md:col-span-7 md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-gold/15 bg-accent-gold/5 px-4 py-1.5 text-[10px] tracking-widest uppercase text-accent-gold"
          >
            <Sparkles size={11} className="text-accent-gold animate-spin" style={{ animationDuration: "6s" }} />
            Quant · Research · Build
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-[family-name:var(--font-syne)] text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl text-foreground"
          >
            {profile.name.split(" ")[0]}
            <br />
            <span className="gradient-text">{profile.name.split(" ")[1]}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-4 font-[family-name:var(--font-syne)] text-lg font-semibold text-foreground/90"
          >
            {profile.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-3 max-w-xl text-sm leading-relaxed text-muted"
          >
            {profile.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start"
          >
            <button
              onClick={onExplore}
              className="group relative cursor-pointer overflow-hidden rounded-full bg-gradient-to-r from-accent-gold to-accent-magenta px-6.5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0a2218] transition-all duration-300 hover:shadow-[0_0_25px_rgba(207,168,70,0.35)]"
            >
              <span className="relative z-10">Deal the Hand</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-magenta to-accent-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
            
            <button
              onClick={onAbout}
              className="rounded-full border border-accent-gold/25 px-6.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-accent-gold transition-all duration-300 hover:border-accent-gold hover:bg-accent-gold/5 cursor-pointer"
            >
              About Player
            </button>
          </motion.div>
        </div>
      </div>

      {/* Decorative Bottom Segment */}
      <div className="flex items-center justify-between text-[9px] text-muted opacity-30">
        <span>STRAT-ARB // SYSTEMATIC</span>
        <span>AC-SP-K-MINDS</span>
      </div>
    </div>
  );
}
