"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import styles from "./Nebula.module.css";

// Client-only WebGL background for the About page. Mounted always; visibility
// managed via opacity so the fade-in is smooth with no pop-in.
const NebulaScene = dynamic(() => import("./NebulaScene"), { ssr: false });

export default function Nebula() {
  const ref = useRef(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (ref.current) ref.current.style.opacity = "1";
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div ref={ref} className={styles.wrap} style={{ opacity: 0 }} aria-hidden="true">
      <NebulaScene />
      {/* dark scrim from the left edge → guarantees the reading column stays
          legible at any viewport width, over the nebula. */}
      <div className={styles.scrim} />
    </div>
  );
}
