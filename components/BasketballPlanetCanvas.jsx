"use client";

import dynamic from "next/dynamic";
import styles from "./BasketballPlanet.module.css";

// Client-only WebGL basketball planet; never runs during SSR.
const BasketballPlanet = dynamic(() => import("./BasketballPlanet"), {
  ssr: false,
  loading: () => <div className={styles.canvas} aria-hidden="true" />,
});

export default function BasketballPlanetCanvas() {
  return <BasketballPlanet />;
}
