"use client";

import { useEffect, useRef } from "react";
import styles from "./Cockpit.module.css";

// The canopy opening — a generous, angular sci-fi window. Everything OUTSIDE
// this path is solid ship material; the starfield + orbs are only visible
// through it. Kept large (center clear) with the bottom raised for the console.
const OPENING = "M11 10 L89 10 L94 15 L94 73 L88 80 L12 80 L6 73 L6 15 Z";

// Structural canopy drawn as one scalable SVG: opaque hull with a window cut out
// (even-odd hole), a lit glass rim, top struts crossing the glass, glass
// reflection/vignette confined to the opening, and a dashboard face along the
// bottom. preserveAspectRatio="none" stretches it to any viewport; strokes use
// non-scaling-stroke so the frame lines stay crisp and even.
function Canopy() {
  return (
    <svg
      className={styles.canopy}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="shipHull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15113a" />
          <stop offset="0.5" stopColor="#0c0926" />
          <stop offset="1" stopColor="#050415" />
        </linearGradient>
        <linearGradient id="dashFace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0e1c33" />
          <stop offset="0.28" stopColor="#0a1226" />
          <stop offset="1" stopColor="#03040f" />
        </linearGradient>
        <radialGradient id="glassVig" cx="0.5" cy="0.4" r="0.72">
          <stop offset="0.5" stopColor="#020310" stopOpacity="0" />
          <stop offset="1" stopColor="#02030f" stopOpacity="0.5" />
        </radialGradient>
        <linearGradient id="glassSheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0.16" stopColor="#c8f2ff" stopOpacity="0" />
          <stop offset="0.29" stopColor="#c8f2ff" stopOpacity="0.06" />
          <stop offset="0.4" stopColor="#c8f2ff" stopOpacity="0" />
          <stop offset="0.68" stopColor="#c8f2ff" stopOpacity="0" />
          <stop offset="0.76" stopColor="#c8f2ff" stopOpacity="0.03" />
          <stop offset="0.84" stopColor="#c8f2ff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="canopyWin" clipPathUnits="userSpaceOnUse">
          <path d={OPENING} />
        </clipPath>
      </defs>

      {/* glass cues — reflection + edge vignette, confined to the window so light
          reads as catching the canopy surface between you and space */}
      <g clipPath="url(#canopyWin)">
        <rect x="0" y="0" width="100" height="100" fill="url(#glassVig)" />
        <rect x="0" y="0" width="100" height="100" fill="url(#glassSheen)" />
      </g>

      {/* solid hull all around the opening (window punched out via even-odd) */}
      <path
        d={`M0 0 L100 0 L100 100 L0 100 Z ${OPENING}`}
        fillRule="evenodd"
        fill="url(#shipHull)"
      />

      {/* dashboard face rising along the bottom */}
      <path d="M0 78 L100 78 L100 100 L0 100 Z" fill="url(#dashFace)" />
      {/* instrument panel detail on the console */}
      <g
        stroke="rgba(33,230,255,0.4)"
        strokeWidth="0.9"
        vectorEffect="non-scaling-stroke"
        fill="rgba(33,230,255,0.05)"
      >
        <rect x="15" y="86" width="17" height="7" rx="1.2" />
        <rect x="68" y="86" width="17" height="7" rx="1.2" />
      </g>
      {/* angled side consoles + a coaming seam line across the dash */}
      <g
        stroke="rgba(33,230,255,0.22)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        fill="none"
      >
        <path d="M0 89 L12 83 L88 83 L100 89" />
        <path d="M34 95 L38 91 L62 91 L66 95" />
      </g>

      {/* canopy struts crossing the top of the glass (opaque ship frame) */}
      <g
        fill="url(#shipHull)"
        stroke="rgba(33,230,255,0.35)"
        strokeWidth="0.6"
        vectorEffect="non-scaling-stroke"
      >
        <polygon points="48.8,0 51.2,0 51.2,16 48.8,16" />
        <polygon points="28.5,0 30.9,0 50.6,15 48.2,15" />
        <polygon points="69.1,0 71.5,0 51.8,15 49.4,15" />
      </g>

      {/* lit glass rim — stacked strokes fake a soft cyan glow along the edge */}
      <g fill="none">
        <path
          d={OPENING}
          stroke="rgba(33,230,255,0.10)"
          strokeWidth="7"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={OPENING}
          stroke="rgba(33,230,255,0.26)"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={OPENING}
          stroke="rgba(150,242,255,0.8)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}

// The /skills cockpit: physical ship structure framing the view (canopy + dash +
// struts + glass), with live readouts painted onto that structure. Purely
// decorative and pointer-transparent — it never overlaps the orbs in the center.
export default function Cockpit() {
  const coordRef = useRef(null);
  const velRef = useRef(null);

  // Slowly drifting coordinate / velocity readout so the console feels "live".
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
      <Canopy />

      {/* header — painted onto the top canopy frame / strut bow */}
      <header className={styles.header}>
        <div className={styles.title}>
          <span className={styles.bracket}>[</span> LOADOUT{" "}
          <span className={styles.bracket}>]</span>
        </div>
        <div className={styles.subtitle}>{"// SKILL MATRIX · ONLINE"}</div>
      </header>

      {/* nav readout — painted onto the top-right hull */}
      <div className={`${styles.readout} ${styles.topRight}`}>
        <div ref={coordRef} className={styles.coords}>
          X +128.4 Y -042.1 Z +009.6
        </div>
        <div ref={velRef} className={styles.vel}>
          VEL 0.420c
        </div>
      </div>

      {/* scanner tag riding the left canopy pillar */}
      <div className={styles.scannerLabel}>OPTICAL ARRAY · SCAN</div>

      {/* console controls — glowing indicator lights + panel label on the dash */}
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

      {/* status readouts — painted onto the console face */}
      <div className={`${styles.readout} ${styles.bottomLeft}`}>
        <span className={styles.dot} />
        SCANNER: ACTIVE
      </div>
      <div className={`${styles.readout} ${styles.bottomRight}`}>
        <span className={styles.bars}>▮▮▮▮▯</span> STATUS: NOMINAL
      </div>
    </div>
  );
}
