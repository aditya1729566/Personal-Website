import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";

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
  title: "Aditya Agrawal — Quantitative Investor & Builder",
  description:
    "Quantitative investor, researcher, entrepreneur, and mathematician building at the intersection of finance, mathematics, and technology.",
  keywords: [
    "quantitative finance",
    "Aditya Agrawal",
    "statistical arbitrage",
    "entrepreneur",
    "mathematics",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} ${plexMono.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
