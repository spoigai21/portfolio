"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import styles from "./BasketballPlanet.module.css";

const BALL_R = 1.3;

// Four great-circle seams approximating a basketball's panel pattern.
// Each entry is an Euler rotation applied to a default (XY-plane) torus.
const SEAMS = [
  [Math.PI / 2, 0, 0], // equator
  [0, Math.PI / 2, 0], // vertical front
  [0, Math.PI / 2 + 0.9, 0], // curved side
  [0, Math.PI / 2 - 0.9, 0], // curved side
];

// The basketball rendered as a small glowing planet: emissive color cycles
// through the spectrum, seams stay dark, and it turns slowly.
function Ball({ reduced }) {
  const group = useRef();
  const ball = useRef();
  const hsl = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (!reduced && group.current) group.current.rotation.y += delta * 0.35;
    if (ball.current) {
      const mat = ball.current.material;
      const hue = reduced ? 0.58 : (t * 0.05) % 1; // cycle, or hold cyan-ish
      hsl.setHSL(hue, 0.75, 0.5);
      mat.emissive.copy(hsl);
      hsl.setHSL(hue, 0.7, 0.32);
      mat.color.copy(hsl);
    }
  });

  return (
    <group ref={group}>
      {/* glowing color-cycling body */}
      <mesh ref={ball}>
        <sphereGeometry args={[BALL_R, 64, 64]} />
        <meshStandardMaterial emissiveIntensity={1.1} roughness={0.45} metalness={0.2} />
      </mesh>

      {/* dark seams sitting just above the surface */}
      {SEAMS.map((rot, i) => (
        <mesh key={i} rotation={rot}>
          <torusGeometry args={[BALL_R * 1.002, 0.022, 16, 96]} />
          <meshBasicMaterial color={0x0a0510} />
        </mesh>
      ))}
    </group>
  );
}

// A faint tilted orbital ring behind/around the ball — celestial, not sporty.
function OrbitalRing({ reduced }) {
  const ring = useRef();
  useFrame((_, delta) => {
    if (!reduced && ring.current) ring.current.rotation.z += delta * 0.12;
  });
  return (
    <mesh ref={ring} rotation={[Math.PI / 2.2, 0, 0.35]}>
      <torusGeometry args={[2.15, 0.02, 16, 120]} />
      <meshBasicMaterial color={0x21e6ff} transparent opacity={0.5} toneMapped={false} />
    </mesh>
  );
}

function Scene({ reduced }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 6]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-6, -3, 3]} intensity={0.7} color="#21e6ff" />

      <Ball reduced={reduced} />
      <OrbitalRing reduced={reduced} />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
        rotateSpeed={0.5}
      />
    </>
  );
}

export default function BasketballPlanet() {
  const reduced = useRef(false);
  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  return (
    <div className={styles.canvas}>
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 45, position: [0, 0, 5.4] }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene reduced={reduced.current} />
      </Canvas>
    </div>
  );
}
