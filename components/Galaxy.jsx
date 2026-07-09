"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import styles from "./Galaxy.module.css";

// Client-only WebGL background. Always mounted/rendered — visibility is managed
// purely via opacity so the fade is smooth with no pop-in.
const GalaxyScene = dynamic(() => import("./GalaxyScene"), { ssr: false });

export default function Galaxy() {
  const ref = useRef(null);

  // Fade the galaxy in near-immediately once mounted. (The old behavior gated
  // opacity on scrolling a full viewport past a hero that no longer exists on
  // these pages, which left the background stuck hidden behind short sections.)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (ref.current) ref.current.style.opacity = "1";
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // starts at 0, then transitions to full via the CSS fade on mount
  return (
    <div ref={ref} className={styles.wrap} style={{ opacity: 0 }} aria-hidden="true">
      <GalaxyScene />
    </div>
  );
}
