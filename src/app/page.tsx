"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Github, Menu, X } from "lucide-react";

import { ArtworkInspector, ArtworkPlaque } from "@/components/ArtworkPlaque";
import DigitalTwinChat from "@/components/DigitalTwinChat";
import type { ArchiveChapter } from "@/components/Premium3DScene";
import { artworkById, artworks, type Artwork } from "@/data/artworks";
import { profile } from "@/data/profile";

const Premium3DScene = dynamic(() => import("@/components/Premium3DScene"), {
  ssr: false,
  loading: () => <div className="archive-scene archive-scene-loading" aria-hidden="true" />,
});

const chapters: Array<{ id: ArchiveChapter; label: string; mark: string }> = [
  { id: "philosophy", label: "Philosophy", mark: "φ" },
  { id: "history", label: "History", mark: "H" },
  { id: "art", label: "Art", mark: "A" },
  { id: "markets", label: "Quant finance", mark: "Q" },
];

const nav = [
  { label: "Index", href: "#index" },
  { label: "Inquiry", href: "#inquiry" },
  { label: "Work", href: "#work" },
  { label: "Research", href: "#research" },
  { label: "Future", href: "#future" },
];

const sourceLabels: Record<ArchiveChapter, string> = {
  philosophy: "Two Men Contemplating the Moon / c. 1825 / The Met",
  history: "Herodotos / 2nd century CE / The Met",
  art: "Wheat Field with Cypresses / 1889 / The Met",
  markets: "Venice from the Salute / c. 1835 / The Met",
};

const roomLabels = [
  "Self-Portrait / Rembrandt",
  "Two Men Contemplating the Moon / Friedrich",
  "Washington Crossing the Delaware / Leutze",
  "Wheat Field with Cypresses / Van Gogh",
  "Venice from the Salute / Turner",
  "The Death of Harmonia / Pierre",
  "Young Woman with a Lute / Vermeer",
  "Whalers / Turner",
];

const chapterTargets: Record<ArchiveChapter, string> = {
  philosophy: "inquiry",
  history: "history",
  art: "art",
  markets: "work",
};

