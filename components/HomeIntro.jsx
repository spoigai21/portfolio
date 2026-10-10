import Link from "next/link";
import HeroName from "./HeroName";
import MobilePage from "./MobilePage";
import { profile } from "@/lib/content";
import styles from "./HomeIntro.module.css";

// Everything on the homepage that a crawler needs to read.
//
// This is a server component on purpose. The galaxy (GalaxyNavCanvas) is loaded
// with ssr:false because WebGL can't run during SSR — which previously meant the
// homepage's entire server-rendered body was the footer. No <h1>, no name, and
// no links to /about, /work, etc., so every other route was orphaned: reachable
// only by executing the Three.js scene.
//
// HeroName is rendered here rather than inside GalaxyNav so it lands in the
// initial HTML. It's still a client component (the comet animation needs the
// DOM), but client components SSR their markup — only ssr:false skips that.
//
// ---------------------------------------------------------------------------
// Two homepages share this markup, split purely in CSS at 640px:
//
//   Desktop — the orbiting planets ARE the navigation. The intro lines and the
//     work section are display:none and the nav is visually hidden (crawlable,
//     revealed on keyboard focus), exactly as before.
//   Phones  — the planet system can't fit a portrait viewport, so
//     GalaxyNavCanvas skips WebGL entirely and the whole site becomes one
//     scrolling document: name, role, then numbered sections (experience,
//     research, projects, skills, about, now, contact) rendered by
//     MobilePage from the same content as the desktop routes.
// ---------------------------------------------------------------------------

const destinations = [
  { label: "Work", href: "/work" },
  { label: "Skills", href: "/skills" },
  { label: "About", href: "/about" },
  { label: "Now", href: "/now" },
  { label: "Contact", href: "/contact" },
];

export default function HomeIntro() {
  return (
    <>
      <HeroName />

      <div className={styles.brief}>
        <p className={styles.now}>{profile.intro}</p>
      </div>

      {/* Real anchors so the orbiting planets aren't the only path to the
          rest of the site: visually hidden, crawlable, revealed on focus. On
          phones the sections below carry the same content inline, so these
          stay hidden there too. */}
      <nav className={styles.nav} aria-label="Site">
        {destinations.map((d) => (
          <Link key={d.href} href={d.href}>
            {d.label}
          </Link>
        ))}
      </nav>

      <MobilePage />

    </>
  );
}
