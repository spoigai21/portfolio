"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import HeroName from "./HeroName";
import styles from "./GalaxyNav.module.css";

// Destinations as planets. Every planet shares ONE angular speed, so the whole
// system rotates rigidly: the angle between any two planets stays fixed for all
// time, which makes their pairwise 3D distances constant. Combined with the
// even 72° phase spacing (2π/5) and the widening radii below, no two planets —
// and therefore no two labels — ever collide. Distinct inclinations tilt each
// orbit into its own band for depth without breaking that guarantee.
const TAU = Math.PI * 2;
const PLANETS = [
  { label: "Contact", href: "/contact", type: "molten", size: 0.46, radius: 3.4, phase: (0 * TAU) / 5, incl: 0.16 },
  { label: "Now", href: "/now", type: "rock", size: 0.54, radius: 4.9, phase: (1 * TAU) / 5, incl: -0.24 },
  { label: "Skills", href: "/skills", type: "ice", size: 0.5, radius: 6.4, phase: (2 * TAU) / 5, incl: 0.28 },
  { label: "About", href: "/about", type: "emerald", size: 0.64, radius: 7.9, phase: (3 * TAU) / 5, incl: -0.18 },
  { label: "Work", href: "/projects", type: "gas", size: 0.98, radius: 9.4, phase: (4 * TAU) / 5, incl: 0.12 },
];

// One constant angular velocity for every planet (rad/s) → a calm, rigid sweep
// (~90s/revolution) with no inner planet ever lapping an outer one.
const ANGULAR_SPEED = 0.07;
const orbitalSpeed = () => ANGULAR_SPEED;

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

