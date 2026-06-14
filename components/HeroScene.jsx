"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Text3D,
  Center,
  DragControls,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { profile } from "@/lib/content";

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const RED = "#ff1744";

/* ---------- Hologram name ---------- */

// Translucent emissive text. Bloom (below) makes it bleed light; the value is
// pushed above 1.0 so it crosses the bloom luminance threshold.
const holoVertex = /* glsl */ `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const holoFragment = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  void main() {
    // semi-transparent so the beam is faintly visible through the letters
    gl_FragColor = vec4(uColor * 0.9, 0.75);
  }
`;

// Screen-space scanlines: a 1px dark line every 4px. Drawn on a plane just in
// front of the text — this is what sells "projected" rather than "printed".
const scanFragment = /* glsl */ `
  precision mediump float;
  void main() {
    // 3px-spaced dark lines at 12% opacity — reads as "projected"
    gl_FragColor = vec4(0.0, 0.0, 0.0, step(0.5, fract(gl_FragCoord.y / 3.0)) * 0.12);
  }
`;
const scanVertex = /* glsl */ `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function HologramName({ text, reduced }) {
  const grp = useRef();

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(RED) },
    }),
    []
  );

  useFrame((state) => {
    if (grp.current && !reduced) {
      grp.current.position.y = 2.6 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
    }
  });

  return (
    <group ref={grp} position={[0, 2.6, 0]}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.62}
          height={0.14}
          bevelEnabled
          bevelSize={0.01}
          bevelThickness={0.02}
          bevelSegments={2}
          curveSegments={5}
        >
          {text}
          <shaderMaterial
            uniforms={uniforms}
            vertexShader={holoVertex}
            fragmentShader={holoFragment}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </Text3D>
      </Center>

      {/* scanline overlay, same footprint as the name, just in front of it */}
      <mesh position={[0, 0, 0.13]} renderOrder={2}>
        <planeGeometry args={[5.8, 1.05]} />
        <shaderMaterial
          vertexShader={scanVertex}
          fragmentShader={scanFragment}
          transparent
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
    </group>
  );
}

/* ---------- Projector + beam ---------- */

// Soft volumetric beam: a cone (apex down at the lens, widening upward).
// Brightness fades up the height and softens at the silhouette edges.
const beamVertex = /* glsl */ `
  varying float vH;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vH = (position.y + 0.86) / 1.72;      // 1 at the lens, 0 at the top opening
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const beamFragment = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uBase;
  varying float vH;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float edge = abs(dot(normalize(vN), normalize(vV))); // soft radial edges
    float alpha = uBase * vH * edge;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

function Projector({ reduced }) {
  const ring = useRef();
  const beamUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#ff8fa3") },
      uBase: { value: 0.12 },
    }),
    []
  );

  useFrame((state) => {
    if (!reduced && ring.current) {
      ring.current.rotation.z = state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <group>
      {/* dark-chrome beveled puck (wider at the bottom) */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[1.8, 2.2, 0.5, 32]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* lens element on top, faintly glowing red */}
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.7, 0.95, 0.18, 32]} />
        <meshStandardMaterial
          color="#241026"
          metalness={0.85}
          roughness={0.35}
          emissive={RED}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* glowing ring around the top edge */}
      <mesh ref={ring} position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.05, 16, 96]} />
        <meshBasicMaterial color={RED} toneMapped={false} />
      </mesh>

      {/* volumetric beam — wide top opening that "catches" the name from below */}
      <mesh rotation={[Math.PI, 0, 0]} position={[0, 1.46, 0]}>
        <coneGeometry args={[2.3, 1.72, 48, 1, true]} />
        <shaderMaterial
          uniforms={beamUniforms}
          vertexShader={beamVertex}
          fragmentShader={beamFragment}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* ---------- Scene ---------- */

function Scene() {
  const reduced = prefersReduced();
  const [dragging, setDragging] = useState(false);
  return (
    <>
      <ambientLight intensity={0.5} color="#c3b6ff" />
      <pointLight position={[0, 3.5, 1.5]} intensity={1.1} color="#ff8fa3" />
      <directionalLight position={[3, 5, 4]} intensity={0.9} color="#b9a9ff" />

      <Projector reduced={reduced} />

      <Suspense fallback={null}>
        <DragControls
          onDragStart={() => setDragging(true)}
          onDragEnd={() => setDragging(false)}
        >
          <HologramName text={profile.name} reduced={reduced} />
        </DragControls>
      </Suspense>

      <OrbitControls
        makeDefault
        enabled={!dragging}
        target={[0, 1.8, 0]}
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        autoRotate={false}
        minPolarAngle={0.6}
        maxPolarAngle={1.45}
      />

      {/* Bloom — makes the ring, text and beam bleed light like a real
          projection. Without this nothing reads as "glowing". */}
      <EffectComposer disableNormalPass>
        <Bloom
          luminanceThreshold={0.2}
          intensity={1.5}
          radius={0.8}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 45, position: [0, 3.6, 6.8], near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene />
    </Canvas>
  );
}
