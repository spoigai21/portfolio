"use client";

import { useEffect, useState } from "react";
import styles from "./Nav.module.css";

const sections = [
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <a href="#top" className={styles.brand} onClick={() => setOpen(false)}>
          SP<span className={styles.dot}>.</span>
        </a>

        <button
          className={styles.toggle}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>

        <nav className={`${styles.links} ${open ? styles.linksOpen : ""}`}>
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} onClick={() => setOpen(false)}>
              {s.label}
            </a>
          ))}
          <a
            href="/resume.pdf"
            className={styles.resume}
            onClick={() => setOpen(false)}
          >
            Résumé
          </a>
        </nav>
      </div>
    </header>
  );
}
