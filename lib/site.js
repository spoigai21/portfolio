// Single source of truth for anything SEO / metadata related.
//
// `siteUrl` drives canonical tags, og:url, the sitemap, and the JSON-LD `url`.
// Override per-environment with NEXT_PUBLIC_SITE_URL if needed — the env var
// wins over the fallback below. No trailing slash.
//
// This must match the host Vercel actually serves as primary, including the
// www. If Vercel is set to redirect www -> apex, change this to the apex
// (https://shayanpoigai.dev) — a canonical pointing at a host that 301s away
// tells Google to index a URL that doesn't serve content.
const FALLBACK_SITE_URL = "https://www.shayanpoigai.dev";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL
).replace(/\/+$/, "");

export const siteName = "Shayan Poigai";

// ~150 chars, name-first, describes the person rather than the site.
export const siteDescription =
  "Shayan Poigai is a full-stack and AI software engineer studying computer science at Santa Clara University, building production systems that ship.";

export const jobTitle = "Software Engineer";

export const almaMater = "Santa Clara University";

// Absolute URL helper — metadata fields like og:url and JSON-LD want absolute.
export const abs = (path = "/") =>
  `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

// Social profiles feed JSON-LD `sameAs`, which is what lets Google tie the
// name "Shayan Poigai" on this site to the same person on LinkedIn/GitHub.
export const sameAs = [
  "https://www.linkedin.com/in/shayanpoigai/",
  "https://github.com/spoigai21",
];

export const ogImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Shayan Poigai — Software Engineer",
};

// Builds a route's metadata export. `title` is the leaf only ("About") — the
// root layout's title template appends "— Shayan Poigai", so the name lands in
// every page title without repeating it here. OG/Twitter are set per route too,
// otherwise a shared link to /work would preview with the homepage's copy.
export function pageMeta({ title, description, path, type = "website" }) {
  const fullTitle = `${title} — ${siteName}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName,
      title: fullTitle,
      description,
      url: abs(path),
      locale: "en_US",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.url],
    },
  };
}

// Every indexable route, with the sitemap priority/changefreq it should carry.
// Draft blog stubs are deliberately excluded — see app/sitemap.js.
export const routes = [
  { path: "/", priority: 1.0, changeFrequency: "monthly" },
  { path: "/about", priority: 0.9, changeFrequency: "monthly" },
  { path: "/work", priority: 0.9, changeFrequency: "monthly" },
  { path: "/skills", priority: 0.8, changeFrequency: "monthly" },
  { path: "/now", priority: 0.7, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
];
