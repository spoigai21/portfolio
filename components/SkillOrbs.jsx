"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { skills } from "@/lib/content";
import { getSkillDetail } from "@/lib/skillDetails";
import styles from "./Skills.module.css";

// Orb tints — cyan folded in to match the holographic tooltip.
const PALETTE = [0x7c3aed, 0x4338ca, 0x21e6ff, 0xff1744];
const HOVER_EMISSIVE = 0x21e6ff; // cyan flash on the hovered orb
const SPACING = 2.5;
const LOGO_PX = 256; // rasterization resolution for each logo

// Rasterize an SVG logo onto a canvas and hand back a three.js texture.
// Drawing at an explicit size avoids the "SVG has no intrinsic dimensions"
// pitfall, so it renders reliably across browsers.
function useLogoTexture(url) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    let disposed = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (disposed) return;
      const canvas = document.createElement("canvas");
      canvas.width = LOGO_PX;
      canvas.height = LOGO_PX;
      const ctx = canvas.getContext("2d");
      // contain the logo with padding, preserving aspect ratio
      const pad = LOGO_PX * 0.12;
      const box = LOGO_PX - pad * 2;
      const ratio = img.width && img.height ? img.width / img.height : 1;
      let w = box;
      let h = box;
      if (ratio > 1) h = box / ratio;
      else w = box * ratio;
      ctx.drawImage(img, (LOGO_PX - w) / 2, (LOGO_PX - h) / 2, w, h);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      tex.needsUpdate = true;
      setTexture(tex);
    };
    img.src = url;
    return () => {
      disposed = true;
    };
  }, [url]);

  return texture;
}

function useColumns() {
  const [cols, setCols] = useState(5);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      // 20 orbs reflow to even grids: 4 wide (5 rows) narrow, 5 wide (4 rows) up.
      setCols(w < 560 ? 4 : 5);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

// Lay skills out on a centered grid in the XY plane.
function useLayout(count, cols) {
  return useMemo(() => {
    const rows = Math.ceil(count / cols);
    const positions = [];
    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const itemsInRow = Math.min(cols, count - row * cols);
      const rowWidth = (itemsInRow - 1) * SPACING;
      const x = col * SPACING - rowWidth / 2;
      const y = ((rows - 1) * SPACING) / 2 - row * SPACING;
      positions.push([x, y, 0]);
    }
    return { positions, width: cols * SPACING, height: rows * SPACING };
  }, [count, cols]);
}

// Targeting reticle drawn around the selected orb — a steady inner ring plus a
// set of rotating corner arcs, so it reads as "locked on". Billboarded to always
// face the camera. Additive + non-raycastable so it never affects orb hovering.
const RETICLE_ARCS = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
function Reticle({ reduced }) {
  const ring = useRef();
  const arcs = useRef();

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    if (arcs.current) arcs.current.rotation.z = t * 0.7;
    if (ring.current) ring.current.scale.setScalar(1 + Math.sin(t * 4) * 0.03);
  });

  return (
    <Billboard>
      <mesh ref={ring} raycast={() => null}>
        <ringGeometry args={[1.24, 1.32, 48]} />
        <meshBasicMaterial
          color={HOVER_EMISSIVE}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          toneMapped={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <group ref={arcs}>
        {RETICLE_ARCS.map((a) => (
          <mesh key={a} raycast={() => null}>
            <ringGeometry args={[1.42, 1.52, 20, 1, a, 0.85]} />
            <meshBasicMaterial
              color={HOVER_EMISSIVE}
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
              toneMapped={false}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </Billboard>
  );
}

function Orb({ position, color, logo, index, hovered, onHover, reduced }) {
  const group = useRef();
  const sphere = useRef();
  const wire = useRef();
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const isHovered = hovered === index;
  const texture = useLogoTexture(logo);
  const baseColor = useMemo(() => new THREE.Color(color), [color]);
  const hoverColor = useMemo(() => new THREE.Color(HOVER_EMISSIVE), []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;

    if (!reduced) {
      group.current.position.y = position[1] + Math.sin(t * 0.8 + phase) * 0.12;
      if (wire.current) {
        wire.current.rotation.y += delta * 0.1;
        wire.current.rotation.x += delta * 0.04;
      }
    }

    const targetScale = isHovered ? 1.3 : 1;
    const s = THREE.MathUtils.damp(group.current.scale.x, targetScale, 8, delta);
    group.current.scale.setScalar(s);

    if (sphere.current) {
      const mat = sphere.current.material;
      const target = isHovered ? 1.6 : 0.5;
      mat.emissiveIntensity = THREE.MathUtils.damp(
        mat.emissiveIntensity,
        target,
        8,
        delta
      );
      // flash the hovered orb cyan; ease back to base tint when not hovered
      const k = 1 - Math.exp(-8 * delta);
      mat.emissive.lerp(isHovered ? hoverColor : baseColor, k);
    }
  });

  return (
    <group ref={group} position={position}>
      {/* invisible, slightly larger hit target — guarantees the orb is easy to
          hover and is always raycastable regardless of the visible materials */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          onHover(index);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "";
          onHover(null);
        }}
      >
        <sphereGeometry args={[1.05, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* targeting reticle shows on hover, locking onto the readout's system */}
      {isHovered && <Reticle reduced={reduced} />}

      {/* glassy glowing core, tinted from the palette */}
      <mesh ref={sphere}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* faint wireframe shell */}
      <mesh ref={wire} scale={1.18}>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.25} />
      </mesh>

      {/* the brand logo, always facing the camera */}
      {texture && (
        <Billboard>
          <mesh position={[0, 0, 0.72]}>
            <planeGeometry args={[0.95, 0.95]} />
            <meshBasicMaterial
              map={texture}
              transparent
              toneMapped={false}
              depthWrite={false}
            />
          </mesh>
        </Billboard>
      )}

    </group>
  );
}

// Positions the camera so the whole grid is comfortably in frame.
function FitCamera({ width, height }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    const fov = (camera.fov * Math.PI) / 180;
    const fitH = height / 2 / Math.tan(fov / 2);
    const fitW = width / 2 / Math.tan(fov / 2) / aspect;
    const z = Math.max(fitH, fitW) * 1.15 + 2.5;
    camera.position.set(0, 0, z);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size, width, height]);
  return null;
}

