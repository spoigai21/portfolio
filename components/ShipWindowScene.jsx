"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 1600;
const R = 56; // radius of the disk the stars are seeded across (world units)
// Camera sits at the origin looking down -z. Stars live between the far plane and
// a near plane kept a safe distance in front of the lens, so they streak like a
// moderate cruise rather than getting so close they smear into full warp.
const Z_NEAR = -8.0;
const Z_FAR = -170.0;

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Star attributes computed once. Every star has a FIXED x/y and travels toward
// the camera at one shared ship velocity — perspective alone turns that into
// depth parallax: a star near the lens sweeps outward fast and streaks long,
// while a distant star barely moves and stays a short point. Because all tracks
// radiate from the vanishing point (screen center, behind the orb grid), the
// center stays naturally calm and the edges get the strongest motion.
function useStars() {
  return useMemo(() => {
    const base = [];
    for (let i = 0; i < COUNT; i++) {
      // uniform over a disk, nudged outward (pow < 1) so the center stays sparse
      const a = Math.random() * Math.PI * 2;
      const rr = Math.pow(Math.random(), 0.62) * R;
      const x = Math.cos(a) * rr;
      const y = Math.sin(a) * rr;
      const z = Z_FAR + Math.random() * (Z_NEAR - Z_FAR);
      // small per-star jitter around the shared velocity so stars don't recycle
      // in lockstep — parallax comes from depth, not from this.
      const speed = 0.85 + Math.random() * 0.3;
      const seed = Math.random();
      base.push({ x, y, z, speed, seed });
    }

    // Points geometry: one vertex per star (the star core / distant dots).
    const pPos = new Float32Array(COUNT * 3);
    const pSpeed = new Float32Array(COUNT);
    const pSeed = new Float32Array(COUNT);
    // Line geometry: two vertices per star (head + tail) for the motion streak.
    const lPos = new Float32Array(COUNT * 2 * 3);
    const lSpeed = new Float32Array(COUNT * 2);
    const lSeed = new Float32Array(COUNT * 2);
    const lHead = new Float32Array(COUNT * 2);

    base.forEach((s, i) => {
      pPos[i * 3] = s.x;
      pPos[i * 3 + 1] = s.y;
      pPos[i * 3 + 2] = s.z;
      pSpeed[i] = s.speed;
      pSeed[i] = s.seed;

      for (let k = 0; k < 2; k++) {
        const v = i * 2 + k;
        lPos[v * 3] = s.x;
        lPos[v * 3 + 1] = s.y;
        lPos[v * 3 + 2] = s.z;
        lSpeed[v] = s.speed;
        lSeed[v] = s.seed;
        lHead[v] = k === 0 ? 1 : 0; // first vertex = head (near), second = tail
      }
    });

    const points = new THREE.BufferGeometry();
    points.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    points.setAttribute("aSpeed", new THREE.BufferAttribute(pSpeed, 1));
    points.setAttribute("aSeed", new THREE.BufferAttribute(pSeed, 1));

    const lines = new THREE.BufferGeometry();
    lines.setAttribute("position", new THREE.BufferAttribute(lPos, 3));
    lines.setAttribute("aSpeed", new THREE.BufferAttribute(lSpeed, 1));
    lines.setAttribute("aSeed", new THREE.BufferAttribute(lSeed, 1));
    lines.setAttribute("aHead", new THREE.BufferAttribute(lHead, 1));

    return { points, lines };
  }, []);
}

// Shared GLSL: advance a star toward the camera at the ship velocity and wrap it
// back to the far plane. `depth` is 0 at the far plane, 1 at the near plane.
const MOTION = /* glsl */ `
  const float Z_NEAR = ${Z_NEAR.toFixed(1)};
  const float Z_FAR = ${Z_FAR.toFixed(1)};
  const float RANGE = ${(Z_NEAR - Z_FAR).toFixed(1)};
  float headZ(float baseZ) {
    float travel = (uReduced > 0.5) ? 0.0 : uSpeed * uTime * aSpeed;
    return Z_FAR + mod(baseZ - Z_FAR + travel, RANGE);
  }
`;

