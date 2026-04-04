import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FloatingParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.4, 'rgba(255,255,255,0.6)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 32, 32);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.015;
    pointsRef.current.rotation.x = Math.sin(t * 0.008) * 0.05;
    
    // Subtle drift
    const geo = pointsRef.current.geometry;
    const posArr = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += Math.sin(t * 0.3 + i) * 0.0005;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#00f5d4"
        map={particleTexture}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/* A second smaller set of cyan particles for depth */
const CyanDust: React.FC = () => {
  const ref = useRef<THREE.Points>(null);
  const count = 80;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i]     = (Math.random() - 0.5) * 25;
      pos[i + 1] = (Math.random() - 0.5) * 18;
      pos[i + 2] = (Math.random() - 0.5) * 8 - 5;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = -clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#A78BFA"
        transparent
        opacity={0.2}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const ParticleBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 55 }}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <FloatingParticles />
        <CyanDust />
      </Canvas>
    </div>
  );
};

export default ParticleBackground;
