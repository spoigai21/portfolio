"use client";

import dynamic from "next/dynamic";
import Reveal from "./Reveal";
import styles from "./Skills.module.css";

// The R3F canvas is client-only and dynamically imported so it never runs
// during SSR (avoids hydration/WebGL issues and keeps the initial bundle lean).
const SkillOrbs = dynamic(() => import("./SkillOrbs"), {
  ssr: false,
  loading: () => <div className={styles.canvasFallback} aria-hidden="true" />,
});

export default function Skills() {
  return (
    <section className="section" id="skills">
      <div className="container">
        <Reveal>
          <p className="eyebrow">{"// skills"}</p>
          <h2 className="section-title">Languages &amp; frameworks</h2>
          <p className={styles.hint}>
            Hover an orb to reveal the tool. Drag to look around.
          </p>
        </Reveal>
      </div>

      <Reveal className={styles.canvasWrap}>
        <SkillOrbs />
      </Reveal>
    </section>
  );
}
