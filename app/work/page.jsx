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
      {/* The page's sections carry their own headings ("Experience",
          "Projects") but there was no top-level h1. The journal layout has no
          natural slot for a visible one, so it's sr-only — present for
          crawlers and screen readers, invisible in the design. */}
      <h1 className="sr-only">Work and projects by Shayan Poigai</h1>
      <LogTerminal>
        <ExperienceTimeline />
        <ProjectsCarousel />
      </LogTerminal>
    </main>
  );
}
