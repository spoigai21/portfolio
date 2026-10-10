"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import CanvasBoundary from "./CanvasBoundary";
import styles from "./GalaxyNav.module.css";

// Client-only: the WebGL launchpad never runs during SSR.
const GalaxyNav = dynamic(() => import("./GalaxyNav"), {
  ssr: false,
  loading: () => <div className={styles.wrap} aria-hidden="true" />,
});

// Phones don't get the orbit system at all. At portrait aspect the camera's
// horizontal view is roughly half what the outermost orbit needs, so most of
// the planets sit off-screen; HomeIntro's link list is the nav there instead
// (see the mobile block in HomeIntro.module.css). Skipping the canvas also
// spares the smallest devices a WebGL context they'd never see.
// Same condition as the CSS (see the note in MobilePage.module.css): the
// planets need a cursor and a window wider than it is tall. Touch devices and
// short/portrait viewports get the document instead.
const MOBILE = "(hover: none) and (pointer: coarse), (max-width: 640px), (max-height: 520px), (max-aspect-ratio: 9/10)";

export default function GalaxyNavCanvas() {
  // `null` until measured so the server render and the first client render
  // agree on the placeholder; only then do we decide whether to mount WebGL.
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (isMobile !== false) {
    return <div className={styles.wrap} aria-hidden="true" />;
  }

  // Without WebGL the hero keeps its name, role, bio, and links (all rendered
  // by HomeIntro) — it just loses the orbiting planets.
  return (
    <CanvasBoundary fallback={<div className={styles.wrap} aria-hidden="true" />}>
      <GalaxyNav />
    </CanvasBoundary>
  );
}
