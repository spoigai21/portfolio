"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import styles from "./StarField.module.css";

const COUNT = 13;

// Red shooting stars, with slight shade variation.
const GOLDS = ["#ff1744", "#ff5252", "#c4001d"];

// Star configs computed ONCE at module load so the front and back canvas layers
// render the identical system. All motion is a deterministic function of a
// shared wall-clock + these configs, so the two layers stay in perfect sync.
const STARS = Array.from({ length: COUNT }, (_, i) => ({
  seed: 1 + i * 1.37,
  period: 2.4 + Math.random() * 3, // seconds between launches (more frequent)
  active: 0.55 + Math.random() * 0.7, // how long a streak is visible (faster)
  travel: 20 + Math.random() * 12, // distance covered per streak (faster)
  length: 1.6 + Math.random() * 2, // streak length
  width: 0.5 + Math.random() * 0.7,
  curve: (i % 2 === 0 ? 1 : -1) * (4 + Math.random() * 4), // lateral bend
  offset: Math.random() * 9, // stagger so they don't all fire together
  color: GOLDS[i % GOLDS.length],
}));

const UP = new THREE.Vector3(0, 1, 0);
const tmpDir = new THREE.Vector3();
const tmpSide = new THREE.Vector3();
const tmpPos = new THREE.Vector3();
const tmpNext = new THREE.Vector3();

// deterministic pseudo-random in [0,1) from integer-ish inputs
function hash(seed, cycle, k) {
  const x = Math.sin(seed * 127.1 + cycle * 311.7 + k * 74.3) * 43758.5453;
  return x - Math.floor(x);
}

// Cone whose apex (the head) is bright and base (the tail) fades to black.
// With additive blending, black contributes nothing, giving a fading streak.
function makeStreakGeometry() {
  const geo = new THREE.ConeGeometry(0.06, 1, 8, 1, true);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const c = THREE.MathUtils.clamp(pos.getY(i) + 0.5, 0, 1); // 0 tail -> 1 head
    const v = c * c; // sharpen so the head reads as the bright point
    colors[i * 3] = v;
    colors[i * 3 + 1] = v;
    colors[i * 3 + 2] = v;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}
const STREAK_GEO = makeStreakGeometry();

// One shooting star. `layer` decides whether it draws when on the near side
// ("front", over text) or far side ("back", behind text) of the text plane.
function ShootingStar({ config, layer, reduced }) {
  const mesh = useRef();

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    if (reduced) {
      m.visible = false;
      return;
    }

    const t = performance.now() / 1000 + config.offset;
    const cycle = Math.floor(t / config.period);
    const localT = t - cycle * config.period;

    // idle between launches
    if (localT > config.active) {
      m.visible = false;
      return;
    }

    const p = localT / config.active; // 0 -> 1 along the streak

    // per-launch start point and direction (deterministic, shared across layers)
    const sx = (hash(config.seed, cycle, 0) - 0.5) * 16;
    const sy = (hash(config.seed, cycle, 1) - 0.5) * 9 + 1;
    const sz = (hash(config.seed, cycle, 2) - 0.5) * 8;
    const dx = Math.cos(hash(config.seed, cycle, 3) * Math.PI * 2);
    const dy = -(0.3 + hash(config.seed, cycle, 4) * 0.6); // downward bias
    const dz = (hash(config.seed, cycle, 5) - 0.5) * 1.8; // crosses the text plane
    const dir = tmpDir.set(dx, dy, dz).normalize();

    // a perpendicular axis to bend the path along (curve "around")
    tmpSide.copy(dir).cross(UP);
    if (tmpSide.lengthSq() < 1e-4) tmpSide.set(1, 0, 0);
    tmpSide.normalize();

    // curved path: straight travel + a sideways arc that peaks mid-flight
    const pathAt = (pp, out) =>
      out
        .copy(dir)
        .multiplyScalar(pp * config.travel)
        .addScaledVector(tmpSide, config.curve * Math.sin(pp * Math.PI))
        .add(tmpPos.set(sx, sy, sz));

    pathAt(p, m.position);
    // orient the streak along its tangent so the head leads the curve
    pathAt(Math.min(p + 0.02, 1), tmpNext);
    tmpNext.sub(m.position);
    if (tmpNext.lengthSq() > 1e-6) {
      m.quaternion.setFromUnitVectors(UP, tmpNext.normalize());
    }
    m.scale.set(config.width, config.length, config.width);

    // near side (toward camera) -> front layer; far side -> back layer
    const near = m.position.z > 0;
    m.visible = layer === "front" ? near : !near;

    // fade in and out at the ends of the streak
    m.material.opacity = Math.sin(p * Math.PI);
  });

  return (
    <mesh ref={mesh} geometry={STREAK_GEO} visible={false}>
      <meshBasicMaterial
        color={config.color}
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

function System({ layer, reduced }) {
  return (
    <>
      {STARS.map((config, i) => (
        <ShootingStar key={i} config={config} layer={layer} reduced={reduced} />
      ))}
    </>
  );
}

// `layer`: "front" (above content) or "back" (behind content, above aurora).
export default function StarField({ layer = "front" }) {
  const layerRef = useRef(null);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Hidden during the hero, fading in just past it — same curve as the galaxy.
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const start = window.innerHeight;
      const end = window.innerHeight * 1.5;
      const o = Math.min(1, Math.max(0, (scrollY - start) / (end - start)));
      if (layerRef.current) layerRef.current.style.opacity = String(o);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      style={{ opacity: 0 }}
      className={`${styles.layer} ${layer === "back" ? styles.back : styles.front}`}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 60, position: [0, 0, 9] }}
        gl={{ antialias: true, alpha: true }}
      >
        <System layer={layer} reduced={reduced} />
      </Canvas>
    </div>
  );
}
