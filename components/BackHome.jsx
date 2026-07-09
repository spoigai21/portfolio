"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./BackHome.module.css";

// The only persistent nav: a return-to-hero control on every page except home
// (home navigates via the planets).
export default function BackHome() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <Link href="/" className={styles.back} aria-label="Back to home">
      <span className={styles.arrow} aria-hidden="true">←</span>
      Home
    </Link>
  );
}
