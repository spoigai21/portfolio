"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import styles from "./BlackHole.module.css";

/* geometry constants — the disk plane is tilted so it reads as a real 3D disk */
const DISK_INNER = 1.35;
const DISK_OUTER = 3.5;
const DISK_TILT = [-1.15, 0, 0.22]; // euler; near edge dips, far edge lifts
const CORE_R = 1.0;

/* soft radial sprite reused for glows and particles (same trick as the hero) */
function makeSoftCircle() {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ---------- accretion disk shader ---------- *
 * Differential rotation (inner spins faster) + procedural turbulence, coloured
 * on a white-hot → amber → magenta → violet temperature gradient so it never
 * competes with the site's cyan. All motion lives in uTime, so a frozen uTime
 * gives the static reduced-motion version for free. */
const diskVertex = /* glsl */ `
  varying vec2 vLocal;
  void main() {
    vLocal = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const diskFragment = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  uniform float uInner;
  uniform float uOuter;
  varying vec2 vLocal;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  void main(){
    float r = length(vLocal);
    float t = (r - uInner) / (uOuter - uInner);   // 0 inner .. 1 outer
    if (t < 0.0 || t > 1.0) discard;
    float ang = atan(vLocal.y, vLocal.x);

    // differential rotation: inner bands sweep faster than outer bands
    float speed = mix(2.4, 0.55, t);
    float swirl = ang + uTime * speed;

    // layered noise → churning matter rather than a flat band
    float n = noise(vec2(swirl * 2.3, r * 3.0));
    n = mix(n, noise(vec2(swirl * 5.0, r * 6.5)), 0.5);
    float bands = 0.55 + 0.45 * sin(swirl * 3.0 + n * 6.2);
    float density = clamp(bands * (0.55 + 0.7 * n), 0.0, 1.4);

    // temperature gradient
    vec3 hot = vec3(1.0, 0.96, 0.88);
    vec3 amber = vec3(1.0, 0.55, 0.16);
    vec3 magenta = vec3(0.96, 0.16, 0.55);
    vec3 violet = vec3(0.42, 0.12, 0.72);
    vec3 col;
    if (t < 0.34)      col = mix(hot, amber, t / 0.34);
    else if (t < 0.67) col = mix(amber, magenta, (t - 0.34) / 0.33);
    else               col = mix(magenta, violet, (t - 0.67) / 0.33);

    // soft inner/outer falloff, brightest near the core
    float edge = smoothstep(0.0, 0.10, t) * (1.0 - smoothstep(0.72, 1.0, t));
    float bright = mix(2.6, 0.45, t) * edge * density;
    // faint relativistic beaming — one side reads brighter (approaching matter)
    bright *= 0.7 + 0.55 * (0.5 + 0.5 * sin(ang + 0.6));

    gl_FragColor = vec4(col * bright, edge * density);
  }
`;

function AccretionDisk({ reduced }) {
  const mat = useRef();
  const uniforms = useMemo(
    () => ({
      uTime: { value: reduced ? 0.6 : 0 },
      uInner: { value: DISK_INNER },
      uOuter: { value: DISK_OUTER },
    }),
    [reduced]
  );
  useFrame((_, delta) => {
    if (!reduced && mat.current) mat.current.uniforms.uTime.value += delta * 0.35;
  });
  return (
    <mesh>
      <ringGeometry args={[DISK_INNER, DISK_OUTER, 190, 1]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={diskVertex}
        fragmentShader={diskFragment}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ---------- photon-ring rim ---------- *
 * Fresnel halo brightest at the silhouette (same corona trick as the hero sun)
 * so the core separates from the dark page. uStrength pulses subtly. */
const rimVertex = /* glsl */ `
  varying vec3 vN;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const rimFragment = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vN;
  varying vec3 vView;
  void main() {
    float f = pow(1.0 - max(dot(vN, vView), 0.0), 4.2); // thin, edge-hugging
    gl_FragColor = vec4(uColor, f * uStrength);
  }
`;

function PhotonRim({ reduced }) {
  const mat = useRef();
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#fff4e0") },
      uStrength: { value: 1.5 },
    }),
    []
  );
  useFrame((state) => {
    if (!reduced && mat.current) {
      mat.current.uniforms.uStrength.value =
        1.45 + 0.35 * Math.sin(state.clock.elapsedTime * 1.4);
    }
  });
  return (
    <mesh scale={1.04}>
      <sphereGeometry args={[CORE_R, 64, 64]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={rimVertex}
        fragmentShader={rimFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ---------- event horizon ---------- *
 * Pure black, unlit, opaque: it occludes whatever passes behind it, reading as
 * an absence of light rather than a black-painted ball. */
function EventHorizon() {
  return (
    <mesh>
      <sphereGeometry args={[CORE_R, 64, 64]} />
      <meshBasicMaterial color={0x000000} toneMapped={false} />
    </mesh>
  );
}

/* ---------- lensed "Einstein" ring ---------- *
 * A camera-facing bright ring larger than the core. Because it isn't occluded
 * by the horizon, its top and bottom arcs stand in for accretion-disk light
 * lensed up and over from behind — the cheap gravitational-lensing cheat. */
function LensRing({ reduced }) {
  const ring = useRef();
  useFrame((state) => {
    if (!reduced && ring.current) {
      const s = 1 + 0.02 * Math.sin(state.clock.elapsedTime * 1.4);
      ring.current.scale.set(s, s, s);
    }
  });
  return (
    <mesh ref={ring}>
      <torusGeometry args={[CORE_R * 1.16, 0.045, 16, 190]} />
      <meshBasicMaterial
        color={0xffdca8}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ---------- infalling particles ---------- *
 * Points spiralling inward on the disk plane (parent group applies the tilt).
 * Inner particles rotate faster; on capture they respawn at the outer edge. */
function Infall({ sprite, reduced }) {
  const COUNT = 240;
  const points = useRef();
  const state = useRef(null);

  const geo = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const radii = new Float32Array(COUNT);
    const angles = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const r = DISK_INNER + Math.random() * (DISK_OUTER - DISK_INNER);
      const a = Math.random() * Math.PI * 2;
      radii[i] = r;
      angles[i] = a;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.sin(a) * r;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
    }
    state.current = { radii, angles };
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((_, delta) => {
    if (reduced || !points.current) return;
    const dt = Math.min(delta, 0.05);
    const { radii, angles } = state.current;
    const pos = points.current.geometry.attributes.position;
    for (let i = 0; i < COUNT; i++) {
      // inner orbits sweep faster; matter slowly drains inward
      angles[i] += (dt * 0.9) / (radii[i] * 0.5);
      radii[i] -= dt * (0.12 + 0.35 / radii[i]);
      if (radii[i] <= CORE_R * 1.02) {
        radii[i] = DISK_OUTER * (0.85 + Math.random() * 0.15);
        angles[i] = Math.random() * Math.PI * 2;
      }
      pos.array[i * 3] = Math.cos(angles[i]) * radii[i];
      pos.array[i * 3 + 1] = Math.sin(angles[i]) * radii[i];
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={points} geometry={geo}>
      <pointsMaterial
        size={0.075}
        map={sprite}
        color={0xffe0b0}
        transparent
        opacity={0.85}
        sizeAttenuation
        alphaTest={0.01}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

/* ---------- lensed starfield ---------- *
 * Stars on a distant shell; those projecting near the core are brightened to
 * fake light being bent/piled up around the event horizon. */
function Starfield({ sprite }) {
  const geo = useMemo(() => {
    const COUNT = 620;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const col = new THREE.Color();
    const palette = ["#cdd8ff", "#ffffff", "#ffe6c4", "#dcecff"];
    for (let i = 0; i < COUNT; i++) {
      const r = 22 + Math.random() * 40;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      // lensing cheat: brighten stars whose line of sight grazes the core
      const proj = Math.hypot(x, y) / r;
      const lens = z < 0 ? 1 + 1.6 * Math.pow(1 - proj, 3.0) : 1;
      col.set(palette[(Math.random() * palette.length) | 0]);
      const b = Math.min(1, (0.45 + Math.random() * 0.5) * lens);
      colors[i * 3] = col.r * b;
      colors[i * 3 + 1] = col.g * b;
      colors[i * 3 + 2] = col.b * b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, []);

  return (
    <points geometry={geo}>
      <pointsMaterial
        size={0.16}
        map={sprite}
        sizeAttenuation
        transparent
        alphaTest={0.01}
        depthWrite={false}
        vertexColors
      />
    </points>
  );
}

function Scene({ reduced }) {
  const system = useRef();
  const sprite = useMemo(() => makeSoftCircle(), []);

  useFrame((state) => {
    if (reduced || !system.current) return;
    // slow hypnotic drift/wobble of the whole system
    const t = state.clock.elapsedTime;
    system.current.rotation.z = 0.03 * Math.sin(t * 0.12);
    system.current.rotation.x = 0.025 * Math.sin(t * 0.09);
    system.current.position.y = 0.06 * Math.sin(t * 0.15);
  });

  return (
    <>
      <ambientLight intensity={0.12} />
      <pointLight position={[-6, 3, 4]} intensity={0.4} color="#b98cff" />

      <Starfield sprite={sprite} />

      {/* faint blue-white glow pooling behind the core → separation + lensing */}
      <sprite position={[0, 0, -0.6]} scale={[7.5, 7.5, 1]}>
        <spriteMaterial
          map={sprite}
          color="#4a6cff"
          transparent
          opacity={0.28}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      <group ref={system}>
        <EventHorizon />
        <PhotonRim reduced={reduced} />
        <LensRing reduced={reduced} />

        {/* the disk + its infalling matter share one tilted plane */}
        <group rotation={DISK_TILT}>
          <AccretionDisk reduced={reduced} />
          <Infall sprite={sprite} reduced={reduced} />
        </group>
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 1.7}
        rotateSpeed={0.4}
      />
    </>
  );
}

export default function BlackHole() {
  const reduced = useRef(false);
  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  return (
    <div className={styles.canvas}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ fov: 45, position: [0, 1.5, 6] }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene reduced={reduced.current} />
      </Canvas>
    </div>
  );
}
