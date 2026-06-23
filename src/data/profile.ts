export const profile = {
  name: "Aditya Agrawal",
  tagline: "Quantitative mind. Relentless builder.",
  subtitle:
    "Aspiring quant investor, researcher, entrepreneur & mathematician — building at the intersection of markets, math, and technology.",
  socialLinks: {
    x: "https://x.com/aditya_quant",
    github: "https://github.com/aditya1729566",
  },
  about: `I am an aspiring quantitative investor, researcher, entrepreneur, and mathematician with a deep interest in financial markets, economics, risk management, and emerging technologies. My work sits at the intersection of mathematics, finance, insurance, artificial intelligence, and entrepreneurship.

I enjoy exploring complex systems, challenging assumptions, and building projects that combine rigorous analytical thinking with practical real-world applications. My long-term ambition is to conduct impactful research, build successful businesses, and eventually manage a world-class hedge fund focused on quantitative and systematic investing.`,
  philosophy:
    "I am driven by curiosity, analytical thinking, and a desire to understand how complex systems work—from financial markets and economies to technology and human behavior. My goal is to combine rigorous research, entrepreneurship, and quantitative thinking to create meaningful impact at scale.",
  coreInterests: [
    "Quantitative Finance",
    "Statistical Arbitrage",
    "Hedge Funds",
    "Mathematics",
    "Economics",
    "Insurance & Risk Management",
    "Development Economics",
    "Market Microstructure",
    "High-Frequency Trading",
    "Artificial Intelligence",
    "Startups & Entrepreneurship",
    "Bitcoin & Cryptocurrencies",
    "Philosophy",
    "Public Policy & Education Reform",
  ],
  currentAreasOfStudy: {
    quantitativeTrading: [
      "Statistical arbitrage strategies",
      "Mean reversion systems",
      "Pairs trading",
      "Market-neutral portfolio construction",
      "Risk management",
      "Portfolio optimization",
      "Execution cost modeling",
      "Market microstructure research",
    ],
    mathematics: [
      "Advanced probability",
      "Statistics",
      "Stochastic processes",
      "Financial mathematics",
      "Mathematical modeling",
    ],
    economics: [
      "Development economics",
      "Insurance economics",
      "Financial markets",
      "Universal Basic Income (UBI)",
      "Disaster recovery economics",
    ],
    technology: [
      "Artificial Intelligence",
      "Prompt Engineering",
      "Python Programming",
      "Financial Data Analysis",
      "Software Development",
    ],
  },
  careerJourney: [
    {
      phase: "Foundation",
      title: "Mathematics & Economics",
      period: "Core Disciplines",
      description:
        "Building deep foundations in advanced probability, statistics, stochastic processes, financial mathematics, and development economics — the analytical backbone for everything I build.",
      highlights: [
        "Advanced probability & statistics",
        "Stochastic processes",
        "Financial mathematics",
        "Development economics & UBI research",
      ],
      icon: "sigma",
    },
    {
      phase: "Markets",
      title: "Quantitative Trading Research",
      period: "Active Research",
      description:
        "Developing and backtesting systematic strategies — statistical arbitrage, mean reversion, pairs trading, and market-neutral portfolio construction with rigorous risk management.",
      highlights: [
        "KO–PEP strategy · Sharpe 1.9",
        "MA–V strategy · Sharpe 1.3",
        "Kalman Filter-based models",
        "Execution cost modeling",
      ],
      icon: "chart",
    },
    {
      phase: "Technology",
      title: "AI & Software Development",
      period: "Building in Public",
      description:
        "Engineering AI-powered research tools, cross-platform applications, and scalable software ventures that bridge quantitative finance with modern technology.",
      highlights: [
        "AI financial research platform",
        "Flutter cross-platform apps",
        "Prompt engineering & Python",
        "Fintech product exploration",
      ],
      icon: "code",
    },
    {
      phase: "Vision",
      title: "Research & Entrepreneurship",
      period: "Long-Term Trajectory",
      description:
        "Pursuing a PhD in Mathematics, launching a quantitative hedge fund, and building technology companies at the intersection of AI, finance, and risk management.",
      highlights: [
        "Quantitative hedge fund ambition",
        "Insurance & disaster resilience research",
        "AI-driven startup exploration",
        "Education reform & public policy",
      ],
      icon: "rocket",
    },
  ],
  projects: [
    {
      id: "ai-research",
      title: "AI Financial Research Platform",
      tagline: "Automated investment intelligence",
      category: "AI · FinTech",
      color: "#ff006e",
      liveUrl: "https://deep-asset-research.onrender.com",
      summary:
        "An AI-powered platform that ingests SEC filings and shareholder letters to generate actionable investment research summaries.",
      details: {
        overview:
          "This platform leverages large language models and structured financial data pipelines to analyze 10-K annual reports, 10-Q quarterly filings, and shareholder letters — transforming dense regulatory documents into concise, research-grade summaries for quantitative investors.",
        features: [
          "Automated parsing and analysis of 10-K annual reports",
          "Quarterly 10-Q filing processing and trend extraction",
          "Shareholder letter sentiment and thesis analysis",
          "Investment research summary generation with key metrics",
        ],
        tech: ["Python", "LLMs", "NLP", "Financial Data APIs"],
        status: "In Development",
      },
    },
    {
      id: "quant-trading",
      title: "Quantitative Trading Research",
      tagline: "Systematic strategy development",
      category: "Quant · Research",
      color: "#8338ec",
      liveUrl: "https://github.com/aditya1729566/MA-V-Kalman-Filter-Research",
      summary:
        "Rigorous backtesting and development of statistical arbitrage, pairs trading, and Kalman Filter-based trading models.",
      details: {
        overview:
          "A comprehensive quantitative research framework for developing, testing, and validating systematic trading strategies. Focus on market-neutral portfolio construction, risk-adjusted returns, and execution cost modeling across equity pairs.",
        features: [
          "Statistical arbitrage strategy development & backtesting",
          "Kalman Filter-based dynamic hedge ratio models",
          "Pairs trading systems with cointegration analysis",
          "Risk-adjusted portfolio frameworks with Sharpe optimization",
        ],
        tech: ["Python", "Pandas", "NumPy", "Statsmodels", "Kalman Filters"],
        results: [
          { pair: "KO–PEP", sharpe: "1.9" },
          { pair: "MA–V", sharpe: "1.3" },
        ],
        status: "Active Research",
      },
    },
    {
      id: "codeforces-training-dashboard",
      title: "Codeforces Training Dashboard",
      tagline: "Competitive programming progress analytics",
      category: "CP · Analytics",
      color: "#2563eb",
      liveUrl: "https://codeforces-rating-improvement-tool.vercel.app",
      summary:
        "A training dashboard that tracks and analyzes Codeforces practice, rating growth, problem-solving patterns, and improvement progress.",
      details: {
        overview:
          "A Codeforces-focused training dashboard for monitoring competitive programming progress. It helps users track practice history, analyze performance trends, and understand where their training is improving over time.",
        features: [
          "Codeforces training and progress tracking",
          "Performance analytics across practice sessions",
          "Rating and problem-solving trend analysis",
          "Dashboard views for structured improvement",
        ],
        tech: ["React", "Analytics", "Codeforces API", "Vercel"],
        status: "Live Project",
      },
    },
    {
      id: "startup-exploration",
      title: "Startup Exploration",
      tagline: "AI, fintech, research, and scalable software ventures",
      category: "Venture · Exploration",
      color: "#0f766e",
      summary:
        "Experimenting with AI-driven businesses, financial technology products, research and analytics platforms, and scalable software ventures.",
      details: {
        overview:
          "An ongoing exploration of business ideas at the intersection of AI, finance, research tooling, analytics platforms, and scalable software products.",
        features: [
          "AI-driven business exploration",
          "Financial technology product research",
          "Research and analytics platform ideas",
          "Scalable software venture exploration",
        ],
        tech: ["AI", "FinTech", "Research Tools", "Software Ventures"],
        status: "Exploration",
      },
    },
    {
      id: "interactive-blackjack",
      title: "Interactive BlackJack",
      tagline: "Web-based Blackjack game",
      category: "Web · Game",
      color: "#00bcd4",
      liveUrl: "https://interactive-blackjack.netlify.app/",
      summary: "A browser-based interactive Blackjack game with animations and simple AI opponents.",
      details: {
        overview:
          "Playable Blackjack implemented as a responsive web app. Features simple dealer AI, score tracking, and mobile-friendly controls.",
        features: [
          "Single-player Blackjack against dealer AI",
          "Responsive UI with animated card dealing",
          "Simple scoring and game flow",
        ],
        tech: ["React", "TypeScript", "CSS"],
        status: "Live Project",
      },
    },
    {
      id: "outsmarts",
      title: "Outsmarts",
      tagline: "Multiplayer code-breaking game",
      category: "Mobile · Flutter",
      color: "#00f0ff",
      liveUrl: "https://cool-fudge-4f3efa.netlify.app/",
      summary:
        "A cross-platform multiplayer game built with Flutter, combining strategic code-breaking gameplay with mobile-first design.",
      details: {
        overview:
          "Outsmarts is an online multiplayer game where players compete in code-breaking challenges. Built from the ground up with Flutter, it delivers a seamless experience across iOS and Android with real-time multiplayer mechanics.",
        features: [
          "Multiplayer code-breaking gameplay with real-time sessions",
          "Mobile-first development optimized for touch interfaces",
          "Cross-platform architecture — single codebase, dual deployment",
          "Scalable game logic designed for competitive play",
        ],
        tech: ["Flutter", "Dart", "Firebase", "Mobile UI/UX"],
        status: "Live Project",
      },
    },
  ],
  researchAreas: [
    {
      title: "Insurance & Risk Transfer",
      description:
        "Researching how insurance can improve resilience for individuals, businesses, and developing economies — including disaster insurance, accessibility, and innovative models for digital assets.",
    },
    {
      title: "Development Economics",
      description:
        "Exploring how countries respond to earthquakes, floods, tornadoes, and other large-scale economic shocks — and how financial protection mechanisms can accelerate recovery.",
    },
    {
      title: "Financial Markets",
      description:
        "Deep research into high-frequency trading, market microstructure, quantitative investment strategies, and cryptocurrency market dynamics.",
    },
  ],
  longTermGoals: {
    finance: [
      "Launch and manage a quantitative hedge fund",
      "Develop systematic investment strategies",
      "Build expertise in global capital markets",
    ],
    academia: [
      "Pursue advanced research in mathematics and economics",
      "Earn a PhD in Mathematics",
      "Publish research in finance and economic policy",
    ],
    entrepreneurship: [
      "Build and scale technology companies",
      "Create products at AI × finance intersection",
      "Develop innovative risk-management solutions",
    ],
    publicService: [
      "Contribute to education reform",
      "Promote AI literacy and practical learning",
      "Support evidence-based policymaking",
    ],
  },
  hobbies: [
    "Reading philosophy",
    "Financial market research",
    "Building software projects",
    "Studying economics",
    "Learning about Bitcoin and cryptocurrencies",
    "Chess",
    "Poker theory",
    "Competitive problem solving",
    "Debating philosophical questions",
    "Exploring new business ideas",
    "Following developments in science and technology",
  ],
  thinkers: ["Baruch Spinoza", "Friedrich Nietzsche", "Dostoyevsky"],
  philosophyTopics: [
    "Free will",
    "Ethics",
    "Consciousness",
    "Knowledge and truth",
    "Human decision-making",
  ],
  portfolioUrl: "#portfolio-coming-soon",
};
