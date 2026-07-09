import Reveal from "./Reveal";
import { about, education } from "@/lib/content";
import styles from "./About.module.css";

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <Reveal>
          <h1 className={styles.heading}>About Me</h1>
        </Reveal>

        <Reveal className={styles.prose}>
          {about.paragraphs.map((p, i) => (
            <p key={i} className={styles.para}>
              {p}
            </p>
          ))}
        </Reveal>

        <Reveal className={styles.outsideBlock}>
          <p className={styles.subLabel}>Hobbies</p>
          <ul className={styles.outside}>
            {about.hobbies.map((h) => (
              <li key={h.label} className={styles.chip}>
                <span className={styles.chipIcon} aria-hidden="true">
                  {h.icon}
                </span>
                {h.label}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className={styles.eduBlock}>
          <p className={styles.subLabel}>Education</p>
          <ul className={styles.timeline}>
            {education.map((e, i) => (
              <li key={i} className={styles.entry}>
                <span className={styles.entryPeriod}>{e.period}</span>
                <span className={styles.entryRole}>{e.degree}</span>
                <span className={styles.entryOrg}>{e.school}</span>
                {e.detail && <span className={styles.entryDetail}>{e.detail}</span>}
              </li>
            ))}
          </ul>
          <a href="/shayan-resume.pdf" className={styles.resume} download>
            Résumé ↓
          </a>
        </Reveal>
      </div>
    </section>
  );
}
