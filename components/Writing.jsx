import Reveal from "./Reveal";
import { now } from "@/lib/content";
import styles from "./Writing.module.css";

function formatUpdated(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return d
    .toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    .toUpperCase();
}

export default function Writing() {
  const technical = now.items.filter((it) => !it.mini);
  const mini = now.items.filter((it) => it.mini);

  return (
    <section className="section" id="now">
      <div className="container">
        <Reveal>
          <h2 className="section-title">What I&apos;m Working On Now</h2>
        </Reveal>

        <Reveal>
          <p className={styles.updated}>
            Last updated · {formatUpdated(now.updated)}
          </p>
        </Reveal>

        <ul className={styles.list}>
          {technical.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              // an odd final technical card goes full-width so the grid stays even
              className={`${styles.item} ${
                technical.length % 2 === 1 && i === technical.length - 1 ? styles.wide : ""
              }`}
              delay={i * 60}
            >
              <div className={styles.card}>
                <h3 className={styles.title}>{item.title}</h3>
                {item.summary && <p className={styles.summary}>{item.summary}</p>}
              </div>
            </Reveal>
          ))}

          {mini.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              className={styles.item}
              delay={(technical.length + i) * 60}
            >
              <div className={`${styles.card} ${styles.miniCard}`}>
                <h3 className={styles.miniTitle}>{item.title}</h3>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
