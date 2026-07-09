"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import styles from "./GalaxyNav.module.css";

// Each destination is a planet with its own character, size, and orbit.
// Orbits are roughly Keplerian: inner planets sweep faster than outer ones.
// radius = orbital radius; size = planet radius; phase = starting angle.
const PLANETS = [
  { label: "Contact", href: "/contact", type: "molten", size: 0.42, radius: 1.25, phase: 3.0 },
  { label: "Writing", href: "/writing", type: "rock", size: 0.5, radius: 1.95, phase: 5.4 },
  { label: "Skills", href: "/skills", type: "ice", size: 0.44, radius: 2.7, phase: 4.0 },
  { label: "About", href: "/about", type: "emerald", size: 0.58, radius: 3.5, phase: 2.1 },
  { label: "Projects", href: "/projects", type: "gas", size: 0.88, radius: 4.5, phase: 0.3 },
];

// Orbital angular speed ω = K / radius^1.5 (Kepler). K tuned so the innermost
// planet takes ~20s per revolution and the outermost drifts much slower.
const K = 0.42;
const orbitalSpeed = (r) => K / Math.pow(r, 1.5);

/* ---------- procedural surface textures (canvas → THREE texture) ---------- */
function finish(canvas) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

function newCanvas(size = 256) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  return c;
}

