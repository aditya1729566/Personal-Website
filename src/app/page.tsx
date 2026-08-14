"use client";

import { PointerEvent, ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Bot,
  ChartNoAxesCombined,
  ExternalLink,
  Github,
  GraduationCap,
  Layers3,
  MousePointer2,
  Orbit,
  RotateCcw,
  ShieldCheck,
  Target,
  X,
} from "lucide-react";

import DigitalTwinChat from "@/components/DigitalTwinChat";
import Premium3DScene from "@/components/Premium3DScene";
import { profile } from "@/data/profile";

const navItems = [
  { label: "Profile", href: "#profile" },
  { label: "Systems", href: "#systems" },
  { label: "Projects", href: "#projects" },
  { label: "Research", href: "#research" },
  { label: "Endgame", href: "#endgame" },
];

const focusStats = [
  { label: "Research Mode", value: "Quant + AI" },
  { label: "Live Builds", value: String(profile.projects.filter((project) => project.details.status.includes("Live")).length) },
  { label: "Validated Signals", value: "KO-PEP / MA-V" },
];

const studyLabels: Record<keyof typeof profile.currentAreasOfStudy, string> = {
  quantitativeTrading: "Quantitative Trading",
  mathematics: "Mathematics",
  economics: "Economics",
  technology: "Technology",
};

const studyIcons = [ChartNoAxesCombined, Orbit, GraduationCap, Layers3];
const researchIcons = [ShieldCheck, GraduationCap, ChartNoAxesCombined];
const goalLabels: Record<keyof typeof profile.longTermGoals, string> = {
  finance: "Finance",
  academia: "Academia",
  entrepreneurship: "Entrepreneurship",
  publicService: "Public Service",
};

function SectionReveal({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 48, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.08 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={`relative z-10 mx-auto flex min-h-[88svh] w-full max-w-7xl items-start px-5 py-24 sm:px-8 md:min-h-screen md:items-center md:py-28 lg:px-10 ${className}`}
    >
      {children}
    </motion.section>
  );
}

function SectionIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="retro-kicker text-xs font-bold uppercase text-cyan-200/80">{eyebrow}</p>
      <h2 className="retro-heading mt-4 text-4xl font-black leading-[1.02] text-white sm:text-5xl lg:text-7xl">
        {title}
      </h2>
      {copy && <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200/78 sm:text-lg">{copy}</p>}
    </div>
  );
}

