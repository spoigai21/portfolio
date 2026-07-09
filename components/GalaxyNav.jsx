"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Center, Html, OrbitControls, Text3D } from "@react-three/drei";
import * as THREE from "three";
import { profile } from "@/lib/content";
import styles from "./GalaxyNav.module.css";

// Destinations as planets. Orbits are spread wide so the sun sits clearly alone
// at the center and the labels never crowd each other. Roughly Keplerian:
// inner planets sweep faster than outer ones.
const PLANETS = [
  { label: "Contact", href: "/contact", type: "molten", size: 0.42, radius: 2.4, phase: 3.0 },
  { label: "Writing", href: "/writing", type: "rock", size: 0.5, radius: 3.6, phase: 5.4 },
  { label: "Skills", href: "/skills", type: "ice", size: 0.46, radius: 4.8, phase: 0.6 },
  { label: "About", href: "/about", type: "emerald", size: 0.6, radius: 6.0, phase: 2.4 },
  { label: "Projects", href: "/projects", type: "gas", size: 0.9, radius: 7.5, phase: 4.6 },
];

// ω = K / radius^1.5 (Kepler); K tuned for a calm inner ~25s/rev.
const K = 0.9;
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
  for (let k = 0; k < 4000; k++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`;
    ctx.fillRect(Math.random() * s, Math.random() * s, 2 + Math.random() * 3, 1);
  }
  return finish(c);
}
function makeNoiseTexture(base, dark, light) {
  const s = 256;
  const c = newCanvas(s);
  const ctx = c.getContext("2d");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, s, s);
  const blob = (color, count, maxR, maxA) => {
    for (let i = 0; i < count; i++) {
      ctx.globalAlpha = Math.random() * maxA;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(Math.random() * s, Math.random() * s, 2 + Math.random() * maxR, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  blob(dark, 900, 10, 0.5);
  blob(light, 500, 6, 0.4);
  ctx.globalAlpha = 1;
  return finish(c);
}
function makeMoltenTexture() {
  const s = 256;
  const c = newCanvas(s);
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#1a0a06";
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 1600; i++) {
    ctx.globalAlpha = Math.random() * 0.9;
    ctx.fillStyle = Math.random() < 0.5 ? "#ff6a00" : "#ffd070";
    ctx.beginPath();
    ctx.arc(Math.random() * s, Math.random() * s, 1 + Math.random() * 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  return finish(c);
}
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

/* ---------- 3D name floating above the system ---------- */
function HeroName() {
  return (
    <Billboard position={[0, 6, 0]}>
      <Suspense fallback={null}>
        <Center>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={0.62}
            height={0.16}
            bevelEnabled
            bevelSize={0.012}
            bevelThickness={0.02}
            bevelSegments={2}
            curveSegments={5}
          >
            {profile.name}
            <meshStandardMaterial
              color="#0a2a30"
              emissive="#21e6ff"
              emissiveIntensity={0.9}
              roughness={0.35}
              metalness={0.4}
            />
          </Text3D>
        </Center>
      </Suspense>
    </Billboard>
  );
}

/* ---------- sun ---------- */
function Sun({ glow, reduced }) {
  const core = useRef();
  useFrame((_, delta) => {
    if (!reduced && core.current) core.current.rotation.y += delta * 0.15;
  });
  return (
    <group>
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

/* ---------- one orbiting planet = a clickable destination ---------- */
function usePlanetMaterial(type) {
  return useMemo(() => {
    switch (type) {
      case "gas":
        return { map: makeGasTexture(), roughness: 0.7, metalness: 0.0 };
      case "rock":
        return { map: makeNoiseTexture("#9c4a24", "#5f2a12", "#c67a4a"), roughness: 0.95, metalness: 0.0 };
      case "ice":
        return { map: makeNoiseTexture("#bcd8ef", "#7fa8cf", "#ffffff"), roughness: 0.35, metalness: 0.05 };
      case "emerald":
        return { map: makeNoiseTexture("#14663f", "#0a3a24", "#3fbf86"), roughness: 0.6, metalness: 0.1 };
      case "molten": {
        const t = makeMoltenTexture();
        return { map: t, emissiveMap: t, emissive: "#ff6a00", emissiveIntensity: 1.4, roughness: 0.8, metalness: 0.0 };
      }
      default:
        return { map: null, roughness: 0.6, metalness: 0.0 };
    }
  }, [type]);
}

function Planet({ planet, index, rotRef, hovered, setHovered, reduced }) {
  const grp = useRef();
  const mesh = useRef();
  const router = useRouter();
  const isHovered = hovered === index;
  const mat = usePlanetMaterial(planet.type);
  const speed = useMemo(() => orbitalSpeed(planet.radius), [planet.radius]);

  useFrame((_, delta) => {
    const a = planet.phase + rotRef.current * speed;
    if (grp.current) {
      grp.current.position.x = Math.cos(a) * planet.radius;
      grp.current.position.z = Math.sin(a) * planet.radius;
    }
    if (mesh.current) {
      if (!reduced) mesh.current.rotation.y += delta * 0.4;
      const target = isHovered ? 1.45 : 1;
      mesh.current.scale.setScalar(THREE.MathUtils.damp(mesh.current.scale.x, target, 8, delta));
    }
  });

  const go = () => router.push(planet.href);
  const enter = () => {
    document.body.style.cursor = "pointer";
    setHovered(index);
  };
  const leave = () => {
    document.body.style.cursor = "";
    setHovered(null);
  };

  return (
    <group ref={grp}>
      {/* the planet itself is the primary click target */}
      <mesh
        ref={mesh}
        onClick={(e) => {
          e.stopPropagation();
          go();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          enter();
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          leave();
        }}
      >
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

      {planet.type === "gas" && (
        <mesh rotation={[-Math.PI / 2 + 0.5, 0, 0.15]}>
          <ringGeometry args={[planet.size * 1.4, planet.size * 2.2, 64]} />
          <meshBasicMaterial color="#d9b47a" side={THREE.DoubleSide} transparent opacity={0.45} depthWrite={false} />
        </mesh>
      )}

      <Html center position={[0, -(planet.size + 0.55), 0]} zIndexRange={[20, 0]}>
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

function OrbitPaths() {
  return (
    <>
      {PLANETS.map((p) => (
        <mesh key={p.href} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[p.radius - 0.014, p.radius + 0.014, 160]} />
          <meshBasicMaterial color="#21e6ff" side={THREE.DoubleSide} transparent opacity={0.1} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

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
      const b = 0.5 + Math.random() * 0.5;
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
  const small = useStarLayer(700, 18, 46, ["#c8d4ff", "#ffffff", "#ffd9b0"]);
  const big = useStarLayer(70, 16, 40, ["#ffffff", "#bcd0ff"]);
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
    if (!reduced && hovered === null) rotRef.current += delta;
  });

  return (
    <>
      <ambientLight intensity={0.14} />
      <directionalLight position={[-6, 3, -4]} intensity={0.25} color="#21e6ff" />

      <Starfield sprite={glow} />
      <HeroName />
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
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <div className={styles.wrap}>
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 46, position: [0, 9, 17] }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene hovered={hovered} setHovered={setHovered} reduced={reduced.current} />
      </Canvas>

      {/* short, plain, present-tense line (the only 2D copy on the hero) */}
      <p className={styles.tagline}>{profile.now}</p>

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
