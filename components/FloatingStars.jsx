"use client";

import dynamic from "next/dynamic";

// Client-only: WebGL canvases must not run during SSR.
const StarField = dynamic(() => import("./StarField"), { ssr: false });

// Two synchronized layers so the orbs weave behind and in front of the text.
export default function FloatingStars() {
  return (
    <>
      <StarField layer="back" />
      <StarField layer="front" />
    </>
  );
}
