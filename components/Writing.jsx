import Reveal from "./Reveal";
import { posts } from "@/lib/content";
import styles from "./Writing.module.css";

export default function Writing() {
  return (
    <section className="section" id="writing">
      <div className="container">
        <Reveal>
          <h2 className="section-title">Current work</h2>
        </Reveal>

        <ul className={styles.list}>
          {posts.map((post, i) => (
            <Reveal as="li" key={post.slug} className={styles.item} delay={i * 60}>
              <div className={styles.card}>
                <span className={styles.badgeNow}>
                  <span className={styles.dot} aria-hidden="true" /> In progress
                </span>
                <h3 className={styles.title}>{post.title}</h3>
                {post.summary && <p className={styles.summary}>{post.summary}</p>}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
