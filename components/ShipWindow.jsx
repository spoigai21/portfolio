"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import styles from "./ShipWindow.module.css";

// Client-only WebGL backdrop for the /skills page: the view "out the cockpit
// window" — a starfield that drifts past as the ship travels forward. Replaces
// the shared galaxy spiral (whose bright plasma streak ran through the orbs).
// Mounted always; visibility managed via opacity so the fade-in has no pop-in.
const ShipWindowScene = dynamic(() => import("./ShipWindowScene"), {
  ssr: false,
});

export default function ShipWindow() {
  const ref = useRef(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (ref.current) ref.current.style.opacity = "1";
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div ref={ref} className={styles.wrap} style={{ opacity: 0 }} aria-hidden="true">
      <ShipWindowScene />
    </div>
  );
}
