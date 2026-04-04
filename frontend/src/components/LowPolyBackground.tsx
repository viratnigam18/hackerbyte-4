import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const HOVER_RADIUS = 4.0;     // world-space radius of the hover influence
const HOVER_STRENGTH = 1.2;   // max Z displacement toward camera
const HOVER_SMOOTHING = 0.08; // lerp speed for the displacement (0–1)

const LowPolyMesh: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Per-vertex current displacement driven by hover (smoothly animated)
  const hoverDisp = useRef<Float32Array | null>(null);

  // Build geometry once
  const geometry = useMemo(() => {
    const w = 28, h = 16;
    const segW = 55, segH = 32;
    const plane = new THREE.PlaneGeometry(w, h, segW, segH);
    const pos = plane.attributes.position;

    // Displace vertices for low-poly crystalline look
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Stronger displacement in center, gentle at edges
      const edgeFactor = 1 - 0.4 * Math.max(Math.abs(x) / (w / 2), Math.abs(y) / (h / 2));
      const displacement = (Math.random() - 0.5) * 0.55 * edgeFactor;
      pos.setZ(i, displacement);
      // Small random xy jitter for more organic triangles
      pos.setX(i, x + (Math.random() - 0.5) * 0.12);
      pos.setY(i, y + (Math.random() - 0.5) * 0.12);
    }

    // Convert to non-indexed for flat shading (each triangle gets its own color)
    const nonIndexed = plane.toNonIndexed();
    nonIndexed.computeVertexNormals();

    // Per-face coloring with green gradient
    const darkGreen = new THREE.Color('#0a2e1f');
    const medGreen = new THREE.Color('#1a6b3c');
    const brightGreen = new THREE.Color('#2f9e5a');
    const lightGreen = new THREE.Color('#5ec97e');
    const yellowGreen = new THREE.Color('#8edb6a');

    const posNI = nonIndexed.attributes.position;
    const colors = new Float32Array(posNI.count * 3);

    for (let i = 0; i < posNI.count; i += 3) {
      // Face center
      const cx = (posNI.getX(i) + posNI.getX(i + 1) + posNI.getX(i + 2)) / 3;
      const cy = (posNI.getY(i) + posNI.getY(i + 1) + posNI.getY(i + 2)) / 3;

      // Elliptical distance from center (stretched horizontally)
      const dist = Math.sqrt((cx * cx) / ((w / 2) * (w / 2)) + (cy * cy) / ((h / 2) * (h / 2)));
      const t = Math.min(dist, 1);

      // 5-stop gradient: center → edge
      const color = new THREE.Color();
      if (t < 0.15) {
        color.lerpColors(yellowGreen, lightGreen, t / 0.15);
      } else if (t < 0.35) {
        color.lerpColors(lightGreen, brightGreen, (t - 0.15) / 0.2);
      } else if (t < 0.6) {
        color.lerpColors(brightGreen, medGreen, (t - 0.35) / 0.25);
      } else {
        color.lerpColors(medGreen, darkGreen, (t - 0.6) / 0.4);
      }

      // Add per-face random variation for organic feel
      const v = (Math.random() - 0.5) * 0.04;
      const r = Math.max(0, Math.min(1, color.r + v * 0.5));
      const g = Math.max(0, Math.min(1, color.g + v));
      const b = Math.max(0, Math.min(1, color.b + v * 0.3));

      for (let j = 0; j < 3; j++) {
        colors[(i + j) * 3] = r;
        colors[(i + j) * 3 + 1] = g;
        colors[(i + j) * 3 + 2] = b;
      }
    }

    nonIndexed.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return nonIndexed;
  }, []);

  // Capture original positions for animation (full xyz)
  const originalPositions = useMemo(() => {
    if (!geometry) return new Float32Array(0);
    return new Float32Array(geometry.attributes.position.array);
  }, [geometry]);

  // Initialize hover displacement buffer
  useEffect(() => {
    if (geometry) {
      hoverDisp.current = new Float32Array(geometry.attributes.position.count);
    }
  }, [geometry]);

  // Mouse tracking
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 24;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 14;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  // Animation loop
  useFrame(({ clock }) => {
    if (!meshRef.current || !lightRef.current || !hoverDisp.current) return;
    const t = clock.getElapsedTime();
    const mx = mouse.current.x;
    const my = mouse.current.y;

    // Move spotlight toward mouse (smooth follow)
    lightRef.current.position.x += (mx - lightRef.current.position.x) * 0.06;
    lightRef.current.position.y += (my - lightRef.current.position.y) * 0.06;

    // Animate vertex positions: wave + hover displacement
    const pos = meshRef.current.geometry.attributes.position;
    const hd = hoverDisp.current;
    const rSq = HOVER_RADIUS * HOVER_RADIUS;

    for (let i = 0; i < pos.count; i++) {
      const ox = originalPositions[i * 3];
      const oy = originalPositions[i * 3 + 1];
      const oz = originalPositions[i * 3 + 2];

      // Subtle background wave
      const wave = Math.sin(ox * 0.5 + t * 0.4) * 0.03 + Math.cos(oy * 0.4 + t * 0.3) * 0.03;

      // Hover displacement — vertices near mouse push toward camera (+Z)
      const dx = ox - mx;
      const dy = oy - my;
      const distSq = dx * dx + dy * dy;

      // Target displacement: strong at center, falls off smoothly
      let targetDisp = 0;
      if (distSq < rSq) {
        const dist = Math.sqrt(distSq);
        const falloff = 1 - dist / HOVER_RADIUS;
        // Smooth cubic falloff for natural look
        targetDisp = HOVER_STRENGTH * falloff * falloff * (3 - 2 * falloff);
      }

      // Smoothly interpolate current displacement toward target
      hd[i] += (targetDisp - hd[i]) * HOVER_SMOOTHING;

      pos.setZ(i, oz + wave + hd[i]);
    }
    pos.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <>
      {/* Ambient base light */}
      <ambientLight intensity={0.35} color="#1a5c35" />
      {/* Directional for depth */}
      <directionalLight color="#2f855a" intensity={0.5} position={[5, 5, 10]} />
      {/* Mouse-following spotlight — BRIGHT hover glow */}
      <pointLight
        ref={lightRef}
        color="#a7f3d0"
        intensity={18}
        distance={18}
        decay={1.8}
        position={[0, 0, 5]}
      />
      {/* Secondary fill light */}
      <pointLight color="#4ade80" intensity={1.5} position={[-8, -4, 6]} />
      {/* Extra accent from opposite side */}
      <pointLight color="#34d399" intensity={1} position={[10, 5, 6]} />

      <mesh ref={meshRef} geometry={geometry} rotation={[0, 0, 0]}>
        <meshPhongMaterial vertexColors flatShading shininess={12} specular={new THREE.Color('#2a7a4a')} />
      </mesh>
    </>
  );
};

const LowPolyBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#071a10' }}
      >
        <LowPolyMesh />
      </Canvas>
      {/* Soft vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(7,26,16,0.6) 100%)',
        }}
      />
    </div>
  );
};

export default LowPolyBackground;
