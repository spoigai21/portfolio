import Reveal from "./Reveal";
import Cockpit from "./Cockpit";
import SkillOrbsCanvas from "./SkillOrbsCanvas";
import styles from "./Skills.module.css";

// The orbs are framed as a ship's readout: cockpit HUD chrome around the edges,
// a faint scanner grid + sweep directly behind the orbs. Neither touches the
// orbs themselves — they stay exactly as they were.
export default function Skills() {
  return (
    <section className="section" id="skills">
      <Cockpit />
      <Reveal className={styles.canvasWrap}>
        {/* subtle "readout screen" behind the orbs — grid + slow scanline sweep */}
        <div className={styles.readout} aria-hidden="true">
          <div className={styles.grid} />
          <div className={styles.scan} />
        </div>
        <SkillOrbsCanvas />
      </Reveal>
    </section>
  );
}
