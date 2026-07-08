import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import SkillOrbsCanvas from "./SkillOrbsCanvas";
import styles from "./Skills.module.css";

// Server component: the heading renders and hydrates independently of the
// client-only WebGL canvas, so the canvas can never block the heading.
export default function Skills() {
  return (
    <section className="section" id="skills">
      <div className="container">
        <SectionHeader eyebrow={"// skills"} title="Languages & frameworks" />
      </div>

      <Reveal className={styles.canvasWrap}>
        <SkillOrbsCanvas />
      </Reveal>
    </section>
  );
}
