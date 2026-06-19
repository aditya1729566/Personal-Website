"use client";

import { ArrowUpRight, Bot, BriefcaseBusiness, ChartNoAxesCombined, ExternalLink, Github, GraduationCap, Layers3, ShieldCheck, Sparkles, Target, Trophy } from "lucide-react";

import DigitalTwinChat from "@/components/DigitalTwinChat";
import { profile } from "@/data/profile";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Research", href: "#research" },
  { label: "Goals", href: "#goals" },
];

const stats = [
  { label: "Research focus", value: "Quant finance" },
  { label: "Live projects", value: String(profile.projects.filter((p) => p.details.status.includes("Live")).length) },
  { label: "Strategy examples", value: "KO-PEP / MA-V" },
];

const journeyIcons = [GraduationCap, ChartNoAxesCombined, Layers3, Trophy];
const researchIcons = [ShieldCheck, BriefcaseBusiness, ChartNoAxesCombined];
const goalLabels: Record<keyof typeof profile.longTermGoals, string> = {
  finance: "Finance",
  academia: "Academia",
  entrepreneurship: "Entrepreneurship",
  publicService: "Public Service",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#top" className="flex items-center gap-3 font-[family-name:var(--font-syne)] text-sm font-bold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">AA</span>
            <span>{profile.name}</span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface hover:text-foreground">
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={profile.socialLinks.x}
              target="_blank"
              rel="noreferrer"
              aria-label="Open Aditya's X profile"
              className="hidden h-9 w-9 items-center justify-center rounded-md border border-border bg-white text-sm font-bold text-foreground transition hover:border-accent-blue hover:text-accent-blue sm:inline-flex"
            >
              X
            </a>
            <a
              href={profile.socialLinks.github}
              target="_blank"
              rel="noreferrer"
              aria-label="Open Aditya's GitHub profile"
              className="hidden h-9 w-9 items-center justify-center rounded-md border border-border bg-white text-foreground transition hover:border-accent-blue hover:text-accent-blue sm:inline-flex"
            >
              <Github size={17} />
            </a>
            <a href="#work" className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90">
              View Work
              <ArrowUpRight size={16} />
            </a>
          </div>
        </nav>
      </header>

      <section id="top" className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-24 lg:pt-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-muted">
            <Sparkles size={15} className="text-accent-blue" />
            Quantitative research, markets, and software
          </div>

          <h1 className="mt-6 max-w-3xl font-[family-name:var(--font-syne)] text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-5 max-w-2xl text-xl font-semibold leading-relaxed text-foreground/85">
            {profile.tagline}
          </p>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
            {profile.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#work" className="inline-flex items-center gap-2 rounded-md bg-accent-blue px-5 py-3 text-sm font-bold text-white transition hover:bg-accent-blue-dark">
              Explore Projects
              <ArrowUpRight size={17} />
            </a>
            <a href="#about" className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-5 py-3 text-sm font-bold text-foreground transition hover:border-foreground/30">
              Read Profile
            </a>
            <a href={profile.socialLinks.x} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-5 py-3 text-sm font-bold text-foreground transition hover:border-accent-blue hover:text-accent-blue">
              X
              <ExternalLink size={15} />
            </a>
            <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-5 py-3 text-sm font-bold text-foreground transition hover:border-accent-blue hover:text-accent-blue">
              GitHub
              <Github size={16} />
            </a>
          </div>
        </div>

        <aside className="rounded-lg border border-border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-muted">Current direction</p>
              <h2 className="mt-2 font-[family-name:var(--font-syne)] text-2xl font-bold">Research-driven builder</h2>
            </div>
            <Bot className="text-accent-green" size={28} />
          </div>
          <p className="mt-5 text-sm leading-7 text-muted">
            Building projects at the intersection of mathematics, finance, AI, insurance, and entrepreneurship, with a long-term focus on systematic investing.
          </p>
          <div className="mt-6 grid gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between rounded-md bg-surface px-4 py-3">
                <span className="text-sm text-muted">{stat.label}</span>
                <span className="text-sm font-bold text-foreground">{stat.value}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section id="about" className="border-y border-border bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-kicker">About</p>
            <h2 className="section-title">{"What I'm building toward."}</h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-muted">
            {profile.about.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <blockquote className="border-l-4 border-accent-green bg-surface px-5 py-4 text-foreground/85">
              {profile.philosophy}
            </blockquote>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="section-heading">
          <p className="section-kicker">Path</p>
          <h2 className="section-title">Career Journey</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {profile.careerJourney.map((step, index) => {
            const Icon = journeyIcons[index] ?? Target;
            return (
              <article key={step.title} className="rounded-lg border border-border bg-white p-5 shadow-sm">
                <Icon className="text-accent-blue" size={24} />
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted">{step.phase} / {step.period}</p>
                <h3 className="mt-2 font-[family-name:var(--font-syne)] text-lg font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{step.description}</p>
                <ul className="mt-4 space-y-2">
                  {step.highlights.slice(0, 3).map((highlight) => (
                    <li key={highlight} className="flex gap-2 text-sm text-foreground/80">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-green" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section id="work" className="border-y border-border bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="section-heading">
            <p className="section-kicker">Work</p>
            <h2 className="section-title">Projects and Ventures</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {profile.projects.map((project) => (
              <article key={project.id} className="rounded-lg border border-border bg-background p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-accent-blue">{project.category}</p>
                    <h3 className="mt-2 font-[family-name:var(--font-syne)] text-2xl font-bold">{project.title}</h3>
                    <p className="mt-2 text-sm font-semibold text-foreground/80">{project.tagline}</p>
                  </div>
                  <span className="rounded-md bg-white px-3 py-1.5 text-xs font-bold text-muted ring-1 ring-border">{project.details.status}</span>
                </div>
                <p className="mt-5 text-sm leading-7 text-muted">{project.details.overview}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.details.tech.map((tech) => (
                    <span key={tech} className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-foreground/75 ring-1 ring-border">{tech}</span>
                  ))}
                </div>
                {"results" in project.details && project.details.results && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {project.details.results.map((result) => (
                      <div key={result.pair} className="rounded-md border border-border bg-white px-3 py-2 text-sm">
                        <span className="font-bold">{result.pair}</span>
                        <span className="ml-2 text-muted">Sharpe {result.sharpe}</span>
                      </div>
                    ))}
                  </div>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-md border border-border bg-white px-4 py-2 text-sm font-bold text-foreground transition hover:border-accent-blue hover:text-accent-blue">
                    Visit Project
                    <ExternalLink size={15} />
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="research" className="mx-auto max-w-6xl px-5 py-16">
        <div className="section-heading">
          <p className="section-kicker">Research</p>
          <h2 className="section-title">Research Areas</h2>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {profile.researchAreas.map((area, index) => {
            const Icon = researchIcons[index] ?? Target;
            return (
              <article key={area.title} className="rounded-lg border border-border bg-white p-6 shadow-sm">
                <Icon className="text-accent-green" size={24} />
                <h3 className="mt-4 font-[family-name:var(--font-syne)] text-xl font-bold">{area.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{area.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="goals" className="border-t border-border bg-foreground text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white/55">Goals</p>
            <h2 className="mt-3 font-[family-name:var(--font-syne)] text-3xl font-bold leading-tight md:text-4xl">Long-term direction</h2>
            <p className="mt-4 text-sm leading-7 text-white/70">
              A focused mix of finance, academic research, entrepreneurship, and public service.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(profile.longTermGoals).map(([key, goals]) => (
              <div key={key} className="rounded-lg border border-white/10 bg-white/5 p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">{goalLabels[key as keyof typeof profile.longTermGoals]}</h3>
                <ul className="mt-4 space-y-3">
                  {goals.map((goal) => (
                    <li key={goal} className="flex gap-3 text-sm leading-6 text-white/75">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gold" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {profile.name}. Built for clarity and substance.</p>
          <div className="flex flex-wrap items-center gap-3">
            <a href={profile.socialLinks.x} target="_blank" rel="noreferrer" className="font-semibold text-foreground hover:text-accent-blue">
              X
            </a>
            <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-accent-blue">
              GitHub
              <Github size={15} />
            </a>
          </div>
        </div>
      </footer>

      <DigitalTwinChat />
    </main>
  );
}
