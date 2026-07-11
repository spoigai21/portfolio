"use client";

import { useEffect, useRef, useState } from "react";
import { logEntries } from "@/lib/logEntries";
import styles from "./LogTerminal.module.css";

const SECTIONS = [
  { key: "experience", label: "Experience", entries: logEntries.experience },
  { key: "projects", label: "Projects", entries: logEntries.projects },
];

// Which card in a horizontal scroller is currently centered. Read straight from
// the DOM (the components are left untouched): each <section> has one <ol> track
// whose direct <li> children are the cards. Works for both the timeline (a
// wrapping .scroller scrolls) and the carousel (the <ol> scrolls itself).
function centeredIndex(section) {
  const ol = section?.querySelector("ol");
  if (!ol || ol.children.length === 0) return 0;
  const scrollEl =
    ol.scrollWidth > ol.clientWidth + 4 ? ol : ol.parentElement;
  const rect = scrollEl.getBoundingClientRect();
  const mid = rect.left + scrollEl.clientWidth / 2;
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < ol.children.length; i++) {
    const r = ol.children[i].getBoundingClientRect();
    const d = Math.abs(r.left + r.width / 2 - mid);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}

const scrollerFor = (section) => {
  const ol = section?.querySelector("ol");
  if (!ol) return null;
  return ol.scrollWidth > ol.clientWidth + 4 ? ol : ol.parentElement;
};

// Wraps the Work section (Experience timeline + Projects carousel) in a framed
// ship's-log terminal: a bordered document with a live header + ambient log that
// track whichever card the reader is on. Content is passed through untouched.
export default function LogTerminal({ children }) {
  const rootRef = useRef(null);
  const [activeSection, setActiveSection] = useState("experience");
  const [indices, setIndices] = useState({ experience: 0, projects: 0 });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const expSec = root.querySelector('[aria-label="Experience"]');
    const projSec = root.querySelector('[aria-label="Projects"]');
    let raf = 0;

    const recompute = () => {
      raf = 0;
      setIndices({
        experience: centeredIndex(expSec),
        projects: centeredIndex(projSec),
      });
      // active section = the one whose vertical center is nearest the viewport's
      const vmid = window.innerHeight / 2;
      const dist = (el) => {
        if (!el) return Infinity;
        const r = el.getBoundingClientRect();
        return Math.abs((r.top + r.bottom) / 2 - vmid);
      };
      setActiveSection(dist(projSec) < dist(expSec) ? "projects" : "experience");
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(recompute);
    };

    const scrollers = [scrollerFor(expSec), scrollerFor(projSec)].filter(Boolean);
    scrollers.forEach((el) =>
      el.addEventListener("scroll", schedule, { passive: true })
    );
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();
    // one more pass after layout/media settles
    const t = setTimeout(schedule, 300);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      scrollers.forEach((el) => el.removeEventListener("scroll", schedule));
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const active = SECTIONS.find((s) => s.key === activeSection) || SECTIONS[0];
  const activeIdx = Math.min(indices[activeSection] ?? 0, active.entries.length - 1);
  const activeEntry = active.entries[activeIdx] || active.entries[0];

  return (
    <section className="section" ref={rootRef}>
      <div className="container">
        <div className={styles.frame}>
          <span className={`${styles.bracket} ${styles.bTL}`} aria-hidden="true" />
          <span className={`${styles.bracket} ${styles.bTR}`} aria-hidden="true" />
          <span className={`${styles.bracket} ${styles.bBL}`} aria-hidden="true" />
          <span className={`${styles.bracket} ${styles.bBR}`} aria-hidden="true" />

          <header className={styles.logHead}>
            <div className={styles.logTitle}>
              <span className={styles.brk}>[</span> {"CAPTAIN'S LOG"}{" "}
              <span className={styles.brk}>]</span>
            </div>
            <div className={styles.logMeta}>
              <span className={styles.metaStardate}>
                STARDATE {activeEntry.stardate}
              </span>
              <span className={styles.cursor} />
            </div>
          </header>

          <div className={styles.body}>{children}</div>
        </div>
      </div>
    </section>
  );
}
