import Galaxy from "@/components/Galaxy";
import FloatingStars from "@/components/FloatingStars";
import CursorGlow from "@/components/CursorGlow";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Writing from "@/components/Writing";
import Education from "@/components/Education";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Galaxy />
      <FloatingStars />
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <About />
        {/* Projects lead — strongest work first, before the chronological job list */}
        <Projects />
        <Experience />
        <Skills />
        <Writing />
        <Education />
      </main>
      <Footer />
    </>
  );
}
