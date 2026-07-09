"use client";

import dynamic from "next/dynamic";
import styles from "./GalaxyNav.module.css";

// Client-only: the WebGL launchpad never runs during SSR.
const GalaxyNav = dynamic(() => import("./GalaxyNav"), {
  ssr: false,
  loading: () => <div className={styles.wrap} aria-hidden="true" />,
});

export default function GalaxyNavCanvas() {
  return <GalaxyNav />;
}
