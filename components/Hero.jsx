"use client";

import dynamic from "next/dynamic";
import { profile } from "@/lib/content";
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

      {/* Human intro overlaid on the scene: who I am, in a sentence or two. */}
      <div className={styles.overlay}>
        <div className="container">
          <div className={styles.overlayInner}>
            <p className={`eyebrow ${styles.eyebrow}`}>{profile.role}</p>
            <p className={styles.tagline}>{profile.heroStatement}</p>
            <div className={styles.cta}>
              <a href="#projects" className={styles.primary}>
                See what I&apos;ve built
              </a>
              <a href="#about" className={styles.secondary}>
                More about me
              </a>
            </div>
          </div>
        </div>
      </div>

      <a href="#about" className={styles.scrollCue} aria-label="Scroll to about">
        <span className={styles.scrollLine} aria-hidden="true" />
      </a>
    </section>
  );
}
