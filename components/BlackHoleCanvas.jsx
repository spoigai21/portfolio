"use client";

import dynamic from "next/dynamic";
import styles from "./BlackHole.module.css";

// Client-only WebGL black hole; never runs during SSR.
const BlackHole = dynamic(() => import("./BlackHole"), {
  ssr: false,
  loading: () => <div className={styles.canvas} aria-hidden="true" />,
});

export default function BlackHoleCanvas() {
  return <BlackHole />;
}
