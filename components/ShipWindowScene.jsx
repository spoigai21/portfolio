"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 1200;
const R = 72; // radius of the disk the stars are seeded across (world units)
const Z_FAR = -150.0;
const Z_NEAR = -2.5;

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Star attributes computed once. Each star has a fixed x/y (so perspective makes
// it sweep outward from the vanishing point as it approaches — naturally slow at
// the center, fast at the edges) plus a base depth, a speed, and a seed.
function useStars() {
  return useMemo(() => {
    const base = [];
    for (let i = 0; i < COUNT; i++) {
      // uniform-ish over a disk, biased slightly outward so the center stays sparse
      const a = Math.random() * Math.PI * 2;
      const rr = Math.sqrt(Math.random()) * R;
      const x = Math.cos(a) * rr;
      const y = Math.sin(a) * rr;
      const z = Z_FAR + Math.random() * (Z_NEAR - Z_FAR);
      const speed = 1.4 + Math.random() * 4.2; // units/sec — gentle, not warp
      const seed = Math.random();
      base.push({ x, y, z, speed, seed });
    }

    // Points geometry: one vertex per star (the star dot).
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
        lHead[v] = k === 0 ? 1 : 0; // first vertex = head, second = tail
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

// Shared GLSL: advance a star's head along +z and wrap it back to the far plane.
const MOTION = /* glsl */ `
  const float Z_FAR = ${Z_FAR.toFixed(1)};
  const float Z_NEAR = ${Z_NEAR.toFixed(1)};
  float headZ(float baseZ) {
    float range = Z_NEAR - Z_FAR;
    float motion = (uReduced > 0.5) ? 0.0 : uTime * aSpeed;
    return Z_FAR + mod(baseZ - Z_FAR + motion, range);
  }
`;

const pointsVertex = /* glsl */ `
  uniform float uTime;
  uniform float uReduced;
  uniform float uSize;
  attribute float aSpeed;
  attribute float aSeed;
  varying float vShade;
  varying vec3 vColor;
  ${MOTION}
  void main() {
    float range = Z_NEAR - Z_FAR;
    float z = headZ(position.z);
    vec4 mv = modelViewMatrix * vec4(position.xy, z, 1.0);
    gl_Position = projectionMatrix * mv;

    float depth = (z - Z_FAR) / range;            // 0 far .. 1 near
    gl_PointSize = clamp(uSize * (0.35 + depth * 1.7) / -mv.z, 0.6, 5.0);

    // dim toward screen center so the orb cluster is never competed with
    vec2 ndc = gl_Position.xy / gl_Position.w;
    float r = clamp(length(ndc), 0.0, 1.4);
    float centerDim = 0.12 + 0.88 * smoothstep(0.16, 0.52, r);

    float fadeIn = smoothstep(0.0, 0.12, depth);
    float fadeOut = 1.0 - smoothstep(0.9, 1.0, depth);
    float twinkle = (uReduced > 0.5)
      ? 1.0
      : 0.78 + 0.22 * sin(uTime * (1.5 + aSpeed) + aSeed * 6.2831);

    vShade = centerDim * fadeIn * fadeOut * (0.55 + 0.45 * depth) * twinkle;
    vColor = mix(vec3(0.83, 0.90, 1.0), vec3(0.44, 0.92, 1.0), step(0.74, aSeed));
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
    gl_FragColor = vec4(vColor * vShade, a * vShade);
  }
`;

const linesVertex = /* glsl */ `
  uniform float uTime;
  uniform float uReduced;
  uniform float uTrail;
  attribute float aSpeed;
  attribute float aSeed;
  attribute float aHead;
  varying float vShade;
  varying vec3 vColor;
  ${MOTION}
  void main() {
    float range = Z_NEAR - Z_FAR;
    float zHead = headZ(position.z);
    // the tail sits further away (toward the vanishing point) -> streak points out
    float trail = uTrail * (0.6 + aSpeed * 0.4);
    float zTail = max(zHead - trail, Z_FAR + 0.01);
    float z = mix(zTail, zHead, aHead);

    vec4 mv = modelViewMatrix * vec4(position.xy, z, 1.0);
    gl_Position = projectionMatrix * mv;

    float depth = (zHead - Z_FAR) / range;
    vec2 ndc = gl_Position.xy / gl_Position.w;
    float r = clamp(length(ndc), 0.0, 1.4);
    float centerDim = 0.05 + 0.95 * smoothstep(0.22, 0.58, r);

    float fadeIn = smoothstep(0.0, 0.2, depth);
    float fadeOut = 1.0 - smoothstep(0.88, 1.0, depth);
    float speedFade = depth * depth;             // streaks only read once near/fast

    vShade = centerDim * fadeIn * fadeOut * speedFade * mix(0.04, 0.62, aHead);
    vColor = mix(vec3(0.70, 0.86, 1.0), vec3(0.38, 0.90, 1.0), step(0.74, aSeed));
  }
`;

const linesFragment = /* glsl */ `
  precision mediump float;
  varying float vShade;
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor * vShade, vShade);
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
      uSize: { value: 26 },
    }),
    [reduced]
  );
  const linesUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReduced: { value: reduced ? 1 : 0 },
      uTrail: { value: reduced ? 0 : 4.5 },
    }),
    [reduced]
  );

  useFrame((state) => {
    if (reduced) return; // static field
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
          blending={THREE.NormalBlending}
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
          blending={THREE.NormalBlending}
        />
      </points>
    </>
  );
}

export default function ShipWindowScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 62, position: [0, 0, 0], near: 0.1, far: 220 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Starfield />
    </Canvas>
  );
}