function Scene({ cols, hovered, onHover, reduced }) {
  const { positions, width, height } = useLayout(skills.length, cols);
  return (
    <>
      <FitCamera width={width} height={height} />
      <ambientLight intensity={0.6} />
      <pointLight position={[6, 6, 8]} intensity={1.2} color="#bcd0ff" />
      <pointLight position={[-8, -4, 4]} intensity={0.8} color="#7c3aed" />

      {skills.map((skill, i) => (
        <Orb
          key={skill.name}
          index={i}
          position={positions[i]}
          color={PALETTE[i % PALETTE.length]}
          logo={skill.logo}
          hovered={hovered}
          onHover={onHover}
          reduced={reduced}
        />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        // hold still while a system is targeted so the reticle stays aligned
        autoRotate={!reduced && hovered === null}
        autoRotateSpeed={0.12}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.6}
        rotateSpeed={0.5}
      />
    </>
  );
}

// Ship "scanner lock" readout for the hovered skill. Rendered in a portal to
// <body> so it's a true viewport-fixed overlay (the Reveal wrapper's
// will-change:transform would otherwise trap position:fixed). Pointer-transparent
// (see CSS) so it never steals hover from an orb sitting behind it.
function SkillPanel({ skill }) {
  const detail = getSkillDetail(skill.name);
  return createPortal(
    <aside
      className={styles.panel}
      role="status"
      aria-label={`Module readout: ${skill.name}`}
    >
      <span className={`${styles.pBracket} ${styles.pbTL}`} aria-hidden="true" />
      <span className={`${styles.pBracket} ${styles.pbTR}`} aria-hidden="true" />
      <span className={`${styles.pBracket} ${styles.pbBL}`} aria-hidden="true" />
      <span className={`${styles.pBracket} ${styles.pbBR}`} aria-hidden="true" />
      <div className={styles.panelScan} aria-hidden="true" />

      <div className={styles.panelInner}>
        <div className={styles.panelEyebrow}>
          <span className={styles.panelDot} /> SCANNING
        </div>
        <h3 className={styles.panelTitle}>
          <span className={styles.pBrk}>[</span> MODULE:{" "}
          {skill.name.toUpperCase()} <span className={styles.pBrk}>]</span>
        </h3>
        <div className={styles.panelClass}>CLASS // {detail.category.toUpperCase()}</div>

        <div className={styles.panelBlock}>
          <div className={styles.panelLabel}>USED IN</div>
          <div className={styles.panelValue}>{detail.deployedIn}</div>
        </div>

        <div className={styles.panelBlock}>
          <div className={styles.panelLabel}>LOG</div>
          <div className={styles.panelDesc}>&gt; {detail.relationship}</div>
        </div>
      </div>
    </aside>,
    document.body
  );
}

export default function SkillOrbs() {
  const cols = useColumns();
  const [hovered, setHovered] = useState(null);
  // Which skill the readout panel is showing. Follows `hovered`, but lingers
  // briefly when hover clears so gliding across the gaps between orbs doesn't
  // make the panel flicker/unmount — it just swaps content.
  const [panelIndex, setPanelIndex] = useState(null);
  const [reduced, setReduced] = useState(false);
  const hideTimer = useRef();

  useEffect(() => {
    setReduced(
      typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    clearTimeout(hideTimer.current);
    if (hovered !== null) {
      setPanelIndex(hovered);
    } else {
      hideTimer.current = setTimeout(() => setPanelIndex(null), 180);
    }
    return () => clearTimeout(hideTimer.current);
  }, [hovered]);

  return (
    <>
      <div className={styles.canvas}>
        <Canvas
          dpr={[1, 2]}
          camera={{ fov: 50, position: [0, 0, 14] }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene
            cols={cols}
            hovered={hovered}
            onHover={setHovered}
            reduced={reduced}
          />
        </Canvas>
      </div>

      {panelIndex !== null && <SkillPanel skill={skills[panelIndex]} />}
    </>
  );
}
