"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import styles from "./PlanetSurface.module.css";

// Client-only WebGL background for the /now page: standing on a planet, looking
// out at the sky. Mounted always; visibility managed via opacity so the fade-in
// is smooth with no pop-in.
const PlanetSurfaceScene = dynamic(() => import("./PlanetSurfaceScene"), {
  ssr: false,
});

export default function PlanetSurface() {
  const ref = useRef(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (ref.current) ref.current.style.opacity = "1";
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div ref={ref} className={styles.wrap} style={{ opacity: 0 }} aria-hidden="true">
      <PlanetSurfaceScene />
    </div>
  );
}
