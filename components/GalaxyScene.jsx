"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const TWO_PI = Math.PI * 2;

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- shared soft-circle sprite texture ---------- */
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

/* ---------- Layer 1: distant background star field ---------- */
function useStarField(count = 4000) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cool = new THREE.Color("#c8d4ff");
    const warm = new THREE.Color("#ffccaa");
    for (let i = 0; i < count; i++) {
      // random point in a large spherical shell around the camera
      const r = 30 + Math.random() * 55;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * TWO_PI;
      positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(theta);
      const col = Math.random() < 0.1 ? warm : cool;
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

/* ---------- Layer 2: galaxy disc ---------- */
const ARMS = 3;
const SPIN = 1.0;
const MAX_R = 7;
const RANDOMNESS = 0.22;
const RAND_POWER = 3;

function useGalaxyDisc(count = 10000) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const core = new Float32Array(count);

    const coreA = new THREE.Color("#ff1744");
    const coreB = new THREE.Color("#ff6b8a");
    const midA = new THREE.Color("#7c3aed");
    const midB = new THREE.Color("#4338ca");
    const outer = new THREE.Color("#3a3a6a");
    const tmp = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // denser near the center, sparse at the edges
      const radius = Math.pow(Math.random(), 1.5) * MAX_R;
      const t = radius / MAX_R;
      const branch = (i % ARMS) * (TWO_PI / ARMS);
      const angle = branch + radius * SPIN;

      const scatter = () =>
        Math.pow(Math.random(), RAND_POWER) *
        (Math.random() < 0.5 ? 1 : -1) *
        RANDOMNESS *
        radius;

      positions[i * 3] = Math.cos(angle) * radius + scatter();
      positions[i * 3 + 1] = scatter() * 0.4; // thin disc
      positions[i * 3 + 2] = Math.sin(angle) * radius + scatter();

      let size;
      if (t < 0.15) {
        // hot core
        tmp.copy(coreA).lerp(coreB, Math.random()).multiplyScalar(1.3);
        core[i] = 1;
        size = 2.0 + Math.random() * 0.8;
      } else if (t < 0.6) {
        // violet -> indigo arms
        tmp.copy(midA).lerp(midB, (t - 0.15) / 0.45);
        core[i] = 0;
        size = 1.2 + Math.random() * 0.6;
      } else {
        // dim blue-grey edges fading to near-invisible
        const f = (t - 0.6) / 0.4;
        tmp.copy(outer).multiplyScalar(1.0 - f * 0.85);
        core[i] = 0;
        size = 0.8 + Math.random() * 0.4;
      }

      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
      sizes[i] = size;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aCore", new THREE.BufferAttribute(core, 1));
    return geo;
  }, [count]);
}

const discVertex = /* glsl */ `
  uniform float uSize;
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aCore;
  varying vec3 vColor;
  varying float vCore;
  void main() {
    vColor = aColor;
    vCore = aCore;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = clamp(aSize * uSize / -mv.z, 1.0, 8.0); // sizeAttenuation
    gl_Position = projectionMatrix * mv;
  }
`;
const discFragment = /* glsl */ `
  precision mediump float;
  uniform float uCorePulse;
  uniform float uBrightness;
  varying vec3 vColor;
  varying float vCore;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    // only the core particles pulse; uBrightness keeps the whole disc as
    // a dim backdrop (~35%)
    vec3 col = vColor * mix(1.0, uCorePulse, vCore) * uBrightness;
    gl_FragColor = vec4(col, a * uBrightness);
  }
`;

/* ---------- Layer 3: nebula fog sprites ---------- */
const NEBULAE = [
  { r: 2.0, arm: 0, color: "#5b2a9e", opacity: 0.06, size: 6 },
  { r: 3.6, arm: 1, color: "#ff1744", opacity: 0.04, size: 7.5 },
  { r: 1.5, arm: 2, color: "#5b2a9e", opacity: 0.06, size: 5 },
  { r: 4.6, arm: 0, color: "#ff1744", opacity: 0.04, size: 8.5 },
];

function Nebulae({ texture }) {
  return (
    <>
      {NEBULAE.map((n, i) => {
        const angle = n.arm * (TWO_PI / ARMS) + n.r * SPIN;
        const pos = [Math.cos(angle) * n.r, 0, Math.sin(angle) * n.r];
        return (
          <sprite key={i} position={pos} scale={[n.size, n.size, 1]}>
            <spriteMaterial
              map={texture}
              color={n.color}
              opacity={n.opacity}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
        );
      })}
    </>
  );
}

/* ---------- assembled scene ---------- */
function Galaxy() {
  const reduced = prefersReduced();
  const sprite = useMemo(() => makeSoftCircle(), []);
  const starGeo = useStarField(4000);
  const discGeo = useGalaxyDisc(10000);

  const spin = useRef();
  const stars = useRef();
  const discMat = useRef();

  const uniforms = useMemo(
    () => ({
      uSize: { value: 18 },
      uCorePulse: { value: 0.8 },
      uBrightness: { value: 1.0 }, // full strength (hierarchy handled by scroll fade)
    }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (!reduced) {
      // one full disc rotation every ~180s
      if (spin.current) spin.current.rotation.y += delta * (TWO_PI / 180);
      // background stars drift the opposite way at 1/5 speed (parallax)
      if (stars.current) stars.current.rotation.y -= delta * (TWO_PI / 180) / 5;
    }
    if (discMat.current) {
      // core brightness oscillates 0.6..1.0 on a 10s cycle
      discMat.current.uniforms.uCorePulse.value = reduced
        ? 0.8
        : 0.8 + 0.2 * Math.sin((t * TWO_PI) / 10);
    }
  });

  return (
    <>
      {/* Layer 1 — distant stars */}
      <group ref={stars}>
        <points geometry={starGeo}>
          <pointsMaterial
            size={1.0}
            sizeAttenuation
            map={sprite}
            alphaTest={0.01}
            transparent
            depthWrite={false}
            vertexColors
          />
        </points>
      </group>

      {/* Layers 2 & 3 — tilted, slowly spinning galaxy */}
      <group rotation={[-0.52, 0, 0]}>
        <group ref={spin}>
          <points geometry={discGeo} frustumCulled={false}>
            <shaderMaterial
              ref={discMat}
              uniforms={uniforms}
              vertexShader={discVertex}
              fragmentShader={discFragment}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </points>
          <Nebulae texture={sprite} />
        </group>
      </group>
    </>
  );
}

export default function GalaxyScene() {
  return (
    <Canvas
      dpr={0.75}
      camera={{ fov: 55, position: [0, 0, 9], near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Galaxy />
    </Canvas>
  );
}
