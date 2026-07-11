"use client";

import { usePathname } from "next/navigation";
import Galaxy from "./Galaxy";
import Nebula from "./Nebula";
import PlanetSurface from "./PlanetSurface";
import ShipWindow from "./ShipWindow";
import CaptainsLog from "./CaptainsLog";
import FloatingStars from "./FloatingStars";
import ContactVoid from "./ContactVoid";

// Contact gets its own deep-void atmosphere; About gets a soft, receding nebula
// that stays out of the reading column; Now puts you on a planet surface looking
// at the sky; every other page shares the galaxy (spiral disc). The layered red
// shooting stars ride along on all of them for depth.
function Backdrop({ pathname }) {
  if (pathname === "/about") return <Nebula />;
  if (pathname === "/now") return <PlanetSurface />;
  // Work page reads like a ship's log/archive rather than open galaxy — this
  // also replaces the bright galaxy streak that used to cross behind the cards.
  if (pathname === "/projects") return <CaptainsLog />;
  return <Galaxy />;
}

export default function SiteBackdrop() {
  const pathname = usePathname();
  if (pathname === "/contact") return <ContactVoid />;
  // /skills gets the cockpit-window starfield on its own — no red shooting stars,
  // so nothing bright ever streaks across the skill orbs in the center.
  if (pathname === "/skills") return <ShipWindow />;
  return (
    <>
      <Backdrop pathname={pathname} />
      <FloatingStars />
    </>
  );
}
