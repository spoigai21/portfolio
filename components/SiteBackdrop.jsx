"use client";

import { usePathname } from "next/navigation";
import Galaxy from "./Galaxy";
import Nebula from "./Nebula";
import PlanetSurface from "./PlanetSurface";
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
  return (
    <>
      <Backdrop pathname={pathname} />
      <FloatingStars />
    </>
  );
}
