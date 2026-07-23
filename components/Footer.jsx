"use client";

import { usePathname } from "next/navigation";
import { profile } from "@/lib/content";
import styles from "./Footer.module.css";

export default function Footer() {
  // The Work page is a fixed, non-scrolling "seated at a station" scene, so the
  // page footer would never be reachable — omit it there.
  const pathname = usePathname();
  if (pathname === "/work") return null;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.copy}>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <nav className={styles.links}>
          <a href={profile.links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </nav>
      </div>
    </footer>
  );
}
