"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const TWO_PI = Math.PI * 2;

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Soft round star sprite (same technique as the galaxy backdrop).
function makeSoftCircle() {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.45, "rgba(255,255,255,0.4)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// A quiet distant starfield in a spherical shell — the "space" the log interface
// is layered over. No bright galaxy disc; kept dim and cool.
function useStars(count = 1600) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cool = new THREE.Color("#9fb2ff");
    const cyan = new THREE.Color("#67e8ff");
    for (let i = 0; i < count; i++) {
      const r = 30 + Math.random() * 55;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * TWO_PI;
      positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(theta);
      const col = Math.random() < 0.18 ? cyan : cool;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [count]);
}

function Stars() {
  const reduced = prefersReduced();
  const sprite = useMemo(makeSoftCircle, []);
  const geo = useStars(1600);
  const ref = useRef();

  // barely-there drift so the record feels alive; frozen for reduced motion
  useFrame((_, delta) => {
    if (!reduced && ref.current) ref.current.rotation.y += delta * 0.006;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.85}
        sizeAttenuation
        map={sprite}
        alphaTest={0.01}
        transparent
        depthWrite={false}
        vertexColors
        opacity={0.6}
      />
    </points>
  );
}

export default function CaptainsLogScene() {
  return (
    <Canvas
      dpr={0.75}
      camera={{ fov: 55, position: [0, 0, 9], near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Stars />
    </Canvas>
  );
}
