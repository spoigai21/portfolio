import ExperienceTimeline from "@/components/ExperienceTimeline";
import ProjectsCarousel from "@/components/ProjectsCarousel";
import LogTerminal from "@/components/LogTerminal";

export const metadata = {
  title: "Work — Shayan Poigai",
  description: "Projects and work experience by Shayan Poigai.",
};

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
