import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleHeart: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const particlesPosition = useMemo(() => {
    const positions = [];
    const count = 5000;
    let added = 0;
    while (added < count) {
      const x = (Math.random() - 0.5) * 3;
      const y = (Math.random() - 0.5) * 3;
      const z = (Math.random() - 0.5) * 3;
      
      const math_x = x;
      const math_y = z;
      const math_z = y;

      const term1 = math_x * math_x + (9/4) * math_y * math_y + math_z * math_z - 1;
      const value = Math.pow(term1, 3) - math_x * math_x * math_z * math_z * math_z - (9/80) * math_y * math_y * math_z * math_z * math_z;
      
      if (value <= 0 && value > -0.5) {
        positions.push(x * 1.5, y * 1.5, z * 1.5);
        added++;
      }
    }
    return new Float32Array(positions);
  }, []);

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 32, 32);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const beat = Math.sin(time * 3);
    const pulse = beat > 0 ? beat * 0.15 : 0;
    
    // Heartbeat scale
    const scale = 1 + pulse;
    
    if (pointsRef.current) {
      pointsRef.current.scale.set(scale, scale, scale);
      pointsRef.current.rotation.y = time * 0.2;
    }
    
    if (meshRef.current) {
      meshRef.current.scale.set(scale * 1.6, scale * 1.6, scale * 1.6);
      meshRef.current.rotation.y = time * 0.2;
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
    }
  });

  return (
    <group>
      {/* Central glowing particle heart */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#ff3333"
          map={particleTexture}
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Surrounding elegant wireframe glass shell */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshPhysicalMaterial 
          color="#D1F2EB" 
          wireframe={true} 
          transparent
          opacity={0.15}
          roughness={0.1}
          metalness={0.9}
          emissive="#1A237E"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
};

const HeartModel: React.FC = () => {
  return (
    <ParticleHeart />
  );
};

export default HeartModel;
