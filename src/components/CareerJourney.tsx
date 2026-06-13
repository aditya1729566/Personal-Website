"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { ChessPawn, ChessKnight, ChessRook, ChessKing, Diamond } from "./ChessPokerIcons";

const chessIconMap = [ChessPawn, ChessKnight, ChessRook, ChessKing];

export default function CareerJourney() {
  return (
    <div className="flex h-full w-full flex-col justify-between py-2 sm:py-4 select-none">
      {/* Decorative Top Segment */}
      <div className="flex items-center justify-between opacity-40">
        <span className="text-[10px] tracking-[0.25em] uppercase text-accent-gold">
          Grandmaster Strategy
        </span>
        <span className="text-[10px] tracking-[0.25em] uppercase text-poker-red flex items-center gap-1">
          <Diamond size={10} className="fill-poker-red" /> Mid-Game Active
        </span>
      </div>

      <div className="my-auto flex flex-col justify-center h-[90%]">
        <div className="mb-4">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent-gold">
            02 · Strategy
          </span>
          <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-1">
            Career Path
          </h2>
        </div>

        {/* Horizontal timeline cards */}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 items-stretch">
          {profile.careerJourney.map((step, i) => {
            const ChessIcon = chessIconMap[i];

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group rounded-xl border border-accent-gold/10 bg-felt-dark/30 p-4 transition-all duration-300 hover:border-accent-gold/30 hover:bg-felt-light/10 flex flex-col justify-between"
              >
                {/* Connector line for large screens */}
                {i < 3 && (
                  <div className="absolute top-8 left-[90%] right-[-15%] hidden h-[1px] bg-gradient-to-r from-accent-gold/30 to-transparent md:block z-0 pointer-events-none" />
                )}

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-gold/10 text-accent-gold transition-transform duration-300 group-hover:scale-110">
                      <ChessIcon size={20} />
                    </div>
                    <span className="text-[8px] font-bold tracking-[0.15em] uppercase text-accent-gold/50">
                      {step.phase}
                    </span>
                  </div>

                  <span className="text-[9px] text-muted font-bold block">{step.period}</span>
                  <h3 className="font-[family-name:var(--font-syne)] text-sm font-bold text-foreground mt-1 group-hover:text-accent-gold transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-[10px] leading-relaxed text-muted mt-2">
                    {step.description}
                  </p>
                </div>

                <ul className="mt-4 space-y-1.5 border-t border-accent-gold/5 pt-3 relative z-10">
                  {step.highlights.slice(0, 3).map((h) => (
                    <li
                      key={h}
                      className="text-[9px] font-semibold text-foreground/75 before:mr-1.5 before:text-poker-red before:content-['♦'] flex items-center"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Decorative Bottom Segment */}
      <div className="flex items-center justify-between text-[9px] text-muted opacity-30">
        <span>STRAT-ARB // TIMELINE</span>
        <span>AC-SP-K-MINDS</span>
      </div>
    </div>
  );
}
