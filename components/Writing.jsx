import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { posts } from "@/lib/content";
import styles from "./Writing.module.css";

// Formats an ISO date string (YYYY-MM-DD) without pulling in a date library.
function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Writing() {
  return (
    <section className="section" id="writing">
      <div className="container">
        <SectionHeader eyebrow={"// writing"} title="Notes & write-ups" />

        <ul className={styles.list}>
          {posts.map((post, i) => (
            <Reveal as="li" key={post.slug} className={styles.item} delay={i * 60}>
              <a href={`/blog/${post.slug}`} className={styles.card}>
                <div className={styles.meta}>
                  <time className={styles.date} dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                  {post.status === "draft" && (
                    <span className={styles.badge}>Draft</span>
                  )}
                </div>
                <h3 className={styles.title}>{post.title}</h3>
                {post.summary && <p className={styles.summary}>{post.summary}</p>}
                <span className={styles.readMore}>Read ↗</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
