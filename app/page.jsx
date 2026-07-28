import GalaxyNavCanvas from "@/components/GalaxyNavCanvas";
import HomeIntro from "@/components/HomeIntro";

// The launchpad hub: a minimal galaxy with the destinations as orbiting bodies.
//
// The canvas is client-only, so HomeIntro carries the name, role, bio, and the
// real navigation links — server-rendered, so they exist for crawlers and for
// anyone without WebGL.
export default function Home() {
  return (
    <main className="hero-shell">
      <GalaxyNavCanvas />
      <HomeIntro />
    </main>
  );
}
