"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import styles from "./ShipCabin.module.css";

// Client-only WebGL view through the window.
const PortholeScene = dynamic(() => import("./PortholeScene"), { ssr: false });

// Reframes the Work page as a first-person "at my desk" scene:
//   .back  (z 0)  — dark cabin interior with a LARGE window (upper area) showing
//                   space; sits behind the journal so the journal occludes it.
//   .frame (z 40) — the desk/console surface in the foreground along the bottom.
// The journal (LogTerminal) is the shrunken document sitting between them.
export default function ShipCabin() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const on = shown ? styles.shown : "";

  return (
    <>
      {/* dark interior + the big forward window, behind the journal */}
      <div className={`${styles.back} ${on}`} aria-hidden="true">
        <div className={styles.window}>
          <div className={styles.windowGlass}>
            <PortholeScene />
          </div>
          <div className={styles.mullionH} />
          <div className={styles.mullionV} />
          <div className={styles.windowFrame} />
          <span className={`${styles.wBracket} ${styles.wTL}`} />
          <span className={`${styles.wBracket} ${styles.wTR}`} />
          <span className={`${styles.wBracket} ${styles.wBL}`} />
          <span className={`${styles.wBracket} ${styles.wBR}`} />
          <div className={styles.windowLabel}>VIEWPORT · FORWARD</div>
        </div>

        {/* the desk surface the journal sits ON — a solid tabletop on the same
            tilted plane as the journal. Props are its children so they lie flat
            on that same plane, off to the sides where the journal doesn't cover. */}
        <div className={styles.deskSurface}>
          {/* left margin */}
          <div className={styles.propPlant} />
          <div className={styles.propSlates} />
          <div className={styles.propMug} />
          <div className={styles.propPuck} />
          <div className={styles.propPen} />
          <div className={styles.propStylus} />
          {/* right margin */}
          <div className={styles.propComm} />
          <div className={styles.deskObject} />
          <div className={styles.propCable} />
          <div className={styles.propHolo} />
          <div className={styles.propMonitor} />
          <div className={styles.deckLights}>
            <span className={`${styles.deckLed} ${styles.deckLedOn}`} />
            <span className={styles.deckLed} />
            <span className={`${styles.deckLed} ${styles.deckLedOn}`} />
          </div>
          {/* front control strip near the viewer */}
          <div className={styles.propKeyboard} />
        </div>
      </div>

      {/* the near front edge / lip of the desk (its thickness) — the ONLY part of
          the desk in the foreground; the tabletop itself sits behind the journal */}
      <div className={`${styles.frame} ${on}`} aria-hidden="true">
        <div className={styles.ambientGlow} />
        <div className={styles.deskFront} />
      </div>
    </>
  );
}
