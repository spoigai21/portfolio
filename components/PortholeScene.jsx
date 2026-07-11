"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const STAR_COUNT = 640;
const Z_FAR = -22; // where stars are born
const Z_NEAR = 4.3; // just in front of the camera (at z ~4.6); recycle past here
const SPREAD = 9; // x/y half-extent

// Forward-travel starfield: every star drifts toward the camera along +z and is
// recycled to the far plane once it passes. Perspective makes the near stars
// sweep past faster than distant ones, so depth/parallax comes for free. Calm
// cruising speed — not warp.
function Stars({ reduced }) {
  const ref = useRef();
  const { geometry, speeds } = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const speeds = new Float32Array(STAR_COUNT);
    for (let i = 0; i < STAR_COUNT; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * SPREAD;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * SPREAD;
      positions[i * 3 + 2] = Z_FAR + Math.random() * (Z_NEAR - Z_FAR);
      speeds[i] = 0.95 + Math.random() * 1.5; // a touch quicker — clearer travel
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry: geo, speeds };
  }, []);

  useFrame((_, delta) => {
    if (reduced || !ref.current) return;
    const d = Math.min(delta, 0.05); // clamp so a tab-switch can't jump stars
    const pos = ref.current.geometry.attributes.position;
    const arr = pos.array;
    for (let i = 0; i < STAR_COUNT; i++) {
      const zi = i * 3 + 2;
      arr[zi] += speeds[i] * d;
      if (arr[zi] > Z_NEAR) {
        arr[i * 3] = (Math.random() * 2 - 1) * SPREAD;
        arr[i * 3 + 1] = (Math.random() * 2 - 1) * SPREAD;
        arr[zi] = Z_FAR;
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.07}
        color="#dbe8ff"
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

const atmoVertex = /* glsl */ `
  varying vec3 vN;
  void main() {
    vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const atmoFragment = /* glsl */ `
  precision mediump float;
  varying vec3 vN;
  uniform vec3 uColor;
  void main() {
    float f = pow(1.0 - abs(vN.z), 2.6);
    gl_FragColor = vec4(uColor * f, f);
  }
`;

function Planet({ reduced }) {
  const spin = useRef();
  const group = useRef();
  const moon = useRef();
  const atmo = useMemo(
    () => ({ uColor: { value: new THREE.Color("#4aa6ff") } }),
    []
  );

  useFrame((state, delta) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    if (spin.current) spin.current.rotation.y += delta * 0.06;
    if (group.current) {
      // very slow approach (z drifts toward the camera → grows via perspective)
      group.current.position.z = -1.4 + Math.sin(t * 0.024) * 1.7;
      group.current.position.x = -1.15 + Math.sin(t * 0.033) * 0.22;
      group.current.position.y = -0.9 + Math.cos(t * 0.028) * 0.1;
    }
    if (moon.current) {
      // a small moon orbiting the planet — extra ambient movement
      moon.current.position.set(
        Math.cos(t * 0.32) * 3.1,
        0.5 + Math.sin(t * 0.32) * 0.5,
        Math.sin(t * 0.32) * 1.5
      );
    }
  });

  return (
    <group ref={group} position={[-1.15, -0.9, -1.4]}>
      <mesh ref={spin}>
        <sphereGeometry args={[1.9, 48, 48]} />
        <meshStandardMaterial
          color="#35608f"
          roughness={0.9}
          metalness={0.04}
          emissive="#0b1b33"
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh scale={1.045}>
        <sphereGeometry args={[1.9, 48, 48]} />
        <shaderMaterial
          uniforms={atmo}
          vertexShader={atmoVertex}
          fragmentShader={atmoFragment}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={moon} position={[3.1, 0.5, 0]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial
          color="#9fb0c4"
          roughness={1}
          metalness={0}
          emissive="#141c26"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  const reduced = prefersReduced();
  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight position={[4, 2, 3]} intensity={1.7} color="#dbe9ff" />
      <Stars reduced={reduced} />
      <Planet reduced={reduced} />
    </>
  );
}

export default function PortholeScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 46, position: [0, 0, 4.6], near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene />
    </Canvas>
  );
}
