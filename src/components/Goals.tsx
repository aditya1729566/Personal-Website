"use client";

import { motion } from "framer-motion";
import { Clock, FolderOpen } from "lucide-react";
import { profile } from "@/data/profile";
import { ChessKing, Diamond } from "./ChessPokerIcons";

const goalCategories = [
  { key: "finance" as const, label: "Finance", color: "#cfa846" },
  { key: "academia" as const, label: "Academia", color: "#d92534" },
  { key: "entrepreneurship" as const, label: "Venture", color: "#cfa846" },
  { key: "publicService" as const, label: "Service", color: "#d92534" },
];

export default function Goals() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex h-full w-full flex-col justify-between py-2 sm:py-4 select-none">
      {/* Decorative Top Segment */}
      <div className="flex items-center justify-between opacity-40">
        <span className="text-[10px] tracking-[0.25em] uppercase text-accent-gold">
          The Checkmate Strategy
        </span>
        <span className="text-[10px] tracking-[0.25em] uppercase text-poker-red flex items-center gap-1">
          <Diamond size={10} className="fill-poker-red" /> The River Active
        </span>
      </div>

      <div className="my-auto grid gap-6 md:grid-cols-12 md:items-stretch h-[90%]">
        {/* Left Side: Long-term Goals */}
        <div className="col-span-12 flex flex-col justify-between md:col-span-7 pr-2 md:border-r md:border-accent-gold/10 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent-gold">
              05 · The River
            </span>
            <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-1">
              Long-Term Vision
            </h2>

            <div className="grid gap-3 grid-cols-2 mt-4">
              {goalCategories.map((cat) => (
                <div key={cat.key} className="rounded-xl border border-white/[0.03] bg-charcoal p-3 flex flex-col justify-between">
                  <h4 className="font-[family-name:var(--font-syne)] text-[9px] font-bold tracking-widest uppercase" style={{ color: cat.color }}>
                    {cat.label}
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {profile.longTermGoals[cat.key].slice(0, 2).map((goal) => (
                      <li key={goal} className="text-[9px] font-medium leading-normal text-muted flex items-start">
                        <span className="mr-1 text-[8px] opacity-60" style={{ color: cat.color }}>♦</span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Hobbies Section */}
          <div className="mt-4">
            <h4 className="text-[9px] font-bold tracking-widest uppercase text-muted mb-2">Interests & Hobbies</h4>
            <div className="flex flex-wrap gap-1">
              {profile.hobbies.map((hobby) => {
                const isChessPoker = hobby.toLowerCase().includes("chess") || hobby.toLowerCase().includes("poker");
                return (
                  <span
                    key={hobby}
                    className={`rounded-lg border px-2 py-0.5 text-[9px] font-medium transition-colors cursor-default ${
                      isChessPoker
                        ? "border-accent-gold/40 bg-accent-gold/5 text-accent-gold font-semibold"
                        : "border-white/[0.04] bg-felt-dark/30 text-muted"
                    }`}
                  >
                    {hobby}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Portfolio Coming Soon & Mini Footer */}
        <div className="col-span-12 flex flex-col justify-between md:col-span-5 md:pl-2" style={{ scrollbarWidth: "none" }}>
          {/* Card overlay */}
          <div className="rounded-xl border border-accent-gold/15 bg-felt-light/10 p-5 text-center relative overflow-hidden flex-1 flex flex-col justify-center items-center shadow-sm">
            <div className="absolute h-32 w-32 rounded-full bg-accent-gold/5 blur-[30px]" />
            <motion.div
              animate={{ rotate: [0, 6, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-gold/10 text-accent-gold"
            >
              <FolderOpen size={20} className="text-accent-gold" />
            </motion.div>

            <h3 className="font-[family-name:var(--font-syne)] text-base font-bold text-foreground">
              Portfolio Coming Soon
            </h3>
            <p className="mt-2 text-[10px] leading-relaxed text-muted max-w-[200px]">
              A complete showcase of papers, models, software systems, and fund parameters.
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-accent-gold/25 bg-accent-gold/5 px-3 py-1 text-[8px] font-bold tracking-wider uppercase text-accent-gold">
              <Clock size={10} />
              Launching Q3 2026
            </div>
          </div>

          {/* Micro Footer inside Card */}
          <div className="border-t border-accent-gold/10 pt-3.5 mt-4 flex items-center justify-between text-[9px] text-muted font-medium select-none">
            <div>
              <p className="text-foreground font-bold">{profile.name}</p>
              <p className="text-[8px] opacity-60">Quant Investor & Builder</p>
            </div>
            <span className="opacity-50">© {currentYear} Aditya Agrawal</span>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Segment */}
      <div className="flex items-center justify-between text-[9px] text-muted opacity-30">
        <span>STRAT-ARB // ENDGAME</span>
        <span>AC-SP-K-MINDS</span>
      </div>
    </div>
  );
}
