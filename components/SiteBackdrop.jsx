"use client";

import { usePathname } from "next/navigation";
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

export default function SiteBackdrop() {
  const pathname = usePathname();
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
