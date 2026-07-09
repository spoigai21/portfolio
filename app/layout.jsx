import {
  Space_Grotesk,
  Space_Mono,
  Playfair_Display,
  Syne,
  Bree_Serif,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import SiteBackdrop from "@/components/SiteBackdrop";
import CursorGlow from "@/components/CursorGlow";
import BackHome from "@/components/BackHome";
import Footer from "@/components/Footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["italic", "normal"],
  variable: "--font-serif",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const breeSerif = Bree_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-slab",
  display: "swap",
});

export const metadata = {
  title: "Shayan Poigai — Software Engineer",
  description:
    "Full-stack software engineer building AI pipelines, quantum experiments, and products that ship.",
};

export const viewport = {
  themeColor: "#0c0628",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${spaceMono.variable} ${playfair.variable} ${syne.variable} ${breeSerif.variable}`}
      >
        {/* Backdrop (galaxy, or the void on /contact) + chrome for every page */}
        <SiteBackdrop />
        <CursorGlow />
        <BackHome />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
