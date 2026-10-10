"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import CanvasBoundary from "./CanvasBoundary";
import Galaxy from "./Galaxy";
import Nebula from "./Nebula";
import PlanetSurface from "./PlanetSurface";
import ShipWindow from "./ShipWindow";
import ShipCabin from "./ShipCabin";
import FloatingStars from "./FloatingStars";
import ContactVoid from "./ContactVoid";

// Contact gets its own deep-void atmosphere; About gets a soft, receding nebula
// that stays out of the reading column; Now puts you on a planet surface looking
// at the sky; every other page shares the galaxy (spiral disc). The layered red
// shooting stars ride along on all of them for depth.
function Backdrop({ pathname }) {
  if (pathname === "/about") return <Nebula />;
  if (pathname === "/now") return <PlanetSurface />;
  return <Galaxy />;
}

// The phone homepage is a flat, high-contrast document (see
// HomeIntro.module.css) — a galaxy behind that text is noise, not atmosphere,
// so phones get no backdrop on "/" at all. Every other route keeps its scene.
function useMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(
      "(hover: none) and (pointer: coarse), (max-width: 640px), (max-height: 520px), (max-aspect-ratio: 9/10)"
    );
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return mobile;
}

function Chooser() {
  const pathname = usePathname();
  const mobile = useMobile();
  if (mobile && pathname === "/") return null;
  if (pathname === "/contact") return <ContactVoid />;
  // /skills gets the cockpit-window starfield on its own — no red shooting stars,
  // so nothing bright ever streaks across the skill orbs in the center.
  if (pathname === "/skills") return <ShipWindow />;
  // Work page is the interior of a ship — enclosed cabin with a porthole. No
  // full-screen starfield or shooting stars; space shows only through the window.
  if (pathname === "/work") return <ShipCabin />;
  return (
    <>
      <Backdrop pathname={pathname} />
      <FloatingStars />
    </>
  );
}

// The backdrop renders on every page, so a WebGL failure here would otherwise
// take down every route's content, not just the decoration.
export default function SiteBackdrop() {
  return (
    <CanvasBoundary>
      <Chooser />
    </CanvasBoundary>
  );
}
