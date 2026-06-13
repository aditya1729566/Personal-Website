"use client";

import { motion } from "framer-motion";
import { Shield, Globe, TrendingUp } from "lucide-react";
import { profile } from "@/data/profile";
import { Spade } from "./ChessPokerIcons";

const icons = [Shield, Globe, TrendingUp];
const names = ["The Hedge", "The Macro", "The Bet"];

export default function Research() {
  return (
    <div className="flex h-full w-full flex-col justify-between py-2 sm:py-4 select-none">
      {/* Decorative Top Segment */}
      <div className="flex items-center justify-between opacity-40">
        <span className="text-[10px] tracking-[0.25em] uppercase text-accent-gold">
          The Analytical Flop
        </span>
        <span className="text-[10px] tracking-[0.25em] uppercase text-accent-gold flex items-center gap-1">
          <Spade size={10} className="fill-accent-gold" /> Spade Deck Active
        </span>
      </div>

      <div className="my-auto flex flex-col justify-center h-[90%]">
        <div className="mb-4">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent-gold">
            04 · The Gambit
          </span>
          <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-1">
            Research Interests
          </h2>
        </div>

        {/* 3 cards side-by-side */}
        <div className="grid gap-4 md:grid-cols-3 items-stretch">
          {profile.researchAreas.map((area, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="group rounded-xl border border-accent-gold/10 bg-felt-dark/40 p-4 transition-all duration-500 hover:border-accent-gold/30 hover:bg-felt-light/10 flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-gold/10 text-accent-gold transition-transform duration-300 group-hover:scale-110">
                      <Icon size={16} />
                    </div>
                    <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-accent-gold/50">
                      {names[i]}
                    </span>
                  </div>

                  <h3 className="font-[family-name:var(--font-syne)] text-sm font-bold text-foreground group-hover:text-accent-gold transition-colors duration-300">
                    {area.title}
                  </h3>
                  <p className="mt-2 text-[10px] leading-relaxed text-muted font-medium">
                    {area.description}
                  </p>
                </div>

                <div className="mt-4 border-t border-accent-gold/5 pt-2 text-[8px] font-semibold text-accent-gold/40 select-none">
                  RESEARCH AREA 0{i + 1} // ACTIVE
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Decorative Bottom Segment */}
      <div className="flex items-center justify-between text-[9px] text-muted opacity-30">
        <span>STRAT-ARB // ACADEMIA</span>
        <span>AC-SP-K-MINDS</span>
      </div>
    </div>
  );
}
