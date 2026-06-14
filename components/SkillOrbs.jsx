"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { skills } from "@/lib/content";
import styles from "./Skills.module.css";

const PALETTE = [0x7c3aed, 0x4338ca, 0xff1744];
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
      setCols(w < 480 ? 3 : w < 820 ? 4 : 5);
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

function Orb({ position, color, logo, index, hovered, onHover, reduced }) {
  const group = useRef();
  const sphere = useRef();
  const wire = useRef();
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const isHovered = hovered === index;
  const texture = useLogoTexture(logo);

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
      const target = isHovered ? 1.5 : 0.5;
      mat.emissiveIntensity = THREE.MathUtils.damp(
        mat.emissiveIntensity,
        target,
        8,
        delta
      );
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
        autoRotate={!reduced && hovered === null}
        autoRotateSpeed={0.12}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.6}
        rotateSpeed={0.5}
      />
    </>
  );
}

export default function SkillOrbs() {
  const cols = useColumns();
  const [hovered, setHovered] = useState(null);
  const wrapRef = useRef(null);
  const tipRef = useRef(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Position the tooltip from real DOM pointer coordinates (reliable), while
  // the r3f scene handles which orb is hovered.
  const handlePointerMove = (e) => {
    if (!wrapRef.current || !tipRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    tipRef.current.style.left = `${e.clientX - rect.left}px`;
    tipRef.current.style.top = `${e.clientY - rect.top}px`;
  };

  return (
    <div
      ref={wrapRef}
      className={styles.canvas}
      onPointerMove={handlePointerMove}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 50, position: [0, 0, 14] }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene
          cols={cols}
          hovered={hovered}
          onHover={setHovered}
          reduced={reduced.current}
        />
      </Canvas>

      <div
        ref={tipRef}
        className={styles.tip}
        style={{ display: hovered !== null ? "block" : "none" }}
      >
        {hovered !== null ? skills[hovered].name : ""}
      </div>
    </div>
  );
}
