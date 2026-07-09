import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import styles from "./ComingSoon.module.css";

// Reusable galaxy-styled scaffold for pages that have no content yet.
export default function ComingSoon({ eyebrow, title, note }) {
  return (
    <section className="section">
      <div className="container">
        <SectionHeader eyebrow={eyebrow} title={title} />
        <Reveal className={styles.panel}>
          <span className={styles.pulse} aria-hidden="true" />
          <p className={styles.label}>Transmission incoming</p>
          {note && <p className={styles.note}>{note}</p>}
        </Reveal>
      </div>
    </section>
  );
}
