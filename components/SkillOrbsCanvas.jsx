"use client";

import dynamic from "next/dynamic";
import styles from "./Skills.module.css";

// The R3F canvas is client-only and dynamically imported so it never runs
// during SSR (avoids hydration/WebGL issues and keeps the initial bundle lean).
// Isolating the ssr:false import here — instead of on the whole Skills section —
// keeps the section heading in the server tree, so a WebGL/hydration hiccup in
// the canvas can never leave the heading stuck invisible.
const SkillOrbs = dynamic(() => import("./SkillOrbs"), {
  ssr: false,
  loading: () => <div className={styles.canvasFallback} aria-hidden="true" />,
});

export default function SkillOrbsCanvas() {
  return <SkillOrbs />;
}