function ChapterHeading({
  label,
  title,
  className = "",
}: {
  label: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="archive-label">{label}</p>
      <h2 className="archive-title">{title}</h2>
    </div>
  );
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.16 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [activeChapter, setActiveChapter] = useState<ArchiveChapter>("philosophy");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [journeyProgress, setJourneyProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  const liveProjects = useMemo(() => profile.projects.filter((project) => project.liveUrl), []);
  const closeArtwork = useCallback(() => setSelectedArtwork(null), []);

  const goToSection = useCallback((sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    if (sectionId === "index") {
      window.scrollTo({ behavior: "smooth", top: 0 });
      return;
    }
    const roomCenter = section.offsetTop + section.offsetHeight / 2;
    const catalogueOffset = window.innerWidth < 760 ? -90 : 60;
    window.scrollTo({
      behavior: "smooth",
      top: roomCenter - window.innerHeight / 2 - catalogueOffset,
    });
  }, []);

  const goToChapter = useCallback((chapter: ArchiveChapter) => {
    setActiveChapter(chapter);
    goToSection(chapterTargets[chapter]);
  }, [goToSection]);

  const handleSectionLink = useCallback((event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    goToSection(href.slice(1));
  }, [goToSection]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const maximum = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      setScrollProgress(window.scrollY / maximum);

      const candidates = Array.from(document.querySelectorAll<HTMLElement>("[data-archive-chapter]"));
      const center = window.innerHeight * 0.5;
      const closest = candidates.reduce<{ element: HTMLElement; distance: number } | null>((best, element) => {
        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - center);
        return !best || distance < best.distance ? { element, distance } : best;
      }, null);
      const next = closest?.element.dataset.archiveChapter as ArchiveChapter | undefined;
      if (next) setActiveChapter(next);

      const sectionCenters = candidates.map((element) => {
        const rect = element.getBoundingClientRect();
        return window.scrollY + rect.top + rect.height / 2;
      });
      const pageCenter = window.scrollY + center;
      let path = 0;
      if (sectionCenters.length > 1) {
        const segment = sectionCenters.findIndex((sectionCenter) => sectionCenter >= pageCenter);
        if (segment === -1) path = 1;
        else if (segment <= 0) path = 0;
        else {
          const previous = sectionCenters[segment - 1];
          const following = sectionCenters[segment];
          const local = (pageCenter - previous) / Math.max(following - previous, 1);
          path = (segment - 1 + local) / (sectionCenters.length - 1);
        }
      }
      setJourneyProgress(path);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <main className="archive-site">
      <Premium3DScene
        activeChapter={activeChapter}
        scrollProgress={journeyProgress}
        onChapterChange={goToChapter}
        onArtworkSelect={(artworkId) => setSelectedArtwork(artworkById[artworkId] ?? null)}
      />
      <div className="archive-atmosphere" aria-hidden="true" />

      <header className="archive-header">
        <a href="#index" className="archive-monogram" aria-label="Aditya Agrawal, return to top" onClick={(event) => handleSectionLink(event, "#index")}>
          <span>AA</span>
          <span className="archive-monogram-name">Aditya Agrawal</span>
        </a>
        <nav className="archive-nav" aria-label="Main navigation">
          {nav.map((item) => <a key={item.href} href={item.href} onClick={(event) => handleSectionLink(event, item.href)}>{item.label}</a>)}
        </nav>
        <div className="archive-socials">
          <a href={profile.socialLinks.x} target="_blank" rel="noreferrer" aria-label="Aditya on X">X</a>
          <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" aria-label="Aditya on GitHub"><Github size={17} /></a>
          <button type="button" className="archive-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="archive-mobile-nav"
          aria-label="Mobile navigation"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => {
                setMenuOpen(false);
                handleSectionLink(event, item.href);
              }}
            >
              {item.label}
            </a>
          ))}
        </motion.nav>
      )}

      <aside className="chapter-rail" aria-label="Explore the four disciplines">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            type="button"
            onClick={() => goToChapter(chapter.id)}
            className={activeChapter === chapter.id ? "is-active" : ""}
            aria-pressed={activeChapter === chapter.id}
            aria-label={`Open ${chapter.label} chapter`}
          >
            <span className="chapter-mark">{chapter.mark}</span>
            <span>{chapter.label}</span>
          </button>
        ))}
      </aside>

      <div className="archive-progress" aria-hidden="true"><span style={{ transform: `scaleX(${scrollProgress})` }} /></div>
      <div className="museum-location" aria-hidden="true">
        <span>Room {String(Math.min(7, Math.round(journeyProgress * 7)) + 1).padStart(2, "0")} / 08</span>
        <span className="museum-location-line" />
        <span>{journeyProgress < 0.035 ? "Scroll to walk" : roomLabels[Math.min(7, Math.round(journeyProgress * 7))]}</span>
      </div>

      <section id="index" className="archive-section archive-hero" data-archive-chapter="philosophy">
        <div className="archive-content hero-copy">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="archive-label">
            Personal museum / eight rooms of inquiry
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Aditya<br /><i>Agrawal</i>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.16 }}
            className="hero-thesis"
          >
            I study the forces behind choice, civilization, beauty, and price.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="hero-actions">
            <a href="#work" onClick={(event) => handleSectionLink(event, "#work")}>Selected work <ArrowDown size={16} /></a>
            <button type="button" onClick={() => goToChapter("philosophy")}>Enter the gallery <ArrowUpRight size={16} /></button>
          </motion.div>
          <button
            type="button"
            className="hero-artwork-link"
            onClick={() => setSelectedArtwork(artworks[0])}
            aria-label="Inspect Self-Portrait by Rembrandt van Rijn"
          >
            <span>On view</span>
            <strong>Self-Portrait / Rembrandt / 1660</strong>
            <ArrowUpRight size={14} />
          </button>
        </div>
        <p className="scene-caption">{sourceLabels[activeChapter]}</p>
      </section>

      <section id="inquiry" className="archive-section inquiry-section" data-archive-chapter="philosophy">
        <div className="archive-content inquiry-copy">
          <Reveal>
            <ChapterHeading label="Inquiry / Philosophy" title="Questions before answers." />
            <p className="lead-copy">
              My work begins with a philosophical habit: challenge the premise, define what can be known, then build a model that survives contact with reality.
            </p>
          </Reveal>
          <ArtworkPlaque artwork={artworks[1]} onInspect={setSelectedArtwork} />
        </div>
      </section>

      <section id="history" className="archive-section history-section" data-archive-chapter="history">
        <div className="archive-content history-copy">
          <Reveal>
            <ChapterHeading label="Context / History" title="Every system has a memory." />
            <p className="lead-copy">
              History turns abstract incentives into evidence. It is where institutions, shocks, ambition, and human judgment reveal what a clean theory leaves out.
            </p>
          </Reveal>
          <ArtworkPlaque artwork={artworks[2]} onInspect={setSelectedArtwork} />
        </div>
      </section>

      <section id="art" className="archive-section art-section" data-archive-chapter="art">
        <div className="archive-content art-copy">
          <Reveal>
            <ChapterHeading label="Attention / Art" title="Form makes thought visible." />
            <p className="lead-copy">
              Art is a discipline of attention. Composition, tension, and restraint can make complexity felt before it is explained, a useful lesson for research and software alike.
            </p>
          </Reveal>
          <ArtworkPlaque artwork={artworks[3]} onInspect={setSelectedArtwork} />
        </div>
      </section>

      <section id="work" className="archive-section work-section" data-archive-chapter="markets">
        <div className="archive-content work-copy">
          <Reveal>
            <ChapterHeading label="Practice / Quant finance" title="Models, tools, and live experiments." />
            <p className="lead-copy">
              I build at the intersection of quantitative finance, mathematics, AI, and market structure, with a bias toward research that can become a working system.
            </p>
          </Reveal>
          <ArtworkPlaque artwork={artworks[4]} onInspect={setSelectedArtwork} />
        </div>
      </section>

      <section id="projects" className="archive-section project-section">
        <div className="archive-content work-copy">
          <Reveal>
            <ChapterHeading label="Cases on file / Personal work" title="Selected work, currently live." />
          </Reveal>
          <div className="project-ledger">
            {liveProjects.map((project, index) => (
              <motion.a
                key={project.id}
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, x: -28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6, delay: Math.min(index * 0.055, 0.22) }}
                className="project-entry"
              >
                <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="project-main">
                  <strong>{project.title}</strong>
                  <small>{project.summary}</small>
                </span>
                <span className="project-category">{project.category}</span>
                <ArrowUpRight size={18} />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section id="research" className="archive-section research-section" data-archive-chapter="history">
        <div className="archive-content research-copy">
          <Reveal>
            <ChapterHeading label="Research / Applied systems" title="Risk is where disciplines meet." />
            <p className="lead-copy">I study how uncertainty travels through insurance, markets, institutions, and the systems people depend on.</p>
          </Reveal>
          <ArtworkPlaque artwork={artworks[5]} onInspect={setSelectedArtwork} />
        </div>
      </section>

      <section id="research-notes" className="archive-section research-notes-section">
        <div className="archive-content research-copy">
          <Reveal><ChapterHeading label="Research notes / Current questions" title="Where the inquiry continues." /></Reveal>
          <div className="research-lines">
            {profile.researchAreas.map((area, index) => (
              <Reveal key={area.title} delay={index * 0.07} className="research-line">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="future" className="archive-section future-section" data-archive-chapter="philosophy">
        <div className="archive-content future-copy">
          <Reveal>
            <ChapterHeading label="Trajectory / The unfinished index" title="Research, enterprise, public consequence." />
            <p className="lead-copy">I want the next room to hold ambitious research, durable businesses, and systems whose usefulness reaches beyond the model.</p>
          </Reveal>
          <ArtworkPlaque artwork={artworks[6]} onInspect={setSelectedArtwork} />
        </div>
      </section>

      <section id="about" className="archive-section about-section" data-archive-chapter="art">
        <div className="archive-content future-copy">
          <Reveal>
            <ChapterHeading label="Closing room / Personal direction" title="The work remains unfinished." />
          </Reveal>
          <Reveal delay={0.08} className="future-statement">
            <p>{profile.about.split("\n\n")[1]}</p>
            <div className="future-links">
              <a href={profile.socialLinks.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={16} /></a>
              <a href={profile.socialLinks.x} target="_blank" rel="noreferrer">X / @aditya_quant <ArrowUpRight size={16} /></a>
            </div>
          </Reveal>
          <ArtworkPlaque artwork={artworks[7]} onInspect={setSelectedArtwork} />
          <footer className="archive-footer">
            <span>Aditya Agrawal</span>
            <span>Quantitative research / mathematics / ideas</span>
            <a href="#index" onClick={(event) => handleSectionLink(event, "#index")}>Return to index</a>
          </footer>
        </div>
      </section>

      <DigitalTwinChat />
      <ArtworkInspector artwork={selectedArtwork} onClose={closeArtwork} />
    </main>
  );
}
