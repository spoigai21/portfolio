"use client";

import { useEffect, useRef } from "react";
import styles from "./Cockpit.module.css";

// Minimal sci-fi cockpit / HUD frame for the /skills page. Purely decorative
// chrome confined to the margins (corner brackets, an inset viewport frame, a
// header, and a few readouts) so it never overlaps or competes with the orbs in
// the center. Pointer-events are off throughout — it can't swallow orb hovers.
export default function Cockpit() {
  const coordRef = useRef(null);
  const velRef = useRef(null);

  // Slowly drifting coordinate / velocity readout so the frame feels "live".
  // Frozen under reduced-motion (no interval, static values).
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const fmt = (n, pad) => {
      const s = Math.abs(n).toFixed(1).padStart(pad, "0");
      return `${n < 0 ? "-" : "+"}${s}`;
    };
    const render = (t) => {
      if (coordRef.current) {
        const x = 128.4 + Math.sin(t * 0.13) * 6.2;
        const y = -42.1 + Math.cos(t * 0.09) * 4.4;
        const z = 9.6 + Math.sin(t * 0.17 + 1.3) * 2.1;
        coordRef.current.textContent = `X ${fmt(x, 5)}  Y ${fmt(y, 5)}  Z ${fmt(z, 5)}`;
      }
      if (velRef.current) {
        const v = 0.42 + Math.sin(t * 0.5) * 0.015;
        velRef.current.textContent = `VEL ${v.toFixed(3)}c`;
      }
    };

    if (reduced) {
      render(0);
      return;
    }
    const id = setInterval(() => render(performance.now() / 1000), 180);
    render(performance.now() / 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.hud} aria-hidden="true">
      {/* --- cockpit interior: you're sitting in a dark cabin looking out --- */}
      {/* heavy hull vignette so the view reads as a bright window in a dark ship */}
      <div className={styles.hull} />
      {/* faint diagonal reflection across the canopy glass */}
      <div className={styles.glare} />
      {/* dark chamfered canopy frame masses in each corner */}
      <div className={`${styles.plate} ${styles.pTL}`} />
      <div className={`${styles.plate} ${styles.pTR}`} />
      <div className={`${styles.plate} ${styles.pBL}`} />
      <div className={`${styles.plate} ${styles.pBR}`} />
      {/* canopy coaming top + instrument console bottom */}
      <div className={styles.coamingTop} />
      <div className={styles.dash}>
        <div className={styles.dashGlow} />
        <div className={styles.dashLights}>
          <span className={`${styles.led} ${styles.ledOn}`} />
          <span className={styles.led} />
          <span className={`${styles.led} ${styles.ledOn}`} />
          <span className={`${styles.led} ${styles.ledRed}`} />
          <span className={`${styles.led} ${styles.ledOn}`} />
          <span className={styles.led} />
          <span className={`${styles.led} ${styles.ledOn}`} />
        </div>
        <div className={styles.dashLabel}>NAV · HELM · LIFE SUPPORT</div>
      </div>

      {/* inset viewport frame + brighter corner brackets */}
      <div className={styles.frame} />
      <span className={`${styles.corner} ${styles.tl}`} />
      <span className={`${styles.corner} ${styles.tr}`} />
      <span className={`${styles.corner} ${styles.bl}`} />
      <span className={`${styles.corner} ${styles.br}`} />

      {/* header */}
      <header className={styles.header}>
        <div className={styles.title}>
          <span className={styles.bracket}>[</span> SYSTEMS{" "}
          <span className={styles.bracket}>]</span>
        </div>
        <div className={styles.subtitle}>{"// SKILL MATRIX · ONLINE"}</div>
      </header>

      {/* top-right nav readout */}
      <div className={`${styles.readout} ${styles.topRight}`}>
        <div ref={coordRef} className={styles.coords}>
          X +128.4 Y -042.1 Z +009.6
        </div>
        <div ref={velRef} className={styles.vel}>
          VEL 0.420c
        </div>
      </div>

      {/* left edge scanner label */}
      <div className={styles.scannerLabel}>OPTICAL ARRAY · SCAN</div>

      {/* bottom-left status */}
      <div className={`${styles.readout} ${styles.bottomLeft}`}>
        <span className={styles.dot} />
        SCANNER: ACTIVE
      </div>

      {/* bottom-right status */}
      <div className={`${styles.readout} ${styles.bottomRight}`}>
        <span className={styles.bars}>▮▮▮▮▯</span> STATUS: NOMINAL
      </div>
    </div>
  );
}
