"use client";

import { useEffect, useRef } from "react";
import { profile } from "@/lib/content";
import styles from "./HeroName.module.css";

const CHARS = profile.name.toUpperCase().split("");
const COMET_MS = 2400; // time for the comet to cross the frame (slow, graceful)
const COOL_MS = 500; // hot -> cyan cooldown per letter

// A comet streaks across the hero and the letters of the name materialize in its
// wake — hot/white, then cooling to the cyan holographic resting color. Whole
// thing runs under ~1.5s. Reduced motion skips straight to the final state.
export default function HeroName() {
  const rootRef = useRef(null);
  const cometRef = useRef(null);
  const lettersRef = useRef([]);

  useEffect(() => {
    const root = rootRef.current;
    const comet = cometRef.current;
    const letters = lettersRef.current.filter(Boolean);

    const showFinal = () => {
      letters.forEach((el) => el.classList.add(styles.on, styles.settled));
      if (comet) comet.style.display = "none";
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rect = root?.getBoundingClientRect();
    if (reduced || !root || !comet || !rect || !rect.width) {
      showFinal();
      return;
    }

    const W = rect.width;

    // comet crosses the full frame width, centered on the name's line
    const anim = comet.animate(
      [
        { transform: "translate(-40px, -50%)", opacity: 0 },
        { opacity: 1, offset: 0.08 },
        { opacity: 1, offset: 0.9 },
        { transform: `translate(${W + 40}px, -50%)`, opacity: 0 },
      ],
      { duration: COMET_MS, easing: "linear", fill: "forwards" }
    );

    // reveal each letter as the comet head reaches its position
    const timers = [];
    letters.forEach((el) => {
      const lr = el.getBoundingClientRect();
      const cx = lr.left + lr.width / 2 - rect.left;
      const t = Math.max(0, ((cx + 40) / (W + 80)) * COMET_MS - 20);
      timers.push(
        setTimeout(() => {
          el.classList.add(styles.on);
          setTimeout(() => el.classList.add(styles.settled), COOL_MS);
        }, t)
      );
    });

    return () => {
      timers.forEach(clearTimeout);
      try {
        anim.cancel();
      } catch {}
    };
  }, []);

  let letterIndex = -1;
  return (
    <div ref={rootRef} className={styles.name} role="img" aria-label={profile.name}>
      <span ref={cometRef} className={styles.comet} aria-hidden="true" />
      {CHARS.map((ch, i) => {
        if (ch === " ") {
          return (
            <span key={i} className={styles.space} aria-hidden="true">
              &nbsp;
            </span>
          );
        }
        letterIndex += 1;
        const idx = letterIndex;
        return (
          <span
            key={i}
            aria-hidden="true"
            ref={(el) => (lettersRef.current[idx] = el)}
            className={styles.letter}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
}
