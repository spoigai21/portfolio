"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const TWO_PI = Math.PI * 2;

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- shared soft-circle sprite ---------- */
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

/* ---------- terrain silhouette + atmospheric rim ----------
   A very large, near-black sphere seated far below the camera reads as a gently
   curved planet horizon across the lower frame. A slightly larger concentric
   fresnel shell (same corona trick as the hero sun) glows only at its limb —
   which sits just above the terrain silhouette — giving a soft cyan→violet rim
   that hugs the curve and fades upward into the sky. */
const HORIZON_Y = -5; // world-space height of the silhouette near centre

const rimVertex = /* glsl */ `
  varying vec3 vN;
  varying vec3 vView;
  varying float vWorldY;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldY = wp.y;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const rimFragment = /* glsl */ `
  precision mediump float;
  uniform vec3 uLow;
  uniform vec3 uHigh;
  uniform float uPower;
  uniform float uStrength;
  uniform float uHorizon;
  uniform float uFade;
  varying vec3 vN;
  varying vec3 vView;
  varying float vWorldY;
  void main() {
    float f = pow(1.0 - max(dot(vN, vView), 0.0), uPower);   // limb glow
    float h = clamp((vWorldY - uHorizon) / uFade, 0.0, 1.0); // 0 horizon → 1 up
    vec3 col = mix(uLow, uHigh, smoothstep(0.0, 0.7, h));    // cyan → violet
    float a = f * uStrength * (1.0 - h);                     // fade upward
    gl_FragColor = vec4(col, a);
  }
`;

function Planet() {
  const rimUniforms = useMemo(
    () => ({
      uLow: { value: new THREE.Color("#21e6ff") },
      uHigh: { value: new THREE.Color("#7c3aed") },
      uPower: { value: 2.6 },
      uStrength: { value: 0.95 },
      uHorizon: { value: HORIZON_Y },
      uFade: { value: 16 },
    }),
    []
  );
  return (
    <group position={[0, -57, -10]}>
      {/* dark terrain silhouette — a plain, low-contrast body, never textured */}
      <mesh renderOrder={0}>
        <sphereGeometry args={[52, 96, 96]} />
        <meshBasicMaterial color="#05030f" />
      </mesh>
      {/* atmospheric fresnel rim, drawn over the terrain */}
      <mesh renderOrder={1} scale={1.028}>
        <sphereGeometry args={[52, 96, 96]} />
        <shaderMaterial
          uniforms={rimUniforms}
          vertexShader={rimVertex}
          fragmentShader={rimFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* ---------- distant moon, low and off to one side ---------- */
const moonFragment = /* glsl */ `
  precision mediump float;
  uniform vec3 uLit;
  uniform vec3 uDark;
  uniform vec3 uLightDir;
  varying vec3 vN;
  void main() {
    float d = dot(normalize(vN), normalize(uLightDir));
    float t = smoothstep(-0.25, 0.65, d);   // soft terminator → a faint crescent
    gl_FragColor = vec4(mix(uDark, uLit, t), 1.0);
  }
`;
const moonVertex = /* glsl */ `
  varying vec3 vN;
  void main() {
    vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function Moon({ glow }) {
  const uniforms = useMemo(
    () => ({
      uLit: { value: new THREE.Color("#6a6488") },
      uDark: { value: new THREE.Color("#141026") },
      uLightDir: { value: new THREE.Vector3(0.7, 0.4, 0.5) },
    }),
    []
  );
  return (
    <group position={[-20, -2.5, -45]}>
      <sprite scale={[6.5, 6.5, 1]}>
        <spriteMaterial map={glow} color="#5b4a9e" transparent opacity={0.16} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <mesh>
        <sphereGeometry args={[1.15, 48, 48]} />
        <shaderMaterial uniforms={uniforms} vertexShader={moonVertex} fragmentShader={moonFragment} />
      </mesh>
    </group>
  );
}

/* ---------- parallax star slabs at several depths ---------- */
function useStarSlab(count, z, spreadX, yMin, yMax, jitterZ) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cool = new THREE.Color("#c8d4ff");
    const warm = new THREE.Color("#ffd9b0");
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * spreadX;
      positions[i * 3 + 1] = yMin + Math.random() * (yMax - yMin);
      positions[i * 3 + 2] = z + (Math.random() - 0.5) * jitterZ;
      const col = Math.random() < 0.12 ? warm : cool;
      const b = 0.4 + Math.random() * 0.5; // keep every star dim
      colors[i * 3] = col.r * b;
      colors[i * 3 + 1] = col.g * b;
      colors[i * 3 + 2] = col.b * b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [count, z, spreadX, yMin, yMax, jitterZ]);
}

function StarLayer({ geo, size, sprite, groupRef }) {
  return (
    <group ref={groupRef}>
      <points geometry={geo}>
        <pointsMaterial
          size={size}
          sizeAttenuation
          map={sprite}
          alphaTest={0.01}
          transparent
          depthWrite={false}
          vertexColors
        />
      </points>
    </group>
  );
}

/* ---------- assembled scene ---------- */
function Scene() {
  const reduced = prefersReduced();
  const sprite = useMemo(() => makeSoftCircle(), []);

  const farGeo = useStarSlab(1200, -60, 90, -2, 46, 20);
  const midGeo = useStarSlab(480, -34, 55, -1, 34, 12);
  const nearGeo = useStarSlab(160, -16, 34, 0, 24, 8);

  const horizon = useRef();
  const far = useRef();
  const mid = useRef();
  const near = useRef();

  // pointer + scroll drive parallax; the backdrop has pointer-events:none, so we
  // read the window directly rather than r3f's canvas pointer.
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  useEffect(() => {
    if (reduced) return;
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scroll.current = window.scrollY || 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  // per-layer parallax: horizon barely moves, near stars move most
  const layers = [
    { ref: horizon, ax: 0.1, ay: 0.05, sy: 0.0006 },
    { ref: far, ax: 0.35, ay: 0.18, sy: 0.0016 },
    { ref: mid, ax: 0.9, ay: 0.5, sy: 0.004 },
    { ref: near, ax: 1.9, ay: 1.0, sy: 0.008 },
  ];

  useFrame((_, delta) => {
    if (reduced) return;
    const k = Math.min(1, delta * 3); // frame-rate independent damping
    for (const L of layers) {
      const g = L.ref.current;
      if (!g) continue;
      const tx = -pointer.current.x * L.ax;
      const ty = pointer.current.y * L.ay + scroll.current * L.sy;
      g.position.x += (tx - g.position.x) * k;
      g.position.y += (ty - g.position.y) * k;
    }
  });

  return (
    <>
      <group ref={horizon}>
        <Planet />
        <Moon glow={sprite} />
      </group>
      <StarLayer geo={farGeo} size={0.55} sprite={sprite} groupRef={far} />
      <StarLayer geo={midGeo} size={0.85} sprite={sprite} groupRef={mid} />
      <StarLayer geo={nearGeo} size={1.25} sprite={sprite} groupRef={near} />
    </>
  );
}

export default function PlanetSurfaceScene() {
  return (
    <Canvas
      dpr={[0.75, 1.5]}
      camera={{ fov: 55, position: [0, 0, 12], near: 0.1, far: 300 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene />
    </Canvas>
  );
}
