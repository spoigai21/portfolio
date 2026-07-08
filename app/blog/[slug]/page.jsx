import { notFound } from "next/navigation";
import { posts } from "@/lib/content";
import styles from "../blog.module.css";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return { title: "Post not found — Shayan Poigai" };
  return {
    title: `${post.title} — Shayan Poigai`,
    description: post.summary || undefined,
  };
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PostPage({ params }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const isDraft = post.status === "draft" || !post.body;

  return (
    <section className={`section ${styles.wrap}`}>
      <div className="container">
        <a href="/blog" className={styles.back}>
          ← All writing
        </a>

        <article className={styles.article}>
          <div className={styles.meta}>
            <time className={styles.date} dateTime={post.date}>
              {formatDate(post.date)}
            </time>
            {isDraft && <span className={styles.badge}>Draft</span>}
          </div>
          <h1 className={styles.postTitle}>{post.title}</h1>

          {isDraft ? (
            <div className={styles.stub}>
              <p className={styles.stubTitle}>Coming soon</p>
              <p className={styles.stubText}>
                This post is still being written. Check back soon.
              </p>
            </div>
          ) : (
            <div className={styles.postBody}>{post.body}</div>
          )}
        </article>
      </div>
    </section>
  );
}
