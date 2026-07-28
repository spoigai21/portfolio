import { abs, routes } from "@/lib/site";
import { posts } from "@/lib/content";

// Served at /sitemap.xml, built from the route list in lib/site.js so adding a
// page can't silently leave it out of the sitemap.
export default function sitemap() {
  const lastModified = new Date();

  const pages = routes.map((r) => ({
    url: abs(r.path),
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Only posts that actually have a body. The rest render a "Coming soon"
  // placeholder and are marked noindex — listing them here would ask Google to
  // crawl pages it has been told not to index.
  const published = posts
    .filter((p) => p.status !== "draft" && p.body)
    .map((p) => ({
      url: abs(`/blog/${p.slug}`),
      lastModified: p.date ? new Date(`${p.date}T00:00:00`) : lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    }));

  return [...pages, ...published];
}
