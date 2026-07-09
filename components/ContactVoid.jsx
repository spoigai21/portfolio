import styles from "./ContactVoid.module.css";

// Deep-space void backdrop unique to the Contact page — related to the galaxy,
// but a darker, quieter nebula environment of its own.
export default function ContactVoid() {
  return <div className={styles.void} aria-hidden="true" />;
}
