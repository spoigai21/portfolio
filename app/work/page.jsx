import ExperienceTimeline from "@/components/ExperienceTimeline";
import ProjectsCarousel from "@/components/ProjectsCarousel";
import LogTerminal from "@/components/LogTerminal";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Work",
  description:
    "Software projects and engineering experience by Shayan Poigai — AI pipelines, full-stack products, machine learning research, and systems work in C++, Python, and React.",
  path: "/work",
});

export default function ProjectsPage() {
  return (
    <main className="page">
      <LogTerminal>
        <ExperienceTimeline />
        <ProjectsCarousel />
      </LogTerminal>
    </main>
  );
}
