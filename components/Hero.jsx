"use client";

import dynamic from "next/dynamic";
import styles from "./Hero.module.css";

// Client-only WebGL hero scene (projector + hologram name).
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <div className={styles.canvasFallback} aria-hidden="true" />,
});

export default function Hero() {
  return (
    <section className={styles.hero} id="top">
      {/* 3D holographic projector scene — only the name is shown */}
      <div className={styles.scene}>
        <HeroScene />
      </div>

      <a href="#work" className={styles.scrollCue} aria-label="Scroll to work">
        <span className={styles.scrollLine} aria-hidden="true" />
      </a>
    </section>
  );
}
