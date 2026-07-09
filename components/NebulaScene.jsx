"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const TWO_PI = Math.PI * 2;

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- shared soft-circle sprite (distant stars) ---------- */
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

/* ---------- distant star field (far depth behind the nebula) ---------- */
function useStarField(count = 1600) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cool = new THREE.Color("#c8d4ff");
    const warm = new THREE.Color("#ffccaa");
    for (let i = 0; i < count; i++) {
      const r = 32 + Math.random() * 55;
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

/* ---------- volumetric nebula (full-screen fbm quad) ----------
   A screen-filling quad (vertex writes clip space directly, ignoring the
   camera) carries a domain-warped fbm cloud field. It is deliberately soft,
   low-contrast and anchored to the right / lower-right so it never competes
   with the left reading column. */
const nebulaVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const nebulaFragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uAspect;   // width / height, to keep the noise round
  uniform vec3 uViolet;
  uniform vec3 uMagenta;
  uniform vec3 uIndigo;
  varying vec2 vUv;

  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453) * 2.0 - 1.0;
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y) * 0.5 + 0.5;
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = vec2((uv.x - 0.5) * uAspect, uv.y - 0.5);
    float t = uTime;

    // domain warp → churning, formless cloud structure
    vec2 q = vec2(fbm(p * 2.2 + vec2(0.0, t * 0.02)),
                  fbm(p * 2.2 + vec2(5.2, -t * 0.016)));
    float d = fbm(p * 3.0 + q * 1.5 + vec2(t * 0.012, -t * 0.008));
    d = smoothstep(0.34, 1.0, d); // clip the low-density floor → wispy, not flat

    // anchor the visual mass to the right + lower-right
    float mx = smoothstep(0.12, 0.92, uv.x);
    float my = smoothstep(0.98, 0.1, uv.y);          // heavier toward the bottom
    float blob = 1.0 - smoothstep(0.0, 0.85,
      length(vec2((uv.x - 0.82) * uAspect, uv.y - 0.26)));
    float mask = clamp(mx * (0.5 + 0.7 * my), 0.0, 1.0);
    mask = max(mask * 0.85, blob * 0.55);

    float density = d * mask;

    // deep violet base, magenta only in the densest cells, indigo in the thin
    vec3 col = mix(uIndigo, uViolet, smoothstep(0.0, 0.6, d));
    col = mix(col, uMagenta, smoothstep(0.6, 1.0, d) * 0.5);

    // low-contrast guardrails: cap brightness and opacity well below the text
    col *= 0.5;
    float alpha = density * 0.4;
    gl_FragColor = vec4(col, alpha);
  }
`;

function Nebula({ reduced }) {
  const matRef = useRef();
  const { size } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uViolet: { value: new THREE.Color("#7c3aed") },
      uMagenta: { value: new THREE.Color("#d633ff") },
      uIndigo: { value: new THREE.Color("#4338ca") },
    }),
    []
  );

  uniforms.uAspect.value = size.width / Math.max(1, size.height);

  useFrame((_, delta) => {
    if (!reduced && matRef.current) matRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={nebulaVertex}
        fragmentShader={nebulaFragment}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

function Scene() {
  const reduced = prefersReduced();
  const sprite = useMemo(() => makeSoftCircle(), []);
  const starGeo = useStarField(1600);
  const stars = useRef();

  useFrame((_, delta) => {
    // very slow parallax drift on the far stars
    if (!reduced && stars.current) stars.current.rotation.y += delta * (TWO_PI / 900);
  });

  return (
    <>
      <Nebula reduced={reduced} />
      <group ref={stars}>
        <points geometry={starGeo}>
          <pointsMaterial
            size={0.9}
            sizeAttenuation
            map={sprite}
            alphaTest={0.01}
            transparent
            depthWrite={false}
            opacity={0.85}
            vertexColors
          />
        </points>
      </group>
    </>
  );
}

export default function NebulaScene() {
  return (
    <Canvas
      dpr={0.75}
      camera={{ fov: 55, position: [0, 0, 9], near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene />
    </Canvas>
  );
}
