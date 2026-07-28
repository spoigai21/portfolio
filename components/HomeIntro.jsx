import Link from "next/link";
import HeroName from "./HeroName";
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
// The hero deliberately shows the name alone. The bio and job title live in
// the page metadata, the JSON-LD Person, and /about — not as extra hero copy.
const destinations = [
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Skills", href: "/skills" },
  { label: "Now", href: "/now" },
  { label: "Contact", href: "/contact" },
];

export default function HomeIntro() {
  return (
    <>
      <HeroName />

      {/* Real anchors so the orbiting planets aren't the only path to the rest
          of the site. Visually hidden (the planets are the visual nav) but
          crawlable, keyboard-reachable, and revealed on focus. */}
      <nav className={styles.nav} aria-label="Site">
        {destinations.map((d) => (
          <Link key={d.href} href={d.href}>
            {d.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
