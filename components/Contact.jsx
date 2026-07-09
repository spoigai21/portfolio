import Reveal from "./Reveal";
import BlackHoleCanvas from "./BlackHoleCanvas";
import { contact } from "@/lib/content";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <Reveal>
          <h2 className={styles.title}>Get in touch</h2>
        </Reveal>

        <div className={styles.stage}>
          <BlackHoleCanvas />

          <div className={styles.channels}>
            {contact.map((c) => {
              const external = c.href.startsWith("http");
              return (
                <a
                  key={c.label}
                  href={c.href}
                  className={styles.channel}
                  {...(external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  <span className={styles.channelLabel}>{c.label}</span>
                  <span className={styles.channelValue}>{c.value}</span>
                  <span className={styles.channelArrow} aria-hidden="true">
                    ↗
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
