import ExperienceTimeline from "@/components/ExperienceTimeline";
import ProjectsCarousel from "@/components/ProjectsCarousel";

export const metadata = {
  title: "Work — Shayan Poigai",
  description: "Projects and work experience by Shayan Poigai.",
};

export default function ProjectsPage() {
  return (
    <main className="page">
      <section className="section">
        <div className="container">
          <ExperienceTimeline />
          <ProjectsCarousel />
        </div>
      </section>
    </main>
  );
}
