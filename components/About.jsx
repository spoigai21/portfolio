import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { about } from "@/lib/content";
import styles from "./About.module.css";

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHeader eyebrow={"// about"} title="A bit about me" />

        <div className={styles.grid}>
          <Reveal className={styles.prose}>
            <p className={styles.lead}>{about.lead}</p>
            {about.paragraphs.map((p, i) => (
              <p key={i} className={styles.para}>
                {p}
              </p>
            ))}
          </Reveal>

          <Reveal className={styles.facts} delay={80}>
            <ul className={styles.factList}>
              {about.facts.map((f) => (
                <li key={f.label} className={styles.fact}>
                  <span className={styles.factLabel}>{f.label}</span>
                  <span className={styles.factValue}>{f.value}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
