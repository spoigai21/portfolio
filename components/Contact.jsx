import Reveal from "./Reveal";
import BasketballPlanetCanvas from "./BasketballPlanetCanvas";
import { contact } from "@/lib/content";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <Reveal>
          <h2 className={`section-title ${styles.title}`}>Get in touch</h2>
        </Reveal>

        <div className={styles.stage}>
          <BasketballPlanetCanvas />

          <Reveal className={styles.channels}>
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
                </a>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
