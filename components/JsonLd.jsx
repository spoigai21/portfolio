import {
  siteUrl,
  siteName,
  siteDescription,
  jobTitle,
  almaMater,
  sameAs,
  abs,
} from "@/lib/site";
import { profile } from "@/lib/content";

// Structured data. This is the piece that lets Google associate the string
// "Shayan Poigai" with this site as an entity (knowledge-panel style) rather
// than treating it as an unremarkable keyword match.
//
// Two graphs:
//   Person  — who the site is about; `sameAs` cross-links LinkedIn/GitHub so
//             Google can merge those profiles into one entity.
//   WebSite — declares this domain as the person's official site.
//
// Note: schema.org's Person type has no `almaMater` property — `alumniOf` is
// the correct encoding for the same concept, so that's what's used here.
const personId = `${siteUrl}/#person`;
const siteId = `${siteUrl}/#website`;

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": personId,
      name: siteName,
      givenName: "Shayan",
      familyName: "Poigai",
      url: siteUrl,
      jobTitle,
      description: siteDescription,
      email: `mailto:${profile.email}`,
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: almaMater,
        sameAs: "https://www.scu.edu/",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Fremont",
        addressRegion: "CA",
        addressCountry: "US",
      },
      knowsAbout: [
        "Software Engineering",
        "Full-Stack Development",
        "Artificial Intelligence",
        "Machine Learning",
        "Backend Development",
      ],
      sameAs,
    },
    {
      "@type": "WebSite",
      "@id": siteId,
      url: siteUrl,
      name: `${siteName} — ${jobTitle}`,
      description: siteDescription,
      inLanguage: "en-US",
      publisher: { "@id": personId },
      about: { "@id": personId },
    },
    {
      "@type": "ProfilePage",
      "@id": abs("/#profilepage"),
      url: siteUrl,
      name: `${siteName} — ${jobTitle}`,
      isPartOf: { "@id": siteId },
      about: { "@id": personId },
      inLanguage: "en-US",
    },
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // Server-rendered so it is present in the initial HTML response, not
      // injected after hydration where a crawler may never see it.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