// Horizontal latitude bands → gas giant.
function makeGasTexture() {
  const s = 256;
  const c = newCanvas(s);
  const ctx = c.getContext("2d");
  const bands = ["#c9a06a", "#e6c98f", "#a9743f", "#d9b47a", "#8a5a34", "#e0bd85", "#b98a55"];
  const n = 16;
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = bands[i % bands.length];
    ctx.fillRect(0, Math.floor((i / n) * s), s, Math.ceil(s / n) + 1);
  }
  // faint turbulence streaks
  for (let k = 0; k < 4000; k++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`;
    ctx.fillRect(Math.random() * s, Math.random() * s, 2 + Math.random() * 3, 1);
  }
  return finish(c);
}

// Base fill + soft blotches → rocky / icy / emerald bodies.
function makeNoiseTexture(base, dark, light) {
  const s = 256;
  const c = newCanvas(s);
  const ctx = c.getContext("2d");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, s, s);
  const blob = (color, count, maxR, maxA) => {
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * maxR;
      ctx.globalAlpha = Math.random() * maxA;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(Math.random() * s, Math.random() * s, r, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  blob(dark, 900, 10, 0.5);
  blob(light, 500, 6, 0.4);
  ctx.globalAlpha = 1;
  return finish(c);
}

// Dark rock with bright veins → molten world (used as map + emissiveMap).
function makeMoltenTexture() {
  const s = 256;
  const c = newCanvas(s);
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#1a0a06";
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 1600; i++) {
    const r = 1 + Math.random() * 5;
    ctx.globalAlpha = Math.random() * 0.9;
    ctx.fillStyle = Math.random() < 0.5 ? "#ff6a00" : "#ffd070";
    ctx.beginPath();
    ctx.arc(Math.random() * s, Math.random() * s, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  return finish(c);
}

// Soft round sprite for the sun glow + stars.
function makeSoftCircle() {
  const s = 64;
  const c = newCanvas(s);
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  return finish(c);
}

/* ---------- sun ---------- */
function Sun({ glow, reduced }) {
  const core = useRef();
  useFrame((_, delta) => {
    if (!reduced && core.current) core.current.rotation.y += delta * 0.15;
  });
  return (
    <group>
      {/* the light source itself: no falloff so every orbit is clearly lit */}
      <pointLight position={[0, 0, 0]} intensity={3} decay={0} color="#ffdca8" />
      <mesh ref={core}>
        <sphereGeometry args={[0.95, 48, 48]} />
        <meshStandardMaterial
          color="#ff9d3c"
          emissive="#ffb64d"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      {/* soft additive halo → glowing falloff */}
      <sprite scale={[5.2, 5.2, 1]}>
        <spriteMaterial
          map={glow}
          color="#ffb64d"
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}

/* ---------- one orbiting planet (a navigation destination) ---------- */
function usePlanetMaterial(type) {
  return useMemo(() => {
    switch (type) {
      case "gas":
        return { map: makeGasTexture(), roughness: 0.7, metalness: 0.0 };
      case "rock":
        return {
          map: makeNoiseTexture("#9c4a24", "#5f2a12", "#c67a4a"),
          roughness: 0.95,
          metalness: 0.0,
        };
      case "ice":
        return {
          map: makeNoiseTexture("#bcd8ef", "#7fa8cf", "#ffffff"),
          roughness: 0.35,
          metalness: 0.05,
        };
      case "emerald":
        return {
          map: makeNoiseTexture("#14663f", "#0a3a24", "#3fbf86"),
          roughness: 0.6,
          metalness: 0.1,
        };
      case "molten": {
        const t = makeMoltenTexture();
        return {
          map: t,
          emissiveMap: t,
          emissive: "#ff6a00",
          emissiveIntensity: 1.4,
          roughness: 0.8,
          metalness: 0.0,
        };
      }
      default:
        return { map: null, roughness: 0.6, metalness: 0.0 };
    }
  }, [type]);
}

function Planet({ planet, index, rotRef, hovered, setHovered, reduced }) {
  const grp = useRef();
  const mesh = useRef();
  const isHovered = hovered === index;
  const mat = usePlanetMaterial(planet.type);
  const speed = useMemo(() => orbitalSpeed(planet.radius), [planet.radius]);

  useFrame((_, delta) => {
    // orbit in the XZ plane (a flat disc viewed slightly from above)
    const a = planet.phase + rotRef.current * speed;
    if (grp.current) {
      grp.current.position.x = Math.cos(a) * planet.radius;
      grp.current.position.z = Math.sin(a) * planet.radius;
    }
    if (mesh.current) {
      if (!reduced) mesh.current.rotation.y += delta * 0.4;
      const target = isHovered ? 1.45 : 1;
      mesh.current.scale.setScalar(
        THREE.MathUtils.damp(mesh.current.scale.x, target, 8, delta)
      );
    }
  });

  return (
    <group ref={grp}>
      <mesh ref={mesh}>
        <sphereGeometry args={[planet.size, 48, 48]} />
        <meshStandardMaterial
          map={mat.map}
          emissive={mat.emissive || "#000000"}
          emissiveMap={mat.emissiveMap || null}
          emissiveIntensity={mat.emissiveIntensity || 0}
          roughness={mat.roughness}
          metalness={mat.metalness}
        />
      </mesh>

      {/* Saturn-style ring on the gas giant */}
      {planet.type === "gas" && (
        <mesh rotation={[-Math.PI / 2 + 0.5, 0, 0.15]}>
          <ringGeometry args={[planet.size * 1.4, planet.size * 2.2, 64]} />
          <meshBasicMaterial
            color="#d9b47a"
            side={THREE.DoubleSide}
            transparent
            opacity={0.45}
            depthWrite={false}
          />
        </mesh>
      )}

      <Html center position={[0, -(planet.size + 0.5), 0]} zIndexRange={[20, 0]}>
        <Link
          href={planet.href}
          className={`${styles.chip} ${isHovered ? styles.chipActive : ""}`}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
        >
          {planet.label}
        </Link>
      </Html>
    </group>
  );
}

/* ---------- faint orbital path rings ---------- */
function OrbitPaths() {
  return (
    <>
      {PLANETS.map((p) => (
        <mesh key={p.href} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[p.radius - 0.012, p.radius + 0.012, 128]} />
          <meshBasicMaterial
            color="#21e6ff"
            side={THREE.DoubleSide}
            transparent
            opacity={0.12}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

/* ---------- local starfield with varied sizes + brightness ---------- */
function useStarLayer(count, rMin, rMax, palette) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const col = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = rMin + Math.random() * (rMax - rMin);
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(theta);
      col.set(palette[(Math.random() * palette.length) | 0]);
      const b = 0.5 + Math.random() * 0.5; // brightness variation
      colors[i * 3] = col.r * b;
      colors[i * 3 + 1] = col.g * b;
      colors[i * 3 + 2] = col.b * b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [count, rMin, rMax, palette]);
}

function Starfield({ sprite }) {
  const small = useStarLayer(700, 14, 42, ["#c8d4ff", "#ffffff", "#ffd9b0"]);
  const big = useStarLayer(70, 12, 34, ["#ffffff", "#bcd0ff"]);
  return (
    <>
      <points geometry={small}>
        <pointsMaterial size={0.09} sizeAttenuation map={sprite} alphaTest={0.01} transparent depthWrite={false} vertexColors />
      </points>
      <points geometry={big}>
        <pointsMaterial size={0.22} sizeAttenuation map={sprite} alphaTest={0.01} transparent depthWrite={false} vertexColors />
      </points>
    </>
  );
}

function Scene({ hovered, setHovered, reduced }) {
  const rotRef = useRef(0);
  const glow = useMemo(() => makeSoftCircle(), []);

  useFrame((_, delta) => {
    // shared clock advances unless reduced-motion or the user is hovering
    if (!reduced && hovered === null) rotRef.current += delta;
  });

  return (
    <>
      <ambientLight intensity={0.14} />
      {/* faint cyan rim fill for galaxy cohesion */}
      <directionalLight position={[-6, 3, -4]} intensity={0.25} color="#21e6ff" />

      <Starfield sprite={glow} />
      <Sun glow={glow} reduced={reduced} />
      <OrbitPaths />

      {PLANETS.map((p, i) => (
        <Planet
          key={p.href}
          planet={p}
          index={i}
          rotRef={rotRef}
          hovered={hovered}
          setHovered={setHovered}
          reduced={reduced}
        />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.15}
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
        camera={{ fov: 46, position: [0, 6, 11] }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene hovered={hovered} setHovered={setHovered} reduced={reduced.current} />
      </Canvas>

      {/* minimal wordmark — the only text on the launchpad */}
      <div className={styles.overlay} aria-hidden="true">
        <p className={styles.wordmark}>Shayan Poigai</p>
      </div>

      {/* Accessible, non-3D fallback nav (keyboard + no-WebGL). */}
      <nav className={styles.srNav}>
        {PLANETS.map((p) => (
          <Link key={p.href} href={p.href}>
            {p.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
