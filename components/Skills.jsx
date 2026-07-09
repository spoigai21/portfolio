import Reveal from "./Reveal";
import SkillOrbsCanvas from "./SkillOrbsCanvas";
import styles from "./Skills.module.css";

// No heading — the orbs speak for themselves (reduces repeated section headers).
export default function Skills() {
  return (
    <section className="section" id="skills">
      <Reveal className={styles.canvasWrap}>
        <SkillOrbsCanvas />
      </Reveal>
    </section>
  );
}