// Concentric banded texture for a Saturn ring: opacity + shade variation and a
// couple of dark "divisions", so it reads as a real ring, not a flat disc.
// Maps onto ringGeometry(inner = size*1.5, outer = size*2.7): the annulus samples
// texture radius ~71..128px.
function makeRingTexture() {
  const s = 256;
  const c = newCanvas(s);
  const ctx = c.getContext("2d");
  const cx = s / 2;
  const rIn = 71;
  const rOut = 128;
  for (let rr = rIn; rr <= rOut; rr += 1) {
    const f = (rr - rIn) / (rOut - rIn); // 0 inner → 1 outer
    let alpha = 0.55 + 0.35 * Math.sin(f * Math.PI * 9);
    if ((f > 0.34 && f < 0.4) || (f > 0.68 && f < 0.73)) alpha *= 0.12; // divisions
    alpha = Math.max(0, Math.min(0.95, alpha));
    const shade = 205 + 35 * Math.sin(f * Math.PI * 6);
    ctx.strokeStyle = `rgba(${Math.round(shade)}, ${Math.round(shade * 0.82)}, ${Math.round(
      shade * 0.55
    )}, ${alpha.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(cx, cx, rr, 0, Math.PI * 2);
    ctx.stroke();
  }
  return finish(c);
}

/* ---------- sun ---------- */
// Shared vertex stage for the sun shaders: hands the fragment stage the world
// normal, the view direction (for the front→limb radial gradient), and the
// object-space position (for sampling 3D noise that churns with the body).
const sunVertex = /* glsl */ `
  varying vec3 vN;
  varying vec3 vView;
  varying vec3 vPos;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    vPos = position;
    gl_Position = projectionMatrix * mv;
  }
`;

// The star body. dot(normal, view) is ~1 on the part of the sphere facing the
// camera (the disc's centre) and ~0 at the limb, so it doubles as a radial
// coordinate: white-hot core → gold → deep orange at the edge. Layered fbm
// noise scrolls slowly for surface turbulence + granulation, and uPulse
// breathes the whole thing. Self-lit (no scene lighting) — it *is* the light.
const sunBodyFragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uPulse;
  uniform vec3 uCore;
  uniform vec3 uMid;
  uniform vec3 uEdge;
  varying vec3 vN;
  varying vec3 vView;
  varying vec3 vPos;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main() {
    float facing = max(dot(vN, vView), 0.0);           // 1 centre → 0 limb
    vec3 col = mix(uEdge, uMid, smoothstep(0.0, 0.55, facing));
    col = mix(col, uCore, smoothstep(0.6, 1.0, facing));

    // churning plasma: two octaves drifting in opposite directions
    float n1 = fbm(vPos * 2.6 + vec3(0.0, uTime * 0.14, 0.0));
    float n2 = fbm(vPos * 5.5 - vec3(uTime * 0.09, 0.0, 0.0));
    float turb = 0.55 * n1 + 0.45 * n2;
    col *= 0.78 + 0.5 * turb;                            // granulation
    col += uCore * smoothstep(0.72, 1.0, turb) * 0.5;    // bright hot cells

    col *= uPulse;                                       // slow breathing
    gl_FragColor = vec4(col, 1.0);
  }
`;

// Fresnel corona: brightest at the limb, extending past the body so the
// boundary dissolves into glow instead of a hard cut. uStrength shimmers.
const coronaFragment = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uStrength;
  varying vec3 vN;
  varying vec3 vView;
  varying vec3 vPos;
  void main() {
    float f = pow(1.0 - max(dot(vN, vView), 0.0), uPower);
    gl_FragColor = vec4(uColor, f * uStrength);
  }
`;

function Sun({ glow, reduced }) {
  const core = useRef();
  const bodyUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulse: { value: 1 },
      uCore: { value: new THREE.Color("#fff6e6") }, // near-white hot core
      uMid: { value: new THREE.Color("#ffc247") },  // gold
      uEdge: { value: new THREE.Color("#e04f10") }, // deep orange limb
    }),
    []
  );
  const coronaUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#ffb04d") },
      uPower: { value: 2.4 },
      uStrength: { value: 1.15 },
    }),
    []
  );
  useFrame((state, delta) => {
    if (reduced) return;
    if (core.current) core.current.rotation.y += delta * 0.05; // very slow churn
    bodyUniforms.uTime.value += delta;
    const t = state.clock.elapsedTime;
    bodyUniforms.uPulse.value = 1.0 + 0.06 * Math.sin(t * 0.5);        // breathing
    coronaUniforms.uStrength.value = 1.15 + 0.18 * Math.sin(t * 0.9);  // shimmer
  });
  return (
    <group>
      {/* the sun is the scene's key light — brightest source by a wide margin */}
      <pointLight position={[0, 0, 0]} intensity={4.6} decay={0} color="#ffdca8" />

      {/* hot emissive body — radial gradient + animated turbulence */}
      <mesh ref={core}>
        <sphereGeometry args={[0.95, 64, 64]} />
        <shaderMaterial
          uniforms={bodyUniforms}
          vertexShader={sunVertex}
          fragmentShader={sunBodyFragment}
          toneMapped={false}
        />
      </mesh>

      {/* fresnel corona hugging the limb, pushed past the surface */}
      <mesh scale={1.32}>
        <sphereGeometry args={[0.95, 48, 48]} />
        <shaderMaterial
          uniforms={coronaUniforms}
          vertexShader={sunVertex}
          fragmentShader={coronaFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* layered additive halos → strong bloom that dissolves the edge and
          extends well beyond the sphere, so it reads as a star, not a disc */}
      <sprite scale={[3.0, 3.0, 1]}>
        <spriteMaterial map={glow} color="#ffe6b8" transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <sprite scale={[5.6, 5.6, 1]}>
        <spriteMaterial map={glow} color="#ffc46a" transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <sprite scale={[11.0, 11.0, 1]}>
        <spriteMaterial map={glow} color="#ff8a3c" transparent opacity={0.28} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <sprite scale={[18.0, 18.0, 1]}>
        <spriteMaterial map={glow} color="#ff6a1e" transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
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

function Planet({ planet, index, rotRef, hovered, setHovered, reduced, glow }) {
  const grp = useRef();
  const mesh = useRef();
  const glowRef = useRef();
  const router = useRouter();
  const isHovered = hovered === index;
  const mat = usePlanetMaterial(planet.type);
  const ringTex = useMemo(
    () => (planet.type === "gas" ? makeRingTexture() : null),
    [planet.type]
  );
  const speed = useMemo(() => orbitalSpeed(planet.radius), [planet.radius]);

  useFrame((state, delta) => {
    // orbit tilted by the planet's inclination → each planet on its own band
    const a = planet.phase + rotRef.current * speed;
    if (grp.current) {
      const ex = Math.cos(a) * planet.radius;
      const ez = Math.sin(a) * planet.radius;
      grp.current.position.x = ex;
      grp.current.position.y = ez * Math.sin(planet.incl);
      grp.current.position.z = ez * Math.cos(planet.incl);
    }
    if (mesh.current) {
      if (!reduced) mesh.current.rotation.y += delta * 0.4;
      const target = isHovered ? 1.45 : 1;
      mesh.current.scale.setScalar(THREE.MathUtils.damp(mesh.current.scale.x, target, 8, delta));
    }
    if (glowRef.current) {
      // cyan aura that gently pulses → signals "this is interactive"
      const base = isHovered ? 0.42 : 0.25;
      const pulse = reduced ? 0 : 0.06 * Math.sin(state.clock.elapsedTime * 1.6 + planet.phase);
      glowRef.current.material.opacity = base + pulse;
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
      {/* faint cyan interactive aura (non-raycasting so it never blocks clicks) */}
      <sprite ref={glowRef} scale={[planet.size * 3.6, planet.size * 3.6, 1]} raycast={() => null}>
        <spriteMaterial map={glow} color="#21e6ff" transparent opacity={0.25} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>

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

      {/* banded, tilted Saturn ring */}
      {planet.type === "gas" && ringTex && (
        <mesh rotation={[-1.1, 0, 0.35]} raycast={() => null}>
          <ringGeometry args={[planet.size * 1.5, planet.size * 2.7, 96]} />
          <meshBasicMaterial map={ringTex} side={THREE.DoubleSide} transparent depthWrite={false} />
        </mesh>
      )}

      <Html center position={[0, -(planet.size + 0.6), 0]} zIndexRange={[20, 0]}>
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
        <mesh key={p.href} rotation={[Math.PI / 2 - p.incl, 0, 0]} raycast={() => null}>
          <ringGeometry args={[p.radius - 0.016, p.radius + 0.016, 160]} />
          <meshBasicMaterial color="#21e6ff" side={THREE.DoubleSide} transparent opacity={0.11} depthWrite={false} />
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
          glow={glow}
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
        camera={{ fov: 44, position: [0, 12, 23] }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene hovered={hovered} setHovered={setHovered} reduced={reduced.current} />
      </Canvas>

      {/* comet-written 3D-styled name overlay */}
      <HeroName />

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
