import { siteUrl } from "@/lib/site";

// Served at /robots.txt. Generated rather than dropped in public/ so the
// sitemap URL always tracks the configured domain instead of going stale.
//
// Note there is deliberately no Disallow for /blog: the draft stubs are kept
// out of the index with a noindex meta tag, and a robots.txt block would stop
// crawlers from ever fetching the page to *see* that tag.
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
