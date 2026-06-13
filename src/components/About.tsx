"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { Heart } from "./ChessPokerIcons";

export default function About() {
  const paragraphs = profile.about.split("\n\n");

  return (
    <div className="flex h-full w-full flex-col justify-between py-2 sm:py-4 select-none">
      {/* Decorative Top Segment */}
      <div className="flex items-center justify-between opacity-40">
        <span className="text-[10px] tracking-[0.25em] uppercase text-accent-gold">
          Profile Dossier
        </span>
        <span className="text-[10px] tracking-[0.25em] uppercase text-poker-red flex items-center gap-1">
          <Heart size={10} className="fill-poker-red inline" /> Red Deck Active
        </span>
      </div>

      <div className="my-auto grid gap-6 md:grid-cols-12 md:items-stretch h-[90%]">
        {/* Left Side: Bio & Philosophy */}
        <div className="col-span-12 flex flex-col justify-between md:col-span-7 pr-2 md:border-r md:border-accent-gold/10 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent-gold">
              01 · The Player
            </span>
            <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-1">
              Who I Am
            </h2>

            <div className="mt-4 space-y-3">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-xs leading-relaxed text-muted font-medium"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          <blockquote className="rounded-xl border border-accent-gold/15 bg-felt-light/20 p-4 mt-4 shadow-sm relative">
            <div className="absolute top-2 right-3 opacity-10">
              <Heart size={32} className="fill-poker-red" />
            </div>
            <p className="text-[11px] italic leading-relaxed text-foreground/80">
              &ldquo;{profile.philosophy}&rdquo;
            </p>
          </blockquote>
        </div>

        {/* Right Side: Interests & Thinkers */}
        <div className="col-span-12 flex flex-col justify-between md:col-span-5 md:pl-2 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div>
            <h3 className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-widest uppercase text-poker-red">
              Core Interests
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-3 max-h-40 overflow-y-auto pr-1" style={{ scrollbarWidth: "none" }}>
              {profile.coreInterests.map((interest, i) => (
                <motion.span
                  key={interest}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                  className="rounded-lg border border-accent-gold/10 bg-felt-dark/40 px-2 py-1 text-[10px] font-medium text-muted transition-colors duration-300 hover:border-accent-gold hover:text-accent-gold cursor-default"
                >
                  {interest}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="border-t border-accent-gold/10 pt-4 mt-4">
            <h3 className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-widest uppercase text-accent-gold">
              Thinkers I Follow
            </h3>
            <ul className="mt-3 space-y-2">
              {profile.thinkers.map((thinker) => (
                <li
                  key={thinker}
                  className="text-xs font-semibold text-muted before:mr-2 before:text-poker-red before:content-['♦'] flex items-center"
                >
                  {thinker}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Segment */}
      <div className="flex items-center justify-between text-[9px] text-muted opacity-30">
        <span>STRAT-ARB // BIOGRAPHY</span>
        <span>AC-SP-K-MINDS</span>
      </div>
    </div>
  );
}
