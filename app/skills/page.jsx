import Skills from "@/components/Skills";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Skills",
  description:
    "The languages, frameworks, and tools Shayan Poigai builds with — Python, C++, Java, React, FastAPI, PostgreSQL, Docker, and AWS.",
  path: "/skills",
});

export default function SkillsPage() {
  return (
    <main className="page">
      <Skills />
    </main>
  );
}
