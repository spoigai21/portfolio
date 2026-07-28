"use client";

import dynamic from "next/dynamic";
import CanvasBoundary from "./CanvasBoundary";
import styles from "./GalaxyNav.module.css";

// Client-only: the WebGL launchpad never runs during SSR.
const GalaxyNav = dynamic(() => import("./GalaxyNav"), {
  ssr: false,
  loading: () => <div className={styles.wrap} aria-hidden="true" />,
});

export default function GalaxyNavCanvas() {
  // Without WebGL the hero keeps its name, role, bio, and links (all rendered
  // by HomeIntro) — it just loses the orbiting planets.
  return (
    <CanvasBoundary fallback={<div className={styles.wrap} aria-hidden="true" />}>
      <GalaxyNav />
    </CanvasBoundary>
  );
}
