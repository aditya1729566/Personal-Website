"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { Club, Diamond, Spade, Heart } from "./ChessPokerIcons";

type Project = (typeof profile.projects)[number];

const projectCards = [
  { id: "outsmarts", suit: <Club size={14} className="text-accent-gold" />, val: "10", color: "#cfa846" },
  { id: "ai-research", suit: <Diamond size={14} className="text-poker-red" />, val: "J", color: "#d92534" },
  { id: "quant-trading", suit: <Spade size={14} className="text-accent-gold" />, val: "Q", color: "#cfa846" },
  { id: "startup-exploration", suit: <Heart size={14} className="text-poker-red" />, val: "K", color: "#d92534" },
];

function Card3D({ project, index }: { project: Project; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const cardDesign = projectCards[index % projectCards.length];

  return (
    <div 
      className="glass border-gradient perspective-2000 min-h-[18rem] w-full cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        className="preserve-3d relative h-full w-full rounded-3xl border border-accent-gold/15 bg-charcoal-light/30 shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(0,0,0,0.25)]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* FRONT FACE */}
        <div className="backface-hidden absolute inset-0 flex flex-col justify-between p-4 rounded-xl bg-charcoal-light">
          {/* Card Corner Info */}
          <div className="flex items-center justify-between opacity-50 select-none">
            <div className="flex flex-col items-center leading-none font-bold text-[10px]">
              <span>{cardDesign.val}</span>
              <span className="mt-0.5">{cardDesign.suit}</span>
            </div>
            <span className="text-[8px] font-bold tracking-widest uppercase text-muted">
              {project.category}
            </span>
          </div>

          {/* Title and Summary */}
          <div className="my-auto">
            <h3 className="font-[family-name:var(--font-syne)] text-base font-bold text-foreground">
              {project.title}
            </h3>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] text-accent-gold font-semibold mt-0.5">{project.tagline}</p>
                <p className="text-[10px] text-muted leading-relaxed mt-2.5 line-clamp-3">
                  {project.summary}
                </p>
              </div>
              {project.liveUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.liveUrl, "_blank", "noopener");
                  }}
                  aria-label={`Visit ${project.title}`}
                  className="ml-2 h-8 shrink-0 rounded-full border border-accent-gold/25 bg-accent-gold/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-gold hover:bg-accent-gold/10"
                >
                  Visit
                </button>
              )}
            </div>
          </div>

          {/* Hint */}
          <div className="text-right text-[8px] font-bold tracking-wider uppercase text-accent-gold/60 select-none">
            Click to Flip ♦
          </div>
        </div>

        {/* BACK FACE (Rotated 180 degrees) */}
        <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between p-4 rounded-xl bg-felt-light/10">
          {/* Corner detail */}
          <div className="flex items-center justify-between opacity-50 select-none">
            <div className="flex flex-col items-center leading-none font-bold text-[10px] rotate-180">
              <span>{cardDesign.val}</span>
              <span className="mt-0.5">{cardDesign.suit}</span>
            </div>
            <span className="text-[8px] font-bold tracking-widest uppercase text-accent-gold">
              Specs
            </span>
          </div>

          {/* Back content (Features & Tech Stack) */}
          <div className="my-auto overflow-y-auto max-h-[80%] pr-0.5" style={{ scrollbarWidth: "none" }}>
            <h4 className="text-[8px] font-bold tracking-widest uppercase text-accent-gold mb-1">
              Key Features
            </h4>
            <ul className="space-y-1">
              {project.details.features.slice(0, 3).map((feat, idx) => (
                <li key={idx} className="text-[9px] text-muted leading-tight before:content-['·'] before:mr-1 before:text-accent-gold flex items-start">
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            {/* Results if quant */}
            {"results" in project.details && project.details.results && (
              <div className="mt-2 flex gap-2">
                {project.details.results.map((res) => (
                  <div key={res.pair} className="bg-charcoal px-2 py-0.5 rounded border border-accent-gold/10 text-center">
                    <span className="text-[8px] text-accent-gold font-bold">{res.pair}: {res.sharpe} SR</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 flex flex-wrap gap-1">
              {project.details.tech.map((t) => (
                <span key={t} className="bg-charcoal px-1.5 py-0.5 rounded text-[8px] text-muted font-medium border border-white/[0.03]">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[8px] font-bold tracking-widest uppercase text-accent-gold/60 select-none">
            <span>{project.details.status}</span>
            <span className="text-poker-red">Flip Back ♠</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Projects() {
  return (
    <div className="flex h-full w-full flex-col justify-between py-2 sm:py-4 select-none">
      {/* Decorative Top Segment */}
      <div className="flex items-center justify-between opacity-40">
        <span className="text-[10px] tracking-[0.25em] uppercase text-accent-gold">
          The Dealt Hand
        </span>
        <span className="text-[10px] tracking-[0.25em] uppercase text-poker-red flex items-center gap-1">
          <Club size={10} className="fill-accent-gold inline text-accent-gold" /> Black Deck Active
        </span>
      </div>

      <div className="my-auto flex flex-col justify-center h-[90%]">
        <div className="mb-4">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent-gold">
            03 · The Deck
          </span>
          <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-1">
            Build & Ventures
          </h2>
        </div>

        {/* Overlapping hands of cards on larger viewports */}
        <div className="mx-auto grid w-full max-w-[1280px] gap-5 justify-center sm:grid-cols-2 xl:grid-cols-4 items-stretch">
          {profile.projects.map((project, i) => (
            <Card3D
              key={project.id}
              project={project}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Decorative Bottom Segment */}
      <div className="flex items-center justify-between text-[9px] text-muted opacity-30">
        <span>STRAT-ARB // VENTURES</span>
        <span>AC-SP-K-MINDS</span>
      </div>
    </div>
  );
}
