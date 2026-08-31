import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";

const siteUrl = "https://adityaag.com/";
const siteTitle = "Aditya Agrawal — Quantitative Researcher & Builder";
const siteDescription =
  "Aditya Agrawal is a quantitative researcher and developer exploring financial markets, mathematics, systematic trading, economic risk, and research software.";
const socialImage = "/og-aditya-agrawal-museum.jpg";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: siteUrl,
  },
  authors: [{ name: "Aditya Agrawal", url: siteUrl }],
  creator: "Aditya Agrawal",
  publisher: "Aditya Agrawal",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "profile",
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "Aditya Agrawal",
    locale: "en_US",
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: "Entrance to Aditya Agrawal's interactive personal museum portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    creator: "@aditya_quant",
    images: [socialImage],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}#person`,
      name: "Aditya Agrawal",
      alternateName: "@aditya_quant",
      url: siteUrl,
      description: siteDescription,
      sameAs: [
        "https://x.com/aditya_quant",
        "https://github.com/aditya1729566",
        "https://www.linkedin.com/in/aditya-agrawal-367337288/",
      ],
      knowsAbout: [
        "Quantitative research",
        "Quantitative finance",
        "Systematic trading",
        "Statistical arbitrage",
        "Mathematics",
        "Financial markets",
        "Insurance and economic risk",
        "Software development",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      url: siteUrl,
      name: "Aditya Agrawal",
      description: siteDescription,
      publisher: { "@id": `${siteUrl}#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}#profile`,
      url: siteUrl,
      name: siteTitle,
      description: siteDescription,
      isPartOf: { "@id": `${siteUrl}#website` },
      mainEntity: { "@id": `${siteUrl}#person` },
      about: { "@id": `${siteUrl}#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} ${plexMono.variable}`}>
      <head>
        <link rel="preload" as="image" href="/archive/rubens-prometheus-bound.webp" type="image/webp" fetchPriority="high" />
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
