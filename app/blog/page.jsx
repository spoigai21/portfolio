import { posts } from "@/lib/content";
import styles from "./blog.module.css";

export const metadata = {
  title: "Writing — Shayan Poigai",
  description: "Technical notes and write-ups by Shayan Poigai.",
};

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogIndex() {
  return (
    <section className={`section ${styles.wrap}`}>
      <div className="container">
        <a href="/#writing" className={styles.back}>
          ← Back to home
        </a>
        <p className="eyebrow">{"// writing"}</p>
        <h1 className="section-title">Notes &amp; write-ups</h1>

        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.slug}>
              <a href={`/blog/${post.slug}`} className={styles.card}>
                <div className={styles.meta}>
                  <time className={styles.date} dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                  {post.status === "draft" && (
                    <span className={styles.badge}>Draft</span>
                  )}
                </div>
                <h2 className={styles.cardTitle}>{post.title}</h2>
                {post.summary && <p className={styles.summary}>{post.summary}</p>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