export default function Home() {
  const [solarExplore, setSolarExplore] = useState(false);

  useEffect(() => {
    document.body.style.overflow = solarExplore ? "hidden" : "";
    if (solarExplore) window.scrollTo({ top: 0, behavior: "smooth" });
    return () => {
      document.body.style.overflow = "";
    };
  }, [solarExplore]);

  const handleEmptySpaceExplorePointer = (event: PointerEvent<HTMLElement>) => {
    if (solarExplore) return;
    if (event.pointerType !== "mouse") return;
    const target = event.target as HTMLElement;
    if (
      target.closest(
        "a, button, input, select, textarea, header, footer, article, h1, h2, h3, h4, p, span, svg, .premium-panel, [role='button'], [data-no-solar-explore]",
      )
    ) {
      return;
    }
    setSolarExplore(true);
  };

  return (
    <main onPointerDownCapture={handleEmptySpaceExplorePointer} className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <Premium3DScene exploreMode={solarExplore} onExploreChange={setSolarExplore} />
      <motion.div
        aria-hidden="true"
        animate={{ opacity: solarExplore ? 0.18 : 1 }}
        className="scanline-overlay pointer-events-none fixed inset-0 z-[1]"
      />
      <motion.div
        aria-hidden="true"
        animate={{ opacity: solarExplore ? 0 : 1 }}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[1] h-48 bg-gradient-to-t from-black to-transparent"
      />

      <AnimatePresence>
        {solarExplore && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28 }}
            className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/72 px-5 py-4 backdrop-blur-2xl sm:px-8 lg:px-10"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div>
                <p className="retro-kicker text-[10px] font-black uppercase text-cyan-200">Solar System Explorer</p>
                <p className="mt-1 hidden text-xs text-slate-300 sm:block">Drag to rotate, scroll to zoom, click a planet to focus.</p>
              </div>
              <div className="hidden items-center gap-3 text-xs font-bold text-slate-300 md:flex">
                <span className="inline-flex items-center gap-1.5"><MousePointer2 size={14} /> Click planets</span>
                <span className="inline-flex items-center gap-1.5"><RotateCcw size={14} /> Drag view</span>
              </div>
              <button
                type="button"
                onClick={() => setSolarExplore(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 bg-white/[0.08] text-white transition hover:border-cyan-200/45 hover:bg-cyan-200/10"
                aria-label="Exit solar system explorer"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!solarExplore && (
          <motion.header
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35 }}
            className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-black/62 backdrop-blur-2xl"
          >
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <a href="#top" className="group flex items-center gap-3">
            <span className="retro-heading grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-white/10 text-sm font-black text-white shadow-[0_0_36px_rgba(98,168,255,0.24)]">
              AA
            </span>
            <span className="hidden text-sm font-bold text-white/90 transition group-hover:text-white sm:block">{profile.name}</span>
          </a>

          <div className="hidden items-center gap-1 rounded-lg border border-white/10 bg-white/[0.06] p-1 lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="rounded-md px-4 py-2 text-xs font-bold uppercase text-slate-300 transition hover:bg-white/10 hover:text-white">
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a href={profile.socialLinks.x} target="_blank" rel="noreferrer" aria-label="Open Aditya's X profile" className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.08] text-sm font-black text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10">
              X
            </a>
            <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" aria-label="Open Aditya's GitHub profile" className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.08] text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10">
              <Github size={18} />
            </a>
            <a href="#projects" className="hidden items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-cyan-100 sm:inline-flex">
              Work
              <ArrowUpRight size={16} />
            </a>
          </div>
            </nav>
          </motion.header>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!solarExplore && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionReveal id="top" className="pt-36">
          <div className="grid w-full gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="retro-heading max-w-5xl text-5xl font-black leading-[0.96] text-white sm:text-7xl lg:text-8xl"
            >
              {profile.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.16 }}
              className="mt-7 max-w-2xl text-xl font-semibold leading-8 text-slate-100 sm:text-2xl"
            >
              {profile.tagline}
            </motion.p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">{profile.subtitle}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setSolarExplore(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_18px_55px_rgba(34,211,238,0.22)] transition hover:bg-white"
              >
                Enter Orbit
                <ArrowDown size={17} />
              </button>
              <a href="#projects" className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.08] px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:border-white/30 hover:bg-white/12">
                See Projects
                <ArrowUpRight size={17} />
              </a>
            </div>
          </div>

          <aside className="premium-panel p-6 sm:p-7">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="retro-kicker text-xs font-black uppercase text-slate-400">Current Orbit</p>
                <h2 className="retro-heading mt-3 text-3xl font-black text-white">Research-driven builder</h2>
              </div>
              <Bot className="text-cyan-200" size={30} />
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              Building at the intersection of mathematics, financial markets, AI, insurance, and entrepreneurship.
            </p>
            <div className="mt-7 grid gap-3">
              {focusStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3">
                  <span className="text-sm text-slate-400">{stat.label}</span>
                  <span className="text-sm font-black text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </aside>
          </div>
        </SectionReveal>

        <SectionReveal id="profile">
        <div className="grid w-full gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <SectionIntro eyebrow="Profile" title="What I am building toward." />
          <div className="premium-panel space-y-5 p-6 sm:p-8">
            {profile.about.split("\n\n").map((paragraph) => (
              <p key={paragraph} className="text-base leading-8 text-slate-200/82">{paragraph}</p>
            ))}
            <blockquote className="rounded-lg border border-cyan-200/18 bg-cyan-200/[0.07] p-5 text-base leading-8 text-cyan-50">
              {profile.philosophy}
            </blockquote>
          </div>
        </div>
        </SectionReveal>

        <SectionReveal id="systems">
        <div className="w-full">
          <SectionIntro
            eyebrow="Systems"
            title="The disciplines powering the work."
            copy="Each area feeds the same loop: research a system, model its behavior, build tools, test assumptions, and compound the feedback."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Object.entries(profile.currentAreasOfStudy).map(([key, topics], index) => {
              const Icon = studyIcons[index] ?? Target;
              return (
                <article key={key} className="premium-panel group p-5 transition duration-500 hover:-translate-y-2 hover:border-cyan-200/35 hover:bg-white/[0.09]">
                  <Icon className="text-cyan-200" size={24} />
                  <h3 className="retro-heading mt-5 text-xl font-black text-white">{studyLabels[key as keyof typeof profile.currentAreasOfStudy]}</h3>
                  <ul className="mt-5 space-y-2.5">
                    {topics.slice(0, 5).map((topic) => (
                      <li key={topic} className="flex gap-2 text-sm leading-6 text-slate-300">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
        </SectionReveal>

        <SectionReveal id="projects">
        <div className="w-full">
          <SectionIntro eyebrow="Portfolio" title="Projects with a research engine underneath." />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {profile.projects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: Math.min(index * 0.05, 0.2) }}
                className="premium-panel group p-6 transition duration-500 hover:-translate-y-2 hover:border-white/25 hover:bg-white/[0.095]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="retro-kicker text-xs font-black uppercase text-cyan-200/80">{project.category}</p>
                    <h3 className="retro-heading mt-3 text-2xl font-black text-white">{project.title}</h3>
                    <p className="mt-2 text-sm font-bold text-slate-300">{project.tagline}</p>
                  </div>
                  <span className="rounded-md border border-white/12 bg-white/[0.08] px-3 py-1.5 text-xs font-black text-slate-300">{project.details.status}</span>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-300">{project.details.overview}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.details.tech.map((tech) => (
                    <span key={tech} className="rounded-md border border-white/10 bg-white/[0.07] px-3 py-1 text-xs font-bold text-slate-300">{tech}</span>
                  ))}
                </div>

                {"results" in project.details && project.details.results && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {project.details.results.map((result) => (
                      <div key={result.pair} className="rounded-lg border border-cyan-200/15 bg-cyan-200/[0.07] px-4 py-2 text-sm">
                        <span className="font-black text-white">{result.pair}</span>
                        <span className="ml-2 text-cyan-100/75">Sharpe {result.sharpe}</span>
                      </div>
                    ))}
                  </div>
                )}

                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-cyan-200">
                    Visit Project
                    <ExternalLink size={15} />
                  </a>
                )}
              </motion.article>
            ))}
          </div>
        </div>
        </SectionReveal>

        <SectionReveal id="research">
        <div className="w-full">
          <SectionIntro eyebrow="Research" title="Markets, resilience, and complex systems." />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {profile.researchAreas.map((area, index) => {
              const Icon = researchIcons[index] ?? Target;
              return (
                <article key={area.title} className="premium-panel p-6">
                  <Icon className="text-emerald-300" size={26} />
                  <h3 className="retro-heading mt-5 text-2xl font-black text-white">{area.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{area.description}</p>
                </article>
              );
            })}
          </div>
        </div>
        </SectionReveal>

        <SectionReveal id="endgame">
        <div className="grid w-full gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <SectionIntro
            eyebrow="Endgame"
            title="Long-term direction."
            copy="The destination is not just a better portfolio site. It is a body of work strong enough to support serious research, durable software, and eventually a world-class quantitative investment firm."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(profile.longTermGoals).map(([key, goals]) => (
              <div key={key} className="premium-panel p-5">
                <h3 className="retro-kicker text-sm font-black uppercase text-cyan-200">{goalLabels[key as keyof typeof profile.longTermGoals]}</h3>
                <ul className="mt-5 space-y-3">
                  {goals.map((goal) => (
                    <li key={goal} className="flex gap-3 text-sm leading-6 text-slate-300">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        </SectionReveal>

        <footer className="relative z-10 border-t border-white/10 bg-black/70 px-5 py-8 backdrop-blur-xl sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {profile.name}. Built as an interactive research portfolio.</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href={profile.socialLinks.x} target="_blank" rel="noreferrer" className="font-black text-white transition hover:text-cyan-200">X</a>
            <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-black text-white transition hover:text-cyan-200">
              GitHub
              <Github size={15} />
            </a>
          </div>
        </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {!solarExplore && <DigitalTwinChat />}
    </main>
  );
}
