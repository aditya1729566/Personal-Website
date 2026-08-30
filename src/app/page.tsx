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
  loading: () => null,
});

const chapters: Array<{ id: ArchiveChapter; label: string; mark: string }> = [
  { id: "philosophy", label: "Philosophy", mark: "01" },
  { id: "history", label: "History", mark: "02" },
  { id: "art", label: "Art", mark: "03" },
  { id: "markets", label: "Quant", mark: "04" },
];

const nav = [
  { label: "Index", href: "#index" },
  { label: "Inquiry", href: "#inquiry" },
  { label: "Work", href: "#work" },
  { label: "Research", href: "#research" },
  { label: "Future", href: "#future" },
];

const sourceLabels: Record<ArchiveChapter, string> = {
  philosophy: "The Fall of Icarus / 1636-38 / Museo del Prado",
  history: "Herodotos / 2nd century CE / The Met",
  art: "Love and Psyche / 1817 / Cleveland Museum of Art",
  markets: "The Farewell of Telemachus and Eucharis / 1818 / Getty",
};

const roomLabels = [
  "Prometheus Bound / Rubens",
  "The Fall of Icarus / Gowy",
  "Washington Crossing the Delaware / Leutze",
  "Love and Psyche / David",
  "The Farewell of Telemachus and Eucharis / David",
  "The Death of Harmonia / Pierre",
  "The Chess Players / Retzsch",
  "The Last Supper / Leonardo",
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
  const [sceneReady, setSceneReady] = useState(false);

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
    <main className={`archive-site${journeyProgress < 0.035 ? " is-at-entrance" : ""}`}>
      <a className="skip-link" href="#index">Skip to the collection</a>
      <Premium3DScene
        activeChapter={activeChapter}
        scrollProgress={journeyProgress}
        onChapterChange={goToChapter}
        onArtworkSelect={(artworkId) => setSelectedArtwork(artworkById[artworkId] ?? null)}
        onReady={() => setSceneReady(true)}
      />
      <div className="archive-atmosphere" aria-hidden="true" />

      <motion.div
        className="museum-loader"
        role="status"
        aria-live="polite"
        initial={false}
        animate={sceneReady ? { opacity: 0, visibility: "hidden" } : { opacity: 1, visibility: "visible" }}
        transition={{ opacity: { duration: 0.75, delay: sceneReady ? 0.18 : 0 }, visibility: { delay: sceneReady ? 0.95 : 0 } }}
      >
        <div className="museum-loader-architecture" aria-hidden="true">
          <div className="museum-loader-artwork" />
        </div>
        <div className="museum-loader-copy">
          <span>Aditya Agrawal / The personal collection</span>
          <strong>Preparing the entrance gallery</strong>
          <i aria-hidden="true"><b /></i>
        </div>
      </motion.div>

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
        <p>Rooms</p>
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
            <span className="chapter-name">{chapter.label}</span>
          </button>
        ))}
      </aside>

      <div className="archive-progress" aria-hidden="true"><span style={{ transform: `scaleX(${scrollProgress})` }} /></div>
      <div className={`museum-location${journeyProgress >= 0.035 ? " is-visible" : ""}`} aria-hidden="true">
        <span>Room {String(Math.min(7, Math.round(journeyProgress * 7)) + 1).padStart(2, "0")} / 08</span>
        <span className="museum-location-line" />
        <span>{journeyProgress < 0.035 ? "Scroll to walk" : roomLabels[Math.min(7, Math.round(journeyProgress * 7))]}</span>
      </div>

      <section id="index" className="archive-section archive-hero" data-archive-chapter="philosophy">
        <div className="archive-content hero-copy">
          <div className="hero-intro">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="archive-label">
              Entrance gallery / Aditya&apos;s personal museum
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
              I study markets with mathematics, history, and code. Current work: Kalman-filter pairs models and tools that read SEC filings.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="hero-actions">
              <button type="button" onClick={() => goToChapter("philosophy")}>Enter the rooms <ArrowDown size={16} /></button>
            </motion.div>
          </div>
          <ArtworkPlaque artwork={artworks[0]} onInspect={setSelectedArtwork} variant="hero" />
        </div>
        <p className="scene-caption">{sourceLabels[activeChapter]}</p>
      </section>

      <section id="inquiry" className="archive-section inquiry-section" data-archive-chapter="philosophy">
        <div className="archive-content inquiry-copy">
          <Reveal>
            <ChapterHeading label="Room I / Philosophy" title="Questions before answers." />
            <p className="lead-copy">
              I read Spinoza, Nietzsche, and Dostoyevsky because each forces the same useful habit: decide what you believe about choice before trying to model it.
            </p>
          </Reveal>
          <ArtworkPlaque artwork={artworks[1]} onInspect={setSelectedArtwork} />
        </div>
      </section>

      <section id="history" className="archive-section history-section" data-archive-chapter="history">
        <div className="archive-content history-copy">
          <Reveal>
            <ChapterHeading label="Room II / History" title="The past tests the model." />
            <p className="lead-copy">
              I use history to pressure-test theories. Institutions, market shocks, and disaster recovery show where a clean explanation stops being clean.
            </p>
          </Reveal>
          <ArtworkPlaque artwork={artworks[2]} onInspect={setSelectedArtwork} />
        </div>
      </section>

      <section id="art" className="archive-section art-section" data-archive-chapter="art">
        <div className="archive-content art-copy">
          <Reveal>
            <ChapterHeading label="Room III / Art" title="Attention is a choice." />
            <p className="lead-copy">
              I look at painting to study decisions about emphasis: what gets sharpened, softened, or left out. The same choices appear when I make a chart or explain a trade.
            </p>
          </Reveal>
          <ArtworkPlaque artwork={artworks[3]} onInspect={setSelectedArtwork} />
        </div>
      </section>

      <section id="work" className="archive-section work-section" data-archive-chapter="markets">
        <div className="archive-content work-copy">
          <Reveal>
            <ChapterHeading label="Room IV / Quant finance" title="Research that has to survive costs." />
            <p className="lead-copy">
              My pairs work tests dynamic hedge ratios with Kalman filters. KO-PEP reached a 1.9 Sharpe and MA-V 1.3 in the study; robustness and execution still decide whether the result matters.
            </p>
          </Reveal>
          <ArtworkPlaque artwork={artworks[4]} onInspect={setSelectedArtwork} />
        </div>
      </section>

      <section id="projects" className="archive-section project-section">
        <div className="archive-content work-copy">
          <Reveal>
            <ChapterHeading label="Study room / Personal work" title="Things I have put into use." />
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
            <ChapterHeading label="Research room / Risk" title="Who absorbs the shock?" />
            <p className="lead-copy">I study how insurance changes recovery after earthquakes and floods, especially where households and small businesses have little financial protection.</p>
          </Reveal>
          <ArtworkPlaque artwork={artworks[5]} onInspect={setSelectedArtwork} />
        </div>
      </section>

      <section id="current-questions" className="archive-section current-questions-section">
        <div className="archive-content research-copy">
          <Reveal><ChapterHeading label="Reading table / Current questions" title="Questions I am still working through." /></Reveal>
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
            <ChapterHeading label="Future room / Working plan" title="Study, test, write, repeat." />
            <p className="lead-copy">I want to earn a PhD in mathematics, publish work in finance and economic policy, and eventually run a systematic fund. The immediate work is less grand: keep building and keep the results honest.</p>
          </Reveal>
          <ArtworkPlaque artwork={artworks[6]} onInspect={setSelectedArtwork} />
        </div>
      </section>

      <section id="about" className="archive-section about-section" data-archive-chapter="art">
        <div className="archive-content future-copy">
          <Reveal>
            <ChapterHeading label="Closing room / Personal direction" title="What I return to." />
          </Reveal>
          <Reveal delay={0.08} className="future-statement">
            <p>I read philosophy, study probability, follow markets, play chess and poker, and build software to test ideas that would otherwise remain untested.</p>
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
