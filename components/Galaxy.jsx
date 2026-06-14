"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import styles from "./Galaxy.module.css";

// Client-only WebGL background. Always mounted/rendered — visibility is managed
// purely via opacity so the fade is smooth with no pop-in.
const GalaxyScene = dynamic(() => import("./GalaxyScene"), { ssr: false });

export default function Galaxy() {
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const start = window.innerHeight; // hero section: stays hidden
      const end = window.innerHeight * 1.5; // fully visible just past the hero
      const opacity = Math.min(1, Math.max(0, (scrollY - start) / (end - start)));
      if (ref.current) ref.current.style.opacity = String(opacity);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // opacity:0 by default so the hero is pure indigo until you scroll past it
  return (
    <div ref={ref} className={styles.wrap} style={{ opacity: 0 }} aria-hidden="true">
      <GalaxyScene />
    </div>
  );
}
