"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import styles from "./GalaxyNav.module.css";

// The launchpad destinations, as orbiting bodies. Colors drawn from the galaxy
// palette (violet / indigo / cyan / red / magenta).
const NAV = [
  { label: "Projects", href: "/projects", color: 0x7c3aed },
  { label: "About", href: "/about", color: 0x4338ca },
  { label: "Skills", href: "/skills", color: 0x21e6ff },
  { label: "Writing", href: "/writing", color: 0xff1744 },
  { label: "Contact", href: "/contact", color: 0xd633ff },
];

const RADIUS = 3.2;
const TILT = 0.5; // vertical squash → reads as an orbital plane, not a flat circle

// Central glowing core the destinations orbit around.
function Core({ reduced }) {
  const mesh = useRef();
  const wire = useRef();
  useFrame((_, delta) => {
    if (reduced) return;
    if (mesh.current) mesh.current.rotation.y += delta * 0.2;
    if (wire.current) {
      wire.current.rotation.y -= delta * 0.08;
      wire.current.rotation.x += delta * 0.04;
    }
  });
  return (
    <group>
      <mesh ref={mesh}>
        <sphereGeometry args={[1.05, 48, 48]} />
        <meshStandardMaterial
          color={0x2a1a5e}
          emissive={0x7c3aed}
          emissiveIntensity={0.9}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>
      <mesh ref={wire} scale={1.28}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color={0x21e6ff} wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

// One orbiting destination. Position is recomputed each frame from a shared
// rotation value so the label (offset straight below) always stays upright and
// readable — the interactive target is the label, not the moving sphere.
function Planet({ item, index, count, rotRef, hovered, setHovered, reduced }) {
  const grp = useRef();
  const mesh = useRef();
  const isHovered = hovered === index;
  const baseAngle = (index / count) * Math.PI * 2;

  useFrame((_, delta) => {
    const a = baseAngle + rotRef.current;
    if (grp.current) {
      grp.current.position.x = Math.cos(a) * RADIUS;
      grp.current.position.y = Math.sin(a) * RADIUS * TILT;
      grp.current.position.z = Math.sin(a) * 0.7; // subtle front/back depth
    }
    if (mesh.current) {
      const target = isHovered ? 1.5 : 1;
      mesh.current.scale.setScalar(
        THREE.MathUtils.damp(mesh.current.scale.x, target, 8, delta)
      );
      if (!reduced) mesh.current.rotation.y += delta * 0.5;
      const mat = mesh.current.material;
      mat.emissiveIntensity = THREE.MathUtils.damp(
        mat.emissiveIntensity,
        isHovered ? 1.7 : 0.7,
        8,
        delta
      );
    }
  });

  return (
    <group ref={grp}>
      <mesh ref={mesh}>
        <sphereGeometry args={[0.52, 32, 32]} />
        <meshStandardMaterial
          color={item.color}
          emissive={item.color}
          emissiveIntensity={0.7}
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>
      <Html center position={[0, -1, 0]} zIndexRange={[20, 0]}>
        <Link
          href={item.href}
          className={`${styles.chip} ${isHovered ? styles.chipActive : ""}`}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
        >
          {item.label}
        </Link>
      </Html>
    </group>
  );
}

function Scene({ hovered, setHovered, reduced }) {
  const rotRef = useRef(0);
  useFrame((_, delta) => {
    // orbit advances unless reduced-motion or the user is hovering a destination
    if (!reduced && hovered === null) rotRef.current += delta * 0.12;
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[6, 6, 8]} intensity={1.2} color="#bcd0ff" />
      <pointLight position={[-8, -4, 4]} intensity={0.8} color="#21e6ff" />

      <Core reduced={reduced} />
      {NAV.map((item, i) => (
        <Planet
          key={item.href}
          item={item}
          index={i}
          count={NAV.length}
          rotRef={rotRef}
          hovered={hovered}
          setHovered={setHovered}
          reduced={reduced}
        />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.7}
        rotateSpeed={0.4}
      />
    </>
  );
}

export default function GalaxyNav() {
  const [hovered, setHovered] = useState(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  return (
    <div className={styles.wrap}>
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 50, position: [0, 1.6, 8.4] }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene hovered={hovered} setHovered={setHovered} reduced={reduced.current} />
      </Canvas>

      {/* minimal wordmark — the only text on the launchpad */}
      <div className={styles.overlay} aria-hidden="true">
        <p className={styles.wordmark}>Shayan Poigai</p>
      </div>

      {/* Accessible, non-3D fallback nav (also good for keyboard + no-WebGL). */}
      <nav className={styles.srNav}>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
