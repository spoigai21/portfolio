"use client";

import { useState } from "react";
import { projects } from "@/lib/content";
import styles from "./ProjectsCarousel.module.css";

function ProjectImage({ src, alt }) {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return (
      <div className={`${styles.media} ${styles.placeholder}`} aria-hidden="true">
        <span>{alt}</span>
      </div>
    );
  }
  return (
    <div className={styles.media}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} />
    </div>
  );
}

// Slideshow carousel showcasing one project at a time.
export default function ProjectsCarousel() {
  const [i, setI] = useState(0);
  const n = projects.length;
  const go = (d) => setI((prev) => (prev + d + n) % n);
  const p = projects[i];

  return (
    <section className={styles.wrap} aria-label="Projects">
      <div className={styles.head}>
        <h2 className={styles.title}>Projects</h2>
        <div className={styles.controls}>
          <button onClick={() => go(-1)} aria-label="Previous project">←</button>
          <span className={styles.counter}>
            {i + 1} / {n}
          </span>
          <button onClick={() => go(1)} aria-label="Next project">→</button>
        </div>
      </div>

      <article className={styles.slide} key={p.name}>
        <ProjectImage src={p.image} alt={p.name} />

        <div className={styles.body}>
          <div className={styles.top}>
            <h3 className={styles.name}>{p.name}</h3>
            <span className={styles.period}>{p.period}</span>
          </div>

          <ul className={styles.bullets}>
            {p.bullets.map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>

          <ul className={styles.tags}>
            {p.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          {p.links && (
            <div className={styles.links}>
              {p.links.github && (
                <a href={p.links.github} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
              )}
              {p.links.live && (
                <a href={p.links.live} target="_blank" rel="noreferrer">
                  Live ↗
                </a>
              )}
            </div>
          )}
        </div>
      </article>

      <div className={styles.dots}>
        {projects.map((proj, d) => (
          <button
            key={proj.name}
            className={d === i ? styles.dotActive : styles.dot}
            onClick={() => setI(d)}
            aria-label={`Go to project ${d + 1}`}
            aria-current={d === i ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
