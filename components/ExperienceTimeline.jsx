"use client";

import { useRef } from "react";
import { experience } from "@/lib/content";
import styles from "./ExperienceTimeline.module.css";

// Horizontal, left-to-right timeline the user can slide/scroll through.
export default function ExperienceTimeline() {
  const scroller = useRef(null);
  const slide = (dir) => {
    scroller.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section className={styles.wrap} aria-label="Experience">
      <div className={styles.head}>
        <h2 className={styles.title}>Experience</h2>
        <div className={styles.controls}>
          <button onClick={() => slide(-1)} aria-label="Scroll experience left">
            ←
          </button>
          <button onClick={() => slide(1)} aria-label="Scroll experience right">
            →
          </button>
        </div>
      </div>

      <div className={styles.scroller} ref={scroller}>
        <ol className={styles.track}>
          {experience.map((e, i) => (
            <li key={i} className={styles.item}>
              <span className={styles.node} aria-hidden="true" />
              <div className={styles.card}>
                <span className={styles.period}>{e.period}</span>
                <h3 className={styles.role}>{e.role}</h3>
                <p className={styles.company}>{e.company}</p>
                <ul className={styles.bullets}>
                  {e.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
