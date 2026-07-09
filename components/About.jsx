import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { about, experience, education } from "@/lib/content";
import styles from "./About.module.css";

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHeader eyebrow={"// about"} title="About me" />

        {/* what I'm about — short lines in glass cards */}
        <div className={styles.pillars}>
          {about.pillars.map((p, i) => (
            <Reveal as="div" key={p.label} className={styles.pillar} delay={i * 60}>
              <p className={styles.pillarLabel}>{p.label}</p>
              <ul className={styles.pillarItems}>
                {p.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        {/* outside of code — icon chips */}
        <Reveal className={styles.outsideBlock}>
          <p className={styles.subLabel}>Outside of code</p>
          <ul className={styles.outside}>
            {about.outside.map((o) => (
              <li key={o.text} className={styles.chip}>
                <span className={styles.chipIcon} aria-hidden="true">
                  {o.icon}
                </span>
                {o.text}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* compact path — work + education, no prose */}
        <div className={styles.pathGrid}>
          <Reveal className={styles.pathCol}>
            <p className={styles.subLabel}>Experience</p>
            <ul className={styles.timeline}>
              {experience.map((e, i) => (
                <li key={i} className={styles.entry}>
                  <span className={styles.entryPeriod}>{e.period}</span>
                  <span className={styles.entryRole}>{e.role}</span>
                  <span className={styles.entryOrg}>{e.company}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className={styles.pathCol} delay={80}>
            <p className={styles.subLabel}>Education</p>
            <ul className={styles.timeline}>
              {education.map((e, i) => (
                <li key={i} className={styles.entry}>
                  <span className={styles.entryPeriod}>{e.period}</span>
                  <span className={styles.entryRole}>{e.degree}</span>
                  <span className={styles.entryOrg}>{e.school}</span>
                </li>
              ))}
            </ul>
            <a href="/shayan-resume.pdf" className={styles.resume} download>
              Résumé ↓
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
