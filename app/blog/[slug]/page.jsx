import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/lib/content";
import { pageMeta } from "@/lib/site";
import styles from "../blog.module.css";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return { title: "Post not found", robots: { index: false, follow: true } };

  const meta = pageMeta({
    title: post.title,
    description:
      post.summary || `A post by Shayan Poigai on ${post.title.toLowerCase()}.`,
    path: `/blog/${post.slug}`,
    type: "article",
  });

  // Unwritten stubs render a "Coming soon" placeholder. Letting Google index
  // near-empty pages is thin content that drags on the whole domain, so they
  // stay out of the index (and out of the sitemap) until they have a body.
  if (post.status === "draft" || !post.body) {
    return { ...meta, robots: { index: false, follow: true } };
  }
  return meta;
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
        {/* There is no /blog index route — this pointed at a 404. The writing
            lives on /now, which is where the post links come from. */}
        <Link href="/now" className={styles.back}>
          ← All writing
        </Link>

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