const pointsVertex = /* glsl */ `
  uniform float uTime;
  uniform float uReduced;
  uniform float uSpeed;
  uniform float uSize;
  attribute float aSpeed;
  attribute float aSeed;
  varying float vShade;
  varying vec3 vColor;
  ${MOTION}
  void main() {
    float z = headZ(position.z);
    vec4 mv = modelViewMatrix * vec4(position.xy, z, 1.0);
    gl_Position = projectionMatrix * mv;

    float depth = (z - Z_FAR) / RANGE;            // 0 far .. 1 near
    gl_PointSize = clamp(uSize * (0.45 + depth * 1.3) / -mv.z, 0.5, 3.6);

    // dim hard toward screen center so the orb cluster is never competed with
    vec2 ndc = gl_Position.xy / gl_Position.w;
    float r = clamp(length(ndc), 0.0, 1.5);
    float centerDim = 0.07 + 0.93 * smoothstep(0.14, 0.5, r);

    float fadeIn = smoothstep(0.0, 0.08, depth);
    float fadeOut = 1.0 - smoothstep(0.8, 1.0, depth); // gone before it wraps
    float twinkle = (uReduced > 0.5)
      ? 1.0
      : 0.82 + 0.18 * sin(uTime * 3.0 + aSeed * 6.2831);

    // far stars stay as crisp points; near ones hand brightness to their streak
    float pointWeight = 0.5 + 0.5 * (1.0 - depth);
    vShade = centerDim * fadeIn * fadeOut * pointWeight * twinkle * 0.9;
    vColor = mix(vec3(0.80, 0.88, 1.0), vec3(0.55, 0.92, 1.0), step(0.72, aSeed));
  }
`;

const pointsFragment = /* glsl */ `
  precision mediump float;
  varying float vShade;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, vShade * a); // additive blended
  }
`;

const linesVertex = /* glsl */ `
  uniform float uTime;
  uniform float uReduced;
  uniform float uSpeed;
  uniform float uNearTrail;
  uniform float uFarTrail;
  attribute float aSpeed;
  attribute float aSeed;
  attribute float aHead;
  varying float vShade;
  varying vec3 vColor;
  ${MOTION}
  void main() {
    float zHead = headZ(position.z);
    float depth = (zHead - Z_FAR) / RANGE;        // 0 far .. 1 near

    // trail grows from short (far) to long (near): depth-based streak elongation
    float trailW = mix(uFarTrail, uNearTrail, depth * depth);
    // tail sits further back (toward the vanishing point) so the streak points out
    float zTail = max(zHead - trailW, Z_FAR + 0.5);
    float z = mix(zTail, zHead, aHead);

    vec4 mv = modelViewMatrix * vec4(position.xy, z, 1.0);
    gl_Position = projectionMatrix * mv;

    vec2 ndc = gl_Position.xy / gl_Position.w;
    float r = clamp(length(ndc), 0.0, 1.5);
    // protect a wide calm zone around the orbs; ramp streaks up toward the edges
    float centerDim = smoothstep(0.24, 0.62, r);

    float fadeIn = smoothstep(0.04, 0.16, depth);
    float fadeOut = 1.0 - smoothstep(0.8, 1.0, depth);
    float headTaper = mix(0.04, 1.0, aHead);      // bright head, fading tail
    float speedGlow = 0.2 + 0.8 * depth;          // near streaks read brightest

    vShade = centerDim * fadeIn * fadeOut * headTaper * speedGlow * 0.95;
    vColor = mix(vec3(0.74, 0.88, 1.0), vec3(0.5, 0.93, 1.0), step(0.72, aSeed));
  }
`;

const linesFragment = /* glsl */ `
  precision mediump float;
  varying float vShade;
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor, vShade); // additive blended
  }
`;

function Starfield() {
  const reduced = prefersReduced();
  const { points, lines } = useStars();
  const pointsMat = useRef();
  const linesMat = useRef();

  const pointsUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReduced: { value: reduced ? 1 : 0 },
      uSpeed: { value: 46 }, // world units/sec — moderate cruise (~0.4c feel)
      uSize: { value: 24 },
    }),
    [reduced]
  );
  const linesUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReduced: { value: reduced ? 1 : 0 },
      uSpeed: { value: 46 },
      // static field still shows a few short streaks; motion field streaks long
      uNearTrail: { value: reduced ? 2.5 : 9.0 },
      uFarTrail: { value: reduced ? 0.6 : 1.2 },
    }),
    [reduced]
  );

  useFrame((state) => {
    if (reduced) return; // static field — no animation
    const t = state.clock.elapsedTime;
    if (pointsMat.current) pointsMat.current.uniforms.uTime.value = t;
    if (linesMat.current) linesMat.current.uniforms.uTime.value = t;
  });

  return (
    <>
      <lineSegments geometry={lines} frustumCulled={false}>
        <shaderMaterial
          ref={linesMat}
          uniforms={linesUniforms}
          vertexShader={linesVertex}
          fragmentShader={linesFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <points geometry={points} frustumCulled={false}>
        <shaderMaterial
          ref={pointsMat}
          uniforms={pointsUniforms}
          vertexShader={pointsVertex}
          fragmentShader={pointsFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

export default function ShipWindowScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 62, position: [0, 0, 0], near: 0.1, far: 240 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Starfield />
    </Canvas>
  );
}
