"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/lib/content";
import styles from "./ProjectsCarousel.module.css";

// Media prefers a short looping clip of real usage, falls back to the still
// screenshot, and finally to a labelled placeholder if neither loads. When a
// video is present it plays muted as a preview; clicking opens the lightbox to
// watch it full-size with sound.
function ProjectMedia({ video, image, alt, onOpen }) {
  const [videoFailed, setVideoFailed] = useState(!video);
  const [imgFailed, setImgFailed] = useState(!image);

  if (!videoFailed) {
    return (
      <button
        type="button"
        className={`${styles.media} ${styles.mediaButton}`}
        onClick={onOpen}
        aria-label={`Play ${alt} video with sound`}
      >
        <video
          src={video}
          poster={image || undefined}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoFailed(true)}
        />
        <span className={styles.playBadge} aria-hidden="true">▶</span>
      </button>
    );
  }
  if (!imgFailed) {
    return (
      <div className={styles.media}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" loading="lazy" onError={() => setImgFailed(true)} />
      </div>
    );
  }
  return (
    <div className={`${styles.media} ${styles.placeholder}`} aria-hidden="true">
      <span>{alt}</span>
    </div>
  );
}

// Carousel of project cards on a horizontal scroll-snap track. The next card
// peeks in from the right edge so it's obvious the carousel continues.
export default function ProjectsCarousel() {
  const track = useRef(null);
  const [i, setI] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const n = projects.length;

  // Close the lightbox on Escape while it's open.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  // Distance between adjacent cards (card width + gap), measured live so it
  // stays correct across breakpoints.
  const step = () => {
    const kids = track.current?.children;
    if (!kids || kids.length === 0) return 0;
    if (kids.length > 1) return kids[1].offsetLeft - kids[0].offsetLeft;
    return kids[0].offsetWidth;
  };

  const go = (d) => {
    const w = step();
    if (w) track.current?.scrollBy({ left: d * w, behavior: "smooth" });
  };
  const jump = (idx) => {
    const w = step();
    if (w) track.current?.scrollBy({ left: (idx - i) * w, behavior: "smooth" });
  };
  const onScroll = () => {
    const w = step();
    if (w) setI(Math.round((track.current?.scrollLeft ?? 0) / w));
  };

  return (
    <section className={styles.wrap} aria-label="Projects">
      <div className={styles.head}>
        <h2 className={styles.title}>Projects</h2>
        <div className={styles.controls}>
          <button onClick={() => go(-1)} aria-label="Previous project">←</button>
          <span className={styles.counter}>
            {i + 1} / {n}
          </span>
          <button onClick={() => go(1)} aria-label="Next project">→</button>
        </div>
      </div>

      <ol className={styles.track} ref={track} onScroll={onScroll}>
        {projects.map((p) => (
          <li className={styles.slide} key={p.name}>
            <ProjectMedia
              video={p.video}
              image={p.image}
              alt={p.name}
              onOpen={() => setLightbox({ video: p.video, name: p.name })}
            />

            <div className={styles.body}>
              <div className={styles.top}>
                <h3 className={styles.name}>{p.name}</h3>
                <span className={styles.period}>{p.period}</span>
              </div>

              <ul className={styles.bullets}>
                {p.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>

              {p.note && <p className={styles.note}>{p.note}</p>}

              <ul className={styles.tags}>
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>

              {p.links && (
                <div className={styles.links}>
                  {p.links.github && (
                    <a href={p.links.github} target="_blank" rel="noreferrer">
                      GitHub ↗
                    </a>
                  )}
                  {p.links.live && (
                    <a href={p.links.live} target="_blank" rel="noreferrer">
                      Live ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className={styles.dots}>
        {projects.map((proj, d) => (
          <button
            key={proj.name}
            className={d === i ? styles.dotActive : styles.dot}
            onClick={() => jump(d)}
            aria-label={`Go to project ${d + 1}`}
            aria-current={d === i ? "true" : undefined}
          />
        ))}
      </div>

      {lightbox && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${lightbox.name} video`}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={() => setLightbox(null)}
            aria-label="Close video"
          >
            ✕
          </button>
          <video
            className={styles.lightboxVideo}
            src={lightbox.video}
            controls
            autoPlay
            playsInline
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
