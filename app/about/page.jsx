import About from "@/components/About";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "About",
  description:
    "About Shayan Poigai — a software engineer at Santa Clara University building backend AI and product features, with a growing interest in quantum computing.",
  path: "/about",
  type: "profile",
});

export default function AboutPage() {
  return (
    <main className="page">
      <About />
    </main>
  );
}
