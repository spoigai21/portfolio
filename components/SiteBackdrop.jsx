"use client";

import { usePathname } from "next/navigation";
import Galaxy from "./Galaxy";
import FloatingStars from "./FloatingStars";
import ContactVoid from "./ContactVoid";

// Contact gets its own deep-void atmosphere; every other page shares the galaxy
// (spiral disc + red shooting stars).
export default function SiteBackdrop() {
  const pathname = usePathname();
  if (pathname === "/contact") return <ContactVoid />;
  return (
    <>
      <Galaxy />
      <FloatingStars />
    </>
  );
}
