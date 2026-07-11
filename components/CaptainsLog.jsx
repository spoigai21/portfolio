"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import styles from "./CaptainsLog.module.css";

// Client-only WebGL starfield behind the Work page's log interface.
const CaptainsLogScene = dynamic(() => import("./CaptainsLogScene"), {
  ssr: false,
});

// Backdrop for the Work (/projects) page: just the quiet starfield over a deep
// void (replacing the old bright galaxy streak). The framed "captain's log"
// interface — header, ambient log, scrim, scanlines — lives with the content in
// LogTerminal; the red shooting stars (FloatingStars) ride along above this.
export default function CaptainsLog() {
  const ref = useRef(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (ref.current) ref.current.style.opacity = "1";
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div ref={ref} className={styles.wrap} style={{ opacity: 0 }} aria-hidden="true">
      <CaptainsLogScene />
    </div>
  );
}
