"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { projects } from "@/lib/content";
import styles from "./Projects.module.css";

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
      {/* plain img so a missing file degrades gracefully to the placeholder */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} />
    </div>
  );
}

// Renders a project's mini case study as labeled story beats.
function CaseStudy({ study }) {
  const beats = [
    { label: "Problem", text: study.problem },
    { label: "Hardest call", text: study.decision },
    { label: "What broke", text: study.broke },
    { label: "What I learned", text: study.learned },
  ].filter((b) => b.text);

  return (
    <dl className={styles.caseStudy}>
      {beats.map((b) => (
        <div key={b.label} className={styles.beat}>
          <dt className={styles.beatLabel}>{b.label}</dt>
          <dd className={styles.beatText}>{b.text}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="container">
        <Reveal>
          <p className="eyebrow">{"// projects"}</p>
          <h2 className="section-title">Things I&apos;ve built</h2>
        </Reveal>

        <div className={styles.list}>
          {projects.map((p, i) => (
            <Reveal as="article" key={p.name} className={styles.card} delay={i * 60}>
              <ProjectImage src={p.image} alt={p.name} />

              <div className={styles.body}>
                <h3 className={styles.name}>{p.name}</h3>
                <p className={styles.desc}>{p.description}</p>

                {p.caseStudy && <CaseStudy study={p.caseStudy} />}

                <ul className={styles.tags}>
                  {p.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>

                {p.links?.live && (
                  <a
                    href={p.links.live}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.tryLive}
                  >
                    ▶ Try it live ↗
                  </a>
                )}

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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
