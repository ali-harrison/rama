import type { Metadata } from "next";
import { Hanken_Grotesk, IBM_Plex_Mono, Ms_Madi } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const madi = Ms_Madi({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-madi",
  display: "swap",
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RAMA — garments made visible",
  description:
    "Raw construction. Exposed seams. Natural fabrics that age with wear. Light that reveals imperfection, not perfection.",
};

// Runs before paint so reveal targets start hidden instead of flashing in
const MOTION_FLAG = `if(matchMedia('(prefers-reduced-motion: no-preference)').matches)document.documentElement.classList.add('motion')`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${madi.variable} ${plex.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_FLAG }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
