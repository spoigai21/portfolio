import Contact from "@/components/Contact";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Contact",
  description:
    "Get in touch with Shayan Poigai — software engineer based in the San Francisco Bay Area. Reach out by email, LinkedIn, GitHub, or LeetCode.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="page">
      <Contact />
    </main>
  );
}
