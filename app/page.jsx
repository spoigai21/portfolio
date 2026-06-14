import Galaxy from "@/components/Galaxy";
import FloatingStars from "@/components/FloatingStars";
import CursorGlow from "@/components/CursorGlow";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
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
        <Experience />
        <Projects />
        <Skills />
        <Education />
      </main>
      <Footer />
    </>
  );
}
