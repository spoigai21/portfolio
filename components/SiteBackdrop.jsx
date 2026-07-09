"use client";

import { usePathname } from "next/navigation";
import Galaxy from "./Galaxy";
import Nebula from "./Nebula";
import FloatingStars from "./FloatingStars";
import ContactVoid from "./ContactVoid";

// Contact gets its own deep-void atmosphere; About gets a soft, receding nebula
// that stays out of the reading column; every other page shares the galaxy
// (spiral disc + red shooting stars). The layered stars ride along on all of
// them for depth.
export default function SiteBackdrop() {
  const pathname = usePathname();
  if (pathname === "/contact") return <ContactVoid />;
  return (
    <>
      {pathname === "/about" ? <Nebula /> : <Galaxy />}
      <FloatingStars />
    </>
  );
}
