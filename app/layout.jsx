import {
  Space_Grotesk,
  Space_Mono,
  Playfair_Display,
  Syne,
  Bree_Serif,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import {
  siteUrl,
  siteName,
  siteDescription,
  jobTitle,
  ogImage,
} from "@/lib/site";
import JsonLd from "@/components/JsonLd";
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
  // metadataBase makes every relative URL below (canonical, og:image) resolve
  // to an absolute one, which is what crawlers and social scrapers require.
  metadataBase: new URL(siteUrl),
  title: {
    // Child routes set only their own leaf (e.g. "About") and the template
    // appends the name, so the name is in EVERY page title.
    default: `${siteName} — ${jobTitle}`,
    template: `%s — ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  keywords: [
    "Shayan Poigai",
    "Shayan Poigai software engineer",
    "Shayan Poigai portfolio",
    "Shayan Poigai Santa Clara University",
    "software engineer",
    "full-stack engineer",
    "AI engineer",
  ],
  alternates: { canonical: "/" },
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
    type: "website",
    siteName,
    title: `${siteName} — ${jobTitle}`,
    description: siteDescription,
    url: siteUrl,
    locale: "en_US",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — ${jobTitle}`,
    description: siteDescription,
    images: [ogImage.url],
  },
};

export const viewport = {
  themeColor: "#0c0628",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
      </head>
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
