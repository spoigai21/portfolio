import Reveal from "./Reveal";
import { education, profile } from "@/lib/content";
import styles from "./Education.module.css";

export default function Education() {
  return (
    <section className="section" id="education">
      <div className="container">
        <Reveal>
          <p className="eyebrow">{"// education"}</p>
          <h2 className="section-title">Education</h2>
        </Reveal>

        <div className={styles.list}>
          {education.map((e, i) => (
            <Reveal as="div" key={i} className={styles.card} delay={i * 60}>
              <div className={styles.head}>
                <h3 className={styles.degree}>{e.degree}</h3>
                <span className={styles.period}>{e.period}</span>
              </div>
              <p className={styles.school}>{e.school}</p>
              {e.detail && <p className={styles.detail}>{e.detail}</p>}
            </Reveal>
          ))}
        </div>

        <Reveal className={styles.resumeBlock}>
          <h3 className={styles.resumeTitle}>Want the full story?</h3>
          <p className={styles.resumeText}>
            Grab the one-page résumé, or reach out at{" "}
            <a href={`mailto:${profile.email}`}>{profile.email}</a>.
          </p>
          <a href="/shayan-resume.pdf" className={styles.download} download>
            Download résumé ↓
          </a>
        </Reveal>
      </div>
    </section>
  );
}
