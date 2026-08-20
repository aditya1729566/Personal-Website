"use client";

import { ArrowUpRight, Maximize2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

import type { Artwork } from "@/data/artworks";

export function ArtworkPlaque({
  artwork,
  onInspect,
  variant = "standard",
}: {
  artwork: Artwork;
  onInspect: (artwork: Artwork) => void;
  variant?: "standard" | "hero";
}) {
  return (
    <button type="button" className={`artwork-plaque${variant === "hero" ? " artwork-plaque-hero" : ""}`} onClick={() => onInspect(artwork)} aria-label={`Inspect ${artwork.title} by ${artwork.artist}`}>
      <span className="artwork-plaque-kicker">On view / {artwork.room}</span>
      <strong>{artwork.title}</strong>
      <span className="artwork-plaque-credit"><span>{artwork.artist}</span><span>{artwork.year}</span></span>
      <span className="artwork-plaque-facts">
        <span><small>Medium</small>{artwork.medium}</span>
        <span><small>Collection</small>{artwork.collection}</span>
      </span>
      <span className="artwork-plaque-reason">{artwork.connection}</span>
      <span className="artwork-plaque-action">{variant === "hero" ? "View catalogue entry" : "Inspect work"} <Maximize2 size={13} /></span>
    </button>
  );
}

export function ArtworkInspector({ artwork, onClose }: { artwork: Artwork | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const inspectorRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!artwork) return;
    const previousOverflow = document.body.style.overflow;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const focusable = inspectorRef.current?.querySelectorAll<HTMLElement>("button, a[href]");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      previousFocusRef.current?.focus();
    };
  }, [artwork, onClose]);

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div className="artwork-inspector-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}>
          <motion.section
            ref={inspectorRef}
            className="artwork-inspector"
            role="dialog"
            aria-modal="true"
            aria-labelledby="artwork-inspector-title"
            aria-describedby="artwork-inspector-description"
            initial={{ opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.99 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <button ref={closeRef} type="button" className="artwork-inspector-close" onClick={onClose} aria-label="Close artwork inspection"><X size={19} /></button>
            <div className="artwork-inspector-image-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={artwork.image} alt={`${artwork.title} by ${artwork.artist}`} className="artwork-inspector-image" />
            </div>
            <div className="artwork-inspector-copy">
              <p className="archive-label">{artwork.room}</p>
              <h2 id="artwork-inspector-title">{artwork.title}</h2>
              <p className="artwork-inspector-credit">{artwork.artist} · {artwork.year}</p>
              <dl>
                <div><dt>Medium</dt><dd>{artwork.medium}</dd></div>
                <div><dt>Collection</dt><dd>{artwork.collection}</dd></div>
              </dl>
              <div className="artwork-inspector-reading">
                <section>
                  <h3>About the work</h3>
                  <p id="artwork-inspector-description">{artwork.description}</p>
                </section>
                <section>
                  <h3>What it symbolizes here</h3>
                  <p>{artwork.symbolism}</p>
                </section>
              </div>
              <a href={artwork.sourceUrl} target="_blank" rel="noreferrer">View museum record <ArrowUpRight size={15} /></a>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
