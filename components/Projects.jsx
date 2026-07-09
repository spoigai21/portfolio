import Reveal from "./Reveal";
import { projects, experience } from "@/lib/content";
import styles from "./Projects.module.css";

// One unified, compact list — projects and roles together, no paragraphs.
const entries = [
  ...projects.map((p) => ({
    kind: "Project",
    title: p.name,
    tags: p.tags,
    links: p.links,
  })),
  ...experience.map((e) => ({
    kind: "Role",
    title: e.role,
    org: e.company,
    period: e.period,
  })),
];

export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="container">
        <Reveal>
          <p className="eyebrow">{"// projects & experience"}</p>
          <h2 className="section-title">Projects &amp; Experience</h2>
        </Reveal>

        <div className={styles.grid}>
          {entries.map((e, i) => (
            <Reveal
              as="article"
              key={`${e.kind}-${e.title}`}
              className={styles.card}
              delay={(i % 3) * 60}
            >
              <div className={styles.top}>
                <span
                  className={`${styles.badge} ${
                    e.kind === "Project" ? styles.badgeProject : styles.badgeRole
                  }`}
                >
                  {e.kind}
                </span>
                {e.period && <span className={styles.period}>{e.period}</span>}
              </div>

              <h3 className={styles.title}>{e.title}</h3>
              {e.org && <p className={styles.org}>{e.org}</p>}

              {e.tags && (
                <ul className={styles.tags}>
                  {e.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}

              {e.links && (
                <div className={styles.links}>
                  {e.links.github && (
                    <a href={e.links.github} target="_blank" rel="noreferrer">
                      GitHub ↗
                    </a>
                  )}
                  {e.links.live && (
                    <a href={e.links.live} target="_blank" rel="noreferrer">
                      Live ↗
                    </a>
                  )}
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
