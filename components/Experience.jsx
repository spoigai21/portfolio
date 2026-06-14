import Reveal from "./Reveal";
import { experience } from "@/lib/content";
import styles from "./Experience.module.css";

export default function Experience() {
  return (
    <section className="section" id="work">
      <div className="container">
        <Reveal>
          <p className="eyebrow">{"// experience"}</p>
          <h2 className="section-title">Where I&apos;ve worked</h2>
        </Reveal>

        <ol className={styles.timeline}>
          {experience.map((item, i) => (
            <Reveal as="li" key={i} className={styles.item} delay={i * 60}>
              <span className={styles.node} aria-hidden="true" />
              <div className={styles.card}>
                <p className={styles.period}>{item.period}</p>
                <h3 className={styles.role}>{item.role}</h3>
                <p className={styles.company}>{item.company}</p>
                <p className={styles.desc}>{item.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
